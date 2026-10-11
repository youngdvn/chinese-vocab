package auth

import (
	"errors"
	"os"
	"time"

	"github.com/duycao04/chinese-vocab/apps/api/lib"
	"github.com/golang-jwt/jwt/v5"
)

type TokenService struct {
	secret []byte
	expiry time.Duration
}

func NewTokenService() (*TokenService, error) {
	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		return nil, errors.New("JWT_SECRET must be at least 32 bytes")
	}

	expiry := 24 * time.Hour
	if value := os.Getenv("JWT_EXPIRES_IN"); value != "" {
		parsed, err := time.ParseDuration(value)
		if err != nil || parsed <= 0 {
			return nil, errors.New("invalid JWT_EXPIRES_IN")
		}
		expiry = parsed
	}

	return &TokenService{
		secret: []byte(secret),
		expiry: expiry,
	}, nil
}

func (s *TokenService) Generate(userID int64) (string, time.Time, error) {
	expiresAt := time.Now().Add(s.expiry)

	claims := jwt.RegisteredClaims{
		Subject:   lib.FormatUserID(userID),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ExpiresAt: jwt.NewNumericDate(expiresAt),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(s.secret)
	if err != nil {
		return "", time.Time{}, err
	}

	return signedToken, expiresAt, nil
}
