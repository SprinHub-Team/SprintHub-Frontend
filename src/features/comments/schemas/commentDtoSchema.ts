import { z } from 'zod';
import { userReferenceSchema } from '@/features/auth/schemas/userReferenceSchema';

export const commentDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  cardId: z.string(),
  createdAt: z.string(),
  createdBy: userReferenceSchema,
});
