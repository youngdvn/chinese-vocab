"use client"

import { IconDownload, IconSparkles } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { starterPacks } from "@/constant/starter-packs"
import { StarterPacksDialog } from "@/app/features/vocabulary/components/starter-packs-dialog"

export function StarterPacksSection() {
    return (
        <section className="flex flex-col gap-3.5 px-4">
            <div className="flex flex-col gap-3 justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <IconSparkles size={18} className="text-primary" />
                        <h2 className="font-semibold text-lg tracking-tight text-foreground">
                            Bộ từ vựng cho người mới bắt đầu
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Dữ liệu có sẵn chuẩn ngữ pháp – nạp vào kho từ chỉ với 1 chạm để học ngay
                    </p>
                </div>

                <StarterPacksDialog />
            </div>

            <div className="grid grid-cols-1 gap-3">
                {starterPacks.map((pack) => (
                    <div
                        key={pack.id}
                        className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-linear-to-b from-card/80 to-card/40 p-4 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-semibold border-primary/30 text-primary bg-primary/5"
                                >
                                    {pack.level}
                                </Badge>
                                <span className="text-[11px] font-medium text-muted-foreground">
                                    {pack.words.length} từ vựng
                                </span>
                            </div>

                            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                {pack.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {pack.tagline}
                            </p>

                            {/* Preview 3 words */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {pack.words.slice(0, 3).map((w, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] font-medium text-foreground"
                                    >
                                        {w.hanzi}
                                    </span>
                                ))}
                                <span className="text-[10px] text-muted-foreground self-center">
                                    +{pack.words.length - 3} nữa
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/50">
                            <StarterPacksDialog
                                trigger={
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                    >
                                        <IconDownload size={14} />
                                        <span>Xem & Nạp bộ từ</span>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
