"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import type { Vocabulary } from "@/types/vocabulary"
import { deleteVocabulary, getVocabularies } from "@/services/vocabulary.service"

import { VocabularyHeader } from "./components/vocabulary-header"
import { VocabularyFilters } from "./components/vocabulary-filters"
import { VocabularyList } from "./components/vocabulary-list"
import { VocabularyPagination } from "./components/vocabulary-pagination"

const ITEMS_PER_PAGE = 10

export function VocabularyPage() {
    const [words, setWords] = useState<Vocabulary[]>([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [date, setDate] = useState("all")
    const [hsk, setHsk] = useState("all")
    const [sort, setSort] = useState("latest")
    const [currentPage, setCurrentPage] = useState(1)

    const fetchWords = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await getVocabularies({
                search: search.trim() || undefined,
                status: status !== "all" ? status : undefined,
                date: date !== "all" ? date : undefined,
                hsk_level: hsk !== "all" ? hsk : undefined,
                sort: sort !== "latest" ? sort : undefined,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            })

            setWords(res.data)
            setTotal(res.pagination.total_items)
            setTotalPages(res.pagination.total_pages || 1)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể tải danh sách từ vựng"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [search, status, date, hsk, sort, currentPage])

    useEffect(() => {
        fetchWords()
    }, [fetchWords])

    const handleDelete = async (id: number) => {
        try {
            await deleteVocabulary(id)
            toast.success("Đã xóa từ vựng thành công!")
            fetchWords()
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Không thể xóa từ vựng"
            toast.error(message)
        }
    }

    const clearFilters = () => {
        setSearch("")
        setStatus("all")
        setDate("all")
        setHsk("all")
        setSort("latest")
        setCurrentPage(1)
    }

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 md:p-6">
            <VocabularyHeader onAddSuccess={fetchWords} />

            <VocabularyFilters
                search={search}
                status={status}
                date={date}
                hsk={hsk}
                sort={sort}
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
                onHskChange={(value) => {
                    setHsk(value)
                    setCurrentPage(1)
                }}
                onSortChange={(value) => {
                    setSort(value)
                    setCurrentPage(1)
                }}
                onClear={clearFilters}
            />

            <VocabularyList
                words={words}
                total={total}
                isLoading={isLoading}
                onDelete={handleDelete}
                onUpdate={fetchWords}
            />

            {totalPages > 1 && (
                <VocabularyPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </main>
    )
}