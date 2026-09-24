import apiClient from "@/services/api/apiClient";
import type { GroupResponseDto, CreateGroupRequestDto, UpdateGroupRequestDto, AddMemberRequestDto } from "../types/group.dto";
import type { Group } from "../types/group.schema";
import { toGroup } from "../mappers/groupMapper";

interface ApiResponse<T> {
    data: T;
    message?: string;
}

export async function getMyGroups(): Promise<Group[]> {
    const response = await apiClient.get<ApiResponse<GroupResponseDto[]>>('/groups');
    return response.data.data.map(toGroup);
}

export async function getGroupById(id: string): Promise<Group> {
    const response = await apiClient.get<ApiResponse<GroupResponseDto>>(`/groups/${id}`);
    return toGroup(response.data.data);
}

export async function createGroup(data: CreateGroupRequestDto): Promise<Group> {
    const response = await apiClient.post<ApiResponse<GroupResponseDto>>('/groups', data);
    return toGroup(response.data.data);
}

export async function updateGroup(id: string, data: UpdateGroupRequestDto): Promise<Group> {
    const response = await apiClient.put<ApiResponse<GroupResponseDto>>(`/groups/${id}`, data);
    return toGroup(response.data.data);
}

export async function deleteGroup(id: string): Promise<void> {
    await apiClient.delete(`/groups/${id}`);
}

export async function addMember(groupId: string, data: AddMemberRequestDto): Promise<Group> {
    const response = await apiClient.post<ApiResponse<GroupResponseDto>>(`/groups/${groupId}/members`, data);
    return toGroup(response.data.data);
}

export async function uploadGroupPicture(groupId: string, file: File): Promise<Group> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<GroupResponseDto>>(`/groups/${groupId}/profile-picture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return toGroup(response.data.data);
}
