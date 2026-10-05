import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <Button className="rounded-full" size={"icon"} variant={"ghost"} onClick={() => { setTheme(theme === "dark" ? "light" : "dark") }}>
            {theme === "dark" ? (<IconSun size={5} />) : (<IconMoon size={5} />)}
        </Button>
    )
}