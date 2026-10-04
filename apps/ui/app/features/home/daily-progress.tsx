"use client"

import { dailyVocab } from "@/constant/data"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { useState } from "react"

export default function DailyProgress() {
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

                        {/* <div className="mt-2 flex w-full gap-2">
                            <Button
                                size="sm"
                                variant={item.learned ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => toggleLearned(item.id)}
                            >
                                {item.learned ? "Learned" : "Learned"}
                            </Button>

                            <Button
                                size="sm"
                                variant={item.toReview ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => toggleToReview(item.id)}
                            >
                                {item.toReview ? "Review" : "Review"}
                            </Button>
                        </div> */}
                    </div>
                ))}
            </div>
        </section>
    )
}