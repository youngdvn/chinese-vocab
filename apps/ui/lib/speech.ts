export function speakChinese(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
) {
    if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)
    ) {
        return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = "zh-CN"
    utterance.rate = 0.8
    utterance.pitch = 1

    utterance.onstart = () => {
        onStart?.()
    }

    utterance.onend = () => {
        onEnd?.()
    }

    utterance.onerror = () => {
        onEnd?.()
    }

    window.speechSynthesis.speak(utterance)
}