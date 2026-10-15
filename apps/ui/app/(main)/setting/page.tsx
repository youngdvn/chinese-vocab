"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconBolt, IconChevronRight } from "@tabler/icons-react"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { getUserSettings } from "@/services/user.service"
import type { UserSettings } from "@/types/user.types"
import {
    AppearanceSetting,
    LearningSetting,
    DataSetting,
} from "@/app/features/setting"

export default function SettingPage() {
    const [settings, setSettings] = useState<UserSettings | null>(null)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getUserSettings()
                setSettings(data)
            } catch {
                // If not logged in yet or offline, keep default
            }
        }
        loadSettings()
    }, [])

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
                    <p className="text-sm text-muted-foreground">
                        Tùy chỉnh hệ thống và mục tiêu học tập ChiNex
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    ChiNex v1.0
                </Badge>
            </div>

            {/* Giao diện */}
            <AppearanceSetting />

            {/* Mục tiêu học tập */}
            <LearningSetting
                settings={settings}
                onUpdated={(updated) => setSettings(updated)}
            />

            {/* Luyện tập nhanh */}
            <section className="flex flex-col gap-2">
                <h2 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Luyện tập nhanh (Practice)
                </h2>

                <Card className="p-0 overflow-hidden">
                    <Link
                        href="/practice"
                        className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/50"
                    >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <IconBolt size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">Trung tâm Ôn tập Spaced Repetition</p>
                            <p className="text-xs text-muted-foreground">
                                Flashcard, Nối từ, Quiz trắc nghiệm, Luyện nghe, Gõ Pinyin
                            </p>
                        </div>
                        <IconChevronRight size={18} className="text-muted-foreground" />
                    </Link>
                </Card>
            </section>

            {/* Dữ liệu & Xuất file */}
            <DataSetting />

            <div className="pt-4 text-center text-xs text-muted-foreground">
                ChiNex • Hệ thống học từ vựng tiếng Trung Spaced Repetition
            </div>
        </main>
    )
}