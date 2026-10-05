"use client";

import { IconBrightness, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label";


export default function SettingTheme() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col gap-4 p-4">
            <div>
                <h2 className="text-2xl font-bold">Theme</h2>
                <p className="text-sm text-muted-foreground">
                    Choose how the application looks.
                </p>
            </div>

            <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
                <ThemeOption
                    value="light"
                    icon={<IconSun className="size-5" />}
                    title="Light"
                    description="Light theme"
                />

                <ThemeOption
                    value="dark"
                    icon={<IconMoon className="size-5" />}
                    title="Dark"
                    description="Dark theme"
                />

                <ThemeOption
                    value="system"
                    icon={<IconBrightness className="size-5" />}
                    title="System"
                    description="Use system theme"
                />
            </RadioGroup>
        </div>
    );
}

function ThemeOption({
    value,
    icon,
    title,
    description,
}: {
    value: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Label
            htmlFor={value}
            className="flex justify-between items-center gap-3 rounded-xl border shadow-sm p-4 transition-colors hover:bg-accent"
        >
            <div className="flex gap-2 items-center">
                <RadioGroupItem value={value} id={value} />

                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex size-9 items-center justify-center">
                {icon}
            </div>
        </Label>
    );
}