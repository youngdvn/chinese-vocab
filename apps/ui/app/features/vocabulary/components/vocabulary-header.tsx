import { IconPlus } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

export function VocabularyHeader() {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">
                    Vocabulary
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage your Chinese vocabulary
                </p>
            </div>

            <Button>
                <IconPlus size={17} />
                Add
            </Button>
        </div>
    )
}