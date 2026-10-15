package review

import "time"

type PracticeCard struct {
	VocabularyID int64      `json:"vocabulary_id"`
	Hanzi        string     `json:"hanzi"`
	Pinyin       string     `json:"pinyin"`
	Meaning      string     `json:"meaning"`
	Example      string     `json:"example"`
	Note         string     `json:"note"`
	Status       string     `json:"status"`
	Repetitions  int        `json:"repetitions"`
	NextReviewAt *time.Time `json:"next_review_at,omitempty"`
}

type PracticeResponse struct {
	TotalRemaining int            `json:"total_remaining"`
	Cards          []PracticeCard `json:"cards"`
}

type SubmitReviewRequest struct {
	VocabularyID int64 `json:"vocabulary_id"`
	Rating       int   `json:"rating"` // 1: Hard, 2: Good, 3: Easy
}

type SubmitReviewResponse struct {
	ReviewID     int64     `json:"review_id"`
	VocabularyID int64     `json:"vocabulary_id"`
	Rating       int       `json:"rating"`
	ReviewedAt   time.Time `json:"reviewed_at"`
	NextReviewAt time.Time `json:"next_review_at"`
	Status       string    `json:"status"`
	Repetitions  int       `json:"repetitions"`
}
