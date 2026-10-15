"use client"

import { useState } from "react"
import Link from "next/link"
import {
    IconArrowLeft,
    IconArrowRight,
    IconEye,
    IconEyeOff,
    IconPlayerSkipBack,
    IconRefresh,
    IconSparkles,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Card, CardContent } from "@workspace/ui/components/card"
import { WordAudio } from "@/components/word-audio"
import { submitReview } from "@/services/review.service"
import type { FlashCard } from "@/types/practice.types"

export interface FlashcardViewProps {
    cards: FlashCard[]
    onBack: () => void
}

export function FlashcardView({ cards: initialCards, onBack }: FlashcardViewProps) {
    const [cards, setCards] = useState<FlashCard[]>(initialCards)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const reviewedCount = cards.filter((c) => c.reviewed).length
    const progressPercent = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0
    const currentCard = cards[currentIndex]
    const isFirstCard = currentIndex === 0
    const isLastCard = currentIndex === cards.length - 1

    const markReviewed = async (card: FlashCard) => {
        if (card.reviewed) return
        try {
            await submitReview({ vocabulary_id: card.id, rating: 2 })
            setCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, reviewed: true } : c))
            )
        } catch {
            // silent
        }
    }

    const handleNext = async () => {
        if (!currentCard || isSubmitting) return
        setIsSubmitting(true)
        await markReviewed(currentCard)
        setIsSubmitting(false)

        if (isLastCard) {
            setIsComplete(true)
        } else {
            setCurrentIndex((i) => i + 1)
            setShowAnswer(false)
        }
    }

    const handlePrev = () => {
        if (!isFirstCard) {
            setCurrentIndex((i) => i - 1)
            setShowAnswer(false)
        }
    }

    if (isComplete) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconSparkles size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Tuyệt vời!</h1>
                    <p className="text-sm text-muted-foreground">
                        Bạn vừa ôn xong{" "}
                        <span className="font-semibold text-foreground">{cards.length}</span> từ vựng.
                    </p>
                </div>
                <Card className="w-full border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex justify-around">
                        <div>
                            <p className="text-xs text-muted-foreground">Tổng số thẻ</p>
                            <p className="text-xl font-bold">{cards.length}</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <p className="text-xs text-muted-foreground">Đã ghi nhận SRS</p>
                            <p className="text-xl font-bold text-primary">{cards.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex w-full flex-col gap-3">
                    <Button onClick={onBack} className="w-full gap-2">
                        <IconRefresh size={16} />
                        Chọn từ ôn tiếp
                    </Button>
                    <Link href="/practice/quiz" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Làm Quiz Trắc Nghiệm
                        </Button>
                    </Link>
                    <Link href="/practice/matching" className="w-full">
                        <Button variant="outline" className="w-full">
                            Thử chế độ Nối Từ
                        </Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button variant="ghost" className="w-full">
                            Về Trang Chủ
                        </Button>
                    </Link>
                </div>
            </main>
        )
    }

    if (!currentCard) return null

    const hanzi = currentCard.hanzi || currentCard.chinese || ""

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col items-center justify-center gap-6 py-4 px-4 sm:px-16">
            {/* Progress header with Shadcn Progress */}
            <div className="w-full">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="h-7 px-2 text-xs gap-1 hover:text-foreground"
                    >
                        <IconArrowLeft size={13} />
                        Chọn lại
                    </Button>
                    <span className="text-xs font-medium">
                        Thẻ <span className="font-semibold text-foreground">{currentIndex + 1}</span> / {cards.length}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                        {reviewedCount} đã ôn
                    </Badge>
                </div>
                <Progress value={progressPercent} className="h-2 w-full" />
            </div>

            {/* Flashcard with Shadcn Card */}
            <Card
                onClick={() => setShowAnswer((v) => !v)}
                className="relative min-h-85 w-full cursor-pointer rounded-3xl border bg-card p-8 text-center shadow-sm transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center select-none"
            >
                <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                    <WordAudio word={hanzi} />
                </div>

                {currentCard.reviewed && (
                    <Badge variant="outline" className="absolute top-4 left-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]">
                        ✓ Đã ôn
                    </Badge>
                )}

                <p className="text-6xl font-bold tracking-wide">{hanzi}</p>
                <p className="mt-3 text-lg text-muted-foreground font-medium">{currentCard.pinyin}</p>

                {showAnswer ? (
                    <div className="mt-6 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="h-px w-16 bg-border mb-2" />
                        <p className="text-xl font-semibold text-primary">{currentCard.meaning}</p>
                        {currentCard.example && (
                            <p className="mt-1 text-sm text-muted-foreground italic max-w-xs">
                                &quot;{currentCard.example}&quot;
                            </p>
                        )}
                        {currentCard.note && (
                            <p className="text-xs text-muted-foreground mt-1 bg-muted rounded-lg px-3 py-1">
                                💡 {currentCard.note}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <IconEye size={14} />
                        <span>Chạm để xem nghĩa</span>
                    </div>
                )}
            </Card>

            {/* Navigation buttons */}
            <div className="flex w-full items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    disabled={isFirstCard}
                    className="h-12 w-12 shrink-0 rounded-xl"
                    title="Thẻ trước"
                >
                    <IconArrowLeft size={20} />
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setShowAnswer((v) => !v)}
                    className="flex-1 h-12 rounded-xl gap-2 font-medium"
                >
                    {showAnswer ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    {showAnswer ? "Ẩn đáp án" : "Hiện đáp án"}
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    size="icon"
                    className="h-12 w-12 shrink-0 rounded-xl"
                    title={isLastCard ? "Hoàn thành" : "Thẻ tiếp theo"}
                >
                    {isSubmitting ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : isLastCard ? (
                        <IconSparkles size={20} />
                    ) : (
                        <IconArrowRight size={20} />
                    )}
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-xs text-muted-foreground gap-1.5"
            >
                <IconPlayerSkipBack size={12} />
                Quay lại chọn từ
            </Button>
        </main>
    )
}
