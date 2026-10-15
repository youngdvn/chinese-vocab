package user

import (
	"context"
	"errors"
	"strings"
)

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) GetSettings(ctx context.Context, userID int64) (*UserProfile, error) {
	return s.repository.FindByID(ctx, userID)
}

func (s *Service) UpdateSettings(ctx context.Context, userID int64, req UpdateSettingsRequest) (*UserProfile, error) {
	if req.DailyGoal != nil {
		if *req.DailyGoal < 1 || *req.DailyGoal > 200 {
			return nil, errors.New("mục tiêu học hàng ngày phải từ 1 đến 200 từ")
		}
	}

	if req.Name != nil {
		trimmed := strings.TrimSpace(*req.Name)
		req.Name = &trimmed
	}

	return s.repository.UpdateSettings(ctx, userID, req)
}
