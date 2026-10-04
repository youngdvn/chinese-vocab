"use client"

import { IconMenu2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@workspace/ui/components/drawer"
import Link from "next/link"
import { menuSidebar } from "../../constant/data"



export default function HeaderLayout() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 shadow ${isScrolled
                ? "bg-background/60 backdrop-blur-xl"
                : "bg-background"
                }`}
        >
            <div className="flex h-14 items-center justify-between px-4">
                <h1 className="text-lg font-semibold text-primary">
                    ChiNex
                </h1>

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
                                return (

                                    <Link key={item.id}
                                        href={item.href}
                                        className="rounded-md px-4 py-3 hover:bg-muted flex items-center gap-1 group"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Icon
                                            stroke={1.5}
                                            size={20}
                                            className="transition-colors group-hover:text-primary"
                                        />

                                        <span className="transition-all duration-200 group-hover:text-primary group-hover:font-semibold">
                                            {item.label}
                                        </span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </DrawerContent>
                </Drawer>
            </div>
        </header >
    )
}