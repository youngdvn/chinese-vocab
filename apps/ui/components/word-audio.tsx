"use client"

import { useState } from "react"
import { IconVolume } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { speakChinese } from "@/lib/speech"

type WordAudioProps = {
    word: string
}

export function WordAudio({ word }: WordAudioProps) {
    const [isSpeaking, setIsSpeaking] = useState(false)

    const handleSpeak = () => {
        speakChinese(
            word,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            title={`Phát âm ${word}`}
            aria-label={`Phát âm ${word}`}
        >
            <IconVolume
                size={18}
                className={
                    isSpeaking
                        ? "text-primary"
                        : "text-muted-foreground"
                }
            />
        </Button>
    )
}