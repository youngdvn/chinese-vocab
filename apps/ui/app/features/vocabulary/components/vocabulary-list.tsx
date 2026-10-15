"use client"

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
            <div className="flex flex-col gap-3 py-8 text-center">
                <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Đang tải danh sách từ vựng...</p>
            </div>
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
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <p className="font-medium">
                        Không tìm thấy từ vựng nào
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Hãy thử tìm kiếm với từ khóa khác hoặc thêm từ vựng mới vào kho.
                    </p>
                </div>
            )}
        </section>
    )
}