import { env } from "process";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("🚀 ~ env.NEXT_PUBLIC_API_URL:", env.NEXT_PUBLIC_API_URL)

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        }
    );

    if (!response.ok) {
        const message = await response.text();

        throw new Error(
            message || "Something went wrong"
        );
    }

    return response.json();
}