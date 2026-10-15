import { apiClient } from "@/lib/api/client";
import type { UpdateSettingsPayload, UserSettings } from "../types/user.types";

export function getUserSettings() {
    return apiClient<UserSettings>("/api/v1/users/settings", {
        method: "GET",
    });
}

export function updateUserSettings(payload: UpdateSettingsPayload) {
    return apiClient<UserSettings>("/api/v1/users/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
