"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconCheck,
    IconHelpCircle,
    IconKeyboard,
    IconPlus,
    IconRefresh,
    IconTrophy,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { EmptyState } from "@/components/empty-state"
import { WordAudio } from "@/components/word-audio"
import { getVocabularies } from "@/services/vocabulary.service"
import { submitReview } from "@/services/review.service"
import type { Vocabulary } from "@/types/vocabulary"
import { PracticeNav } from "@/app/features/practice/practice-nav"

function normalizePinyin(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim()
}

export default function PinyinPracticePage() {
    const [words, setWords] = useState<Vocabulary[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [userInput, setUserInput] = useState("")
    const [isEvaluated, setIsEvaluated] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [score, setScore] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)

    const loadWords = useCallback(async () => {
        try {
            setIsLoading(true)
            setIsComplete(false)
            setCurrentIndex(0)
            setUserInput("")
            setIsEvaluated(false)
            setScore(0)
            setShowHint(false)

            const res = await getVocabularies({ limit: 40 })
            const all = res.data || []

            if (all.length === 0) {
                toast.error("Chưa có từ vựng nào để luyện gõ Pinyin!")
                return
            }

            // Shuffle
            const shuffled = [...all].sort(() => 0.5 - Math.random()).slice(0, 10)
            setWords(shuffled)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải từ vựng"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadWords()
    }, [loadWords])

    const handleCheck = () => {
        if (!userInput.trim() || isEvaluated) return

        const currentWord = words[currentIndex]
        if (!currentWord) return
        const expectedNorm = normalizePinyin(currentWord.pinyin)
        const userNorm = normalizePinyin(userInput)

        const correct = userNorm === expectedNorm || userInput.trim().toLowerCase() === currentWord.pinyin.trim().toLowerCase()
        setIsCorrect(correct)
        setIsEvaluated(true)

        if (correct) {
            setScore((s) => s + 1)
            toast.success("Chính xác! Giỏi lắm 🎉")
            submitReview({ vocabulary_id: currentWord.id, rating: 2 }).catch(() => { })
        } else {
            toast.error(`Chưa đúng rồi! Pinyin chuẩn là: ${currentWord.pinyin}`)
            submitReview({ vocabulary_id: currentWord.id, rating: 1 }).catch(() => { })
        }
    }

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex((i) => i + 1)
            setUserInput("")
            setIsEvaluated(false)
            setIsCorrect(false)
            setShowHint(false)
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
                        <Skeleton className="h-4 w-28 rounded-md" />
                        <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Progress */}
                <Skeleton className="h-1.5 w-full rounded-full" />

                {/* Word Card Skeleton */}
                <Card className="relative overflow-hidden text-center py-12 px-4 flex flex-col items-center justify-center gap-3">
                    <Skeleton className="size-9 rounded-lg absolute top-3 right-3" />
                    <Skeleton className="h-16 w-36 rounded-xl" />
                    <Skeleton className="h-5 w-44 rounded-md mt-2" />
                </Card>

                {/* Input & Action Skeleton */}
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-11 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </main>
        )
    }

    if (isComplete) {
        const accuracy = words.length > 0 ? Math.round((score / words.length) * 100) : 0
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconTrophy size={40} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Luyện gõ hoàn tất! ✍️</h1>
                    <p className="text-sm text-muted-foreground">
                        Bạn gõ đúng <span className="font-semibold text-foreground">{score}/{words.length}</span> từ vựng.
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
                    <Button onClick={loadWords} className="w-full gap-2">
                        <IconRefresh size={16} />
                        Luyện tập lại
                    </Button>
                    <Link href="/practice/listening" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Thử Luyện Nghe 🔊
                        </Button>
                    </Link>
                    <Link href="/practice" className="w-full">
                        <Button variant="outline" className="w-full">
                            Quay về Flashcard
                        </Button>
                    </Link>
                </div>
            </main>
        )
    }

    if (words.length === 0) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
                <PracticeNav />
                <EmptyState
                    // icon={<IconKeyboard size={28} />}
                    title="Chưa có từ vựng để luyện gõ Pinyin"
                    description="Hãy thêm các từ vựng mới vào kho từ để bắt đầu luyện phản xạ gõ phiên âm tiếng Trung."
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

    const currentWord = words[currentIndex]
    if (!currentWord) return null

    const hanziText = currentWord.hanzi || currentWord.chinese || ""
    const progressPercent = ((currentIndex + 1) / words.length) * 100

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
                    <h1 className="text-sm font-semibold">Luyện Gõ Pinyin</h1>
                    <p className="text-xs text-muted-foreground">
                        Từ {currentIndex + 1} / {words.length}
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {score} đúng
                </Badge>
            </div>

            {/* Progress */}
            <Progress value={progressPercent} className="h-1.5 w-full" />

            {/* Word Card */}
            <Card className="relative overflow-hidden text-center py-10 px-4 flex flex-col items-center justify-center">
                <div className="absolute top-3 right-3">
                    <WordAudio word={hanziText} />
                </div>

                <p className="text-6xl font-bold tracking-wider">{hanziText}</p>
                <p className="text-lg font-medium text-primary mt-3">{currentWord.meaning}</p>

                {showHint && (
                    <Badge variant="secondary" className="mt-3 text-sm px-3 py-1 animate-in fade-in">
                        Gợi ý: {currentWord.pinyin}
                    </Badge>
                )}
            </Card>

            {/* Input Form */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Nhập pinyin (ví dụ: ni hao hoặc nǐ hǎo)..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (isEvaluated) handleNext()
                                else handleCheck()
                            }
                        }}
                        disabled={isEvaluated}
                        autoFocus
                        className={`h-12 text-center text-lg font-medium transition-all ${isEvaluated
                                ? isCorrect
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                    : "border-destructive bg-destructive/10 text-destructive"
                                : ""
                            }`}
                    />
                </div>

                {isEvaluated ? (
                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-1">
                        <Card className={isCorrect ? "border-emerald-500/30 bg-emerald-500/10" : "border-destructive/30 bg-destructive/10"}>
                            <CardContent className="p-3 text-center">
                                <p className="text-xs text-muted-foreground">Phiên âm chuẩn:</p>
                                <p className="text-xl font-bold mt-0.5">{currentWord.pinyin}</p>
                            </CardContent>
                        </Card>
                        <Button onClick={handleNext} className="w-full h-11 text-base">
                            {currentIndex < words.length - 1 ? "Từ tiếp theo →" : "Xem kết quả 🎉"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowHint(true)}
                            disabled={showHint}
                            className="flex-1 gap-1.5 text-xs text-muted-foreground"
                        >
                            <IconHelpCircle size={14} />
                            Gợi ý Pinyin
                        </Button>
                        <Button
                            onClick={handleCheck}
                            disabled={!userInput.trim()}
                            className="flex-1 gap-1.5"
                        >
                            <IconCheck size={16} />
                            Kiểm tra
                        </Button>
                    </div>
                )}
            </div>
        </main>
    )
}
