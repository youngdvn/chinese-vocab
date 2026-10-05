"use client"

import { useState } from "react"

import { words } from "@/constant/data"

import { VocabularyHeader } from "./components/vocabulary-header"
import { VocabularyFilters } from "./components/vocabulary-filters"
import { VocabularyList } from "./components/vocabulary-list"
import { VocabularyPagination } from "./components/vocabulary-pagination"

const ITEMS_PER_PAGE = 10

export function VocabularyPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [date, setDate] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)

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

    const totalPages = Math.ceil(
        filteredWords.length / ITEMS_PER_PAGE
    )

    const startIndex =
        (currentPage - 1) * ITEMS_PER_PAGE

    const paginatedWords = filteredWords.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    )

    const clearFilters = () => {
        setSearch("")
        setStatus("all")
        setDate("all")
        setCurrentPage(1)
    }

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 md:p-6">
            <VocabularyHeader />

            <VocabularyFilters
                search={search}
                status={status}
                date={date}
                onSearchChange={(value) => {
                    setSearch(value)
                    setCurrentPage(1)
                }}
                onStatusChange={(value) => {
                    setStatus(value)
                    setCurrentPage(1)
                }}
                onDateChange={(value) => {
                    setDate(value)
                    setCurrentPage(1)
                }}
                onClear={clearFilters}
            />

            <VocabularyList
                words={paginatedWords}
                total={filteredWords.length}
            />

            <VocabularyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </main>
    )
}