import type { UserReference } from '@/features/auth/types/user.types';
import type { CommentDto } from '@/features/comments/types/comment.dto';

export type CardPriority = 'alta' | 'media' | 'baja';

export type CardFileDto = {
  fileName: string;
  url: string;
  path: string;
};

export type CardDto = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  dueDate: string | null;
  status: 'pendiente' | 'en_progreso' | 'completada';
  completedAt: string | null;
  subtasks: { id: string; title: string; completed: boolean }[];
  priority: CardPriority;
  files: CardFileDto[];
  assignedTo: UserReference | null;
  comments: CommentDto[];
};
