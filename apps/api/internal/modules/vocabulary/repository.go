package vocabulary

import (
	"context"
	"errors"
	"fmt"
	"math"
	"strings"

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

func (r *Repository) Create(
	ctx context.Context,
	userID int64,
	vocab CreateVocabularyRequest,
) (*Vocabulary, error) {
	status := strings.TrimSpace(vocab.Status)
	if status == "" {
		status = "new"
	}

	query := `
		INSERT INTO vocabularies (
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level,
			created_at,
			updated_at
	`

	result := &Vocabulary{}

	err := r.db.QueryRow(
		ctx,
		query,
		userID,
		vocab.Hanzi,
		vocab.Pinyin,
		vocab.Meaning,
		vocab.Example,
		vocab.Note,
		status,
		vocab.HSKLevel,
	).Scan(
		&result.ID,
		&result.UserID,
		&result.Hanzi,
		&result.Pinyin,
		&result.Meaning,
		&result.Example,
		&result.Note,
		&result.Status,
		&result.HSKLevel,
		&result.CreatedAt,
		&result.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) FindAll(
	ctx context.Context,
	userID int64,
	filter ListVocabularyQuery,
) (*PaginatedVocabularies, error) {
	page := filter.Page
	if page < 1 {
		page = 1
	}
	limit := filter.Limit
	if limit < 1 {
		limit = 10
	} else if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	var whereClauses []string
	args := []any{userID}
	argIdx := 2

	whereClauses = append(whereClauses, "user_id = $1")

	if filter.Search != "" {
		searchPattern := "%" + strings.TrimSpace(filter.Search) + "%"
		whereClauses = append(whereClauses, fmt.Sprintf("(hanzi ILIKE $%d OR pinyin ILIKE $%d OR meaning ILIKE $%d)", argIdx, argIdx, argIdx))
		args = append(args, searchPattern)
		argIdx++
	}

	if filter.Status != "" && filter.Status != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("status = $%d", argIdx))
		args = append(args, strings.TrimSpace(filter.Status))
		argIdx++
	}

	if filter.Date != "" && filter.Date != "all" {
		whereClauses = append(whereClauses, fmt.Sprintf("created_at::date = $%d::date", argIdx))
		args = append(args, strings.TrimSpace(filter.Date))
		argIdx++
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	// 1. Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM vocabularies WHERE %s", whereSQL)
	var totalItems int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&totalItems)
	if err != nil {
		return nil, fmt.Errorf("failed to count vocabularies: %w", err)
	}

	totalPages := 0
	if totalItems > 0 {
		totalPages = int(math.Ceil(float64(totalItems) / float64(limit)))
	}

	// 2. Select paginated items
	dataQuery := fmt.Sprintf(`
		SELECT
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level,
			created_at,
			updated_at
		FROM vocabularies
		WHERE %s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereSQL, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch vocabularies: %w", err)
	}
	defer rows.Close()

	items := make([]Vocabulary, 0)
	for rows.Next() {
		var v Vocabulary
		err := rows.Scan(
			&v.ID,
			&v.UserID,
			&v.Hanzi,
			&v.Pinyin,
			&v.Meaning,
			&v.Example,
			&v.Note,
			&v.Status,
			&v.HSKLevel,
			&v.CreatedAt,
			&v.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, v)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &PaginatedVocabularies{
		Data: items,
		Pagination: PaginationMeta{
			CurrentPage: page,
			Limit:       limit,
			TotalItems:  totalItems,
			TotalPages:  totalPages,
		},
	}, nil
}

func (r *Repository) FindByID(
	ctx context.Context,
	id int64,
	userID int64,
) (*Vocabulary, error) {
	query := `
		SELECT
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level,
			created_at,
			updated_at
		FROM vocabularies
		WHERE id = $1 AND user_id = $2
	`

	var v Vocabulary
	err := r.db.QueryRow(ctx, query, id, userID).Scan(
		&v.ID,
		&v.UserID,
		&v.Hanzi,
		&v.Pinyin,
		&v.Meaning,
		&v.Example,
		&v.Note,
		&v.Status,
		&v.HSKLevel,
		&v.CreatedAt,
		&v.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("vocabulary not found")
		}
		return nil, err
	}

	return &v, nil
}

func (r *Repository) Update(
	ctx context.Context,
	id int64,
	userID int64,
	req UpdateVocabularyRequest,
) (*Vocabulary, error) {
	query := `
		UPDATE vocabularies
		SET
			hanzi = COALESCE($1, hanzi),
			pinyin = COALESCE($2, pinyin),
			meaning = COALESCE($3, meaning),
			example = COALESCE($4, example),
			note = COALESCE($5, note),
			status = COALESCE($6, status),
			hsk_level = COALESCE($7, hsk_level),
			updated_at = NOW()
		WHERE id = $8 AND user_id = $9
		RETURNING
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level,
			created_at,
			updated_at
	`

	var v Vocabulary
	err := r.db.QueryRow(
		ctx,
		query,
		req.Hanzi,
		req.Pinyin,
		req.Meaning,
		req.Example,
		req.Note,
		req.Status,
		req.HSKLevel,
		id,
		userID,
	).Scan(
		&v.ID,
		&v.UserID,
		&v.Hanzi,
		&v.Pinyin,
		&v.Meaning,
		&v.Example,
		&v.Note,
		&v.Status,
		&v.HSKLevel,
		&v.CreatedAt,
		&v.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("vocabulary not found")
		}
		return nil, err
	}

	return &v, nil
}

func (r *Repository) Delete(
	ctx context.Context,
	id int64,
	userID int64,
) error {
	query := `
		DELETE FROM vocabularies
		WHERE id = $1 AND user_id = $2
	`

	result, err := r.db.Exec(ctx, query, id, userID)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return errors.New("vocabulary not found")
	}

	return nil
}

func (r *Repository) ExportAll(
	ctx context.Context,
	userID int64,
) ([]Vocabulary, error) {
	query := `
		SELECT
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			status,
			hsk_level,
			created_at,
			updated_at
		FROM vocabularies
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]Vocabulary, 0)
	for rows.Next() {
		var v Vocabulary
		err := rows.Scan(
			&v.ID,
			&v.UserID,
			&v.Hanzi,
			&v.Pinyin,
			&v.Meaning,
			&v.Example,
			&v.Note,
			&v.Status,
			&v.HSKLevel,
			&v.CreatedAt,
			&v.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, v)
	}

	return items, rows.Err()
}
