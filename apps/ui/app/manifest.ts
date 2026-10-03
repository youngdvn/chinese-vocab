import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Chinese Vocab",
        short_name: "Hanyu",
        description: "",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/icons/icon-192.svg",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.svg",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}