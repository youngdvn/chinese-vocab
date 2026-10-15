const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const TOKEN_KEY = "access_token";

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = getStoredToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...headers,
            ...options?.headers,
        },
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        if (response.status === 401) {
            removeStoredToken();
        }

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

    // Auto-save token if returned in response (login/register)
    if (typeof data === "object" && data !== null) {
        const authData = data as { access_token?: string; token?: string };
        const receivedToken = authData.access_token || authData.token;
        if (receivedToken) {
            setStoredToken(receivedToken);
        }
    }

    return data as T;
}