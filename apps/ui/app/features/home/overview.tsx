import type { DashboardOverview } from "@/types/dashboard.types"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
    IconBook2,
    IconSparkles,
    IconTrendingUp,
    IconCalendarEvent,
} from "@tabler/icons-react"

interface OverviewProps {
    overview?: DashboardOverview | null
}

export function Overview({ overview }: OverviewProps) {
    const items = [
        {
            id: 1,
            label: "Tổng số từ",
            quantity: overview?.total_words ?? 0,
            icon: IconBook2,
            badge: "Tất cả",
            badgeVariant: "default" as const,
        },
        {
            id: 2,
            label: "Từ mới",
            quantity: overview?.new_words ?? 0,
            icon: IconSparkles,
            badge: "Mới thêm",
            badgeVariant: "secondary" as const,
        },
        {
            id: 3,
            label: "Đang học",
            quantity: overview?.learning_words ?? 0,
            icon: IconTrendingUp,
            badge: "Đang ôn",
            badgeVariant: "outline" as const,
        },
        {
            id: 4,
            label: "Tuần này",
            quantity: overview?.this_week_words ?? 0,
            icon: IconCalendarEvent,
            badge: "Gần đây",
            badgeVariant: "secondary" as const,
        },
    ]

    return (
        <section className="flex flex-col gap-4 px-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-primary">
                    Tổng quan
                </h2>
                <Badge variant="outline" className="text-xs">
                    Thời gian thực
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {items.map((item) => {
                    const Icon = item.icon
                    return (
                        <Card
                            key={item.id}
                            className="group relative overflow-hidden py-4 border-l-4 border-l-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <CardContent className="flex flex-col gap-2 p-0 px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon size={16} />
                                    </div>
                                    <Badge variant={item.badgeVariant} className="text-[10px] px-1.5 py-0 h-4">
                                        {item.badge}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {item.label}
                                    </p>
                                    <div className="flex items-baseline justify-between mt-1">
                                        <span className="text-2xl font-bold tracking-tight">
                                            {item.quantity}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            từ
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}