"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@workspace/ui/components/pagination"

interface VocabularyPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function VocabularyPagination({
    currentPage,
    totalPages,
    onPageChange,
}: VocabularyPaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault()

                            if (currentPage > 1) {
                                onPageChange(currentPage - 1)
                            }
                        }}
                    />
                </PaginationItem>

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(page)
                            }}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault()

                            if (currentPage < totalPages) {
                                onPageChange(currentPage + 1)
                            }
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}