"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    IconBolt,
    IconPuzzle,
    IconHelpCircle,
    IconKeyboard,
    IconHeadphones,
} from "@tabler/icons-react"

export function PracticeNav() {
    const pathname = usePathname()

    const modes = [
        {
            href: "/practice",
            label: "Flashcard",
            icon: IconBolt,
            exact: true,
        },
        {
            href: "/practice/matching",
            label: "Nối Từ",
            icon: IconPuzzle,
            exact: false,
        },
        {
            href: "/practice/quiz",
            label: "Trắc Nghiệm",
            icon: IconHelpCircle,
            exact: false,
        },
        {
            href: "/practice/pinyin",
            label: "Gõ Pinyin",
            icon: IconKeyboard,
            exact: false,
        },
        {
            href: "/practice/listening",
            label: "Luyện Nghe",
            icon: IconHeadphones,
            exact: false,
        },
    ]

    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 p-1 w-max mx-auto border">
                {modes.map((mode) => {
                    const Icon = mode.icon
                    const isActive = mode.exact
                        ? pathname === mode.href
                        : pathname.startsWith(mode.href)

                    return (
                        <Link
                            key={mode.href}
                            href={mode.href}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                isActive
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                        >
                            <Icon size={14} className={isActive ? "text-primary" : ""} />
                            <span>{mode.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
