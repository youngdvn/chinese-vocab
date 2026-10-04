import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm">
            {/* Background decoration */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            今日学习
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            Today&apos;s Focus
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Keep your learning streak going.
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                        学
                    </div>
                </div>

                {/* Progress */}
                <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Daily goal
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                15
                                <span className="text-sm font-normal text-muted-foreground">
                                    {" "}
                                    / 20 words
                                </span>
                            </p>
                        </div>

                        <span className="text-sm font-medium text-primary">
                            75%
                        </span>
                    </div>

                    <Progress
                        value={75}
                        className="mt-3 h-2"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                        5 words left to reach today&apos;s goal
                    </p>
                </div>

                {/* Action */}
                <Button className="w-full">
                    Continue Learning
                </Button>
            </div>
        </section>
    )
}