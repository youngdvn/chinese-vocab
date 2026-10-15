"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { DialogClose } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { createVocabulary } from "@/services/vocabulary.service"

interface AddVocabularyFormProps {
    onSuccess?: () => void
}

export function AddVocabularyForm({ onSuccess }: AddVocabularyFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)

        const word = (formData.get("word") as string || "").trim()
        const pinyin = (formData.get("pinyin") as string || "").trim()
        const meaning = (formData.get("meaning") as string || "").trim()
        const example = (formData.get("example") as string || "").trim()
        const note = (formData.get("note") as string || "").trim()

        if (!word || !meaning) {
            toast.error("Vui lòng nhập Hán tự và ý nghĩa!")
            return
        }

        try {
            setIsSubmitting(true)
            await createVocabulary({
                hanzi: word,
                pinyin,
                meaning,
                example: example || undefined,
                note: note || undefined,
            })

            toast.success(`Đã thêm từ "${word}" thành công!`)
            form.reset()
            onSuccess?.()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể thêm từ vựng"
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="word">
                    Hán tự (Chữ Hán) *
                </Label>
                <Input
                    id="word"
                    name="word"
                    placeholder="Ví dụ: 学习"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="pinyin">
                    Pinyin (Phiên âm) *
                </Label>
                <Input
                    id="pinyin"
                    name="pinyin"
                    placeholder="Ví dụ: xuéxí"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="meaning">
                    Tiếng Việt *
                </Label>
                <Input
                    id="meaning"
                    name="meaning"
                    placeholder="Ví dụ: Học tập, nghiên cứu"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="example">
                    Ví dụ câu (Tùy chọn)
                </Label>
                <Input
                    id="example"
                    name="example"
                    placeholder="Ví dụ: 我在学习汉语。"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">
                    Ghi chú thêm (Tùy chọn)
                </Label>
                <Input
                    id="note"
                    name="note"
                    placeholder="Ví dụ: Động từ HSK 1"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                </DialogClose>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang thêm..." : "Lưu"}
                </Button>
            </div>
        </form>
    )
}