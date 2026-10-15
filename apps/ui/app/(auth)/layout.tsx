import Link from "next/link"
import { IconSparkle } from "@tabler/icons-react"
import AuthBackground from "../features/auth/components/auth-background"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] text-foreground">
            <AuthBackground />

            <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center px-6 bg-[#050505]/80 backdrop-blur-md md:relative md:bg-transparent md:backdrop-blur-none">
                <Link
                    href="/"
                    className="group flex items-center gap-1"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconSparkle size={20} />
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        Chi<span className="text-primary">Nex</span>
                    </span>
                </Link>
            </header>

            {/* Nội dung */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-10 pt-26 md:min-h-[calc(100vh-4rem)] md:py-10">
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>
        </main>
    )
}