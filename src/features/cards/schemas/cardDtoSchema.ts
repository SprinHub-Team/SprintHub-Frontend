import { z } from 'zod';
import { userReferenceSchema } from '@/features/auth/schemas/userReferenceSchema';
import { commentDtoSchema } from '@/features/comments/schemas/commentDtoSchema';

export const cardDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  dueDate: z.string().nullable(),
  priority: z.enum(['alta', 'media', 'baja']),
  files: z.array(
    z.object({
      fileName: z.string(),
      url: z.string(),
      path: z.string(),
    }),
  ),
  assignedTo: userReferenceSchema.nullable(),
  comments: z.array(commentDtoSchema),
});
