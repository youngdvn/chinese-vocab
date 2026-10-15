"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    IconDownload,
    IconSparkles,
} from "@tabler/icons-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { starterPacks, type StarterPack } from "@/constant/starter-packs"
import { createVocabulary } from "@/services/vocabulary.service"
import { useRouter } from "next/navigation"
import { Label } from "@workspace/ui/components/label"

interface StarterPacksDialogProps {
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function StarterPacksDialog({ onSuccess, trigger }: StarterPacksDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedPack, setSelectedPack] = useState<StarterPack>(starterPacks[0]!)
    const [isImporting, setIsImporting] = useState(false)
    const [importProgress, setImportProgress] = useState(0)
    const router = useRouter()

    const handleImportPack = async (pack: StarterPack) => {
        setIsImporting(true)
        setImportProgress(0)

        let successCount = 0
        const total = pack.words.length

        try {
            for (let i = 0; i < total; i++) {
                const w = pack.words[i]!
                try {
                    await createVocabulary({
                        hanzi: w.hanzi,
                        pinyin: w.pinyin,
                        meaning: w.meaning,
                        example: w.example,
                        hsk_level: w.hsk_level,
                    })
                    successCount++
                } catch {
                    // Ignore duplicate or individual error
                }
                setImportProgress(Math.round(((i + 1) / total) * 100))
            }

            toast.success(`Đã thêm thành công ${successCount}/${total} từ vào kho từ!`, {
                description: `Bộ từ "${pack.title}" đã sẵn sàng để bạn ôn tập.`,
            })
            onSuccess?.()
            setOpen(false)
        } catch {
            toast.error("Có lỗi xảy ra khi nạp bộ từ vựng")
        } finally {
            setIsImporting(false)
            setImportProgress(0)
        }
    }

    const handlePracticeNow = (pack: StarterPack) => {
        setOpen(false)
        router.push("/practice")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary transition-colors text-xs font-semibold h-9"
                    >
                        <IconSparkles size={16} />
                        <span>Bộ từ vựng có sẵn</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-4 sm:p-6 overflow-hidden">
                <DialogHeader className="pb-3 border-b">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <IconSparkles size={20} />
                        </div>
                        <div>
                            <Label className="text-lg font-bold">
                                Bộ từ vựng cho người mới bắt đầu
                            </Label>
                            <DialogDescription className="text-xs">
                                Chọn bộ từ mẫu đã được biên soạn sẵn để bắt đầu học ngay lập tức mà không cần tự nhập từ.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Progress bar when importing */}
                {isImporting && (
                    <div className="rounded-xl border bg-primary/5 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                            <span>Đang nạp từ vựng vào tài khoản...</span>
                            <span>{importProgress}%</span>
                        </div>
                        <Progress value={importProgress} className="h-2" />
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1 min-h-0 pt-2 overflow-hidden">
                    {/* Pack List Tabs */}
                    <div className="sm:col-span-5 flex flex-col gap-2 overflow-y-auto max-h-55 sm:max-h-95 pr-1">
                        {starterPacks.map((pack) => {
                            const isSelected = selectedPack.id === pack.id
                            return (
                                <button
                                    key={pack.id}
                                    type="button"
                                    onClick={() => setSelectedPack(pack)}
                                    className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                        ? "border-primary bg-primary/10 shadow-xs"
                                        : "border-border/80 bg-card/60 hover:bg-muted/70"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-foreground">
                                            {pack.title}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                                            {pack.level}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {pack.tagline}
                                    </p>
                                    <span className="text-[11px] font-medium text-primary mt-0.5">
                                        {pack.words.length} từ vựng
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Pack Detail & Word Preview */}
                    <div className="sm:col-span-7 flex flex-col border rounded-xl bg-card/40 p-3 min-h-0 overflow-hidden">
                        <div className="flex items-center justify-between pb-2 border-b">
                            <div>
                                <h4 className="font-bold text-sm text-foreground">
                                    {selectedPack.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {selectedPack.description}
                                </p>
                            </div>
                        </div>

                        {/* Words List Scrollable */}
                        <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-1.5 max-h-60">
                            {selectedPack.words.map((w, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background/80 border border-border/50 text-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-base text-primary">
                                            {w.hanzi}
                                        </span>
                                        <span className="text-muted-foreground font-medium">
                                            [{w.pinyin}]
                                        </span>
                                    </div>
                                    <span className="text-right text-foreground truncate max-w-37.5">
                                        {w.meaning}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t mt-auto flex flex-col sm:flex-row gap-2">
                            <Button
                                type="button"
                                onClick={() => handleImportPack(selectedPack)}
                                disabled={isImporting}
                                className="flex-1 gap-2 rounded-xl text-xs font-semibold h-9"
                            >
                                <IconDownload size={15} />
                                <span>Thêm vào kho từ ({selectedPack.words.length} từ)</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
