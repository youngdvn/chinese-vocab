import { Vocabulary } from "@/types/vocabulary"
import {
    IconBolt,
    IconBook2,
    IconBrightness,
    IconDatabaseExport,
    IconLayout,
    IconSettings,
    IconTarget,
} from "@tabler/icons-react"

export const overviewData = [
    { id: 1, label: "Total Words", quantity: 320 },
    { id: 2, label: "New Words", quantity: 135 },
    { id: 3, label: "Learning", quantity: 185 },
    { id: 4, label: "This Week", quantity: 20 },
]

export const dailyVocab = [
    { id: 1, hanyu: "学习", pinyin: "xuéxí", mean: "Học tập", status: "learning" },
    { id: 2, hanyu: "你好", pinyin: "nǐ hǎo", mean: "Xin chào", status: "learning" },
    { id: 3, hanyu: "谢谢", pinyin: "xièxie", mean: "Cảm ơn", status: "learning" },
    { id: 4, hanyu: "再见", pinyin: "zàijiàn", mean: "Tạm biệt", status: "new" },
    { id: 5, hanyu: "朋友", pinyin: "péngyou", mean: "Bạn bè", status: "new" },
    { id: 6, hanyu: "老师", pinyin: "lǎoshī", mean: "Giáo viên", status: "new" },
    { id: 7, hanyu: "学生", pinyin: "xuésheng", mean: "Học sinh / Sinh viên", status: "new" },
    { id: 8, hanyu: "学校", pinyin: "xuéxiào", mean: "Trường học", status: "new" },
    { id: 9, hanyu: "工作", pinyin: "gōngzuò", mean: "Công việc / Làm việc", status: "new" },
    { id: 10, hanyu: "喜欢", pinyin: "xǐhuan", mean: "Thích", status: "new" },
    { id: 11, hanyu: "吃饭", pinyin: "chīfàn", mean: "Ăn cơm / Ăn", status: "new" },
    { id: 12, hanyu: "喝水", pinyin: "hē shuǐ", mean: "Uống nước", status: "new" },
    { id: 13, hanyu: "今天", pinyin: "jīntiān", mean: "Hôm nay", status: "new" },
    { id: 14, hanyu: "明天", pinyin: "míngtiān", mean: "Ngày mai", status: "new" },
    { id: 15, hanyu: "昨天", pinyin: "zuótiān", mean: "Hôm qua", status: "new" },
    { id: 16, hanyu: "现在", pinyin: "xiànzài", mean: "Bây giờ", status: "new" },
    { id: 17, hanyu: "时间", pinyin: "shíjiān", mean: "Thời gian", status: "new" },
    { id: 18, hanyu: "中国", pinyin: "Zhōngguó", mean: "Trung Quốc", status: "new" },
    { id: 19, hanyu: "中文", pinyin: "Zhōngwén", mean: "Tiếng Trung", status: "new" },
    { id: 20, hanyu: "语言", pinyin: "yǔyán", mean: "Ngôn ngữ", status: "new" },
]

export const menuSidebar = [
    { id: 1, label: "Home", href: "/", icon: IconLayout },
    { id: 2, label: "Vocabulary", href: "/vocabulary", icon: IconBook2 },
    { id: 3, label: "Practice", href: "/practice", icon: IconBolt },
    { id: 4, label: "Setting", href: "/setting", icon: IconSettings },
]

export const words: Vocabulary[] = [
    { id: 1, chinese: "学习", pinyin: "xuéxí", meaning: "Học tập", status: "learning", createdAt: "2026-10-04" },
    { id: 2, chinese: "今天", pinyin: "jīntiān", meaning: "Hôm nay", status: "new", createdAt: "2026-10-04" },
    { id: 3, chinese: "喜欢", pinyin: "xǐhuān", meaning: "Thích", status: "learning", createdAt: "2026-10-03" },
    { id: 4, chinese: "朋友", pinyin: "péngyou", meaning: "Bạn bè", status: "new", createdAt: "2026-10-03" },
    { id: 5, chinese: "工作", pinyin: "gōngzuò", meaning: "Công việc", status: "new", createdAt: "2026-10-02" },
    { id: 6, chinese: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào", status: "learning", createdAt: "2026-10-02" },
    { id: 7, chinese: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn", status: "learning", createdAt: "2026-10-01" },
    { id: 8, chinese: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt", status: "learning", createdAt: "2026-10-01" },
    { id: 9, chinese: "吃饭", pinyin: "chīfàn", meaning: "Ăn cơm", status: "new", createdAt: "2026-09-30" },
    { id: 10, chinese: "喝水", pinyin: "hē shuǐ", meaning: "Uống nước", status: "new", createdAt: "2026-09-30" },
    { id: 11, chinese: "学校", pinyin: "xuéxiào", meaning: "Trường học", status: "learning", createdAt: "2026-09-29" },
    { id: 12, chinese: "老师", pinyin: "lǎoshī", meaning: "Giáo viên", status: "learning", createdAt: "2026-09-29" },
    { id: 13, chinese: "学生", pinyin: "xuéshēng", meaning: "Học sinh", status: "new", createdAt: "2026-09-28" },
    { id: 14, chinese: "中国", pinyin: "Zhōngguó", meaning: "Trung Quốc", status: "learning", createdAt: "2026-09-28" },
    { id: 15, chinese: "中文", pinyin: "Zhōngwén", meaning: "Tiếng Trung", status: "new", createdAt: "2026-09-27" },
    { id: 16, chinese: "语言", pinyin: "yǔyán", meaning: "Ngôn ngữ", status: "new", createdAt: "2026-09-27" },
    { id: 17, chinese: "时间", pinyin: "shíjiān", meaning: "Thời gian", status: "learning", createdAt: "2026-09-26" },
    { id: 18, chinese: "现在", pinyin: "xiànzài", meaning: "Bây giờ", status: "new", createdAt: "2026-09-26" },
    { id: 19, chinese: "明天", pinyin: "míngtiān", meaning: "Ngày mai", status: "new", createdAt: "2026-09-25" },
    { id: 20, chinese: "昨天", pinyin: "zuótiān", meaning: "Hôm qua", status: "learning", createdAt: "2026-09-25" },
    { id: 21, chinese: "家", pinyin: "jiā", meaning: "Nhà", status: "learning", createdAt: "2026-09-24" },
    { id: 22, chinese: "妈妈", pinyin: "māma", meaning: "Mẹ", status: "new", createdAt: "2026-09-24" },
    { id: 23, chinese: "爸爸", pinyin: "bàba", meaning: "Bố", status: "learning", createdAt: "2026-09-23" },
    { id: 24, chinese: "吃", pinyin: "chī", meaning: "Ăn", status: "new", createdAt: "2026-09-23" },
    { id: 25, chinese: "喝", pinyin: "hē", meaning: "Uống", status: "new", createdAt: "2026-09-22" },
    { id: 26, chinese: "看", pinyin: "kàn", meaning: "Xem / Nhìn", status: "learning", createdAt: "2026-09-22" },
    { id: 27, chinese: "听", pinyin: "tīng", meaning: "Nghe", status: "new", createdAt: "2026-09-21" },
    { id: 28, chinese: "说", pinyin: "shuō", meaning: "Nói", status: "learning", createdAt: "2026-09-21" },
    { id: 29, chinese: "读", pinyin: "dú", meaning: "Đọc", status: "new", createdAt: "2026-09-20" },
    { id: 30, chinese: "写", pinyin: "xiě", meaning: "Viết", status: "learning", createdAt: "2026-09-20" },
]

export const statusFilters = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Learning", value: "learning" },
]

export const dateFilters = [
    { label: "All dates", value: "all" },
    { label: "Today", value: "2026-10-04" },
    { label: "Yesterday", value: "2026-10-03" },
    { label: "Oct 2, 2026", value: "2026-10-02" },
    { label: "Oct 1, 2026", value: "2026-10-01" },
    { label: "Sep 30, 2026", value: "2026-09-30" },
]

export const settings = [
    {
        title: "Appearance",
        items: [
            {
                label: "Theme",
                href: "/setting/theme",
                description: "System",
                icon: IconBrightness,
            },
        ],
    },
    {
        title: "Learning",
        items: [
            {
                label: "Daily goal",
                href: "/setting/daily-goal",
                description: "20 words per day",
                icon: IconTarget,
            },
        ],
    },
    {
        title: "Data",
        items: [
            {
                label: "Export vocabulary",
                href: "/setting/export",
                description: "Export your vocabulary data",
                icon: IconDatabaseExport,
            },
        ],
    },
]