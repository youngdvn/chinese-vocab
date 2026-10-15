"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { updateVocabulary } from "@/services/vocabulary.service"
import type { Vocabulary } from "@/types/vocabulary"

interface VocabularyEditDialogProps {
    word: Vocabulary
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function VocabularyEditDialog({
    word,
    open,
    onOpenChange,
    onSuccess,
}: VocabularyEditDialogProps) {
    const chineseText = word.hanzi || word.chinese || ""

    const [hanziInput, setHanziInput] = useState(chineseText)
    const [pinyinInput, setPinyinInput] = useState(word.pinyin || "")
    const [meaningInput, setMeaningInput] = useState(word.meaning || "")
    const [exampleInput, setExampleInput] = useState(word.example || "")
    const [noteInput, setNoteInput] = useState(word.note || "")
    const [isUpdating, setIsUpdating] = useState(false)

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
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể cập nhật từ vựng"
            toast.error(message)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xs sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa từ vựng</DialogTitle>
                    <DialogDescription>
                        Cập nhật chữ Hán, phiên âm, ý nghĩa hoặc ví dụ cho từ này.
                    </DialogDescription>
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
                        <Label htmlFor="edit-meaning">Ý nghĩa (Tiếng Việt)</Label>
                        <Input
                            id="edit-meaning"
                            value={meaningInput}
                            onChange={(e) => setMeaningInput(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-example">Ví dụ câu (Tùy chọn)</Label>
                        <Input
                            id="edit-example"
                            value={exampleInput}
                            onChange={(e) => setExampleInput(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-note">Ghi chú (Tùy chọn)</Label>
                        <Input
                            id="edit-note"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            disabled={isUpdating}
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
