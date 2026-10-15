"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
    IconCopy,
    IconMessage2Ai,
    IconRefresh,
    IconSend,
    IconSparkles,
    IconVolume,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    createdAt: string
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: "1",
        role: "assistant",
        content: `你好！(Nǐ hǎo!) 👋 Tôi là **Tiểu Hoa (小华)** – Gia sư tiếng Trung AI của bạn.

Tôi có thể hỗ trợ bạn:
- 📖 **Dịch nghĩa & Phân tích ngữ pháp** câu tiếng Trung chi tiết
- 🗣️ **Luyện đối thoại tiếng Trung** (Hán tự + Pinyin + Dịch tiếng Việt)
- 📝 **Sửa lỗi ngữ pháp** cho câu bạn viết
- 💡 **Giải thích từ vựng & thành ngữ**

Hôm nay bạn muốn học hoặc hỏi gì nào?`,
        createdAt: "Vừa xong",
    },
]

const QUICK_PROMPTS = [
    "Dịch câu: 'Hôm nay tôi muốn cùng bạn đi ăn cơm'",
    "Phân biệt cách dùng '想' (xiǎng) và '要' (yào)",
    "Luyện đối thoại chủ đề Gọi món tại nhà hàng",
    "Gợi ý 5 từ vựng HSK 1 thường gặp về Gia đình",
]

export default function AiChatPage() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSend = async (textToSend?: string) => {
        const query = (textToSend || input).trim()
        if (!query || isLoading) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: query,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Không thể kết nối đến AI")
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || "Tiểu Hoa chưa có câu trả lời cho câu hỏi này.",
                createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
            setMessages((prev) => [...prev, botMsg])
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : "Đã có lỗi xảy ra"
            toast.error(errMsg)
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `Rất tiếc, đã có lỗi kết nối: ${errMsg}. Bạn có thể thử lại câu hỏi nhé!`,
                    createdAt: "Bây giờ",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSpeak = (text: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            toast.error("Trình duyệt không hỗ trợ phát âm")
            return
        }

        window.speechSynthesis.cancel()

        // Extract Chinese text or speak the entire text
        const chineseRegex = /[\u4e00-\u9fa5]+/g
        const match = text.match(chineseRegex)
        const textToSpeak = match ? match.join("，") : text

        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = "zh-CN"
        utterance.rate = 0.85 // Slower for learning
        window.speechSynthesis.speak(utterance)
        toast.info("Đang phát âm tiếng Trung...", { duration: 1500 })
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Đã sao chép nội dung!")
    }

    const handleClearChat = () => {
        setMessages(INITIAL_MESSAGES)
        toast.info("Đã làm mới cuộc hội thoại.")
    }

    return (
        <main className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-4xl flex-col p-3 sm:p-4 md:p-6">
            {/* Header */}
            <header className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/70 text-primary-foreground shadow-sm">
                        <IconMessage2Ai size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-foreground">
                                Tiểu Hoa (小华)
                            </h1>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Gia sư tiếng Trung AI cá nhân của bạn
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearChat}
                        className="size-8 text-muted-foreground hover:text-foreground"
                        title="Bắt đầu hội thoại mới"
                    >
                        <IconRefresh size={16} />
                    </Button>
                </div>
            </header>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
                {messages.map((msg) => {
                    const isBot = msg.role === "assistant"
                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${
                                isBot ? "justify-start" : "justify-end"
                            }`}
                        >
                            {isBot && (
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mt-1">
                                    <IconSparkles size={16} />
                                </div>
                            )}

                            <div
                                className={`flex flex-col max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-2xs ${
                                    isBot
                                        ? "bg-card border border-border/80 text-foreground"
                                        : "bg-primary text-primary-foreground font-medium"
                                }`}
                            >
                                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {msg.content}
                                </div>

                                {/* Assistant footer actions */}
                                {isBot && (
                                    <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-muted-foreground">
                                        <span className="text-[10px] text-muted-foreground/80">
                                            {msg.createdAt}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleSpeak(msg.content)}
                                                className="rounded-md p-1 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                                title="Nghe phát âm tiếng Trung"
                                            >
                                                <IconVolume size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(msg.content)}
                                                className="rounded-md p-1 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                                title="Sao chép câu trả lời"
                                            >
                                                <IconCopy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mt-1">
                            <IconSparkles size={16} />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-card border border-border/80 px-4 py-3 text-muted-foreground">
                            <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="size-2 rounded-full bg-primary animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 3 && (
                <div className="pt-2 pb-1 flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(prompt)}
                            className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all text-left truncate max-w-full cursor-pointer"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Bar */}
            <div className="pt-2 border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="relative flex items-center gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi Tiểu Hoa bất kỳ điều gì về tiếng Trung (dịch câu, ngữ pháp, đối thoại)..."
                        className="h-11 pl-4 pr-12 rounded-2xl border-border/80 bg-background shadow-xs text-sm"
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 size-8 rounded-xl shadow-xs"
                    >
                        <IconSend size={16} />
                    </Button>
                </form>
            </div>
        </main>
    )
}
