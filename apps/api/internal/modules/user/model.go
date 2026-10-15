package user

import "time"

type UserProfile struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	DailyGoal int       `json:"daily_goal"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UpdateSettingsRequest struct {
	Name      *string `json:"name,omitempty"`
	DailyGoal *int    `json:"daily_goal,omitempty"`
}
