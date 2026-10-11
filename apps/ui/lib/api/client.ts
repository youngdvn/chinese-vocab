const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof data === "object" &&
                data !== null &&
                "message" in data &&
                typeof data.message === "string"
                ? data.message
                : typeof data === "string" && data
                    ? data
                    : "Something went wrong";

        throw new Error(message);
    }

    return data as T;
}