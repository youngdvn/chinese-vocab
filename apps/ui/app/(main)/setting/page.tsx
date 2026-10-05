import { settings } from "@/constant/data"
import {
    IconChevronRight,
} from "@tabler/icons-react"
import Link from "next/link"



export default function SettingPage() {
    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your ChiNex preferences
                </p>
            </div>

            {settings.map((section) => (
                <section key={section.title}>
                    <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
                        {section.title}
                    </h2>

                    <div className="overflow-hidden rounded-xl border">
                        {section.items.map((item) => {
                            const Icon = item.icon

                            return (
                                <Link href={item.href}
                                    key={item.label}
                                    className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted"
                                >
                                    <Icon
                                        size={20}
                                        className="text-primary"
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>

                                    <IconChevronRight
                                        size={18}
                                        className="text-muted-foreground"
                                    />
                                </Link>
                            )
                        })}
                    </div>
                </section>
            ))}

            <div className="pt-4 text-center text-xs text-muted-foreground">
                ChiNex v0.1.0
            </div>
        </main>
    )
}