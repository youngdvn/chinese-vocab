package vocabulary

import "time"

type Vocabulary struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Hanzi     string    `json:"hanzi"`
	Pinyin    string    `json:"pinyin"`
	Meaning   string    `json:"meaning"`
	Example   string    `json:"example"`
	Note      string    `json:"note"`
	Status    string    `json:"status"`
	HSKLevel  *int      `json:"hsk_level,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateVocabularyRequest struct {
	Hanzi    string `json:"hanzi"`
	Pinyin   string `json:"pinyin"`
	Meaning  string `json:"meaning"`
	Example  string `json:"example"`
	Note     string `json:"note"`
	Status   string `json:"status,omitempty"`
	HSKLevel *int   `json:"hsk_level,omitempty"`
}

type UpdateVocabularyRequest struct {
	Hanzi    *string `json:"hanzi"`
	Pinyin   *string `json:"pinyin"`
	Meaning  *string `json:"meaning"`
	Example  *string `json:"example"`
	Note     *string `json:"note"`
	Status   *string `json:"status"`
	HSKLevel *int    `json:"hsk_level"`
}

type ListVocabularyQuery struct {
	Search   string
	Status   string
	Date     string
	HSKLevel *int
	Sort     string
	Page     int
	Limit    int
}

type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	Limit       int   `json:"limit"`
	TotalItems  int64 `json:"total_items"`
	TotalPages  int   `json:"total_pages"`
}

type PaginatedVocabularies struct {
	Data       []Vocabulary   `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
}
