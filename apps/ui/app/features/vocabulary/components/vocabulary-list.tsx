import { VocabularyCard } from "./vocabulary-card"

interface Vocabulary {
    id: number
    chinese: string
    pinyin: string
    meaning: string
    status: "new" | "learning"
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
            <p className="text-sm text-end text-muted-foreground">
                {total} vocabulary
            </p>

            {words.map((word) => (
                <VocabularyCard
                    key={word.id}
                    word={word}
                />
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