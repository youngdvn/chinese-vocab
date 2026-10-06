import { IconBrain, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function ContinueLearning() {
    return (
        <section className="px-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-lg tracking-tight text-primary">Continue Learning</h2>

                <Link
                    href="/vocabulary"
                    className="text-sm text-foreground/70 underline underline-offset-2"
                >
                    View all
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/vocabulary"
                    className="group flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
                >
                    <IconPlus className="text-primary" />
                    <div>
                        <p className="font-medium">Add vocabulary</p>
                        <p className="text-xs text-muted-foreground">
                            Add a new word
                        </p>
                    </div>
                </Link>

                <Link
                    href="/practice"
                    className="group flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
                >
                    <IconBrain className="text-primary" />
                    <div>
                        <p className="font-medium">Start review</p>
                        <p className="text-xs text-muted-foreground">
                            24 words waiting
                        </p>
                    </div>
                </Link>
            </div>
        </section>
    )
}