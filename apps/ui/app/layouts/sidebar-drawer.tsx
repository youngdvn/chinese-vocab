"use client"

import { menuSidebar } from "@/constant/data"
import { IconMenu2 } from "@tabler/icons-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@workspace/ui/components/drawer"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function SidebarDrawer() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md hover:bg-muted"
                >
                    <IconMenu2
                        size={22}
                        className="text-primary"
                    />
                    <span className="sr-only">
                        Open menu
                    </span>
                </button>
            </DrawerTrigger>

            <DrawerContent className="w-70! sm:w-[320px]!">
                <DrawerHeader>
                    <DrawerTitle>ChiNex</DrawerTitle>
                </DrawerHeader>

                <nav className="flex flex-col gap-2 px-4">
                    {menuSidebar.map((item) => {
                        const Icon = item.icon
                        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                <Icon
                                    stroke={1.5}
                                    size={20}
                                    className={
                                        isActive
                                            ? "text-primary-foreground"
                                            : "text-muted-foreground group-hover:text-primary"
                                    }
                                />

                                <span
                                    className={`transition-all duration-200 ${isActive
                                        ? "font-semibold text-primary-foreground"
                                        : "text-foreground group-hover:font-semibold group-hover:text-primary"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </DrawerContent>
        </Drawer>
    )
}