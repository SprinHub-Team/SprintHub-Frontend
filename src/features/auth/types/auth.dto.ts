export interface LoginRequestDto{
    email: string;
    password: string;
}

export interface RegisterRequestDto{
    name: string;
    email: string;
    documentId: string;
    password: string;
}

export interface LoginUserDto{
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponseDto{
    message: string;
    token: string;
    user: LoginUserDto
}