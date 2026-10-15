"use client"

import { useState } from "react"
import { toast } from "sonner"
import { IconFileSpreadsheet, IconUpload, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { createVocabulary } from "@/services/vocabulary.service"
import type { CreateVocabularyPayload } from "@/types/vocabulary"

interface ImportVocabularyDialogProps {
    onSuccess?: () => void
}

export function ImportVocabularyDialog({ onSuccess }: ImportVocabularyDialogProps) {
    const [open, setOpen] = useState(false)
    const [rawText, setRawText] = useState("")
    const [parsedItems, setParsedItems] = useState<CreateVocabularyPayload[]>([])
    const [isImporting, setIsImporting] = useState(false)
    const [progressPercent, setProgressPercent] = useState(0)

    const handleParse = (text: string) => {
        setRawText(text)
        if (!text.trim()) {
            setParsedItems([])
            return
        }

        try {
            // Try parsing as JSON first
            if (text.trim().startsWith("[") || text.trim().startsWith("{")) {
                const parsed = JSON.parse(text)
                const list = Array.isArray(parsed) ? parsed : [parsed]
                const items: CreateVocabularyPayload[] = list
                    .map((item) => ({
                        hanzi: String(item.hanzi || item.chinese || "").trim(),
                        pinyin: String(item.pinyin || "").trim(),
                        meaning: String(item.meaning || "").trim(),
                        example: item.example ? String(item.example).trim() : undefined,
                        note: item.note ? String(item.note).trim() : undefined,
                    }))
                    .filter((item) => item.hanzi && item.meaning)
                setParsedItems(items)
                return
            }
        } catch {
            // fallback to CSV
        }

        // Parse as CSV / TSV (lines separated by comma or semicolon or tab)
        const lines = text.split("\n")
        const items: CreateVocabularyPayload[] = []

        for (const line of lines) {
            const cleanLine = line.trim()
            if (!cleanLine || cleanLine.startsWith("#")) continue

            // Determine delimiter: tab, semicolon, or comma
            let parts: string[] = []
            if (cleanLine.includes("\t")) {
                parts = cleanLine.split("\t")
            } else if (cleanLine.includes(";")) {
                parts = cleanLine.split(";")
            } else {
                parts = cleanLine.split(",")
            }

            if (parts.length >= 2) {
                const hanzi = parts[0]?.trim() || ""
                const pinyin = parts[1]?.trim() || ""
                const meaning = parts[2]?.trim() || ""
                const example = parts[3]?.trim()
                const note = parts[4]?.trim()

                if (hanzi && (meaning || pinyin)) {
                    items.push({
                        hanzi,
                        pinyin,
                        meaning: meaning || pinyin,
                        example,
                        note,
                    })
                }
            }
        }

        setParsedItems(items)
    }

    const handleImport = async () => {
        if (parsedItems.length === 0) {
            toast.error("Chưa có từ vựng nào hợp lệ để nhập!")
            return
        }

        setIsImporting(true)
        setProgressPercent(0)
        let successCount = 0
        let failCount = 0

        for (let i = 0; i < parsedItems.length; i++) {
            const item = parsedItems[i]
            if (!item) continue
            try {
                await createVocabulary(item)
                successCount++
            } catch {
                failCount++
            }
            setProgressPercent(Math.round(((i + 1) / parsedItems.length) * 100))
        }

        setIsImporting(false)
        if (successCount > 0) {
            toast.success(`Đã nhập thành công ${successCount} từ vựng!${failCount > 0 ? ` (${failCount} lỗi)` : ""}`)
            setOpen(false)
            setRawText("")
            setParsedItems([])
            onSuccess?.()
        } else {
            toast.error("Không thể nhập các từ này, vui lòng kiểm tra lại định dạng!")
        }
    }

    const sampleJSON = `[
  {"hanzi": "中国", "pinyin": "Zhōngguó", "meaning": "Trung Quốc"},
  {"hanzi": "高兴", "pinyin": "gāoxìng", "meaning": "Vui mừng, phấn khởi"}
]`

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                    <IconUpload size={15} />
                    Import CSV/JSON
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconFileSpreadsheet className="text-primary size-5" />
                        Nhập từ vựng hàng loạt
                    </DialogTitle>
                    <DialogDescription>
                        Dán danh sách từ theo định dạng CSV (Hán tự, Pinyin, Nghĩa) hoặc JSON.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Định dạng CSV hoặc JSON:</span>
                        <button
                            type="button"
                            onClick={() => handleParse(sampleJSON)}
                            className="text-primary hover:underline"
                        >
                            Dán mẫu thử
                        </button>
                    </div>

                    <textarea
                        rows={6}
                        placeholder={"中国, Zhōngguó, Trung Quốc\n高兴, gāoxìng, Vui vẻ\n\nhoặc dán mảng JSON..."}
                        value={rawText}
                        onChange={(e) => handleParse(e.target.value)}
                        disabled={isImporting}
                        className="w-full rounded-md border bg-background p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />

                    {/* Preview parsed words */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                            Tìm thấy: <span className="text-primary font-bold">{parsedItems.length}</span> từ hợp lệ
                        </span>
                        {parsedItems.length > 0 && (
                            <Badge variant="outline" className="text-[10px]">
                                Sẵn sàng nhập
                            </Badge>
                        )}
                    </div>

                    {parsedItems.length > 0 && (
                        <div className="max-h-36 overflow-y-auto rounded-lg border bg-muted/40 p-2 divide-y">
                            {parsedItems.slice(0, 10).map((it, idx) => (
                                <div key={idx} className="flex items-center justify-between py-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{it.hanzi}</span>
                                        <span className="text-muted-foreground">({it.pinyin})</span>
                                    </div>
                                    <span className="truncate max-w-[150px]">{it.meaning}</span>
                                </div>
                            ))}
                            {parsedItems.length > 10 && (
                                <p className="pt-1 text-center text-[10px] text-muted-foreground">
                                    ... và {parsedItems.length - 10} từ nữa
                                </p>
                            )}
                        </div>
                    )}

                    {isImporting && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Đang nhập dữ liệu vào kho...</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={isImporting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={parsedItems.length === 0 || isImporting}
                        className="gap-1.5"
                    >
                        <IconCheck size={16} />
                        {isImporting ? "Đang nhập..." : `Nhập ${parsedItems.length} từ`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
