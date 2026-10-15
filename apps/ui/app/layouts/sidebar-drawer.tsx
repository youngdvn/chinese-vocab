"use client"

import { menuSidebar } from "@/constant/data"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@workspace/ui/components/drawer"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getMe, logout } from "@/services/auth.service"
import type { UserResponse } from "@/types/auth.types"
import { IconLogin, IconLogout, IconMenu2 } from "@tabler/icons-react"

export default function SidebarDrawer() {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState<UserResponse | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (open) {
            getMe()
                .then(setUser)
                .catch(() => setUser(null))
        }
    }, [open])

    const handleLogout = async () => {
        try {
            await logout()
            setUser(null)
            toast.success("Đăng xuất thành công!")
            router.push("/login")
            router.refresh()
        } catch {
            router.push("/login")
        } finally {
            setOpen(false)
        }
    }

    return (
        <Drawer
            direction="right"
            open={open}
            onOpenChange={setOpen}
        >
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

            <DrawerContent className="flex h-full w-70! flex-col gap-2 sm:w-[320px]!">
                <DrawerHeader className="text-left pb-2">
                    <DrawerTitle className="text-xl font-bold">
                        Chi<span className="text-primary">Nex</span>
                    </DrawerTitle>
                    {user ? (
                        <div className="mt-2 flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {user.name ? user.name[0]?.toUpperCase() : "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{user.name || "Học viên"}</p>
                                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center justify-between rounded-xl bg-muted/40 p-2 text-xs text-muted-foreground">
                            <span>Bạn chưa đăng nhập</span>
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="font-medium text-primary hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    )}
                </DrawerHeader>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 px-4">
                    {menuSidebar.map((item) => {
                        const Icon = item.icon

                        const isActive =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href)

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
                <div className="border-t mx-4 mt-auto"></div>
                <div className="px-4 pb-4">
                    {user ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-destructive transition-colors hover:bg-destructive/10"
                        >
                            <IconLogout
                                size={20}
                                stroke={1.5}
                                className="text-destructive"
                            />

                            <span className="font-medium">
                                Đăng xuất
                            </span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-primary transition-colors hover:bg-primary/10"
                        >
                            <IconLogin
                                size={20}
                                stroke={1.5}
                                className="text-primary"
                            />

                            <span className="font-medium">
                                Đăng nhập
                            </span>
                        </Link>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}