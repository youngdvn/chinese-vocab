"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconHeadphones,
    IconPlus,
    IconRefresh,
    IconTrophy,
    IconVolume,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { EmptyState } from "@/components/empty-state"
import { getVocabularies } from "@/services/vocabulary.service"
import { submitReview } from "@/services/review.service"
import type { Vocabulary } from "@/types/vocabulary"
import type { ListeningQuestion } from "@/types/practice.types"
import { PracticeNav } from "@/app/features/practice/practice-nav"

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = a[i]!
        a[i] = a[j]!
        a[j] = tmp
    }
    return a
}

export default function ListeningPracticePage() {
    const [questions, setQuestions] = useState<ListeningQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    const speak = useCallback((text: string, rate: number = 0.9) => {
        if (!("speechSynthesis" in window)) {
            toast.error("Trình duyệt không hỗ trợ phát âm thanh!")
            return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "zh-CN"
        utterance.rate = rate

        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)

        window.speechSynthesis.speak(utterance)
    }, [])

    const loadQuestions = useCallback(async () => {
        try {
            setIsLoading(true)
            setIsComplete(false)
            setCurrentIndex(0)
            setSelectedId(null)
            setIsAnswered(false)
            setScore(0)

            const res = await getVocabularies({ limit: 50 })
            const allWords = res.data || []

            if (allWords.length < 4) {
                toast.error("Cần ít nhất 4 từ vựng để tạo bài luyện nghe!")
                return
            }

            const picked = shuffleArray(allWords).slice(0, Math.min(8, allWords.length))
            const generated: ListeningQuestion[] = picked.map((target) => {
                const distractors = shuffleArray(allWords.filter((w) => w.id !== target.id)).slice(0, 3)
                const options = shuffleArray([target, ...distractors])
                return {
                    word: target,
                    correctWord: target,
                    options,
                }
            })

            setQuestions(generated)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải từ vựng"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadQuestions()
    }, [loadQuestions])

    // Auto-play audio when question changes
    useEffect(() => {
        if (questions[currentIndex] && !isAnswered) {
            const text = questions[currentIndex].correctWord.hanzi || questions[currentIndex].correctWord.chinese || ""
            speak(text, 0.9)
        }
    }, [currentIndex, questions, isAnswered, speak])

    const handleSelectOption = (option: Vocabulary) => {
        if (isAnswered) return
        setSelectedId(option.id)
        setIsAnswered(true)

        const currentQ = questions[currentIndex]
        if (!currentQ) return
        const isCorrect = option.id === currentQ.correctWord.id

        if (isCorrect) {
            setScore((s) => s + 1)
            toast.success("Nghe chuẩn xác! 🎉", { duration: 1200 })
            submitReview({ vocabulary_id: currentQ.correctWord.id, rating: 2 }).catch(() => { })
        } else {
            toast.error(`Chưa chính xác! Từ vừa phát âm là "${currentQ.correctWord.hanzi || currentQ.correctWord.chinese}"`)
            submitReview({ vocabulary_id: currentQ.correctWord.id, rating: 1 }).catch(() => { })
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1)
            setSelectedId(null)
            setIsAnswered(false)
        } else {
            setIsComplete(true)
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
                <PracticeNav />

                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                    <div className="flex flex-col items-center gap-1">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Progress */}
                <Skeleton className="h-1.5 w-full rounded-full" />

                {/* Audio Box Skeleton */}
                <Card className="text-center py-10 px-4 flex flex-col items-center justify-center gap-4">
                    <Skeleton className="size-24 rounded-full shadow-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-32 rounded-lg" />
                        <Skeleton className="h-8 w-28 rounded-lg" />
                    </div>
                </Card>

                {/* Prompt badge skeleton */}
                <div className="flex justify-center">
                    <Skeleton className="h-5 w-40 rounded-full" />
                </div>

                {/* Options Grid Skeleton */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex h-16 items-center gap-3 rounded-xl border bg-card p-3 shadow-xs"
                        >
                            <Skeleton className="size-7 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-20 rounded-md" />
                                <Skeleton className="h-3 w-28 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    if (isComplete) {
        const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconTrophy size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Hoàn thành bài luyện nghe! 🎧</h1>
                    <p className="text-sm text-muted-foreground">
                        Bạn nhận diện đúng <span className="font-semibold text-foreground">{score}/{questions.length}</span> từ.
                    </p>
                </div>

                <Card className="w-full">
                    <CardContent className="p-4 flex justify-around text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">{score}</p>
                            <p className="text-xs text-muted-foreground">Đúng</p>
                        </div>
                        <div className="w-px bg-border" />
                        <div>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                            <p className="text-xs text-muted-foreground">Độ chính xác</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex w-full flex-col gap-3">
                    <Button onClick={loadQuestions} className="w-full gap-2">
                        <IconRefresh size={16} />
                        Luyện nghe lại
                    </Button>
                    <Link href="/practice" className="w-full">
                        <Button variant="outline" className="w-full">
                            Về Flashcard
                        </Button>
                    </Link>
                </div>
            </main>
        )
    }

    if (questions.length === 0) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
                <PracticeNav />
                <EmptyState
                    // icon={<IconHeadphones size={28} />}
                    title="Chưa có từ vựng để tạo bài luyện nghe"
                    description="Hãy thêm ít nhất 4 từ vựng vào kho từ để hệ thống có thể phát âm và tạo câu hỏi luyện nghe cho bạn."
                    action={
                        <Link href="/vocabulary">
                            <Button className="gap-1.5 h-9">
                                <IconPlus size={16} />
                                Thêm từ vựng ngay
                            </Button>
                        </Link>
                    }
                />
            </main>
        )
    }

    const currentQ = questions[currentIndex]
    if (!currentQ) return null

    const currentHanzi = currentQ.correctWord.hanzi || currentQ.correctWord.chinese || ""
    const progressPercent = ((currentIndex + 1) / questions.length) * 100

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
            <PracticeNav />

            {/* Header info */}
            <div className="flex items-center justify-between">
                <Link href="/practice" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <IconArrowLeft size={14} />
                    Flashcard
                </Link>
                <div className="text-center">
                    <h1 className="text-sm font-semibold">Luyện Nghe</h1>
                    <p className="text-xs text-muted-foreground">
                        Câu {currentIndex + 1} / {questions.length}
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {score} đúng
                </Badge>
            </div>

            {/* Progress */}
            <Progress value={progressPercent} className="h-1.5 w-full" />

            {/* Audio Listening Box */}
            <Card className="text-center py-10 px-4 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center">
                    <Button
                        size="icon"
                        onClick={() => speak(currentHanzi, 0.9)}
                        className={`size-24 rounded-full shadow-lg transition-all ${isPlaying ? "scale-105 ring-4 ring-primary/30" : "hover:scale-105"
                            }`}
                        title="Nghe lại phát âm"
                    >
                        <IconVolume size={42} />
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => speak(currentHanzi, 0.9)}
                        className="text-xs gap-1.5"
                    >
                        <IconHeadphones size={14} />
                        Tốc độ chuẩn (1.0x)
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => speak(currentHanzi, 0.65)}
                        className="text-xs gap-1.5"
                    >
                        Tốc độ chậm (0.7x)
                    </Button>
                </div>

                {isAnswered && (
                    <div className="mt-2 text-center animate-in fade-in">
                        <p className="text-2xl font-bold">{currentHanzi}</p>
                        <p className="text-sm text-muted-foreground font-medium">{currentQ.correctWord.pinyin}</p>
                    </div>
                )}
            </Card>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-2 gap-3">
                {currentQ.options.map((option) => {
                    const isSelected = selectedId === option.id
                    const isCorrect = option.id === currentQ.correctWord.id
                    const hanzi = option.hanzi || option.chinese || ""

                    let optionStyle = "border-border bg-card hover:border-primary/50 hover:bg-muted/40"

                    if (isAnswered) {
                        if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500/30"
                        } else if (isSelected) {
                            optionStyle = "border-destructive bg-destructive/10 text-destructive font-semibold"
                        } else {
                            optionStyle = "border-border bg-card/60 opacity-60"
                        }
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleSelectOption(option)}
                            disabled={isAnswered}
                            className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-150 min-h-[90px] ${optionStyle}`}
                        >
                            <span className="text-2xl font-bold">{hanzi}</span>
                            <span className="text-xs text-muted-foreground mt-1">{option.pinyin}</span>
                            <span className="text-xs font-medium truncate max-w-[140px] mt-0.5">{option.meaning}</span>
                        </button>
                    )
                })}
            </div>

            {/* Next button */}
            {isAnswered && (
                <Button
                    onClick={handleNext}
                    className="w-full mt-2 py-6 text-base font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    {currentIndex < questions.length - 1 ? "Câu tiếp theo →" : "Xem kết quả luyện nghe 🎉"}
                </Button>
            )}
        </main>
    )
}
