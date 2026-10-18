import type { UserReference } from '@/features/auth/types/user.types';

export type CardPriority = 'alta' | 'media' | 'baja';

export type CardDto = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  dueDate: string | null;
  priority: CardPriority;
  assignedTo: UserReference | null;
};
