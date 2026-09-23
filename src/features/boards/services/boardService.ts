import apiClient from "@/services/api/apiClient";
import type { BoardResponseDto, CreateBoardRequestDto, UpdateBoardRequestDto } from "../types/board.dto";
import type { Board } from "../types/board.schema";
import { toBoard } from "../mappers/boardMapper";

interface ApiResponse<T> {
    data: T;
    message?: string;
}

export async function findByGroupId(groupId: string): Promise<Board[]> {
    const response = await apiClient.get<ApiResponse<BoardResponseDto[]>>(`/boards/group/${groupId}`);
    return response.data.data.map(toBoard);
}

export async function createBoard(data: CreateBoardRequestDto): Promise<Board> {
    const response = await apiClient.post<ApiResponse<BoardResponseDto>>('/boards', data);
    return toBoard(response.data.data);
}

export async function updateBoard(id: string, data: UpdateBoardRequestDto): Promise<Board> {
    const response = await apiClient.put<ApiResponse<BoardResponseDto>>(`/boards/${id}`, data);
    return toBoard(response.data.data);
}

export async function deleteBoard(id: string): Promise<void> {
    await apiClient.delete(`/boards/${id}`);
}
