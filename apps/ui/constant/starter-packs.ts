export interface StarterWord {
    hanzi: string
    pinyin: string
    meaning: string
    example?: string
    hsk_level?: number
}

export interface StarterPack {
    id: string
    title: string
    level: string
    tagline: string
    description: string
    accentColor: string
    words: StarterWord[]
}

export const starterPacks: StarterPack[] = [
    {
        id: "hsk1-core",
        title: "HSK 1 Cốt Lõi",
        level: "HSK 1",
        tagline: "30 từ vựng nền tảng nhất",
        description: "Bộ từ vựng căn bản chuẩn HSK 1 giúp bạn làm quen với các chữ Hán thường gặp nhất.",
        accentColor: "from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30 text-amber-500",
        words: [
            { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào", example: "你好！很高兴认识你。(Xin chào! Rất vui được quen bạn.)", hsk_level: 1 },
            { hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn", example: "谢谢你的帮助。(Cảm ơn sự giúp đỡ của bạn.)", hsk_level: 1 },
            { hanzi: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt", example: "明天见，再见！(Mai gặp lại, tạm biệt!)", hsk_level: 1 },
            { hanzi: "学习", pinyin: "xuéxí", meaning: "Học tập", example: "我喜欢学习汉语。(Tôi thích học tiếng Hán.)", hsk_level: 1 },
            { hanzi: "工作", pinyin: "gōngzuò", meaning: "Công việc / Làm việc", example: "他在中国工作。(Anh ấy làm việc ở Trung Quốc.)", hsk_level: 1 },
            { hanzi: "朋友", pinyin: "péngyou", meaning: "Bạn bè", example: "他是我的好朋友。(Anh ấy là bạn thân của tôi.)", hsk_level: 1 },
            { hanzi: "老师", pinyin: "lǎoshī", meaning: "Giáo viên", example: "王老师教我们中文。(Thầy Vương dạy chúng tôi tiếng Trung.)", hsk_level: 1 },
            { hanzi: "学生", pinyin: "xuésheng", meaning: "Học sinh / Sinh viên", example: "我们都是大学生。(Chúng tôi đều là sinh viên đại học.)", hsk_level: 1 },
            { hanzi: "学校", pinyin: "xuéxiào", meaning: "Trường học", example: "我的学校很大。(Trường của tôi rất to.)", hsk_level: 1 },
            { hanzi: "喜欢", pinyin: "xǐhuan", meaning: "Thích", example: "你喜欢中国菜吗？(Bạn thích món ăn Trung Quốc không?)", hsk_level: 1 },
            { hanzi: "吃饭", pinyin: "chīfàn", meaning: "Ăn cơm / Dùng bữa", example: "我们一起去吃饭吧。(Chúng ta cùng đi ăn cơm đi.)", hsk_level: 1 },
            { hanzi: "喝水", pinyin: "hē shuǐ", meaning: "Uống nước", example: "多喝水对身体好。(Uống nhiều nước tốt cho sức khỏe.)", hsk_level: 1 },
            { hanzi: "今天", pinyin: "jīntiān", meaning: "Hôm nay", example: "今天天气很好。(Hôm nay thời tiết rất đẹp.)", hsk_level: 1 },
            { hanzi: "明天", pinyin: "míngtiān", meaning: "Ngày mai", example: "明天星期几？(Ngày mai là thứ mấy?)", hsk_level: 1 },
            { hanzi: "昨天", pinyin: "zuótiān", meaning: "Hôm qua", example: "昨天我去图书馆了。(Hôm qua tôi đã đến thư viện.)", hsk_level: 1 },
            { hanzi: "现在", pinyin: "xiànzài", meaning: "Bây giờ", example: "现在几点了？(Bây giờ là mấy giờ rồi?)", hsk_level: 1 },
            { hanzi: "时间", pinyin: "shíjiān", meaning: "Thời gian", example: "你什么时候有时间？(Khi nào bạn có thời gian?)", hsk_level: 1 },
            { hanzi: "中国", pinyin: "Zhōngguó", meaning: "Trung Quốc", example: "我想去中国旅游。(Tôi muốn đi du lịch Trung Quốc.)", hsk_level: 1 },
            { hanzi: "中文", pinyin: "Zhōngwén", meaning: "Tiếng Trung", example: "你会说中文吗？(Bạn biết nói tiếng Trung không?)", hsk_level: 1 },
            { hanzi: "家", pinyin: "jiā", meaning: "Nhà / Gia đình", example: "我家有四口人。(Gia đình tôi có 4 người.)", hsk_level: 1 },
            { hanzi: "爸爸", pinyin: "bàba", meaning: "Bố / Ba", example: "我爸爸是医生。(Bố tôi là bác sĩ.)", hsk_level: 1 },
            { hanzi: "妈妈", pinyin: "māma", meaning: "Mẹ", example: "我爱我妈妈。(Tôi yêu mẹ tôi.)", hsk_level: 1 },
            { hanzi: "吃", pinyin: "chī", meaning: "Ăn", example: "你想吃什么？(Bạn muốn ăn gì?)", hsk_level: 1 },
            { hanzi: "喝", pinyin: "hē", meaning: "Uống", example: "我想喝一杯咖啡。(Tôi muốn uống một cốc cà phê.)", hsk_level: 1 },
            { hanzi: "看", pinyin: "kàn", meaning: "Xem / Nhìn / Đọc", example: "他在看书。(Anh ấy đang đọc sách.)", hsk_level: 1 },
            { hanzi: "听", pinyin: "tīng", meaning: "Nghe", example: "请听我说。(Xin hãy nghe tôi nói.)", hsk_level: 1 },
            { hanzi: "说", pinyin: "shuō", meaning: "Nói", example: "请说慢一点。(Xin nói chậm một chút.)", hsk_level: 1 },
            { hanzi: "读", pinyin: "dú", meaning: "Đọc", example: "每天大声朗读课文。(Mỗi ngày hãy đọc to bài học.)", hsk_level: 1 },
            { hanzi: "写", pinyin: "xiě", meaning: "Viết", example: "这个汉字怎么写？(Chữ Hán này viết như thế nào?)", hsk_level: 1 },
            { hanzi: "很好", pinyin: "hěn hǎo", meaning: "Rất tốt", example: "你的中文非常好！(Tiếng Trung của bạn rất tốt!)", hsk_level: 1 },
        ],
    },
    {
        id: "daily-greetings",
        title: "Chào Hỏi & Giao Tiếp",
        level: "Cơ bản",
        tagline: "Giao tiếp tự nhiên hàng ngày",
        description: "Các mẫu từ và câu thông dụng nhất để bắt đầu và kết thúc mọi cuộc đối thoại.",
        accentColor: "from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-500",
        words: [
            { hanzi: "早上好", pinyin: "zǎoshang hǎo", meaning: "Chào buổi sáng", example: "早上好，大家！(Chào buổi sáng mọi người!)" },
            { hanzi: "晚上好", pinyin: "wǎnshang hǎo", meaning: "Chào buổi tối", example: "晚上好，吃了晚饭吗？(Chào buổi tối, đã ăn tối chưa?)" },
            { hanzi: "对不起", pinyin: "duìbuqǐ", meaning: "Xin lỗi", example: "对不起，我迟到了。(Xin lỗi, tôi đến muộn.)" },
            { hanzi: "没关系", pinyin: "méi guānxi", meaning: "Không có sao / Không hề gì", example: "没关系，下次注意。(Không sao đâu, lần sau chú ý nhé.)" },
            { hanzi: "不客气", pinyin: "bú kèqi", meaning: "Đừng khách sáo / Không có chi", example: "不客气，这是我应该做的。(Không có chi, đây là việc tôi nên làm.)" },
            { hanzi: "请问", pinyin: "qǐngwèn", meaning: "Xin hỏi / Cho tôi hỏi", example: "请问，洗手间在哪里？(Xin hỏi nhà vệ sinh ở đâu ạ?)" },
            { hanzi: "认识", pinyin: "rènshi", meaning: "Quen biết", example: "很高兴认识你。(Rất vui được làm quen với bạn.)" },
            { hanzi: "高兴", pinyin: "gāoxìng", meaning: "Vui mừng / Phấn khởi", example: "见到你我很高兴。(Gặp bạn tôi rất vui.)" },
            { hanzi: "好的", pinyin: "hǎo de", meaning: "Được rồi / OK", example: "好的，没问题！(Được rồi, không thành vấn đề!)" },
            { hanzi: "明白", pinyin: "míngbai", meaning: "Hiểu rõ / Nắm được", example: "你明白我的意思吗？(Bạn hiểu ý của tôi không?)" },
            { hanzi: "没问题", pinyin: "méi wèntí", meaning: "Không vấn đề gì", example: "放心吧，没问题！(Yên tâm đi, không sao đâu!)" },
            { hanzi: "可以", pinyin: "kěyǐ", meaning: "Có thể / Được phép", example: "我可以坐这里吗？(Tôi có thể ngồi đây được không?)" },
            { hanzi: "知道", pinyin: "zhīdào", meaning: "Biết", example: "我不知道他在哪里。(Tôi không biết anh ấy ở đâu.)" },
            { hanzi: "帮", pinyin: "bāng", meaning: "Giúp đỡ", example: "你可以帮我一下吗？(Bạn có thể giúp tôi một chút không?)" },
            { hanzi: "祝贺", pinyin: "zhùhè", meaning: "Chúc mừng", example: "祝贺你考试合格！(Chúc mừng bạn đã thi đỗ!)" },
        ],
    },
    {
        id: "numbers-time",
        title: "Chữ Số & Thời Gian",
        level: "Cơ bản",
        tagline: "Đếm số, ngày tháng, giờ giấc",
        description: "Thành thạo cách nói số tiền, số đếm, hỏi giờ và hẹn lịch trong tiếng Trung.",
        accentColor: "from-sky-500/15 via-sky-500/5 to-transparent border-sky-500/30 text-sky-500",
        words: [
            { hanzi: "一", pinyin: "yī", meaning: "Một (1)", example: "一个星期有七天。(Một tuần có 7 ngày.)" },
            { hanzi: "二", pinyin: "èr", meaning: "Hai (2)", example: "现在两点二十分。(Bây giờ là 2 giờ 20 phút.)" },
            { hanzi: "三", pinyin: "sān", meaning: "Ba (3)", example: "我有三个朋友。(Tôi có 3 người bạn.)" },
            { hanzi: "四", pinyin: "sì", meaning: "Bốn (4)", example: "一年有四个季节。(Một năm có 4 mùa.)" },
            { hanzi: "五", pinyin: "wǔ", meaning: "Năm (5)", example: "今天星期五。(Hôm nay là thứ sáu.)" },
            { hanzi: "六", pinyin: "liù", meaning: "Sáu (6)", example: "他六点起床。(Anh ấy 6 giờ dậy.)" },
            { hanzi: "七", pinyin: "qī", meaning: "Bảy (7)", example: "七月是最热的。(Tháng 7 là nóng nhất.)" },
            { hanzi: "八", pinyin: "bā", meaning: "Tám (8)", example: "中国人喜欢数字八。(Người Trung Quốc thích con số 8.)" },
            { hanzi: "九", pinyin: "jiǔ", meaning: "Chín (9)", example: "九月是开学季。(Tháng 9 là mùa tựu trường.)" },
            { hanzi: "十", pinyin: "shí", meaning: "Mười (10)", example: "这道题十分难。(Câu hỏi này khó mười phần.)" },
            { hanzi: "百", pinyin: "bǎi", meaning: "Trăm (100)", example: "这一本书一百块。(Cuốn sách này 100 tệ.)" },
            { hanzi: "千", pinyin: "qiān", meaning: "Nghìn (1000)", example: "一千米有多远？(1000 mét xa bao nhiêu?)" },
            { hanzi: "点", pinyin: "diǎn", meaning: "Giờ (chỉ thời gian)", example: "现在早上八点。(Bây giờ là 8 giờ sáng.)" },
            { hanzi: "分", pinyin: "fēn", meaning: "Phút", example: "等我五分钟。(Chờ tôi 5 phút nhé.)" },
            { hanzi: "星期", pinyin: "xīngqī", meaning: "Tuần lễ / Thứ", example: "这个星期我很忙。(Tuần này tôi rất bận.)" },
            { hanzi: "月", pinyin: "yuè", meaning: "Tháng", example: "五月去北京很合适。(Tháng 5 đi Bắc Kinh rất hợp lý.)" },
            { hanzi: "年", pinyin: "nián", meaning: "Năm", example: "祝你新年快乐！(Chúc bạn năm mới vui vẻ!)" },
            { hanzi: "生日", pinyin: "shēngrì", meaning: "Sinh nhật", example: "今天是我的生日。(Hôm nay là sinh nhật của tôi.)" },
        ],
    },
    {
        id: "food-dining",
        title: "Ẩm Thực & Gọi Món",
        level: "Đời sống",
        tagline: "Khám phá món ngon và gọi món",
        description: "Tự tin gọi món ăn, đồ uống và thanh toán tại nhà hàng Trung Quốc.",
        accentColor: "from-rose-500/15 via-rose-500/5 to-transparent border-rose-500/30 text-rose-500",
        words: [
            { hanzi: "米饭", pinyin: "mǐfàn", meaning: "Cơm trắng", example: "我要一碗米饭。(Cho tôi một bát cơm.)" },
            { hanzi: "面条", pinyin: "miàntiáo", meaning: "Mì sợi", example: "这里的牛肉面很好吃。(Mì bò ở đây rất ngon.)" },
            { hanzi: "包子", pinyin: "bāozi", meaning: "Bánh bao", example: "早餐吃热包子。(Bữa sáng ăn bánh bao nóng.)" },
            { hanzi: "饺子", pinyin: "jiǎozi", meaning: "Sủi cảo / Bánh chẻo", example: "过年要吃饺子。(Tết đến thì ăn sủi cảo.)" },
            { hanzi: "菜", pinyin: "cài", meaning: "Món ăn / Rau củ", example: "请问有什么特色菜？(Xin hỏi có món đặc sản nào không?)" },
            { hanzi: "茶", pinyin: "chá", meaning: "Trà", example: "请喝杯热茶。(Mời uống chén trà nóng.)" },
            { hanzi: "咖啡", pinyin: "kāfēi", meaning: "Cà phê", example: "我不喝冰咖啡。(Tôi không uống cà phê đá.)" },
            { hanzi: "水", pinyin: "shuǐ", meaning: "Nước", example: "来一杯温水。(Cho một ly nước ấm.)" },
            { hanzi: "好吃", pinyin: "hǎochī", meaning: "Ngon miệng", example: "这个中国菜真好吃！(Món Trung này ngon thật sự!)" },
            { hanzi: "多少钱", pinyin: "duōshao qián", meaning: "Bao nhiêu tiền", example: "这个一共多少钱？(Chỗ này tổng cộng bao nhiêu tiền?)" },
            { hanzi: "买单", pinyin: "mǎidān", meaning: "Thanh toán / Tính tiền", example: "服务员，买单！(Phục vụ ơi, tính tiền!)" },
            { hanzi: "菜单", pinyin: "càidān", meaning: "Thực đơn", example: "请给我看菜单。(Làm ơn cho tôi xem thực đơn.)" },
            { hanzi: "辣", pinyin: "là", meaning: "Cay", example: "这个菜有点辣。(Món này hơi cay một chút.)" },
            { hanzi: "甜", pinyin: "tián", meaning: "Ngọt", example: "这个蛋糕很甜。(Cái bánh gato này rất ngọt.)" },
        ],
    },
]
