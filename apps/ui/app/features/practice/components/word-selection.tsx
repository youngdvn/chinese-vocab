"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconArrowRight,
    IconSearch,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { getVocabularies } from "@/services/vocabulary.service"
import type { Vocabulary } from "@/types/vocabulary"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { EmptyState } from "@/components/empty-state"
import { PracticeNav } from "../practice-nav"
import { SelectableWordCard } from "./selectable-word-card"

export interface WordSelectionProps {
    onStart: (words: Vocabulary[]) => void
}

export function WordSelection({ onStart }: WordSelectionProps) {
    const [allWords, setAllWords] = useState<Vocabulary[]>([])
    const [filtered, setFiltered] = useState<Vocabulary[]>([])
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(true)

    const loadWords = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await getVocabularies({ limit: 200 })
            setAllWords(res.data || [])
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Không thể tải từ vựng"
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadWords()
    }, [loadWords])

    useEffect(() => {
        let result = allWords
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(
                (w) =>
                    (w.hanzi || w.chinese || "").includes(q) ||
                    w.pinyin.toLowerCase().includes(q) ||
                    w.meaning.toLowerCase().includes(q)
            )
        }
        if (statusFilter !== "all") {
            result = result.filter((w) => w.status === statusFilter)
        }
        setFiltered(result)
    }, [allWords, search, statusFilter])

    const toggle = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const selectAll = () => setSelected(new Set(filtered.map((w) => w.id)))
    const clearAll = () => setSelected(new Set())

    const handleStart = () => {
        if (selected.size === 0) {
            toast.warning("Hãy chọn ít nhất 1 từ để ôn tập!")
            return
        }
        const chosenWords = allWords.filter((w) => selected.has(w.id))
        onStart(chosenWords)
    }

    if (isLoading) {
        return (
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-0 px-4 pb-28 pt-4">
                <PracticeNav />

                {/* Header Skeleton */}
                <div className="mb-4 mt-2">
                    <Skeleton className="h-3.5 w-20 mb-2 rounded-md" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-6 w-44 rounded-md" />
                        <Skeleton className="h-3.5 w-36 rounded-md" />
                    </div>
                </div>

                {/* Search & Filter Skeleton */}
                <div className="flex gap-2 mb-3">
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>

                {/* Counter & Action Skeleton */}
                <div className="flex items-center justify-between mb-2 px-1">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-6 w-14 rounded-md" />
                    </div>
                </div>

                {/* Word List Skeleton */}
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-xs"
                        >
                            <Skeleton className="size-4 shrink-0 rounded-sm" />
                            <Skeleton className="h-10 w-12 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-3.5 w-20 rounded-md" />
                                <Skeleton className="h-3 w-36 rounded-md" />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col gap-0 px-4 pb-28 pt-4">
            <PracticeNav />

            {/* Header */}
            <div className="mb-4 mt-2">
                <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit mb-2">
                    <IconArrowLeft size={14} />
                    Trang chủ
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Ôn tập Flashcard</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tổng {allWords.length} từ · Đã chọn{" "}
                            <span className="font-semibold text-primary">{selected.size}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Search + filter */}
            <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                    <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo chữ Hán, Pinyin hoặc nghĩa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 h-9 text-sm"
                    />
                </div>
                <div className="w-32">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="new">Từ mới</SelectItem>
                            <SelectItem value="learning">Đang học</SelectItem>
                            <SelectItem value="mastered">Thành thạo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Select/Clear all */}
            <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-muted-foreground">{filtered.length} từ khả dụng</span>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={selectAll} className="h-6 px-2 text-xs text-primary">
                        Chọn tất cả
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-xs text-muted-foreground">
                        Bỏ chọn
                    </Button>
                </div>
            </div>

            {/* Word list */}
            {filtered.length === 0 ? (
                <EmptyState
                    // icon={<IconSearch size={24} />}
                    title="Không tìm thấy từ nào phù hợp"
                    description={
                        allWords.length === 0
                            ? "Kho từ vựng của bạn chưa có từ nào. Hãy thêm từ vựng mới để bắt đầu học nhé!"
                            : "Không có từ vựng nào khớp với bộ lọc tìm kiếm hiện tại."
                    }
                    action={
                        allWords.length === 0 ? (
                            <Link href="/vocabulary">
                                <Button className="gap-1.5 h-9">
                                    Thêm từ vựng ngay
                                </Button>
                            </Link>
                        ) : undefined
                    }
                />
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((word) => (
                        <SelectableWordCard
                            key={word.id}
                            word={word}
                            isSelected={selected.has(word.id)}
                            onToggle={toggle}
                        />
                    ))}
                </div>
            )}

            {/* Sticky confirm bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 max-w-md mx-auto shadow-lg z-20">
                <div className="flex-1 text-sm">
                    {selected.size > 0 ? (
                        <span>
                            Đã chọn <span className="font-semibold text-primary">{selected.size}</span> từ
                        </span>
                    ) : (
                        <span className="text-muted-foreground text-xs">Vui lòng chọn từ để bắt đầu</span>
                    )}
                </div>
                <Button
                    onClick={handleStart}
                    disabled={selected.size === 0}
                    className="gap-2 px-6"
                >
                    Bắt đầu ôn tập
                    <IconArrowRight size={16} />
                </Button>
            </div>
        </main>
    )
}
