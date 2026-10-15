import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import Link from "next/link"
import type { DailyProgress } from "@/types/dashboard.types"
import { IconBrain } from "@tabler/icons-react"

interface HeroSectionProps {
    progress?: DailyProgress | null
}

export function HeroSection({ progress }: HeroSectionProps) {
    const dailyGoal = progress?.daily_goal ?? 20
    const learnedToday = progress?.learned_today ?? 0
    const remainingToday = progress?.remaining_today ?? Math.max(0, dailyGoal - learnedToday)
    const progressPercent = progress?.progress_percentage ?? (dailyGoal > 0 ? (learnedToday / dailyGoal) * 100 : 0)

    return (
        <section className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-5">
                <div className="flex items-start justify-between">
                    <div>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            Mục tiêu hôm nay
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Duy trì chuỗi ngày học tập và ôn luyện kiên trì.
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        <IconBrain />
                    </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Tiến độ hàng ngày
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {learnedToday}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {" "}
                                    / {dailyGoal} từ
                                </span>
                            </p>
                        </div>

                        <span className="text-sm font-medium text-primary">
                            {Math.round(progressPercent)}%
                        </span>
                    </div>

                    <Progress
                        value={progressPercent}
                        className="mt-3 h-2"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                        {remainingToday > 0
                            ? `Còn ${remainingToday} từ nữa để hoàn thành mục tiêu hôm nay`
                            : "Bạn đã xuất sắc hoàn thành mục tiêu học hôm nay!"}
                    </p>
                </div>

                <Link href={"/practice"}>
                    <Button className="w-full">
                        Bắt đầu ôn tập Flashcard
                    </Button>
                </Link>
            </div>
        </section>
    )
}