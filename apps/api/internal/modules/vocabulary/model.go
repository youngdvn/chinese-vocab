package vocabulary

type Vocabulary struct {
	ID       int64  `json:"id"`
	UserID   int64  `json:"user_id"`
	Hanzi    string `json:"hanzi"`
	Pinyin   string `json:"pinyin"`
	Meaning  string `json:"meaning"`
	Example  string `json:"example"`
	Note     string `json:"note"`
	HSKLevel *int   `json:"hsk_level,omitempty"`
}

type CreateVocabularyRequest struct {
	UserID   int64  `json:"user_id"`
	Hanzi    string `json:"hanzi"`
	Pinyin   string `json:"pinyin"`
	Meaning  string `json:"meaning"`
	Example  string `json:"example"`
	Note     string `json:"note"`
	HSKLevel *int   `json:"hsk_level,omitempty"`
}

type UpdateVocabularyRequest struct {
	Hanzi    *string `json:"hanzi"`
	Pinyin   *string `json:"pinyin"`
	Meaning  *string `json:"meaning"`
	Example  *string `json:"example"`
	Note     *string `json:"note"`
	HSKLevel *int    `json:"hsk_level"`
}
