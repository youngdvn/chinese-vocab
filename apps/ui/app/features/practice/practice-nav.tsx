"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
    IconCheck,
    IconChevronDown,
    IconSparkles,
} from "@tabler/icons-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@workspace/ui/components/popover"
import { modes } from "@/constant/data"

export function PracticeNav() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const currentMode =
        modes.find((mode) =>
            mode.exact ? pathname === mode.href : pathname.startsWith(mode.href)
        ) ?? modes[0]!

    const CurrentIcon = currentMode.icon

    const handleSelectMode = (href: string) => {
        setOpen(false)
        router.push(href)
    }

    return (
        <nav aria-label="Chế độ ôn tập" className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/70 p-3 cursor-pointer"
                    >
                        {/* <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center`}
                            >
                                <CurrentIcon size={20} stroke={2} />
                            </div>

                            <div className="flex flex-col text-left min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Chế độ luyện tập
                                    </span>
                                    <span className="hidden sm:inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                        {currentMode.tagline}
                                    </span>
                                </div>
                                <span className="text-base font-bold text-foreground tracking-tight truncate">
                                    {currentMode.label}
                                </span>
                            </div>
                        </div> */}

                        {/* Switch Trigger Pill */}
                        <div className="flex items-center gap-1.5 rounded-xl bg-muted/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <span>Đổi chế độ</span>
                            <IconChevronDown
                                size={15}
                                stroke={2}
                                className={`transition-transform duration-200 ${open ? "rotate-180" : ""
                                    }`}
                            />
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="center"
                    sideOffset={8}
                    className="w-[calc(100vw-32px)] sm:w-[440px] p-2 rounded-2xl shadow-xl border border-border/80 bg-popover/95 backdrop-blur-md"
                >
                    <div className="px-3 pt-2 pb-2.5 border-b border-border/60">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <IconSparkles size={14} className="text-primary" />
                            <span>Chọn phương thức ôn tập</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Chọn 1 trong 5 chế độ để củng cố vốn từ vựng tiếng Trung
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 pt-1.5">
                        {modes.map((mode) => {
                            const Icon = mode.icon
                            const isActive = currentMode.href === mode.href

                            return (
                                <button
                                    key={mode.href}
                                    type="button"
                                    onClick={() => handleSelectMode(mode.href)}
                                    className={`group flex items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-all duration-150 cursor-pointer ${isActive
                                        ? "bg-primary/10 border border-primary/25 text-foreground font-medium"
                                        : "hover:bg-muted/70 text-foreground"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${mode.color}`}
                                        >
                                            <Icon size={18} stroke={isActive ? 2.2 : 1.8} />
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-sm tracking-tight ${isActive
                                                        ? "font-bold text-primary"
                                                        : "font-semibold text-foreground"
                                                        }`}
                                                >
                                                    {mode.label}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/90">
                                                    • {mode.tagline}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {mode.description}
                                            </p>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                                            <IconCheck size={14} stroke={3} />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </nav>
    )
}
