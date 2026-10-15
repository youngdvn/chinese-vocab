"use client"

import { IconCheck } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import type { Vocabulary } from "@/types/vocabulary"

interface SelectableWordCardProps {
    word: Vocabulary
    isSelected: boolean
    onToggle: (id: number) => void
}

export function SelectableWordCard({
    word,
    isSelected,
    onToggle,
}: SelectableWordCardProps) {
    const hanzi = word.hanzi || word.chinese || ""

    const statusBadge = {
        new: { label: "Mới", variant: "default" as const },
        learning: { label: "Đang học", variant: "secondary" as const },
        mastered: { label: "Thành thạo", variant: "outline" as const },
    }[word.status || "new"] || { label: "Mới", variant: "default" as const }

    return (
        <div
            onClick={() => onToggle(word.id)}
            className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                isSelected
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
        >
            <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                    isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                }`}
            >
                {isSelected && <IconCheck size={12} strokeWidth={3} />}
            </div>

            <div className="flex flex-1 items-center gap-3 min-w-0">
                <span className="text-2xl font-bold shrink-0 text-primary">
                    {hanzi}
                </span>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                        {word.pinyin}
                    </p>
                    <p className="text-sm font-medium text-foreground truncate">
                        {word.meaning}
                    </p>
                </div>
            </div>

            <Badge variant={statusBadge.variant} className="text-[10px] h-5 px-1.5">
                {statusBadge.label}
            </Badge>
        </div>
    )
}
