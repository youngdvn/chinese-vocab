import { overviewData } from "@/constant/data";

export default function Overview() {
    return (
        <section className="flex flex-col gap-4 px-4">
            <h2 className="text-lg font-semibold tracking-tight text-primary">
                Overview
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {overviewData.map((item) => (
                    <div
                        key={item.id}
                        className="group rounded-xl border border-l-4 border-l-primary bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-muted-foreground">
                                {item.label}
                            </p>

                            <div className="flex items-end justify-between">
                                <span className="text-xl font-bold tracking-tight">
                                    {item.quantity}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    words
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}