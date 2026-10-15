package dashboard

import "context"

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) GetOverview(ctx context.Context, userID int64) (*OverviewResponse, error) {
	return s.repository.GetOverview(ctx, userID)
}

func (s *Service) GetDailyProgress(ctx context.Context, userID int64) (*DailyProgressResponse, error) {
	return s.repository.GetDailyProgress(ctx, userID)
}
