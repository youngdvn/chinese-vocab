import Link from "next/link"
import { IconBrain, IconSparkle } from "@tabler/icons-react"
import AuthBackground from "../features/auth/components/auth-background"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
            <AuthBackground />

            <header className="relative z-10 flex h-16 items-center px-6">
                <Link
                    href="/"
                    className="group flex items-center gap-1"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ">
                        <IconSparkle size={20} />
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        Chi<span className="text-primary">Nex</span>
                    </span>
                </Link>
            </header>

            <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>
        </main>
    )
}