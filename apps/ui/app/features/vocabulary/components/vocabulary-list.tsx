import { WordAudio } from "@/components/word-audio"
import { IconCheck } from "@tabler/icons-react"

interface Vocabulary {
    id: number
    chinese: string
    pinyin: string
    meaning: string
    learned: boolean
    toReview: boolean
    createdAt: string
}

interface VocabularyListProps {
    words: Vocabulary[]
    total: number
}

export function VocabularyList({
    words,
    total,
}: VocabularyListProps) {
    return (
        <section className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
                {total} vocabulary
            </p>

            {words.map((word) => (
                <div
                    key={word.id}
                    className="group flex items-center justify-between rounded-xl border bg-card p-4 transition hover:bg-muted/50"
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold text-primary">
                            {word.chinese}
                        </div>

                        <div className="min-w-0">
                            <p className="font-semibold">
                                {word.pinyin}
                            </p>

                            <p className="truncate text-sm text-muted-foreground">
                                {word.meaning}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {word.createdAt}
                            </p>
                        </div>
                        <WordAudio word={word.chinese} />
                    </div>

                    {/* {word.learned && (
                        <div className="ml-4 flex shrink-0 items-center gap-1 text-sm text-primary">
                            <IconCheck size={16} />

                            <span className="hidden sm:inline">
                                Learned
                            </span>
                        </div>
                    )} */}
                </div>
            ))}

            {words.length === 0 && (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <p className="font-medium">
                        No vocabulary found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Try another search or filter.
                    </p>
                </div>
            )}
        </section>
    )
}