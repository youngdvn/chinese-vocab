import type { Vocabulary } from "./vocabulary"

export type PracticePhase = "select" | "practice"

export interface FlashCard extends Vocabulary {
    reviewed: boolean
}

export interface MatchItem {
    id: string
    text: string
    vocabId: number
    type: "hanzi" | "meaning"
    matched: boolean
    selected: boolean
    wrong: boolean
}

export interface QuizQuestion {
    word: Vocabulary
    prompt: string
    promptType: "hanzi" | "meaning"
    options: string[]
    correctAnswer: string
}

export interface ListeningQuestion {
    word: Vocabulary
    options: Vocabulary[]
    correctWord: Vocabulary
}
