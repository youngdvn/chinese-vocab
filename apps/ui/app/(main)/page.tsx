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
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-4">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu tổng quan...</p>
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