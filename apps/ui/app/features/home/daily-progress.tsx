"use client"

import Link from "next/link"
import { IconArrowRight, IconPlus } from "@tabler/icons-react"
import { Progress } from "@workspace/ui/components/progress"
import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@/components/empty-state"
import { DailyWordCard } from "./daily-word-card"
import type { DailyProgress as DailyProgressType } from "@/types/dashboard.types"

interface DailyProgressProps {
    progress?: DailyProgressType | null
}

const MAX_DISPLAY_WORDS = 5

export function DailyProgress({ progress }: DailyProgressProps) {
    const dailyGoal = progress?.daily_goal ?? 20
    const learnedCount = progress?.learned_today ?? 0
    const progressPercent = progress?.progress_percentage ?? 0
    const words = progress?.words ?? []
    const displayedWords = words.slice(0, MAX_DISPLAY_WORDS)
    const hasMore = words.length > MAX_DISPLAY_WORDS

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
                        Quản lý từ vựng
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
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        {displayedWords.map((item) => (
                            <DailyWordCard key={item.id} word={item} />
                        ))}

                        {/* Card trống tạo nút + thêm từ vựng */}
                        <Link
                            href="/vocabulary"
                            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center transition-all duration-150 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-xs min-h-[140px]"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 shadow-2xs">
                                <IconPlus size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Thêm từ vựng
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Bổ sung vào kho từ
                                </p>
                            </div>
                        </Link>
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-1">
                            <Link href="/vocabulary" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto gap-2 rounded-xl border-border/80 text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                                >
                                    <span>Xem tất cả ({words.length} từ vựng)</span>
                                    <IconArrowRight size={14} />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    // icon={<IconPlus size={24} />}
                    title="Chưa có từ vựng nào trong danh sách hôm nay"
                    description="Hãy thêm từ vựng mới vào kho từ để bắt đầu học và tích luỹ tiến độ mỗi ngày!"
                    action={
                        <Link href="/vocabulary">
                            <Button className="gap-1.5 h-9">
                                <IconPlus size={16} />
                                Thêm từ vựng ngay
                            </Button>
                        </Link>
                    }
                />
            )}
        </section>
    )
}