"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconCheck,
    IconFlame,
    IconHelpCircle,
    IconRefresh,
    IconTrophy,
    IconX,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { WordAudio } from "@/components/word-audio"
import { getVocabularies } from "@/services/vocabulary.service"
import { submitReview } from "@/services/review.service"
import type { QuizQuestion } from "@/types/practice.types"
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

export default function QuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)

    const loadQuiz = useCallback(async () => {
        try {
            setIsLoading(true)
            setIsComplete(false)
            setCurrentIndex(0)
            setSelectedAnswer(null)
            setIsAnswered(false)
            setScore(0)
            setStreak(0)
            setMaxStreak(0)

            const res = await getVocabularies({ limit: 60 })
            const allWords = res.data || []

            if (allWords.length < 4) {
                toast.error("Bạn cần ít nhất 4 từ vựng để tạo bài kiểm tra Quiz!")
                return
            }

            const shuffledWords = shuffleArray(allWords).slice(0, Math.min(10, allWords.length))
            const generatedQuestions: QuizQuestion[] = shuffledWords.map((currentWord, index) => {
                const promptType: "hanzi" | "meaning" = index % 2 === 0 ? "hanzi" : "meaning"
                const prompt = promptType === "hanzi"
                    ? (currentWord.hanzi || currentWord.chinese || "")
                    : currentWord.meaning
                const correctAnswer = promptType === "hanzi"
                    ? currentWord.meaning
                    : (currentWord.hanzi || currentWord.chinese || "")

                // Pick 3 distractors from other words
                const otherWords = allWords.filter((w) => w.id !== currentWord.id)
                const pickedDistractors = shuffleArray(otherWords)
                    .slice(0, 3)
                    .map((w) => promptType === "hanzi" ? w.meaning : (w.hanzi || w.chinese || ""))

                const options = shuffleArray([correctAnswer, ...pickedDistractors])

                return {
                    word: currentWord,
                    prompt,
                    promptType,
                    options,
                    correctAnswer,
                }
            })

            setQuestions(generatedQuestions)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải từ vựng"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadQuiz()
    }, [loadQuiz])

    const handleSelectOption = async (option: string) => {
        if (isAnswered) return
        setSelectedAnswer(option)
        setIsAnswered(true)

        const currentQ = questions[currentIndex]
        if (!currentQ) return
        const isCorrect = option === currentQ.correctAnswer

        if (isCorrect) {
            setScore((s) => s + 1)
            const newStreak = streak + 1
            setStreak(newStreak)
            if (newStreak > maxStreak) setMaxStreak(newStreak)
            toast.success("Chính xác! 🎉", { duration: 1000 })
            // Submit SRS rating 2 (Good)
            submitReview({ vocabulary_id: currentQ.word.id, rating: 2 }).catch(() => { })
        } else {
            setStreak(0)
            toast.error(`Chưa chính xác! Đáp án đúng: ${currentQ.correctAnswer}`, { duration: 2500 })
            // Submit SRS rating 1 (Hard)
            submitReview({ vocabulary_id: currentQ.word.id, rating: 1 }).catch(() => { })
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1)
            setSelectedAnswer(null)
            setIsAnswered(false)
        } else {
            setIsComplete(true)
        }
    }

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Đang chuẩn bị câu hỏi trắc nghiệm...</p>
            </main>
        )
    }

    if (isComplete) {
        const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
        const isPassed = accuracy >= 70

        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <div className={`flex size-20 items-center justify-center rounded-full ${isPassed ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"}`}>
                    {isPassed ? <IconTrophy size={40} /> : <IconHelpCircle size={40} />}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        {isPassed ? "Chúc mừng! Hoàn thành xuất sắc" : "Cần cố gắng thêm một chút!"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Bạn đã trả lời đúng{" "}
                        <span className="font-semibold text-foreground">{score}/{questions.length}</span> câu hỏi.
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
                            <p className="text-2xl font-bold text-amber-500">{maxStreak}</p>
                            <p className="text-xs text-muted-foreground">Streak cao nhất</p>
                        </div>
                        <div className="w-px bg-border" />
                        <div>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                            <p className="text-xs text-muted-foreground">Tỷ lệ đúng</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex w-full flex-col gap-3">
                    <Button onClick={loadQuiz} className="w-full gap-2">
                        <IconRefresh size={16} />
                        Làm lại bài Quiz
                    </Button>
                    <Link href="/practice/pinyin" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Thử Luyện Gõ Pinyin ✍️
                        </Button>
                    </Link>
                    <Link href="/practice" className="w-full">
                        <Button variant="outline" className="w-full">
                            Về Flashcard
                        </Button>
                    </Link>
                </div>
            </main>
        )
    }

    const currentQ = questions[currentIndex]
    if (!currentQ) return null

    const progressPercent = ((currentIndex + 1) / questions.length) * 100
    const hanziWord = currentQ.word.hanzi || currentQ.word.chinese || ""

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
            <PracticeNav />

            {/* Header info */}
            <div className="flex items-center justify-between">
                <Link href="/practice" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <IconArrowLeft size={14} />
                    Flashcard
                </Link>

                <div className="flex items-center gap-3">
                    {streak > 1 && (
                        <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 bg-amber-500/10">
                            <IconFlame size={12} />
                            {streak} streak!
                        </Badge>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">
                        Câu <span className="font-semibold text-foreground">{currentIndex + 1}</span> / {questions.length}
                    </span>
                </div>
            </div>

            {/* Progress */}
            <Progress value={progressPercent} className="h-1.5 w-full" />

            {/* Question Card */}
            <Card className="relative overflow-hidden border-2 text-center py-8 px-4 flex flex-col items-center justify-center">
                <div className="absolute top-3 right-3">
                    <WordAudio word={hanziWord} />
                </div>

                <Badge variant="secondary" className="mb-3 text-[11px]">
                    {currentQ.promptType === "hanzi" ? "Chọn nghĩa tiếng Việt đúng" : "Chọn chữ Hán tương ứng"}
                </Badge>

                <p className={`${currentQ.promptType === "hanzi" ? "text-5xl font-bold" : "text-2xl font-semibold"} tracking-wide mt-2`}>
                    {currentQ.prompt}
                </p>

                {currentQ.promptType === "hanzi" && currentQ.word.pinyin && (
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        [{currentQ.word.pinyin}]
                    </p>
                )}
            </Card>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option
                    const isCorrect = option === currentQ.correctAnswer

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
                            key={idx}
                            onClick={() => handleSelectOption(option)}
                            disabled={isAnswered}
                            className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-150 active:scale-99 ${optionStyle}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-base font-medium">
                                    {option}
                                </span>
                            </div>

                            {isAnswered && isCorrect && (
                                <IconCheck size={18} className="text-emerald-600 shrink-0" />
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                                <IconX size={18} className="text-destructive shrink-0" />
                            )}
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
                    {currentIndex < questions.length - 1 ? "Câu tiếp theo →" : "Xem kết quả bài Quiz 🎉"}
                </Button>
            )}
        </main>
    )
}
