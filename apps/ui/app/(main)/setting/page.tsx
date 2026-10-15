"use client"

import { useEffect, useState } from "react"
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
                    <h1 className="text-xl font-bold tracking-tight">Cài đặt</h1>
                    <p className="text-xs text-muted-foreground">
                        Tùy chỉnh hệ thống và mục tiêu học tập ChiNex
                    </p>
                </div>
            </div>

            {/* Giao diện */}
            <AppearanceSetting />

            {/* Mục tiêu học tập */}
            <LearningSetting
                settings={settings}
                onUpdated={(updated) => setSettings(updated)}
            />

            {/* Dữ liệu & Xuất file */}
            <DataSetting />

            <div className="pt-4 text-center text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                    ChiNex v1.0
                </Badge>
            </div>
        </main>
    )
}