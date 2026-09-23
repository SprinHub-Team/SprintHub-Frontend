import apiClient from "@/services/api/apiClient";
import type { User } from "../types/auth.schema";
import { toUser } from "../mappers/userMapper";

export interface UpdateUserRequestDto {
    name?: string;
    email?: string;
    documentId?: string;
}

export async function updateUser(id: string, data: UpdateUserRequestDto): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, data);
    return toUser(response.data);
}
