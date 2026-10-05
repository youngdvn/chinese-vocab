"use client"

import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

export default function ThemeToggle() {
    const { setTheme } = useTheme()

    return (
        <Button
            className="rounded-full"
            size="icon"
            variant="ghost"
            onClick={() => {
                setTheme(
                    document.documentElement.classList.contains("dark")
                        ? "light"
                        : "dark"
                )
            }}
            aria-label="Toggle theme"
        >
            <IconSun className="hidden size-4 dark:block" />
            <IconMoon className="size-4 dark:hidden" />
        </Button>
    )
}