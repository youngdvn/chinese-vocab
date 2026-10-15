"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft,
    IconArrowRight,
    IconCheck,
    IconSearch,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { getVocabularies } from "@/services/vocabulary.service"
import type { Vocabulary } from "@/types/vocabulary"
import { PracticeNav } from "../practice-nav"

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
            <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col items-center justify-center gap-4 px-4">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Đang tải danh sách từ vựng...</p>
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
                    <Badge variant="outline" className="text-xs">
                        {selected.size}/{filtered.length} đã chọn
                    </Badge>
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
                <Card className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground border-dashed">
                    <IconSearch size={32} className="opacity-30" />
                    <p className="text-sm">Không tìm thấy từ nào phù hợp</p>
                </Card>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((word) => {
                        const hanzi = word.hanzi || word.chinese || ""
                        const isSelected = selected.has(word.id)
                        return (
                            <div
                                key={word.id}
                                onClick={() => toggle(word.id)}
                                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                                    isSelected
                                        ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
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
                                    <span className="text-2xl font-bold shrink-0">{hanzi}</span>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">{word.pinyin}</p>
                                        <p className="text-sm font-medium truncate">{word.meaning}</p>
                                    </div>
                                </div>

                                <Badge
                                    variant={
                                        word.status === "new"
                                            ? "default"
                                            : word.status === "mastered"
                                            ? "outline"
                                            : "secondary"
                                    }
                                    className="text-[10px] h-5"
                                >
                                    {word.status === "new" ? "Mới" : word.status === "mastered" ? "Thành thạo" : "Đang học"}
                                </Badge>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Sticky confirm bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 max-w-xl mx-auto shadow-lg z-20">
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
