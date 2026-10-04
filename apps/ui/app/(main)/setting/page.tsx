import {
    IconChevronRight,
    IconDatabaseExport,
    IconMoon,
    IconTarget,
} from "@tabler/icons-react"

const settings = [
    {
        title: "Appearance",
        items: [
            {
                label: "Theme",
                description: "System",
                icon: IconMoon,
            },
        ],
    },
    {
        title: "Learning",
        items: [
            {
                label: "Daily goal",
                description: "20 words per day",
                icon: IconTarget,
            },
        ],
    },
    {
        title: "Data",
        items: [
            {
                label: "Export vocabulary",
                description: "Export your vocabulary data",
                icon: IconDatabaseExport,
            },
        ],
    },
]

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
                                <button
                                    key={item.label}
                                    className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted"
                                >
                                    <Icon
                                        size={20}
                                        className="text-muted-foreground group-hover:text-primary"
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
                                </button>
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