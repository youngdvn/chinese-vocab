import { apiClient } from "@/lib/api/client";

import type {
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