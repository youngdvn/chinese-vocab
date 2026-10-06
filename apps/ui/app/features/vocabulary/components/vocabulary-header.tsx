"use client"

import { IconPlus } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { AddVocabularyForm } from "./add-vocabulary-form"


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

            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <IconPlus size={17} />
                        Add
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>
                            Add vocabulary
                        </DialogTitle>

                        <DialogDescription>
                            Add a new Chinese word to your vocabulary.
                        </DialogDescription>
                    </DialogHeader>
                    <AddVocabularyForm />
                </DialogContent>

            </Dialog>
        </div>
    )
}