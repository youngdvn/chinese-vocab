package lib

import (
	"context"
	"errors"
)

type contextKey string

const UserIDContextKey contextKey = "user_id"

var ErrUnauthorized = errors.New("unauthorized: missing or invalid user id in context")

func WithUserID(ctx context.Context, userID int64) context.Context {
	return context.WithValue(ctx, UserIDContextKey, userID)
}

func GetUserID(ctx context.Context) (int64, error) {
	val := ctx.Value(UserIDContextKey)
	if val == nil {
		return 0, ErrUnauthorized
	}
	userID, ok := val.(int64)
	if !ok || userID <= 0 {
		return 0, ErrUnauthorized
	}
	return userID, nil
}
