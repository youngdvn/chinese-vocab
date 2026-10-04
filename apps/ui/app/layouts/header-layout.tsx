"use client"

import { useEffect, useState } from "react"
import SidebarDrawer from "./sidebar-drawer"
import Link from "next/link"

export default function HeaderLayout() {
    const [isScrolled, setIsScrolled] = useState(false)


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
                    <Link href={"/"}>ChiNex</Link>
                </h1>
                <SidebarDrawer />
            </div>
        </header >
    )
}