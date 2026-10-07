package auth

import (
	"context"

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

func (r *Repository) CreateUser(
	ctx context.Context,
	email string,
	passwordHash string,
	name string,
) (*User, error) {
	user := &User{}

	err := r.db.QueryRow(
		ctx,
		`
		INSERT INTO users (
			email,
			password_hash,
			name
		)
		VALUES ($1, $2, $3)
		RETURNING
			id,
			email,
			password_hash,
			name,
			created_at,
			updated_at
		`,
		email,
		passwordHash,
		name,
	).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}
