package auth

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) Register(
	ctx context.Context,
	req RegisterRequest,
) (*RegisterResponse, error) {

	email := strings.TrimSpace(strings.ToLower(req.Email))
	name := strings.TrimSpace(req.Name)

	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, err
	}

	user, err := s.repository.CreateUser(
		ctx,
		email,
		string(passwordHash),
		name,
	)
	if err != nil {
		return nil, err
	}

	return &RegisterResponse{
		ID:    user.ID,
		Email: user.Email,
		Name:  name,
	}, nil
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
) (*LoginResponse, error) {
	email := strings.TrimSpace(strings.ToLower(req.Email))

	user, err := s.repository.FindUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(req.Password),
	); err != nil {
		return nil, ErrInvalidCredentials
	}
	name := ""
	if user.Name != nil {
		name = *user.Name
	}

	return &LoginResponse{
		ID:    user.ID,
		Email: user.Email,
		Name:  name,
	}, nil
}
