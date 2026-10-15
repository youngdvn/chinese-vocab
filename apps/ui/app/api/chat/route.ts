import { NextResponse } from "next/server"

interface ChatMessage {
    role: "user" | "assistant" | "system"
    content: string
}

const SYSTEM_PROMPT = `Bạn là "Tiểu Hoa (小华)" - một gia sư dạy tiếng Trung thông minh, thân thiện, kiên nhẫn và chuyên nghiệp.
Nhiệm vụ của bạn là:
1. Hướng dẫn và giải thích tiếng Trung cho người học Việt Nam một cách dễ hiểu nhất.
2. Mỗi khi đưa ra từ vựng hoặc câu tiếng Trung, LUÔN LUÔN kèm theo:
   - Chữ Hán (Hán tự giản thể): e.g. 学习
   - Bính âm (Pinyin) có dấu thanh điệu: e.g. [xuéxí]
   - Nghĩa tiếng Việt rõ ràng: e.g. Học tập
   - Câu ví dụ thực tế kèm dịch nghĩa
3. Nếu người dùng muốn luyện đối thoại, hãy đóng vai và trả lời bằng tiếng Trung tự nhiên kèm bính âm và dịch nghĩa, sau đó gợi ý câu trả lời tiếp theo cho học viên.
4. Giữ giọng điệu ấm áp, khích lệ và chuẩn xác về ngữ pháp.`

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages, apiKey: userApiKey } = body as {
            messages: ChatMessage[]
            apiKey?: string
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Vui lòng cung cấp nội dung tin nhắn" },
                { status: 400 }
            )
        }

        const geminiKey =
            (userApiKey && !userApiKey.startsWith("sk-") ? userApiKey : "") ||
            process.env.GEMINI_API_KEY ||
            process.env.NEXT_PUBLIC_GEMINI_API_KEY

        const openAiKey =
            (userApiKey && userApiKey.startsWith("sk-") ? userApiKey : "") ||
            process.env.OPENAI_API_KEY

        const lastUserMessage = messages[messages.length - 1]?.content || ""

        // 1. If Gemini API Key is available
        if (geminiKey) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            system_instruction: {
                                parts: [{ text: SYSTEM_PROMPT }],
                            },
                            contents: messages.map((m) => ({
                                role: m.role === "assistant" ? "model" : "user",
                                parts: [{ text: m.content }],
                            })),
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 1000,
                            },
                        }),
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    const reply =
                        data.candidates?.[0]?.content?.parts?.[0]?.text ||
                        "Xin lỗi, Tiểu Hoa chưa thể phản hồi lúc này."

                    return NextResponse.json({ reply })
                } else {
                    const errData = await response.json().catch(() => ({}))
                    const errMsg = errData?.error?.message || response.statusText
                    console.error("Gemini API Error:", errMsg)
                    if (userApiKey) {
                        return NextResponse.json(
                            { error: `Lỗi Gemini API: ${errMsg}` },
                            { status: 400 }
                        )
                    }
                }
            } catch (err) {
                console.error("Gemini fetch error:", err)
            }
        }

        // 2. If OpenAI API Key is available
        if (openAiKey) {
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openAiKey}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            ...messages.map((m) => ({
                                role: m.role,
                                content: m.content,
                            })),
                        ],
                        temperature: 0.7,
                    }),
                })

                if (response.ok) {
                    const data = await response.json()
                    const reply =
                        data.choices?.[0]?.message?.content ||
                        "Xin lỗi, Tiểu Hoa chưa thể phản hồi lúc này."
                    return NextResponse.json({ reply })
                }
            } catch (err) {
                console.error("OpenAI fetch error:", err)
            }
        }

        // 3. Built-in intelligent Chinese tutor fallback
        const reply = generateSmartResponse(lastUserMessage)
        return NextResponse.json({ reply })
    } catch {
        return NextResponse.json(
            { error: "Đã có lỗi xảy ra khi kết nối với gia sư AI" },
            { status: 500 }
        )
    }
}

function generateSmartResponse(input: string): string {
    const q = input.toLowerCase().trim()

    // 1. Phân biệt từ hoặc giải thích ngữ pháp
    if (q.includes("phân biệt") || q.includes("khác nhau") || (q.includes("想") && q.includes("要"))) {
        return `Chào bạn! Tiểu Hoa sẽ giúp bạn phân biệt rõ ràng nhé:

### 📌 Phân biệt "想" (xiǎng) và "要" (yào):

1. **想 [xiǎng] - Muốn / Nhớ / Nghĩ**:
   - Diễn tả **mong muốn, nguyện vọng chủ quan** (có thể chưa làm ngay hoặc chưa chắc chắn).
   - Ví dụ: 我想去中国。(Wǒ xiǎng qù Zhōngguó.) → *Tôi muốn đi Trung Quốc (nguyện vọng).*
   - Mang nghĩa "nhớ": 我想你。(Wǒ xiǎng nǐ.) → *Tôi nhớ bạn.*

2. **要 [yào] - Muốn / Cần / Sẽ**:
   - Thể hiện **ý chí quyết tâm cao hơn**, dự định chắc chắn sẽ làm hoặc yêu cầu cần thiết.
   - Ví dụ: 我要去中国。(Wǒ yào qù Zhōngguó.) → *Tôi sẽ/phải đi Trung Quốc (kế hoạch đã định).*
   - Dùng khi gọi món: 我要一杯水。(Wǒ yào yībēi shuǐ.) → *Cho tôi một cốc nước.*

💡 **Mẹo nhớ:** "想" thiên về suy nghĩ trong đầu (tâm), còn "要" thiên về hành động sắp thực hiện! Bạn có muốn đặt thử một câu để Tiểu Hoa sửa không?`
    }

    // 2. Dịch câu
    if (q.includes("dịch") || q.includes("ăn cơm") || q.includes("hôm nay")) {
        return `Tiểu Hoa dịch và phân tích câu cho bạn đây nhé:

✨ **Câu tiếng Trung:**
**今天我想跟你一起去吃饭。**
- **Pinyin:** Jīntiān wǒ xiǎng gēn nǐ yīqǐ qù chīfàn.
- **Dịch nghĩa:** Hôm nay tôi muốn cùng bạn đi ăn cơm.

🔍 **Phân tích từ vựng & ngữ pháp:**
- **今天 [jīntiān]:** Hôm nay (Trạng từ chỉ thời gian đặt đầu câu hoặc sau chủ ngữ).
- **我 [wǒ]:** Tôi (Đại từ nhân xưng ngôi 1).
- **想 [xiǎng]:** Muốn (Động từ năng nguyện).
- **跟...一起 [gēn... yīqǐ]:** Cùng với ai đó làm gì (Cấu trúc: A 跟 B 一起 + Động từ).
- **去吃饭 [qù chīfàn]:** Đi ăn cơm.

🎉 Bạn có thể luyện phát âm câu này nhé! Rất tự nhiên và người bản xứ dùng hằng ngày.`
    }

    // 3. Đối thoại (chào hỏi, giới thiệu)
    if (q.includes("chào") || q.includes("hello") || q.includes("ni hao") || q.includes("你好")) {
        return `你好！很高兴认识你！(Nǐ hǎo! Hěn gāoxìng rènshi nǐ! - *Xin chào! Rất vui được làm quen với bạn!*) 👋

Hôm nay bạn muốn Tiểu Hoa hỗ trợ điều gì nào?
1. 📖 **Luyện từ vựng**: Học từ mới theo chủ đề (Ẩm thực, Mua sắm, Du lịch, HSK).
2. 🗣️ **Luyện đối thoại**: Nhập vai giao tiếp tiếng Trung theo ngữ cảnh.
3. 📝 **Sửa ngữ pháp**: Đặt câu tiếng Trung để Tiểu Hoa kiểm tra và sửa lỗi.
4. ❓ **Giải đáp thắc mắc**: Hỏi bất kỳ chữ Hán hoặc cấu trúc ngữ pháp nào!`
    }

    // 4. Luyện đối thoại mua sắm / nhà hàng
    if (q.includes("đối thoại") || q.includes("mua sắm") || q.includes("nhà hàng") || q.includes("order")) {
        return `Tuyệt vời! Chúng ta cùng đóng vai giao tiếp tại **Nhà hàng Trung Quốc (餐厅 - cāntīng)** nhé!

Tiểu Hoa sẽ là **Phục vụ bàn (服务员 - fúwùyuán)**, bạn là **Khách hàng**:

👨‍🍳 **Tiểu Hoa nói:**
"您好！欢迎光临！请问您几位？想要吃点什么？"
- **Pinyin:** Nín hǎo! Huānyíng guānglín! Qǐngwèn nín jǐ wèi? Xiǎng yào chī diǎn shénme?
- **Dịch nghĩa:** Xin chào quý khách! Hoan nghênh quý khách! Cho hỏi quý khách đi mấy người ạ? Quý khách muốn dùng món gì?

👉 **Gợi ý cách trả lời cho bạn:**
- "我们两位。请给我看一下菜单。(Wǒmen liǎng wèi. Qǐng gěi wǒ kàn yíxià càidān. - *Chúng tôi 2 người. Làm ơn cho tôi xem menu.*)"
- "我想点一碗牛肉面。(Wǒ xiǎng diǎn yì wǎn niúròumiàn. - *Tôi muốn gọi 1 bát mì bò.*)"

Hãy trả lời Tiểu Hoa bằng tiếng Trung nhé!`
    }

    // 5. Default Response
    return `Tiểu Hoa đã nhận được câu hỏi: "${input}"! ✨

Để học tốt nhất, bạn có thể tham khảo mẫu phân tích từ vựng sau:
- **Hán tự:** 努力学习，天天向上
- **Pinyin:** [nǔlì xuéxí, tiāntiān xiàngshàng]
- **Ý nghĩa:** Chăm chỉ học tập, ngày ngày tiến bộ!

💡 **Bạn có thể thử các lệnh gợi ý sau:**
- *"Dịch câu: Ngày mai bạn có rảnh không?"*
- *"Giải thích ngữ pháp chữ 了 (le)"*
- *"Cho tôi 5 từ vựng HSK 1 về chủ đề Gia đình"*
- *"Sửa giúp tôi câu này: 我天天学习中文"*`
}
