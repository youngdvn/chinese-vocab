"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconSparkleHighlight, } from "@tabler/icons-react"

import SidebarDrawer from "./sidebar-drawer"
import ThemeToggle from "@/components/theme-toggle"

export default function HeaderLayout() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 shadow transition-all duration-300 ${isScrolled
                ? "bg-background/60 backdrop-blur-xl"
                : "bg-background"
                }`}
        >
            <div className="flex h-14 items-center justify-between px-4">
                <Link
                    href="/"
                    className="group flex items-center gap-1"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconSparkleHighlight
                            size={20}
                            stroke={2}
                        />
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        Chi<span className="text-primary">Nex</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SidebarDrawer />
                </div>
            </div>
        </header>
    )
}