"use client"

import { IconVolume } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { speakChinese } from "@/lib/speech"

type WordAudioProps = {
    word: string
}

export function WordAudio({ word }: WordAudioProps) {
    const handleSpeak = () => {
        speakChinese(word)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            aria-label={`Phát âm ${word}`}
        >
            <IconVolume size={18} />
        </Button>
    )
}