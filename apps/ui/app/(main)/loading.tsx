import { Skeleton } from "@workspace/ui/components/skeleton"

export default function MainLoading() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
            <section className="flex flex-col gap-4 px-4">
                <div className="mb-3 flex items-center justify-between">
                    <Skeleton className="h-6 w-36 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-28 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-xs"
                        >
                            <Skeleton className="h-10 w-16 rounded-md" />
                            <Skeleton className="h-4 w-14 rounded-md" />
                            <Skeleton className="h-3.5 w-24 rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
