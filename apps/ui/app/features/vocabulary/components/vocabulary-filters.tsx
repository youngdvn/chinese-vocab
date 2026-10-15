"use client"

import {
    dateFilters,
    hskFilters,
    sortFilters,
    statusFilters,
} from "@/constant/data"
import {
    IconCalendar,
    IconCertificate,
    IconSearch,
    IconSortAscending,
    IconX,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

interface VocabularyFiltersProps {
    search: string
    status: string
    date: string
    hsk: string
    sort: string

    onSearchChange: (value: string) => void
    onStatusChange: (value: string) => void
    onDateChange: (value: string) => void
    onHskChange: (value: string) => void
    onSortChange: (value: string) => void
    onClear: () => void
}

export function VocabularyFilters({
    search,
    status,
    date,
    hsk,
    sort,
    onSearchChange,
    onStatusChange,
    onDateChange,
    onHskChange,
    onSortChange,
    onClear,
}: VocabularyFiltersProps) {
    const hasFilters =
        search.trim() !== "" ||
        status !== "all" ||
        date !== "all" ||
        hsk !== "all" ||
        sort !== "latest"

    return (
        <section className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-4 shadow-xs backdrop-blur-sm">
            {/* Search Bar */}
            <div className="relative">
                <IconSearch
                    size={18}
                    className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm kiếm từ vựng (Hán tự, Bính âm Pinyin, ý nghĩa)..."
                    className="h-10 pl-10 pr-9 rounded-xl border-muted-foreground/20 bg-background/80"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        aria-label="Xóa tìm kiếm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <IconX size={14} />
                    </button>
                )}
            </div>

            {/* Quick Status Chips */}
            <div className="flex flex-wrap items-center gap-1.5 border-b pb-3">
                <span className="mr-1 text-xs font-medium text-muted-foreground">
                    Trạng thái:
                </span>
                {statusFilters.map((item) => {
                    const isActive = status === item.value
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onStatusChange(item.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </div>

            {/* Secondary Select Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* HSK Level */}
                <div className="flex flex-col gap-1.5">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconCertificate size={14} />
                        Cấp độ HSK
                    </Label>

                    <Select value={hsk} onValueChange={onHskChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn HSK" />
                        </SelectTrigger>

                        <SelectContent>
                            {hskFilters.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconCalendar size={14} />
                        Thời gian tạo
                    </Label>

                    <Select value={date} onValueChange={onDateChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Thời gian" />
                        </SelectTrigger>

                        <SelectContent>
                            {dateFilters.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-1.5">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconSortAscending size={14} />
                        Sắp xếp theo
                    </Label>

                    <Select value={sort} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>

                        <SelectContent>
                            {sortFilters.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters Clear Row */}
            {hasFilters && (
                <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                        Đang áp dụng bộ lọc tùy chỉnh
                    </span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <IconX size={14} />
                        Đặt lại tất cả bộ lọc
                    </Button>
                </div>
            )}
        </section>
    )
}