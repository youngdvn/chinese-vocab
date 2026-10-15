export interface DashboardOverview {
    total_words: number
    new_words: number
    learning_words: number
    mastered_words: number
    this_week_words: number
    waiting_review_count: number
}

export interface TodayWord {
    id: number
    hanzi: string
    pinyin: string
    meaning: string
    status: string
    learned_today: boolean
}

export interface DailyProgress {
    daily_goal: number
    learned_today: number
    remaining_today: number
    progress_percentage: number
    words: TodayWord[]
}
