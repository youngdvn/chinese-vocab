"use client"

import { useState } from "react"
import { WordSelection } from "@/app/features/practice/components/word-selection"
import { FlashcardView } from "@/app/features/practice/components/flashcard-view"
import type { FlashCard, PracticePhase } from "@/types/practice.types"
import type { Vocabulary } from "@/types/vocabulary"

export default function PracticePage() {
    const [phase, setPhase] = useState<PracticePhase>("select")
    const [practiceCards, setPracticeCards] = useState<FlashCard[]>([])

    const handleStart = (words: Vocabulary[]) => {
        const cards: FlashCard[] = words.map((w) => ({ ...w, reviewed: false }))
        setPracticeCards(cards)
        setPhase("practice")
    }

    const handleBack = () => {
        setPhase("select")
        setPracticeCards([])
    }

    if (phase === "practice") {
        return <FlashcardView cards={practiceCards} onBack={handleBack} />
    }

    return <WordSelection onStart={handleStart} />
}