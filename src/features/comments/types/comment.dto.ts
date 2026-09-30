import type { UserReference } from '@/features/auth/types/user.types';

export type CommentDto = {
  id: string;
  name: string;
  description: string;
  cardId: string;
  createdAt: string;
  createdBy: UserReference;
};
