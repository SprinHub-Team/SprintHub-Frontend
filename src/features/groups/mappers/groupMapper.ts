import type { GroupResponseDto, GroupMemberResponseDto } from '../types/group.dto';
import type { Group, GroupMember } from '../types/group.schema';

export function toGroupMember(dto: GroupMemberResponseDto): GroupMember {
    return {
        user: {
            id: dto.user._id,
            name: dto.user.name,
            email: dto.user.email,
        },
        role: dto.role,
    };
}

export function toGroup(dto: GroupResponseDto): Group {
    return {
        id: dto._id,
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
