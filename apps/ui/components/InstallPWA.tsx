"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
    }>;
}

export default function InstallPWA() {
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);

    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();

            console.log("✅ beforeinstallprompt fired");

            setInstallPrompt(
                event as BeforeInstallPromptEvent
            );
        };

        const handleAppInstalled = () => {
            console.log("✅ App installed");

            setIsInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        window.addEventListener(
            "appinstalled",
            handleAppInstalled
        );

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );

            window.removeEventListener(
                "appinstalled",
                handleAppInstalled
            );
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) {
            console.log("❌ Install prompt not available");
            return;
        }

        await installPrompt.prompt();

        const { outcome } = await installPrompt.userChoice;

        console.log("Install result:", outcome);

        setInstallPrompt(null);
    };

    if (isInstalled) {
        return (
            <p className="text-sm text-green-600">
                App đã được cài đặt
            </p>
        );
    }

    return (
        <button
            onClick={handleInstall}
            disabled={!installPrompt}
            className="rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
            {installPrompt ? "Install App" : "Preparing..."}
        </button>
    );
}