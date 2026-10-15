export type VocabularyStatus = "new" | "learning" | "mastered"

export interface Vocabulary {
    id: number
    hanzi?: string
    chinese?: string
    pinyin: string
    meaning: string
    example?: string
    note?: string
    status: VocabularyStatus
    created_at?: string
    createdAt?: string
}

export interface PaginationMeta {
    current_page: number
    limit: number
    total_items: number
    total_pages: number
}

export interface PaginatedVocabularies {
    data: Vocabulary[]
    pagination: PaginationMeta
}

export interface CreateVocabularyPayload {
    hanzi: string
    pinyin: string
    meaning: string
    example?: string
    note?: string
}

export interface UpdateVocabularyPayload {
    hanzi?: string
    pinyin?: string
    meaning?: string
    example?: string
    note?: string
    status?: VocabularyStatus
}