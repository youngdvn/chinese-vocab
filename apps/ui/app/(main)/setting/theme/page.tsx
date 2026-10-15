"use client"

import { IconArrowLeft, IconBrightness, IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"

export default function SettingTheme() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 p-4 md:p-6">
            <div>
                <Link
                    href="/setting"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
                >
                    <IconArrowLeft size={14} />
                    Cài đặt
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Giao diện (Theme)</h1>
                <p className="text-sm text-muted-foreground">
                    Tùy chỉnh chế độ hiển thị sáng, tối hoặc theo thiết bị.
                </p>
            </div>

            <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-1 gap-3"
            >
                <ThemeOption
                    value="light"
                    icon={<IconSun className="size-5" />}
                    title="Nền sáng"
                    description="Giao diện sáng dễ nhìn vào ban ngày"
                />

                <ThemeOption
                    value="dark"
                    icon={<IconMoon className="size-5" />}
                    title="Nền tối"
                    description="Giao diện tối dịu mắt, tiết kiệm pin"
                />

                <ThemeOption
                    value="system"
                    icon={<IconBrightness className="size-5" />}
                    title="Hệ thống"
                    description="Tự động đồng bộ theo cài đặt thiết bị của bạn"
                />
            </RadioGroup>
        </div>
    )
}

function ThemeOption({
    value,
    icon,
    title,
    description,
}: {
    value: string
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <Label
            htmlFor={value}
            className="flex justify-between items-center gap-3 rounded-xl border bg-card shadow-xs p-4 transition-colors hover:bg-muted/50 cursor-pointer"
        >
            <div className="flex gap-3 items-center">
                <RadioGroupItem value={value} id={value} />

                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {description}
                    </p>
                </div>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
        </Label>
    )
}