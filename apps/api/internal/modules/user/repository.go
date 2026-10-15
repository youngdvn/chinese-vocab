package user

import (
	"context"
	"errors"
	"fmt"

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

func (r *Repository) FindByID(ctx context.Context, id int64) (*UserProfile, error) {
	query := `
		SELECT
			id,
			email,
			COALESCE(name, ''),
			COALESCE(daily_goal, 20),
			created_at,
			updated_at
		FROM users
		WHERE id = $1
	`

	var profile UserProfile
	err := r.db.QueryRow(ctx, query, id).Scan(
		&profile.ID,
		&profile.Email,
		&profile.Name,
		&profile.DailyGoal,
		&profile.CreatedAt,
		&profile.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to query user profile: %w", err)
	}

	return &profile, nil
}

func (r *Repository) UpdateSettings(ctx context.Context, id int64, req UpdateSettingsRequest) (*UserProfile, error) {
	query := `
		UPDATE users
		SET
			name = COALESCE($1, name),
			daily_goal = COALESCE($2, daily_goal),
			updated_at = NOW()
		WHERE id = $3
		RETURNING
			id,
			email,
			COALESCE(name, ''),
			COALESCE(daily_goal, 20),
			created_at,
			updated_at
	`

	var profile UserProfile
	err := r.db.QueryRow(ctx, query, req.Name, req.DailyGoal, id).Scan(
		&profile.ID,
		&profile.Email,
		&profile.Name,
		&profile.DailyGoal,
		&profile.CreatedAt,
		&profile.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("failed to update user settings: %w", err)
	}

	return &profile, nil
}
