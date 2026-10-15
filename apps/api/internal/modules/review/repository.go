package review

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) GetPracticeCards(
	ctx context.Context,
	userID int64,
	limit int,
) ([]PracticeCard, int, error) {
	countQuery := `
		SELECT COUNT(*)
		FROM vocabularies
		WHERE user_id = $1
		  AND (next_review_at IS NULL OR next_review_at <= NOW() OR status = 'new')
	`

	var totalRemaining int
	err := r.db.QueryRow(ctx, countQuery, userID).Scan(&totalRemaining)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count practice cards: %w", err)
	}

	if totalRemaining == 0 {
		return []PracticeCard{}, 0, nil
	}

	query := `
		SELECT
			v.id,
			v.hanzi,
			v.pinyin,
			v.meaning,
			COALESCE(v.example, ''),
			COALESCE(v.note, ''),
			v.status,
			v.next_review_at,
			COALESCE(rc.rep_count, 0)
		FROM vocabularies v
		LEFT JOIN (
			SELECT vocabulary_id, COUNT(*) as rep_count
			FROM reviews
			WHERE user_id = $1
			GROUP BY vocabulary_id
		) rc ON rc.vocabulary_id = v.id
		WHERE v.user_id = $1
		  AND (v.next_review_at IS NULL OR v.next_review_at <= NOW() OR v.status = 'new')
		ORDER BY
			CASE WHEN v.next_review_at IS NULL THEN 0 ELSE 1 END,
			v.next_review_at ASC,
			v.created_at ASC
		LIMIT $2
	`

	rows, err := r.db.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to fetch practice cards: %w", err)
	}
	defer rows.Close()

	cards := make([]PracticeCard, 0)
	for rows.Next() {
		var c PracticeCard
		err := rows.Scan(
			&c.VocabularyID,
			&c.Hanzi,
			&c.Pinyin,
			&c.Meaning,
			&c.Example,
			&c.Note,
			&c.Status,
			&c.NextReviewAt,
			&c.Repetitions,
		)
		if err != nil {
			return nil, 0, err
		}
		cards = append(cards, c)
	}

	return cards, totalRemaining, rows.Err()
}

func (r *Repository) GetRepetitions(
	ctx context.Context,
	userID int64,
	vocabID int64,
) (int, error) {
	// First ensure vocabulary exists and belongs to user
	var exists bool
	err := r.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM vocabularies WHERE id = $1 AND user_id = $2)", vocabID, userID).Scan(&exists)
	if err != nil {
		return 0, err
	}
	if !exists {
		return 0, errors.New("vocabulary not found")
	}

	var count int
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM reviews WHERE user_id = $1 AND vocabulary_id = $2", userID, vocabID).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *Repository) CreateReview(
	ctx context.Context,
	userID int64,
	req SubmitReviewRequest,
	nextReviewAt time.Time,
	newStatus string,
	newRepetitions int,
) (*SubmitReviewResponse, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	// 1. Insert review record
	insertReviewQuery := `
		INSERT INTO reviews (user_id, vocabulary_id, rating, reviewed_at, next_review_at)
		VALUES ($1, $2, $3, NOW(), $4)
		RETURNING id, reviewed_at
	`
	var reviewID int64
	var reviewedAt time.Time

	err = tx.QueryRow(ctx, insertReviewQuery, userID, req.VocabularyID, req.Rating, nextReviewAt).Scan(&reviewID, &reviewedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert review: %w", err)
	}

	// 2. Update vocabulary status and next_review_at
	updateVocabQuery := `
		UPDATE vocabularies
		SET status = $1, next_review_at = $2, updated_at = NOW()
		WHERE id = $3 AND user_id = $4
	`
	tag, err := tx.Exec(ctx, updateVocabQuery, newStatus, nextReviewAt, req.VocabularyID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to update vocabulary: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return nil, pgx.ErrNoRows
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit review transaction: %w", err)
	}

	return &SubmitReviewResponse{
		ReviewID:     reviewID,
		VocabularyID: req.VocabularyID,
		Rating:       req.Rating,
		ReviewedAt:   reviewedAt,
		NextReviewAt: nextReviewAt,
		Status:       newStatus,
		Repetitions:  newRepetitions,
	}, nil
}
