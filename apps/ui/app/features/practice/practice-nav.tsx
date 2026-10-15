"use client"

import { usePathname, useRouter } from "next/navigation"
import {
    IconBolt,
    IconPuzzle,
    IconHelpCircle,
    IconKeyboard,
    IconHeadphones,
} from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export function PracticeNav() {
    const pathname = usePathname()
    const router = useRouter()

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

    const activeTab =
        modes.find((mode) =>
            mode.exact ? pathname === mode.href : pathname.startsWith(mode.href)
        )?.href ?? "/practice"

    return (
        <div className="w-full overflow-x-auto pb-2 scrollbar-none flex justify-center">
            <Tabs
                value={activeTab}
                onValueChange={(val) => router.push(val)}
                className="w-auto"
            >
                <TabsList className="h-10 p-1 bg-muted/70 border border-border/80 shadow-xs gap-1 rounded-xl">
                    {modes.map((mode) => {
                        const Icon = mode.icon
                        return (
                            <TabsTrigger
                                key={mode.href}
                                value={mode.href}
                                className="gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
                            >
                                <Icon size={14} />
                                <span>{mode.label}</span>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
            </Tabs>
        </div>
    )
}
