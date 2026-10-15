package dashboard

type OverviewResponse struct {
	TotalWords         int `json:"total_words"`
	NewWords           int `json:"new_words"`
	LearningWords      int `json:"learning_words"`
	MasteredWords      int `json:"mastered_words"`
	ThisWeekWords      int `json:"this_week_words"`
	WaitingReviewCount int `json:"waiting_review_count"`
}

type TodayWord struct {
	ID           int64  `json:"id"`
	Hanzi        string `json:"hanzi"`
	Pinyin       string `json:"pinyin"`
	Meaning      string `json:"meaning"`
	Status       string `json:"status"`
	LearnedToday bool   `json:"learned_today"`
}

type DailyProgressResponse struct {
	DailyGoal          int         `json:"daily_goal"`
	LearnedToday       int         `json:"learned_today"`
	RemainingToday     int         `json:"remaining_today"`
	ProgressPercentage float64     `json:"progress_percentage"`
	Words              []TodayWord `json:"words"`
}
