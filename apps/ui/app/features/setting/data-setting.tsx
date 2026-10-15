"use client"

import { useState } from "react"
import { toast } from "sonner"
import { IconDatabaseExport, IconDownload, IconLoader2 } from "@tabler/icons-react"
import { Card } from "@workspace/ui/components/card"
import { exportVocabularies } from "@/services/vocabulary.service"

export function DataSetting() {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const data = await exportVocabularies()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `chinex_vocabularies_${new Date().toISOString().slice(0, 10)}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success("Xuất dữ liệu từ vựng thành công!")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể xuất từ vựng"
            toast.error(message)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <section className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Dữ liệu & Sao lưu (Data & Backup)
            </h2>

            <Card className="p-0 overflow-hidden">
                <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/50 disabled:opacity-50"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {isExporting ? (
                            <IconLoader2 size={20} className="animate-spin text-primary" />
                        ) : (
                            <IconDatabaseExport size={20} className="text-primary" />
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium">Xuất dữ liệu từ vựng (Export JSON)</p>
                        <p className="text-xs text-muted-foreground">
                            {isExporting ? "Đang xuất dữ liệu..." : "Tải toàn bộ từ vựng đã học dưới dạng tệp JSON"}
                        </p>
                    </div>

                    <IconDownload size={18} className="text-muted-foreground" />
                </button>
            </Card>
        </section>
    )
}
