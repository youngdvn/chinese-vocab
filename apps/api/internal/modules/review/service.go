package review

import (
	"context"
	"errors"
	"fmt"
	"time"
)

type RepositoryInterface interface {
	GetPracticeCards(ctx context.Context, userID int64, limit int) ([]PracticeCard, int, error)
	GetRepetitions(ctx context.Context, userID int64, vocabID int64) (int, error)
	CreateReview(ctx context.Context, userID int64, req SubmitReviewRequest, nextReviewAt time.Time, status string, newRepetitions int) (*SubmitReviewResponse, error)
}

type Service struct {
	repository RepositoryInterface
}

func NewService(repository RepositoryInterface) *Service {
	return &Service{
		repository: repository,
	}
}

// CalculateSRS calculates the next review time, updated status, and repetition count based on the rating.
// rating: 1 = Hard, 2 = Good, 3 = Easy
func CalculateSRS(now time.Time, rating int, currentRepetitions int) (nextReviewAt time.Time, newStatus string, newRepetitions int) {
	switch rating {
	case 1: // Hard
		// Reset interval to 1 day
		nextReviewAt = now.Add(24 * time.Hour)
		newStatus = "learning"
		newRepetitions = 0

	case 2: // Good
		newRepetitions = currentRepetitions + 1
		var interval time.Duration
		switch newRepetitions {
		case 1:
			interval = 24 * time.Hour // 1 day
		case 2:
			interval = 3 * 24 * time.Hour // 3 days
		case 3:
			interval = 7 * 24 * time.Hour // 7 days
		default:
			days := time.Duration(newRepetitions * 5)
			interval = days * 24 * time.Hour
		}
		nextReviewAt = now.Add(interval)
		if newRepetitions >= 5 {
			newStatus = "mastered"
		} else {
			newStatus = "learning"
		}

	case 3: // Easy
		newRepetitions = currentRepetitions + 2
		var interval time.Duration
		switch {
		case newRepetitions <= 2:
			interval = 3 * 24 * time.Hour // 3 days
		case newRepetitions == 3 || newRepetitions == 4:
			interval = 7 * 24 * time.Hour // 7 days
		default:
			days := time.Duration(newRepetitions * 7)
			interval = days * 24 * time.Hour
		}
		nextReviewAt = now.Add(interval)
		if newRepetitions >= 4 {
			newStatus = "mastered"
		} else {
			newStatus = "learning"
		}

	default: // Fallback as Good
		nextReviewAt = now.Add(24 * time.Hour)
		newStatus = "learning"
		newRepetitions = currentRepetitions + 1
	}

	return nextReviewAt, newStatus, newRepetitions
}

func (s *Service) GetPracticeCards(ctx context.Context, userID int64, limit int) (*PracticeResponse, error) {
	if limit <= 0 {
		limit = 20
	}

	cards, totalRemaining, err := s.repository.GetPracticeCards(ctx, userID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get practice cards: %w", err)
	}

	return &PracticeResponse{
		TotalRemaining: totalRemaining,
		Cards:          cards,
	}, nil
}

func (s *Service) SubmitReview(ctx context.Context, userID int64, req SubmitReviewRequest) (*SubmitReviewResponse, error) {
	if req.Rating < 1 || req.Rating > 3 {
		return nil, errors.New("rating must be 1 (Hard), 2 (Good), or 3 (Easy)")
	}

	currentReps, err := s.repository.GetRepetitions(ctx, userID, req.VocabularyID)
	if err != nil {
		return nil, fmt.Errorf("failed to get word repetition state: %w", err)
	}

	now := time.Now()
	nextReviewAt, newStatus, newReps := CalculateSRS(now, req.Rating, currentReps)

	res, err := s.repository.CreateReview(ctx, userID, req, nextReviewAt, newStatus, newReps)
	if err != nil {
		return nil, fmt.Errorf("failed to save review: %w", err)
	}

	return res, nil
}
