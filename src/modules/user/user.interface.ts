export interface RegisterUserPayload {
    email: string;
    name: string;
    password: string;
    profile_photo: string;
}

export type TResponsData <T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta ?: TMeta
}

export type TMeta = {
    page: number;
    limit: number;
}