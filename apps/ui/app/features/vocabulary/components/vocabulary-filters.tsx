"use client"

import { dateFilters, statusFilters } from "@/constant/data"
import {
    IconSearch,
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

    onSearchChange: (value: string) => void
    onStatusChange: (value: string) => void
    onDateChange: (value: string) => void
    onClear: () => void
}

export function VocabularyFilters({
    search,
    status,
    date,
    onSearchChange,
    onStatusChange,
    onDateChange,
    onClear,
}: VocabularyFiltersProps) {
    const hasFilters =
        search !== "" ||
        status !== "all" ||
        date !== "all"

    return (
        <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow">
            <div className="relative">
                <IconSearch
                    size={18}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    value={search}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    placeholder="Search vocabulary..."
                    className="h-9 pl-10"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                        Status
                    </Label>

                    <Select
                        value={status}
                        onValueChange={onStatusChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {statusFilters.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                        Date
                    </Label>

                    <Select
                        value={date}
                        onValueChange={onDateChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {dateFilters.map((item) => (
                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {hasFilters && (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onClear}
                    className="w-full"
                >
                    <IconX size={16} />
                    Clear filters
                </Button>
            )}
        </section>
    )
}