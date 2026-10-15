"use client"

import { Badge } from "@workspace/ui/components/badge"
import { WordAudio } from "@/components/word-audio"
import type { TodayWord } from "@/types/dashboard.types"

interface DailyWordCardProps {
    word: TodayWord
}

export function DailyWordCard({ word }: DailyWordCardProps) {
    return (
        <div className="relative flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 text-center">
            <div className="absolute top-2 right-2">
                <WordAudio word={word.hanzi} />
            </div>

            <p className="text-2xl font-bold mt-2 text-primary">
                {word.hanzi}
            </p>

            <p className="text-sm text-muted-foreground font-medium">
                {word.pinyin}
            </p>

            <p className="text-sm font-medium text-foreground line-clamp-1">
                {word.meaning}
            </p>

            <Badge
                variant={word.learned_today ? "default" : "secondary"}
                className="mt-1 text-[10px]"
            >
                {word.learned_today ? "Đã ôn hôm nay" : word.status === "new" ? "Từ mới" : "Cần ôn"}
            </Badge>
        </div>
    )
}
