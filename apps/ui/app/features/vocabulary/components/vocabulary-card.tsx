"use client"

import { useState } from "react"
import { IconEdit, IconTrash } from "@tabler/icons-react"
import { WordAudio } from "@/components/word-audio"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { toast } from "sonner"
import { updateVocabulary } from "@/services/vocabulary.service"
import type { Vocabulary } from "@/types/vocabulary"

interface VocabularyCardProps {
    word: Vocabulary
    onDelete?: (id: number) => void
    onUpdate?: () => void
}

export function VocabularyCard({ word, onDelete, onUpdate }: VocabularyCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const chineseText = word.hanzi || word.chinese || ""

    const [hanziInput, setHanziInput] = useState(chineseText)
    const [pinyinInput, setPinyinInput] = useState(word.pinyin || "")
    const [meaningInput, setMeaningInput] = useState(word.meaning || "")
    const [exampleInput, setExampleInput] = useState(word.example || "")
    const [noteInput, setNoteInput] = useState(word.note || "")

    const handleDelete = () => {
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

    const handleSaveEdit = async () => {
        if (!hanziInput.trim() || !meaningInput.trim()) {
            toast.error("Hán tự và ý nghĩa không được để trống!")
            return
        }

        try {
            setIsUpdating(true)
            await updateVocabulary(word.id, {
                hanzi: hanziInput.trim(),
                pinyin: pinyinInput.trim(),
                meaning: meaningInput.trim(),
                example: exampleInput.trim(),
                note: noteInput.trim(),
            })

            toast.success("Đã cập nhật từ vựng thành công!")
            setIsEditDialogOpen(false)
            onUpdate?.()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể cập nhật từ vựng"
            toast.error(message)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="group rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    {/* Chinese */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-semibold text-primary">
                        {chineseText}
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold leading-none">
                                {word.pinyin}
                            </p>
                        </div>

                        <p className="mt-1.5 truncate text-sm text-muted-foreground">
                            {word.meaning}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                    {/* <Badge
                        variant={
                            word.status === "new"
                                ? "default"
                                : word.status === "mastered"
                                ? "outline"
                                : "secondary"
                        }
                        className="h-5 px-2 text-[10px]"
                    >
                        {word.status === "new" ? "Mới" : word.status === "mastered" ? "Thành thạo" : "Đang học"}
                    </Badge> */}

                    <WordAudio word={chineseText} />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setHanziInput(chineseText)
                            setPinyinInput(word.pinyin || "")
                            setMeaningInput(word.meaning || "")
                            setExampleInput(word.example || "")
                            setNoteInput(word.note || "")
                            setIsEditDialogOpen(true)
                        }}
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-xs sm:max-w-md">
                    <DialogHeader>
                        <Label>Chỉnh sửa từ vựng</Label>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-hanzi">Hán tự</Label>
                            <Input
                                id="edit-hanzi"
                                value={hanziInput}
                                onChange={(e) => setHanziInput(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-pinyin">Phiên âm (Pinyin)</Label>
                            <Input
                                id="edit-pinyin"
                                value={pinyinInput}
                                onChange={(e) => setPinyinInput(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-meaning">Ý nghĩa</Label>
                            <Input
                                id="edit-meaning"
                                value={meaningInput}
                                onChange={(e) => setMeaningInput(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-example">Ví dụ</Label>
                            <Input
                                id="edit-example"
                                placeholder="Ví dụ đặt câu..."
                                value={exampleInput}
                                onChange={(e) => setExampleInput(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-note">Ghi chú</Label>
                            <Input
                                id="edit-note"
                                placeholder="Ghi chú thêm..."
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={isUpdating}>
                            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}