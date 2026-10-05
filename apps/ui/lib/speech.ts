export function isSpeechSupported() {
    return (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window
    )
}

export function speakChinese(text: string) {
    if (!isSpeechSupported()) {
        return false
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = "zh-CN"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    return true
}