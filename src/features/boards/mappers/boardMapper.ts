import type { BoardResponseDto } from '../types/board.dto';
import type { Board } from '../types/board.schema';

export function toBoard(dto: BoardResponseDto): Board {
    return {
        id: dto.id || (dto as any)._id,
        title: dto.title,
        description: dto.description || '',
        groupId: dto.groupId,
        ownerId: dto.ownerId,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    };
}
