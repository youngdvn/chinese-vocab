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
	req CreateVocabularyRequest,
) (*Vocabulary, error) {

	return s.repository.Create(ctx, req)
}

func (s *Service) FindAll(
	ctx context.Context,
	userID int64,
) ([]Vocabulary, error) {
	return s.repository.FindAll(ctx, userID)
}

func (s *Service) FindByID(
	ctx context.Context,
	id int64,
) (*Vocabulary, error) {
	return s.repository.FindByID(ctx, id)
}

func (s *Service) Update(
	ctx context.Context,
	id int64,
	req UpdateVocabularyRequest,
) (*Vocabulary, error) {
	return s.repository.Update(ctx, id, req)
}

func (s *Service) Delete(
	ctx context.Context,
	id int64,
) error {
	return s.repository.Delete(ctx, id)
}
