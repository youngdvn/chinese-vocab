export interface UserSettings {
    id: number
    email: string
    name: string
    daily_goal: number
    created_at: string
    updated_at: string
}

export interface UpdateSettingsPayload {
    name?: string
    daily_goal?: number
}
