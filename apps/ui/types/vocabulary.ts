export type VocabularyStatus = "new" | "learning"

export interface Vocabulary {
    id: number
    chinese: string
    pinyin: string
    meaning: string
    status: VocabularyStatus
    createdAt: string
}