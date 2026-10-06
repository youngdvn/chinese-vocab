import { WordAudio } from "@/components/word-audio"
import { Badge } from "@workspace/ui/components/badge"

interface Vocabulary {
    id: number
    chinese: string
    pinyin: string
    meaning: string
    status: "new" | "learning"
    createdAt: string
}

interface VocabularyCardProps {
    word: Vocabulary
}

export function VocabularyCard({ word }: VocabularyCardProps) {
    return (
        <div className="group rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    {/* Chinese */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-semibold text-primary">
                        {word.chinese}
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold leading-none">
                                {word.pinyin}
                            </p>
                        </div>

                        <p className="mt-1.5 truncate text-sm text-muted-foreground">
                            {word.meaning}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge
                        variant={
                            word.status === "new"
                                ? "default"
                                : "secondary"
                        }
                        className="h-4 px-2 text-[10px]"
                    >
                        {word.status === "new" ? "New" : "Learning"}
                    </Badge>

                    <WordAudio word={word.chinese} />
                </div>
            </div>
        </div>
    )
}