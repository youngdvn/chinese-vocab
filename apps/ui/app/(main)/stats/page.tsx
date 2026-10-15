"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconBolt,
    IconBook2,
    IconFlame,
    IconSparkles,
    IconTarget,
    IconTrophy,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Button } from "@workspace/ui/components/button"
import { getDashboardOverview, getDailyProgress } from "@/services/dashboard.service"
import { getVocabularies } from "@/services/vocabulary.service"
import type { DashboardOverview, DailyProgress as DailyProgressType } from "@/types/dashboard.types"
import type { Vocabulary } from "@/types/vocabulary"

export default function StatsPage() {
    const [overview, setOverview] = useState<DashboardOverview | null>(null)
    const [progress, setProgress] = useState<DailyProgressType | null>(null)
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchAll() {
            try {
                setIsLoading(true)
                const [ovRes, progRes, vocabRes] = await Promise.all([
                    getDashboardOverview().catch(() => null),
                    getDailyProgress().catch(() => null),
                    getVocabularies({ limit: 200 }).catch(() => ({ data: [] })),
                ])
                setOverview(ovRes)
                setProgress(progRes)
                setVocabularies(vocabRes.data || [])
            } catch (err) {
                toast.error("Không thể tải số liệu thống kê")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAll()
    }, [])

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Đang tổng hợp dữ liệu học tập...</p>
            </main>
        )
    }

    const totalWords = overview?.total_words ?? vocabularies.length
    const masteredWords = vocabularies.filter((w) => w.status === "mastered").length
    const learningWords = overview?.learning_words ?? vocabularies.filter((w) => w.status === "learning").length
    const newWords = overview?.new_words ?? vocabularies.filter((w) => w.status === "new").length

    const masteredPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0
    const learningPercent = totalWords > 0 ? Math.round((learningWords / totalWords) * 100) : 0
    const newPercent = totalWords > 0 ? Math.round((newWords / totalWords) * 100) : 0

    const dailyGoal = progress?.daily_goal ?? 20
    const learnedToday = progress?.learned_today ?? 0
    const dailyGoalPercent = progress?.progress_percentage ?? Math.min(100, Math.round((learnedToday / dailyGoal) * 100))

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col gap-5 px-4 py-6">
            {/* Header */}
            <div>
                <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit mb-2">
                    <IconArrowLeft size={14} />
                    Trang chủ
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Thống kê học tập</h1>
                        <p className="text-xs text-muted-foreground">
                            Theo dõi chi tiết tiến trình ghi nhớ từ vựng tiếng Trung
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Goal Card */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <IconTarget size={18} />
                            </div>
                            <div>
                                <CardTitle className="text-base">Mục tiêu hôm nay</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Hoàn thành {learnedToday} / {dailyGoal} từ vựng
                                </p>
                            </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{Math.round(dailyGoalPercent)}%</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <Progress value={dailyGoalPercent} className="h-2.5 w-full" />
                    <p className="mt-2 text-xs text-muted-foreground">
                        {dailyGoalPercent >= 100
                            ? "🎉 Bạn đã xuất sắc hoàn thành mục tiêu ngày!"
                            : `Còn ${Math.max(0, dailyGoal - learnedToday)} từ nữa để đạt mục tiêu.`}
                    </p>
                </CardContent>
            </Card>

            {/* Vocabulary Status Breakdown */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                        <span>Phân bổ trạng thái ({totalWords} từ)</span>
                        <Badge variant="secondary" className="text-xs">
                            SRS Memory
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {/* Mastered */}
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <IconTrophy size={14} />
                                Đã thành thạo (Mastered)
                            </span>
                            <span className="font-semibold">{masteredWords} từ ({masteredPercent}%)</span>
                        </div>
                        <Progress value={masteredPercent} className="h-2 bg-muted text-emerald-500" />
                    </div>

                    {/* Learning */}
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                <IconBolt size={14} />
                                Đang học & Ôn tập (Learning)
                            </span>
                            <span className="font-semibold">{learningWords} từ ({learningPercent}%)</span>
                        </div>
                        <Progress value={learningPercent} className="h-2" />
                    </div>

                    {/* New */}
                    <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                <IconSparkles size={14} />
                                Từ mới thêm (New)
                            </span>
                            <span className="font-semibold">{newWords} từ ({newPercent}%)</span>
                        </div>
                        <Progress value={newPercent} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Card className="text-center p-3">
                    <p className="text-xs text-muted-foreground">Tổng số từ</p>
                    <p className="text-2xl font-bold mt-1 text-primary">{totalWords}</p>
                </Card>
                <Card className="text-center p-3">
                    <p className="text-xs text-muted-foreground">Tuần này</p>
                    <p className="text-2xl font-bold mt-1">{overview?.this_week_words ?? 0}</p>
                </Card>
                <Card className="text-center p-3">
                    <p className="text-xs text-muted-foreground">Tỷ lệ nhớ</p>
                    <p className="text-2xl font-bold mt-1 text-emerald-600">
                        {masteredPercent}%
                    </p>
                </Card>
                <Card className="text-center p-3">
                    <p className="text-xs text-muted-foreground">Streak mục tiêu</p>
                    <div className="flex items-center justify-center gap-1 text-amber-500 mt-1">
                        <IconFlame size={20} />
                        <span className="text-2xl font-bold">1</span>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 mt-2">
                <Link href="/practice">
                    <Button className="w-full gap-2">
                        <IconBolt size={16} />
                        Bắt đầu luyện tập ngay
                    </Button>
                </Link>
                <Link href="/vocabulary">
                    <Button variant="outline" className="w-full gap-2">
                        <IconBook2 size={16} />
                        Quản lý kho từ vựng
                    </Button>
                </Link>
            </div>
        </main>
    )
}
