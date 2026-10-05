export function speakChinese(text: string) {
    if (typeof window === "undefined") return
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = "zh-CN"
    utterance.rate = 0.9
    utterance.pitch = 1

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
}