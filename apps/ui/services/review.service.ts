import { apiClient } from "@/lib/api/client";
import type {
    PracticeResponse,
    SubmitReviewPayload,
    SubmitReviewResponse,
} from "../types/review.types";

export function getPracticeCards(limit: number = 20) {
    return apiClient<PracticeResponse>(`/api/v1/reviews/practice?limit=${limit}`, {
        method: "GET",
    });
}

export function submitReview(payload: SubmitReviewPayload) {
    return apiClient<SubmitReviewResponse>("/api/v1/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
