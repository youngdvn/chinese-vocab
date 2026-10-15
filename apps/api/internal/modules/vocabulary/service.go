package vocabulary

import "context"

type Service struct {
	repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) Create(
	ctx context.Context,
	userID int64,
	req CreateVocabularyRequest,
) (*Vocabulary, error) {
	return s.repository.Create(ctx, userID, req)
}

func (s *Service) FindAll(
	ctx context.Context,
	userID int64,
	filter ListVocabularyQuery,
) (*PaginatedVocabularies, error) {
	return s.repository.FindAll(ctx, userID, filter)
}

func (s *Service) FindByID(
	ctx context.Context,
	id int64,
	userID int64,
) (*Vocabulary, error) {
	return s.repository.FindByID(ctx, id, userID)
}

func (s *Service) Update(
	ctx context.Context,
	id int64,
	userID int64,
	req UpdateVocabularyRequest,
) (*Vocabulary, error) {
	return s.repository.Update(ctx, id, userID, req)
}

func (s *Service) Delete(
	ctx context.Context,
	id int64,
	userID int64,
) error {
	return s.repository.Delete(ctx, id, userID)
}

func (s *Service) ExportAll(
	ctx context.Context,
	userID int64,
) ([]Vocabulary, error) {
	return s.repository.ExportAll(ctx, userID)
}
