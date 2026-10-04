"use client"

import { useState } from "react"
import {
    IconCheck,
    IconPlus,
    IconSearch,
} from "@tabler/icons-react"

const words = [
    { chinese: "学习", pinyin: "xuéxí", meaning: "Học tập", learned: true },
    { chinese: "今天", pinyin: "jīntiān", meaning: "Hôm nay", learned: false },
    { chinese: "喜欢", pinyin: "xǐhuān", meaning: "Thích", learned: true },
    { chinese: "朋友", pinyin: "péngyou", meaning: "Bạn bè", learned: false },
    { chinese: "工作", pinyin: "gōngzuò", meaning: "Công việc", learned: false },
]

export default function VocabularyPage() {
    const [search, setSearch] = useState("")

    const filteredWords = words.filter((word) =>
        `${word.chinese} ${word.pinyin} ${word.meaning}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Vocabulary</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your Chinese vocabulary
                    </p>
                </div>

                <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                    <IconPlus size={17} />
                    Add
                </button>
            </div>

            <div className="relative">
                <IconSearch
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search vocabulary..."
                    className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto">
                {["All", "Learning", "Learned", "Review"].map((item) => (
                    <button
                        key={item}
                        className="whitespace-nowrap rounded-full border px-4 py-2 text-sm hover:bg-muted"
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filteredWords.map((word) => (
                    <div
                        key={word.chinese}
                        className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold text-primary">
                                {word.chinese}
                            </div>

                            <div>
                                <p className="font-semibold">{word.pinyin}</p>
                                <p className="text-sm text-muted-foreground">
                                    {word.meaning}
                                </p>
                            </div>
                        </div>

                        {word.learned && (
                            <div className="flex items-center gap-1 text-sm text-primary">
                                <IconCheck size={16} />
                                Learned
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}