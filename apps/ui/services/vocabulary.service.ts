import { apiClient } from "@/lib/api/client";
import type {
    CreateVocabularyPayload,
    PaginatedVocabularies,
    UpdateVocabularyPayload,
    Vocabulary,
} from "../types/vocabulary";

export interface VocabularyFilterParams {
    search?: string;
    status?: string;
    date?: string;
    page?: number;
    limit?: number;
}

export function getVocabularies(params?: VocabularyFilterParams) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);
    if (params?.date && params.date !== "all") searchParams.set("date", params.date);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/vocabularies${queryString ? `?${queryString}` : ""}`;

    return apiClient<PaginatedVocabularies>(endpoint, {
        method: "GET",
    });
}

export function getVocabularyById(id: number) {
    return apiClient<Vocabulary>(`/api/v1/vocabularies/${id}`, {
        method: "GET",
    });
}

export function createVocabulary(payload: CreateVocabularyPayload) {
    return apiClient<Vocabulary>("/api/v1/vocabularies", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateVocabulary(id: number, payload: UpdateVocabularyPayload) {
    return apiClient<Vocabulary>(`/api/v1/vocabularies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteVocabulary(id: number) {
    return apiClient<void>(`/api/v1/vocabularies/${id}`, {
        method: "DELETE",
    });
}

export function exportVocabularies() {
    return apiClient<Vocabulary[]>("/api/v1/vocabularies/export", {
        method: "GET",
    });
}
