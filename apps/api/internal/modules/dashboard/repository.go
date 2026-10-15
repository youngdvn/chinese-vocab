package dashboard

import (
	"context"
	"fmt"
	"math"

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

func (r *Repository) GetOverview(ctx context.Context, userID int64) (*OverviewResponse, error) {
	query := `
		SELECT
			COUNT(*),
			COUNT(*) FILTER (WHERE status = 'new'),
			COUNT(*) FILTER (WHERE status = 'learning'),
			COUNT(*) FILTER (WHERE status = 'mastered'),
			COUNT(*) FILTER (WHERE created_at >= date_trunc('week', NOW())),
			COUNT(*) FILTER (WHERE next_review_at IS NULL OR next_review_at <= NOW() OR status = 'new')
		FROM vocabularies
		WHERE user_id = $1
	`

	var res OverviewResponse
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&res.TotalWords,
		&res.NewWords,
		&res.LearningWords,
		&res.MasteredWords,
		&res.ThisWeekWords,
		&res.WaitingReviewCount,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get dashboard overview: %w", err)
	}

	return &res, nil
}

func (r *Repository) GetDailyProgress(ctx context.Context, userID int64) (*DailyProgressResponse, error) {
	// 1. Get daily goal from user
	var dailyGoal int
	err := r.db.QueryRow(ctx, "SELECT COALESCE(daily_goal, 20) FROM users WHERE id = $1", userID).Scan(&dailyGoal)
	if err != nil {
		dailyGoal = 20
	}

	// 2. Count distinct words reviewed today
	var learnedToday int
	countQuery := `
		SELECT COUNT(DISTINCT vocabulary_id)
		FROM reviews
		WHERE user_id = $1 AND reviewed_at::date = CURRENT_DATE
	`
	_ = r.db.QueryRow(ctx, countQuery, userID).Scan(&learnedToday)

	remainingToday := dailyGoal - learnedToday
	if remainingToday < 0 {
		remainingToday = 0
	}

	progressPercentage := 0.0
	if dailyGoal > 0 {
		progressPercentage = (float64(learnedToday) / float64(dailyGoal)) * 100.0
		if progressPercentage > 100.0 {
			progressPercentage = 100.0
		}
		progressPercentage = math.Round(progressPercentage*10) / 10
	}

	// 3. Query today's words list
	wordsQuery := `
		SELECT
			v.id,
			v.hanzi,
			v.pinyin,
			v.meaning,
			v.status,
			CASE WHEN r.today_reviews > 0 THEN true ELSE false END as learned_today
		FROM vocabularies v
		LEFT JOIN (
			SELECT vocabulary_id, COUNT(*) as today_reviews
			FROM reviews
			WHERE user_id = $1 AND reviewed_at::date = CURRENT_DATE
			GROUP BY vocabulary_id
		) r ON r.vocabulary_id = v.id
		WHERE v.user_id = $1
		ORDER BY
			learned_today DESC,
			CASE WHEN v.next_review_at IS NULL THEN 0 ELSE 1 END,
			v.next_review_at ASC,
			v.created_at DESC
		LIMIT $2
	`

	rows, err := r.db.Query(ctx, wordsQuery, userID, dailyGoal)
	if err != nil {
		return nil, fmt.Errorf("failed to query today's words: %w", err)
	}
	defer rows.Close()

	words := make([]TodayWord, 0)
	for rows.Next() {
		var w TodayWord
		err := rows.Scan(
			&w.ID,
			&w.Hanzi,
			&w.Pinyin,
			&w.Meaning,
			&w.Status,
			&w.LearnedToday,
		)
		if err != nil {
			return nil, err
		}
		words = append(words, w)
	}

	return &DailyProgressResponse{
		DailyGoal:          dailyGoal,
		LearnedToday:       learnedToday,
		RemainingToday:     remainingToday,
		ProgressPercentage: progressPercentage,
		Words:              words,
	}, nil
}
