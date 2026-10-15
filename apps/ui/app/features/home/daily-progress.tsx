"use client"

import { Progress } from "@workspace/ui/components/progress"
import { Badge } from "@workspace/ui/components/badge"
import { WordAudio } from "@/components/word-audio"
import type { DailyProgress as DailyProgressType } from "@/types/dashboard.types"
import Link from "next/link"

interface DailyProgressProps {
    progress?: DailyProgressType | null
}

export function DailyProgress({ progress }: DailyProgressProps) {
    const dailyGoal = progress?.daily_goal ?? 20
    const learnedCount = progress?.learned_today ?? 0
    const progressPercent = progress?.progress_percentage ?? 0
    const words = progress?.words ?? []

    return (
        <section className="flex flex-col gap-4 px-4">
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-lg tracking-tight text-primary">
                            Tiến độ hôm nay
                        </h2>
                    </div>

                    <Link
                        href="/vocabulary"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                    >
                        Thêm từ vựng
                    </Link>
                </div>

                <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Đã học / Mục tiêu
                        </p>

                        <p className="text-sm font-semibold">
                            {learnedCount} / {dailyGoal} từ
                        </p>
                    </div>

                    <Progress
                        value={progressPercent}
                        className="w-full h-2"
                    />
                </div>
            </div>

            {words.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {words.map((item) => (
                        <div
                            key={item.id}
                            className="relative flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md text-center"
                        >
                            <div className="absolute top-2 right-2">
                                <WordAudio word={item.hanzi} />
                            </div>

                            <p className="text-2xl font-bold mt-2">
                                {item.hanzi}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {item.pinyin}
                            </p>

                            <p className="text-sm font-medium line-clamp-1">
                                {item.meaning}
                            </p>

                            <Badge
                                variant={item.learned_today ? "default" : "secondary"}
                                className="mt-1 text-[10px]"
                            >
                                {item.learned_today ? "Đã ôn hôm nay" : item.status === "new" ? "Từ mới" : "Cần ôn"}
                            </Badge>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Chưa có từ vựng nào trong danh sách hôm nay. Hãy thêm từ vựng mới để bắt đầu học!
                </div>
            )}
        </section>
    )
}