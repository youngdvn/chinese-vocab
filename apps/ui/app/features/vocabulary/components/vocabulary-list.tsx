"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { EmptyState } from "@/components/empty-state"
import { IconBook2 } from "@tabler/icons-react"
import { VocabularyCard } from "./vocabulary-card"
import type { Vocabulary } from "@/types/vocabulary"

interface VocabularyListProps {
    words: Vocabulary[]
    total: number
    isLoading?: boolean
    onDelete?: (id: number) => void
    onUpdate?: () => void
}

export function VocabularyList({
    words,
    total,
    isLoading,
    onDelete,
    onUpdate,
}: VocabularyListProps) {
    if (isLoading) {
        return (
            <section className="flex flex-col gap-3">
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-32 rounded-md" />
                </div>

                {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl border bg-card p-4 shadow-xs"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <Skeleton className="h-7 w-20 rounded-md" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-8 rounded-lg" />
                                <Skeleton className="size-8 rounded-lg" />
                                <Skeleton className="size-8 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-3">
            <p className="text-sm text-end text-muted-foreground">
                Tổng cộng <span className="font-semibold text-foreground">{total}</span> từ vựng
            </p>

            {words.map((word) => (
                <VocabularyCard
                    key={word.id}
                    word={word}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}

            {words.length === 0 && (
                <EmptyState
                    icon={<IconBook2 size={24} />}
                    title="Không tìm thấy từ vựng nào"
                    description="Hãy thử tìm kiếm với từ khóa khác hoặc thêm từ vựng mới vào kho từ cá nhân của bạn."
                />
            )}
        </section>
    )
}