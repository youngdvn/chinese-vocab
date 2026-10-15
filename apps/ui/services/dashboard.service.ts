import { apiClient } from "@/lib/api/client";
import type {
    DailyProgress,
    DashboardOverview,
} from "../types/dashboard.types";

export function getDashboardOverview() {
    return apiClient<DashboardOverview>("/api/v1/dashboard/overview", {
        method: "GET",
    });
}

export function getDailyProgress() {
    return apiClient<DailyProgress>("/api/v1/dashboard/daily-progress", {
        method: "GET",
    });
}
