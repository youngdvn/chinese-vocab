import {
    IconBolt,
    IconBrain,
    IconHeadphones,
    IconHelpCircle,
    IconPlus,
    IconPuzzle,
} from "@tabler/icons-react"
import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

interface ContinueLearningProps {
    waitingCount?: number
}

export function ContinueLearning({ waitingCount = 0 }: ContinueLearningProps) {
    const modes = [
        {
            href: "/practice",
            title: "Flashcard",
            desc: waitingCount > 0 ? `${waitingCount} từ chờ ôn` : "Ôn tập thẻ ghi nhớ",
            icon: IconBolt,
            badge: "SRS",
            badgeVariant: "default" as const,
        },
        {
            href: "/practice/quiz",
            title: "Quiz Trắc Nghiệm",
            desc: "Kiểm tra 4 đáp án chọn 1",
            icon: IconHelpCircle,
            badge: "Mới",
            badgeVariant: "secondary" as const,
        },
        {
            href: "/practice/matching",
            title: "Game Nối Từ",
            desc: "Ghép cặp chữ Hán và nghĩa",
            icon: IconPuzzle,
            badge: "Mini Game",
            badgeVariant: "outline" as const,
        },
        {
            href: "/practice/listening",
            title: "Luyện Nghe",
            desc: "Phát âm tiếng Trung chuẩn",
            icon: IconHeadphones,
            badge: "Audio",
            badgeVariant: "secondary" as const,
        },
    ]

    return (
        <section className="px-4 pb-6">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg tracking-tight text-primary">
                        Chế độ Luyện tập
                    </h2>
                    <Badge variant="outline" className="text-xs">
                        5 chế độ
                    </Badge>
                </div>

                <Link
                    href="/practice"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                >
                    Xem tất cả
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {modes.map((mode) => {
                    const Icon = mode.icon
                    return (
                        <Link key={mode.href} href={mode.href} className="group">
                            <Card className="h-full py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/50">
                                <CardContent className="flex flex-col gap-2 p-0 px-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Icon size={18} />
                                        </div>
                                        <Badge variant={mode.badgeVariant} className="text-[10px] px-1.5 py-0 h-4">
                                            {mode.badge}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                                            {mode.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                            {mode.desc}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}