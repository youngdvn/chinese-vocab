"use client"

import { Button } from "@workspace/ui/components/button"
import { DialogClose } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export function AddVocabularyForm() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const word = formData.get("word")
        const pinyin = formData.get("pinyin")
        const meaning = formData.get("meaning")

        console.log({
            word,
            pinyin,
            meaning,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="word">
                    Chinese
                </Label>

                <Input
                    id="word"
                    name="word"
                    placeholder="例如：学习"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="pinyin">
                    Pinyin
                </Label>

                <Input
                    id="pinyin"
                    name="pinyin"
                    placeholder="例如：xuéxí"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="meaning">
                    Meaning
                </Label>

                <Input
                    id="meaning"
                    name="meaning"
                    placeholder="Ví dụ: Học tập"
                    required
                />
            </div>

            <div className="flex justify-end gap-2">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="destructive"
                    >
                        Cancel
                    </Button>
                </DialogClose>

                <Button type="submit">
                    Submit
                </Button>
            </div>
        </form>
    )
}