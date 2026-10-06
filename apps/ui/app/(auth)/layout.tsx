import Link from "next/link"
import { IconSparkle } from "@tabler/icons-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-screen flex-col">
            <header className="flex h-16 items-center px-6">
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

            <div className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-xs">
                    {children}
                </div>
            </div>
        </main>
    )
}