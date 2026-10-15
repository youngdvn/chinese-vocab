"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { AddVocabularyForm } from "./add-vocabulary-form"
import { ImportVocabularyDialog } from "./import-vocabulary-dialog"
import { StarterPacksDialog } from "./starter-packs-dialog"

interface VocabularyHeaderProps {
    onAddSuccess?: () => void
}

export function VocabularyHeader({ onAddSuccess }: VocabularyHeaderProps) {
    const [open, setOpen] = useState(false)

    const handleSuccess = () => {
        setOpen(false)
        onAddSuccess?.()
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-xl font-bold tracking-tight">
                    Kho từ vựng
                </h1>

                <p className="text-xs text-muted-foreground">
                    Quản lý kho từ vựng tiếng Trung cá nhân
                </p>
            </div>

            <div className="flex items-center gap-2">
                <StarterPacksDialog onSuccess={onAddSuccess} />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-1.5 h-9">
                            <IconPlus size={17} />
                            Thêm từ
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-xs sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Thêm từ vựng mới
                            </DialogTitle>

                            <DialogDescription>
                                Điền chữ Hán, Pinyin và ý nghĩa để lưu vào kho từ.
                            </DialogDescription>
                        </DialogHeader>
                        <AddVocabularyForm onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}