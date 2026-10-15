"use client"

import Link from "next/link"
import { IconBrightness, IconChevronRight } from "@tabler/icons-react"
import { Card } from "@workspace/ui/components/card"

export function AppearanceSetting() {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Giao diện (Appearance)
            </h2>

            <Card className="p-0 overflow-hidden">
                <Link
                    href="/setting/theme"
                    className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/50"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconBrightness size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Giao diện (Theme)</p>
                        <p className="text-xs text-muted-foreground">Sáng, Tối hoặc Tự động theo hệ thống</p>
                    </div>
                    <IconChevronRight size={18} className="text-muted-foreground" />
                </Link>
            </Card>
        </section>
    )
}
