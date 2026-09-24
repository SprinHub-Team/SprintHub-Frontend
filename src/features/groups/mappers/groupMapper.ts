import type { GroupResponseDto } from '../types/group.dto';
import type { Group, GroupMember } from '../types/group.schema';

export function toGroupMember(dto: any): GroupMember {
    return {
        user: {
            id: dto.id || (dto.user && (dto.user.id || dto.user._id)),
            name: dto.name || (dto.user && dto.user.name),
            email: dto.email || (dto.user && dto.user.email),
        },
        role: dto.role,
    };
}

export function toGroup(dto: GroupResponseDto): Group {
    return {
        id: dto.id || (dto as any)._id,
        name: dto.name,
        description: dto.description || '',
        ownerId: dto.ownerId,
        visibility: dto.visibility,
        profilePicture: dto.profilePicture || '',
        members: dto.members ? dto.members.map(toGroupMember) : [],
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    };
}
