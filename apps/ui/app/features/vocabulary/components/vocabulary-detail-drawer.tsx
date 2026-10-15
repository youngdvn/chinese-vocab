"use client"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@workspace/ui/components/drawer"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { WordAudio } from "@/components/word-audio"
import { IconCalendar, IconEdit, IconNotes, IconQuote, IconSparkles } from "@tabler/icons-react"
import type { Vocabulary } from "@/types/vocabulary"

interface VocabularyDetailDrawerProps {
    word: Vocabulary | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit?: () => void
}

export function VocabularyDetailDrawer({
    word,
    open,
    onOpenChange,
    onEdit,
}: VocabularyDetailDrawerProps) {
    if (!word) return null

    const chineseText = word.hanzi || word.chinese || ""

    const statusBadge = {
        new: { label: "Từ mới", variant: "default" as const },
        learning: { label: "Đang học", variant: "secondary" as const },
        mastered: { label: "Thành thạo", variant: "outline" as const },
    }[word.status || "new"] || { label: "Từ mới", variant: "default" as const }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-w-lg mx-auto rounded-t-2xl max-h-[85vh]">
                <DrawerHeader className="text-center pt-2 pb-4">
                    <div className="flex justify-center mb-2">
                        <Badge variant={statusBadge.variant} className="text-xs px-2.5 py-0.5">
                            {statusBadge.label}
                        </Badge>
                    </div>

                    <DrawerTitle className="text-5xl font-bold tracking-wide text-primary">
                        {chineseText}
                    </DrawerTitle>

                    <div className="mt-2 flex items-center justify-center gap-2">
                        <p className="text-lg font-medium text-foreground tracking-wide">
                            {word.pinyin}
                        </p>
                        <WordAudio word={chineseText} />
                    </div>

                    <DrawerDescription className="text-base font-semibold text-foreground mt-1">
                        {word.meaning}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="overflow-y-auto px-5 py-2 space-y-3">
                    {/* Example sentence */}
                    {word.example && (
                        <div className="rounded-xl border bg-card p-3.5 shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1.5">
                                <IconQuote size={14} className="text-primary" />
                                <span>Ví dụ câu</span>
                            </div>
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                {word.example}
                            </p>
                        </div>
                    )}

                    {/* Note */}
                    {word.note && (
                        <div className="rounded-xl border bg-card p-3.5 shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1.5">
                                <IconNotes size={14} className="text-primary" />
                                <span>Ghi chú</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {word.note}
                            </p>
                        </div>
                    )}

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                        {word.created_at && (
                            <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 p-2.5">
                                <IconCalendar size={14} className="text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Ngày thêm</p>
                                    <p className="font-medium text-foreground">
                                        {new Date(word.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 p-2.5">
                            <IconSparkles size={14} className="text-primary" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Trạng thái ôn tập</p>
                                <p className="font-medium text-foreground capitalize">
                                    {word.status === "mastered"
                                        ? "Đã nắm vững"
                                        : word.status === "learning"
                                        ? "Đang ghi nhớ"
                                        : "Chưa bắt đầu"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="pt-3 pb-6 flex flex-row gap-2">
                    {onEdit && (
                        <Button
                            onClick={() => {
                                onOpenChange(false)
                                onEdit()
                            }}
                            className="flex-1 gap-1.5"
                        >
                            <IconEdit size={16} />
                            Chỉnh sửa
                        </Button>
                    )}
                    <DrawerClose asChild>
                        <Button variant="outline" className="flex-1">
                            Đóng
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
