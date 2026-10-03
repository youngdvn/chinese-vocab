"use client"

import { IconMenu2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"

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
                ? "bg-background/60 backdrop-blur-xl" : "bg-background"}`}
        >
            <div className="flex h-14 items-center px-4 justify-between">
                <h1 className="font-semibold text-lg text-primary">ChiNex</h1>
                <IconMenu2 className="text-primary" />
            </div>
        </header>
    )
}