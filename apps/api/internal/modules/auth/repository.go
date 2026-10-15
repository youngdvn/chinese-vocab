package auth

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
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
		var pgErr *pgconn.PgError

		if errors.As(err, &pgErr) &&
			pgErr.Code == "23505" &&
			pgErr.ConstraintName == "users_email_key" {
			return nil, ErrEmailExists
		}

		return nil, err
	}

	return user, nil
}

func (r *Repository) FindUserByEmail(
	ctx context.Context,
	email string,
) (*User, error) {
	user := &User{}

	err := r.db.QueryRow(ctx, `
        SELECT id, email, password_hash, name, created_at, updated_at
        FROM users
        WHERE email = $1
    `, email).Scan(
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

func (r *Repository) FindUserByID(
	ctx context.Context,
	id int64,
) (*User, error) {
	user := &User{}

	err := r.db.QueryRow(ctx, `
        SELECT id, email, password_hash, name, created_at, updated_at
        FROM users
        WHERE id = $1
    `, id).Scan(
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
