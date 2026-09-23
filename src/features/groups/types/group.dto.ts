export interface GroupMemberResponseDto {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    role: 'admin' | 'collaborator' | 'visitor';
    _id?: string;
}

export interface GroupResponseDto {
    _id: string;
    name: string;
    description?: string;
    ownerId: string;
    visibility: 'private' | 'public';
    profilePicture?: string;
    members?: GroupMemberResponseDto[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateGroupRequestDto {
    name: string;
    description?: string;
    visibility?: 'private' | 'public';
}

export interface UpdateGroupRequestDto {
    name?: string;
    description?: string;
    visibility?: 'private' | 'public';
}

export interface AddMemberRequestDto {
    email: string;
    role: 'admin' | 'collaborator' | 'visitor';
}
