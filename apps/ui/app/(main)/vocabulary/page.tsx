"use client"

import { useState } from "react"

import {
    IconCheck,
    IconPlus,
    IconSearch,
    IconX,
} from "@tabler/icons-react"

import { words } from "@/constant/data"

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

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@workspace/ui/components/pagination"

const statusFilters = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Learning",
        value: "learning",
    },
    {
        label: "Learned",
        value: "learned",
    },
    {
        label: "Review",
        value: "review",
    },
]

const dateFilters = [
    {
        label: "All dates",
        value: "all",
    },
    {
        label: "Today",
        value: "2026-10-04",
    },
    {
        label: "Yesterday",
        value: "2026-10-03",
    },
    {
        label: "Oct 2, 2026",
        value: "2026-10-02",
    },
    {
        label: "Oct 1, 2026",
        value: "2026-10-01",
    },
    {
        label: "Sep 30, 2026",
        value: "2026-09-30",
    },
]

const ITEMS_PER_PAGE = 10

export default function VocabularyPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [date, setDate] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)

    // --------------------------------
    // Filter
    // --------------------------------

    const filteredWords = words.filter((word) => {
        const matchesSearch =
            `${word.chinese} ${word.pinyin} ${word.meaning}`
                .toLowerCase()
                .includes(search.toLowerCase())

        const matchesStatus =
            status === "all" ||
            (status === "learned" && word.learned) ||
            (status === "learning" && !word.learned) ||
            (status === "review" && word.toReview)

        const matchesDate =
            date === "all" ||
            word.createdAt === date

        return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
        )
    })

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.ceil(
        filteredWords.length / ITEMS_PER_PAGE
    )

    const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE

    const paginatedWords = filteredWords.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    )

    // --------------------------------
    // Clear filters
    // --------------------------------

    const hasFilters =
        search !== "" ||
        status !== "all" ||
        date !== "all"

    const handleClearFilters = () => {
        setSearch("")
        setStatus("all")
        setDate("all")
        setCurrentPage(1)
    }

    // --------------------------------
    // Pagination
    // --------------------------------

    const handlePageChange = (page: number) => {
        setCurrentPage(page)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 md:p-6">

            {/* =========================
                Header
            ========================= */}

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Vocabulary
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage your Chinese vocabulary
                    </p>
                </div>

                <Button>
                    <IconPlus size={17} />
                    Add
                </Button>
            </div>

            {/* =========================
                Search & Filter
            ========================= */}

            <section className="flex flex-col gap-4 rounded-xl border bg-card p-4">

                {/* Search */}

                <div className="relative">
                    <IconSearch
                        size={18}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                        placeholder="Search vocabulary..."
                        className="h-9 pl-10"
                    />
                </div>

                {/* Filters */}

                <div className="grid grid-cols-2 gap-3">

                    {/* Status */}

                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">
                            Status
                        </Label>

                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                {statusFilters.map((filter) => (
                                    <SelectItem
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date */}

                    <div className="flex flex-col gap-1">
                        <Label className="text-xs text-muted-foreground">
                            Date
                        </Label>

                        <Select
                            value={date}
                            onValueChange={(value) => {
                                setDate(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select date" />
                            </SelectTrigger>

                            <SelectContent>
                                {dateFilters.map((filter) => (
                                    <SelectItem
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Clear filters */}

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="w-full"
                    >
                        <IconX size={16} />
                        Clear filters
                    </Button>
                )}
            </section>

            {/* =========================
                Result count
            ========================= */}

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredWords.length} vocabulary
                </p>

                {totalPages > 1 && (
                    <p className="text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                )}
            </div>

            {/* =========================
                Vocabulary List
            ========================= */}

            <section className="flex flex-col gap-3">

                {paginatedWords.map((word) => (
                    <div
                        key={word.id}
                        className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:bg-muted/50"
                    >
                        <div className="flex min-w-0 items-center gap-4">

                            {/* Chinese */}

                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold text-primary">
                                {word.chinese}
                            </div>

                            {/* Information */}

                            <div className="min-w-0">
                                <p className="font-semibold">
                                    {word.pinyin}
                                </p>

                                <p className="truncate text-sm text-muted-foreground">
                                    {word.meaning}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {word.createdAt}
                                </p>
                            </div>
                        </div>

                        {/* Learned */}

                        {word.learned && (
                            <div className="ml-4 flex shrink-0 items-center gap-1 text-sm text-primary">
                                <IconCheck size={16} />
                                <span className="hidden sm:inline">
                                    Learned
                                </span>
                            </div>
                        )}
                    </div>
                ))}

                {/* Empty state */}

                {paginatedWords.length === 0 && (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <p className="font-medium">
                            No vocabulary found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Try another search or filter.
                        </p>

                        {hasFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="mt-4"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                )}
            </section>

            {/* =========================
                Pagination
            ========================= */}

            {totalPages > 1 && (
                <Pagination className="mt-2">
                    <PaginationContent>

                        {/* Previous */}

                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={currentPage === 1}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                onClick={(e) => {
                                    e.preventDefault()

                                    if (currentPage > 1) {
                                        handlePageChange(
                                            currentPage - 1
                                        )
                                    }
                                }}
                            />
                        </PaginationItem>

                        {/* Pages */}

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={
                                        currentPage === page
                                    }
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(page)
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {/* Next */}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                aria-disabled={
                                    currentPage === totalPages
                                }
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                onClick={(e) => {
                                    e.preventDefault()

                                    if (
                                        currentPage <
                                        totalPages
                                    ) {
                                        handlePageChange(
                                            currentPage + 1
                                        )
                                    }
                                }}
                            />
                        </PaginationItem>

                    </PaginationContent>
                </Pagination>
            )}
        </main>
    )
}