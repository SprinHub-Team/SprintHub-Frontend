import apiClient from "@/services/api/apiClient";
import type { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from "../types/auth.dto";
import type { AuthSession, User } from "../types/auth.schema";
import { toUser } from "../mappers/userMapper";


export async function login(data: LoginRequestDto): Promise<AuthSession>{
    
    const response = await apiClient.post<LoginResponseDto>('/auth/login', data);

    return {
        token: response.data.token,
        user: toUser(response.data.user)
    };

}

export async function register(data: RegisterRequestDto): Promise<void>{
    await apiClient.post('/auth/register', data);
}

export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me');

    return toUser(response.data);
}