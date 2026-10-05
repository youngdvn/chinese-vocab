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

    const handlePageChange = (page: number) => {
        onPageChange(page)

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
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
                                handlePageChange(currentPage - 1)
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
                                handlePageChange(page)
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
                                handlePageChange(currentPage + 1)
                            }
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}