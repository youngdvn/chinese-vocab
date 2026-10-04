import Link from "next/link";
import { DailyProgress, HeroSection, Overview } from "../features/home";
import { IconBrain, IconChevronRight, IconPlus } from "@tabler/icons-react";

export default function HomePage() {


    return (
        <div className="flex w-full flex-col gap-2 p-4">
            <HeroSection />
            <Overview />
            <DailyProgress />
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold">Continue learning</h2>

                    <Link
                        href="/vocabulary"
                        className="text-sm text-primary"
                    >
                        View all
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <p className="text-3xl font-bold">学习</p>
                    <p className="mt-1 text-muted-foreground">
                        xuéxí · Học tập
                    </p>

                    <div className="mt-5 flex justify-end">
                        <Link
                            href="/review"
                            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            Review
                            <IconChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-2 gap-3">
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
                    href="/review"
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
            </section>
        </div>
    )
}