import { apiClient } from "@/lib/api/client";

import type {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
    UserResponse,
} from "../types/auth.types";

export function register(payload: RegisterPayload) {
    return apiClient<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function login(payload: LoginPayload) {
    return apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function logout() {
    return apiClient<{ message: string }>("/api/auth/logout", {
        method: "POST",
    });
}

export function getMe() {
    return apiClient<UserResponse>("/api/auth/me", {
        method: "GET",
    });
}