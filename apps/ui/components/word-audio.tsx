"use client"

import { useState } from "react"
import { IconVolume, IconVolumeOff } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { speakChinese, isSpeechSupported } from "@/lib/speech"

type WordAudioProps = {
    word: string
}

export function WordAudio({ word }: WordAudioProps) {
    const [available] = useState(() => isSpeechSupported())

    const handleSpeak = () => {
        speakChinese(word)
    }

    if (!available) {
        return (
            <Button
                variant="ghost"
                size="icon"
                disabled
                title="Voice unavailable"
                aria-label="Voice unavailable"
            >
                <IconVolumeOff size={18} />
            </Button>
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
            <IconVolume size={18} />
        </Button>
    )
}