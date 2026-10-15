"use client"

import { useEffect, useState } from "react"
import {
    HeroSection,
    Overview,
    DailyProgress,
    ContinueLearning,
} from "@/app/features/home"
import { getDailyProgress, getDashboardOverview } from "@/services/dashboard.service"
import type { DailyProgress as DailyProgressType, DashboardOverview } from "@/types/dashboard.types"

import { Skeleton } from "@workspace/ui/components/skeleton"

export default function HomePage() {
    const [overview, setOverview] = useState<DashboardOverview | null>(null)
    const [progress, setProgress] = useState<DailyProgressType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true)
                const [overviewData, progressData] = await Promise.allSettled([
                    getDashboardOverview(),
                    getDailyProgress(),
                ])

                if (overviewData.status === "fulfilled") {
                    setOverview(overviewData.value)
                }
                if (progressData.status === "fulfilled") {
                    setProgress(progressData.value)
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadDashboardData()
    }, [])

    if (isLoading) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                {/* Daily Progress Skeleton */}
                <section className="flex flex-col gap-4 px-4">
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <Skeleton className="h-6 w-36 rounded-md" />
                            <Skeleton className="h-4 w-24 rounded-md" />
                        </div>

                        <div className="mt-3">
                            <div className="mb-2 flex items-center justify-between">
                                <Skeleton className="h-4 w-28 rounded-md" />
                                <Skeleton className="h-4 w-16 rounded-md" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-xs text-center"
                            >
                                <Skeleton className="h-10 w-16 rounded-md" />
                                <Skeleton className="h-4 w-14 rounded-md" />
                                <Skeleton className="h-3.5 w-24 rounded-md" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Continue Learning Modes Skeleton */}
                <section className="px-4 pb-6">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-40 rounded-md" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs"
                            >
                                <Skeleton className="size-11 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                        <Skeleton className="h-4 w-10 rounded-full" />
                                    </div>
                                    <Skeleton className="h-3 w-32 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
            {/* <HeroSection progress={progress} />
            <Overview overview={overview} /> */}
            <DailyProgress progress={progress} />
            <ContinueLearning waitingCount={overview?.waiting_review_count ?? 0} />
        </div>
    )
}