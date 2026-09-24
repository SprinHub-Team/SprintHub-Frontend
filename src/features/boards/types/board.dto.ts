export interface BoardResponseDto {
    id: string;
    title: string;
    description?: string;
    groupId: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBoardRequestDto {
    title: string;
    description?: string;
    groupId: string;
}

export interface UpdateBoardRequestDto {
    title?: string;
    description?: string;
}
