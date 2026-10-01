package vocabulary

import (
	"context"
	"fmt"

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
	vocab CreateVocabularyRequest,
) (*Vocabulary, error) {

	query := `
		INSERT INTO vocabularies (
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			hsk_level
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			hsk_level
	`

	result := &Vocabulary{}

	err := r.db.QueryRow(
		ctx,
		query,
		vocab.UserID,
		vocab.Hanzi,
		vocab.Pinyin,
		vocab.Meaning,
		vocab.Example,
		vocab.Note,
		vocab.HSKLevel,
	).Scan(
		&result.ID,
		&result.UserID,
		&result.Hanzi,
		&result.Pinyin,
		&result.Meaning,
		&result.Example,
		&result.Note,
		&result.HSKLevel,
	)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) FindAll(
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
			hsk_level
		FROM vocabularies
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	vocabularies := make([]Vocabulary, 0)

	for rows.Next() {
		var vocabulary Vocabulary

		err := rows.Scan(
			&vocabulary.ID,
			&vocabulary.UserID,
			&vocabulary.Hanzi,
			&vocabulary.Pinyin,
			&vocabulary.Meaning,
			&vocabulary.Example,
			&vocabulary.Note,
			&vocabulary.HSKLevel,
		)

		if err != nil {
			return nil, err
		}

		vocabularies = append(vocabularies, vocabulary)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return vocabularies, nil
}

func (r *Repository) FindByID(
	ctx context.Context,
	id int64,
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
			hsk_level
		FROM vocabularies
		WHERE id = $1
	`

	var vocabulary Vocabulary

	err := r.db.QueryRow(
		ctx,
		query,
		id,
	).Scan(
		&vocabulary.ID,
		&vocabulary.UserID,
		&vocabulary.Hanzi,
		&vocabulary.Pinyin,
		&vocabulary.Meaning,
		&vocabulary.Example,
		&vocabulary.Note,
		&vocabulary.HSKLevel,
	)

	if err != nil {
		return nil, err
	}

	return &vocabulary, nil
}

func (r *Repository) Update(
	ctx context.Context,
	id int64,
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
			hsk_level = COALESCE($6, hsk_level),
			updated_at = NOW()
		WHERE id = $7
		RETURNING
			id,
			user_id,
			hanzi,
			pinyin,
			meaning,
			example,
			note,
			hsk_level
	`

	var vocabulary Vocabulary

	err := r.db.QueryRow(
		ctx,
		query,
		req.Hanzi,
		req.Pinyin,
		req.Meaning,
		req.Example,
		req.Note,
		req.HSKLevel,
		id,
	).Scan(
		&vocabulary.ID,
		&vocabulary.UserID,
		&vocabulary.Hanzi,
		&vocabulary.Pinyin,
		&vocabulary.Meaning,
		&vocabulary.Example,
		&vocabulary.Note,
		&vocabulary.HSKLevel,
	)

	if err != nil {
		return nil, err
	}

	return &vocabulary, nil
}

func (r *Repository) Delete(
	ctx context.Context,
	id int64,
) error {

	query := `
		DELETE FROM vocabularies
		WHERE id = $1
	`

	result, err := r.db.Exec(
		ctx,
		query,
		id,
	)

	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("vocabulary not found")
	}

	return nil
}
