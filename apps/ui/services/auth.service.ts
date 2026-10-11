import { apiClient } from "@/lib/api/client";

import type {
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from "../types/auth.types";

export function register(
    payload: RegisterPayload
) {
    return apiClient<RegisterResponse>(
        "/api/auth/register",
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}

export function login(payload: LoginPayload) {
    return apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    })
}