export type RegisterPayload = {
    email: string;
    name: string;
    password: string;
};

export type RegisterResponse = {
    id: number;
    email: string;
    name: string;
};

export type LoginPayload = {
    email: string
    password: string
}

export type LoginResponse = {
    id: number
    email: string
    name: string
}

export type UserResponse = {
    id: number
    email: string
    name: string
    created_at?: string
}