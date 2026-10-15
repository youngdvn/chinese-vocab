export interface PracticeCard {
    vocabulary_id: number
    hanzi: string
    pinyin: string
    meaning: string
    example: string
    note: string
    status: string
    repetitions: number
    next_review_at?: string
}

export interface PracticeResponse {
    total_remaining: number
    cards: PracticeCard[]
}

export interface SubmitReviewPayload {
    vocabulary_id: number
    rating: number // 1: Hard, 2: Good, 3: Easy
}

export interface SubmitReviewResponse {
    review_id: number
    vocabulary_id: number
    rating: number
    reviewed_at: string
    next_review_at: string
    status: string
    repetitions: number
}
