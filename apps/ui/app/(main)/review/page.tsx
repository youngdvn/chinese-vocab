"use client"

import { useState } from "react"
import { IconChevronRight } from "@tabler/icons-react"

export default function ReviewPage() {
    const [showAnswer, setShowAnswer] = useState(false)

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-2xl flex-col items-center justify-center gap-6 p-4">
            <div className="w-full text-center">
                <p className="text-sm text-muted-foreground">
                    12 cards remaining
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[35%] rounded-full bg-primary" />
                </div>
            </div>

            <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="min-h-87.5 w-full rounded-3xl border bg-card p-8 text-center shadow-sm transition hover:shadow-md"
            >
                <p className="text-6xl font-bold">学习</p>

                <p className="mt-4 text-xl text-muted-foreground">
                    xuéxí
                </p>

                {showAnswer ? (
                    <div className="mt-10">
                        <p className="text-lg font-medium">Học tập</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            我喜欢学习中文。
                        </p>
                    </div>
                ) : (
                    <p className="mt-16 text-sm text-muted-foreground">
                        Tap to reveal
                    </p>
                )}
            </button>

            {showAnswer && (
                <div className="grid w-full grid-cols-3 gap-3">
                    <button className="rounded-xl border py-3 text-sm hover:bg-muted">
                        Hard
                    </button>

                    <button className="rounded-xl bg-primary py-3 text-sm text-primary-foreground">
                        Good
                    </button>

                    <button className="rounded-xl border py-3 text-sm hover:bg-muted">
                        Easy
                    </button>
                </div>
            )}

            {!showAnswer && (
                <button
                    onClick={() => setShowAnswer(true)}
                    className="flex items-center gap-1 text-sm text-primary"
                >
                    Show answer
                    <IconChevronRight size={16} />
                </button>
            )}
        </main>
    )
}