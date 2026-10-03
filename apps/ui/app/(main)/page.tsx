"use client"

import { dailyVocab, overviewData } from "@/constant/data"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { useState } from "react"

export default function HomePage() {
    const [statusVocab, setStatusVocab] = useState(dailyVocab)

    const toggleLearned = (id: number) => {
        setStatusVocab((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        learned: !item.learned,
                    }
                    : item
            )
        )
    }

    const toggleToReview = (id: number) => {
        setStatusVocab((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        toReview: !item.toReview,
                    }
                    : item
            )
        )
    }

    const learnedCount = statusVocab.filter((item) => item.learned).length
    const totalCount = statusVocab.length
    const progress =
        totalCount > 0 ? (learnedCount / totalCount) * 100 : 0

    return (
        <div className="flex w-full flex-col gap-2 p-4">
            <section className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
                {/* Background decoration */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                今日学习
                            </p>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight">
                                Today&apos;s Focus
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Keep your learning streak going.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                            学
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="rounded-xl bg-muted/50 p-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Daily goal
                                </p>

                                <p className="mt-1 text-2xl font-bold">
                                    15
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {" "}
                                        / 20 words
                                    </span>
                                </p>
                            </div>

                            <span className="text-sm font-medium text-primary">
                                75%
                            </span>
                        </div>

                        <Progress
                            value={75}
                            className="mt-3 h-2"
                        />

                        <p className="mt-2 text-xs text-muted-foreground">
                            5 words left to reach today&apos;s goal
                        </p>
                    </div>

                    {/* Action */}
                    <Button className="w-full">
                        Continue Learning
                    </Button>
                </div>
            </section>

            <section className="flex flex-col gap-4 p-4">
                <h2 className="text-lg font-semibold tracking-tight text-primary">
                    Overview
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    {overviewData.map((item) => (
                        <div
                            key={item.id}
                            className="group rounded-xl border border-l-4 border-l-primary bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-muted-foreground">
                                    {item.label}
                                </p>

                                <div className="flex items-end justify-between">
                                    <span className="text-xl font-bold tracking-tight">
                                        {item.quantity}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        words
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-4 p-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-primary">
                        Daily Progress
                    </h2>

                    <div className="mt-3">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Learned / Remaining
                            </p>

                            <p className="text-sm font-semibold">
                                {learnedCount} / {totalCount}
                            </p>
                        </div>

                        <Progress
                            value={progress}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {statusVocab.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:-translate-y-0. hover:shadow-md"
                        >
                            <p className="text-lg font-semibold">
                                {item.hanyu}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {item.pinyin}
                            </p>

                            <p className="text-sm">
                                {item.mean}
                            </p>

                            <div className="mt-2 flex w-full gap-2">
                                <Button
                                    size="sm"
                                    variant={item.learned ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => toggleLearned(item.id)}
                                >
                                    {item.learned ? "Learned ✓" : "Learned"}
                                </Button>

                                <Button
                                    size="sm"
                                    variant={item.toReview ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => toggleToReview(item.id)}
                                >
                                    {item.toReview ? "Review ✓" : "Review"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}