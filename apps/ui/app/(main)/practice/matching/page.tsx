"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconPlus,
    IconPuzzle,
    IconRefresh,
    IconSparkles,
    IconTrophy,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { EmptyState } from "@/components/empty-state"
import { getVocabularies } from "@/services/vocabulary.service"
import type { Vocabulary } from "@/types/vocabulary"
import type { MatchItem } from "@/types/practice.types"
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

const PAIRS_COUNT = 6

export default function MatchingPage() {
    const [leftItems, setLeftItems] = useState<MatchItem[]>([])
    const [rightItems, setRightItems] = useState<MatchItem[]>([])
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
    const [selectedRight, setSelectedRight] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [errors, setErrors] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)
    const [round, setRound] = useState(1)

    const loadGame = useCallback(async () => {
        try {
            setIsLoading(true)
            setIsComplete(false)
            setScore(0)
            setErrors(0)
            setSelectedLeft(null)
            setSelectedRight(null)

            const res = await getVocabularies({ limit: 50 })
            const allWords = res.data || []

            if (allWords.length < 3) {
                toast.error("Bạn cần có ít nhất 3 từ vựng để chơi. Hãy thêm từ vựng nhé!")
                return
            }

            const count = Math.min(PAIRS_COUNT, allWords.length)
            const picked = shuffleArray(allWords).slice(0, count)

            const left: MatchItem[] = picked.map((w) => ({
                id: `left-${w.id}`,
                text: w.hanzi || w.chinese || "",
                vocabId: w.id,
                type: "hanzi",
                matched: false,
                selected: false,
                wrong: false,
            }))

            const right: MatchItem[] = shuffleArray(
                picked.map((w) => ({
                    id: `right-${w.id}`,
                    text: w.meaning,
                    vocabId: w.id,
                    type: "meaning" as const,
                    matched: false,
                    selected: false,
                    wrong: false,
                }))
            )

            setLeftItems(left)
            setRightItems(right)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải từ vựng"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadGame()
    }, [loadGame])

    // Check match when both sides selected
    useEffect(() => {
        if (!selectedLeft || !selectedRight) return

        const left = leftItems.find((i) => i.id === selectedLeft)
        const right = rightItems.find((i) => i.id === selectedRight)
        if (!left || !right) return

        const isMatch = left.vocabId === right.vocabId

        if (isMatch) {
            setScore((s) => s + 1)
            toast.success(`✓ Ghép đúng! "${left.text}" = "${right.text}"`, { duration: 1200 })

            setLeftItems((prev) =>
                prev.map((i) => (i.id === selectedLeft ? { ...i, matched: true, selected: false, wrong: false } : i))
            )
            setRightItems((prev) =>
                prev.map((i) => (i.id === selectedRight ? { ...i, matched: true, selected: false, wrong: false } : i))
            )
            setSelectedLeft(null)
            setSelectedRight(null)
        } else {
            setErrors((e) => e + 1)

            setLeftItems((prev) => prev.map((i) => (i.id === selectedLeft ? { ...i, wrong: true } : i)))
            setRightItems((prev) => prev.map((i) => (i.id === selectedRight ? { ...i, wrong: true } : i)))

            setTimeout(() => {
                setLeftItems((prev) =>
                    prev.map((i) => (i.id === selectedLeft ? { ...i, wrong: false, selected: false } : i))
                )
                setRightItems((prev) =>
                    prev.map((i) => (i.id === selectedRight ? { ...i, wrong: false, selected: false } : i))
                )
                setSelectedLeft(null)
                setSelectedRight(null)
            }, 500)
        }
    }, [selectedLeft, selectedRight]) // eslint-disable-line react-hooks/exhaustive-deps

    // Check completion
    useEffect(() => {
        if (leftItems.length > 0 && leftItems.every((i) => i.matched)) {
            setTimeout(() => setIsComplete(true), 400)
        }
    }, [leftItems])

    const handleSelectLeft = (id: string) => {
        const item = leftItems.find((i) => i.id === id)
        if (!item || item.matched || selectedLeft === id) return

        setLeftItems((prev) => prev.map((i) => ({ ...i, selected: i.id === id })))
        setSelectedLeft(id)
    }

    const handleSelectRight = (id: string) => {
        const item = rightItems.find((i) => i.id === id)
        if (!item || item.matched || selectedRight === id) return

        setRightItems((prev) => prev.map((i) => ({ ...i, selected: i.id === id })))
        setSelectedRight(id)
    }

    const handleNextRound = () => {
        setRound((r) => r + 1)
        loadGame()
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
                        <Skeleton className="h-3 w-14 rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>

                {/* Progress */}
                <Skeleton className="h-1.5 w-full rounded-full" />

                {/* Instruction */}
                <div className="flex justify-center">
                    <Skeleton className="h-3.5 w-72 rounded-md" />
                </div>

                {/* Game Board Skeleton: 2 columns of 5 cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex h-14 items-center justify-center rounded-xl border bg-card p-3 shadow-xs"
                            >
                                <Skeleton className="h-6 w-16 rounded-md" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex h-14 items-center justify-center rounded-xl border bg-card p-3 shadow-xs"
                            >
                                <Skeleton className="h-4 w-24 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    if (isComplete) {
        const accuracy = leftItems.length > 0 ? Math.round((score / (score + errors)) * 100) : 100
        const isGoodScore = accuracy >= 80

        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-8 text-center">
                <div className={`flex size-20 items-center justify-center rounded-full ${isGoodScore ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"}`}>
                    {isGoodScore ? <IconTrophy size={40} /> : <IconSparkles size={40} />}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        {isGoodScore ? "Xuất sắc! 🏆" : "Hoàn thành! 🎉"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Vòng {round} — Bạn nối đúng{" "}
                        <span className="font-semibold text-foreground">{score}/{leftItems.length}</span> cặp
                        {errors > 0 && ` (${errors} lần sai)`}.
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
                            <p className="text-2xl font-bold text-destructive">{errors}</p>
                            <p className="text-xs text-muted-foreground">Sai</p>
                        </div>
                        <div className="w-px bg-border" />
                        <div>
                            <p className="text-2xl font-bold">{accuracy}%</p>
                            <p className="text-xs text-muted-foreground">Chính xác</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex w-full flex-col gap-3">
                    <Button onClick={handleNextRound} className="w-full gap-2">
                        <IconRefresh size={16} />
                        Vòng tiếp theo
                    </Button>
                    <Link href="/practice/quiz" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Thử Quiz Trắc Nghiệm 📝
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

    if (leftItems.length === 0) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
                <PracticeNav />
                <EmptyState
                    icon={<IconPuzzle size={28} />}
                    title="Chưa có từ vựng để tạo trò chơi nối từ"
                    description="Hãy thêm ít nhất 2 từ vựng vào kho từ để bắt đầu trò chơi ghép chữ Hán và ý nghĩa."
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

    const matchedCount = leftItems.filter((i) => i.matched).length
    const progressPercent = leftItems.length > 0 ? (matchedCount / leftItems.length) * 100 : 0

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-4 px-4 py-4">
            <PracticeNav />

            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/practice" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <IconArrowLeft size={14} />
                    Flashcard
                </Link>
                <div className="text-center">
                    <h1 className="text-sm font-semibold">Trò chơi Nối Từ</h1>
                    <p className="text-xs text-muted-foreground">Vòng {round}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                        {matchedCount} ✓
                    </Badge>
                    {errors > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5">
                            {errors} ✗
                        </Badge>
                    )}
                </div>
            </div>

            {/* Progress */}
            <Progress value={progressPercent} className="h-1.5 w-full" />

            {/* Instruction */}
            <p className="text-center text-xs text-muted-foreground">
                Chọn một ô chữ Hán bên trái, sau đó chọn nghĩa tương ứng bên phải
            </p>

            {/* Game board */}
            <div className="grid grid-cols-2 gap-3">
                {/* Left column — Hanzi */}
                <div className="flex flex-col gap-2">
                    {leftItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSelectLeft(item.id)}
                            disabled={item.matched}
                            className={`w-full rounded-xl border p-3 text-center text-xl font-bold transition-all duration-150 ${
                                item.matched
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default opacity-60"
                                    : item.wrong
                                    ? "border-destructive/50 bg-destructive/10 text-destructive animate-pulse"
                                    : item.selected
                                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-sm"
                                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 active:scale-98"
                            }`}
                        >
                            {item.matched ? (
                                <span className="text-sm font-medium">{item.text}</span>
                            ) : (
                                item.text
                            )}
                        </button>
                    ))}
                </div>

                {/* Right column — Meanings */}
                <div className="flex flex-col gap-2">
                    {rightItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSelectRight(item.id)}
                            disabled={item.matched}
                            className={`w-full rounded-xl border p-3 text-center text-sm font-medium transition-all duration-150 leading-snug min-h-[56px] flex items-center justify-center ${
                                item.matched
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default opacity-60"
                                    : item.wrong
                                    ? "border-destructive/50 bg-destructive/10 text-destructive animate-pulse"
                                    : item.selected
                                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-sm"
                                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 active:scale-98"
                            }`}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reload */}
            <Button
                variant="ghost"
                size="sm"
                onClick={loadGame}
                className="mx-auto text-xs text-muted-foreground gap-1.5"
            >
                <IconRefresh size={12} />
                Đổi bộ từ mới
            </Button>
        </main>
    )
}
