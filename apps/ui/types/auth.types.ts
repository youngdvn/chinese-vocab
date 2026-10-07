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