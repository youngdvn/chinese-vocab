"use client"

import { useState } from "react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { WordAudio } from "@/components/word-audio"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import type { Vocabulary } from "@/types/vocabulary"
import { VocabularyDetailDrawer } from "./vocabulary-detail-drawer"
import { VocabularyEditDialog } from "./vocabulary-edit-dialog"

interface VocabularyCardProps {
    word: Vocabulary
    onDelete?: (id: number) => void
    onUpdate?: () => void
}

export function VocabularyCard({ word, onDelete, onUpdate }: VocabularyCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const chineseText = word.hanzi || word.chinese || ""

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        toast.warning(`Xóa từ "${chineseText}"?`, {
            description: "Hành động này không thể hoàn tác.",
            duration: 8000,
            action: {
                label: "Xóa",
                onClick: async () => {
                    try {
                        setIsDeleting(true)
                        await onDelete?.(word.id)
                    } finally {
                        setIsDeleting(false)
                    }
                },
            },
            cancel: {
                label: "Huỷ",
                onClick: () => { },
            },
        })
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsEditDialogOpen(true)
    }

    return (
        <>
            <div
                onClick={() => setIsDetailOpen(true)}
                className="group flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all duration-150 hover:bg-muted/40 hover:border-primary/40 hover:shadow-xs active:scale-[0.99] cursor-pointer"
            >
                {/* Chỉ hiển thị phần Hán ngữ trên card */}
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl font-bold tracking-wide text-primary transition-transform group-hover:scale-105 origin-left">
                        {chineseText}
                    </span>
                </div>

                {/* Các action */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 sm:gap-2"
                >
                    <WordAudio word={chineseText} />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditClick}
                        className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Chỉnh sửa từ vựng"
                    >
                        <IconEdit size={16} />
                    </Button>

                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Xóa từ vựng"
                        >
                            <IconTrash size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Chi tiết từ vựng hiển thị qua Drawer kéo từ dưới lên */}
            <VocabularyDetailDrawer
                word={word}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                onEdit={() => setIsEditDialogOpen(true)}
            />

            {/* Dialog chỉnh sửa từ vựng */}
            {isEditDialogOpen && (
                <VocabularyEditDialog
                    word={word}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    onSuccess={onUpdate}
                />
            )}
        </>
    )
}