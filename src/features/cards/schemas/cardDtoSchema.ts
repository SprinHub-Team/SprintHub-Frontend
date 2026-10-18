import { z } from 'zod';
import { userReferenceSchema } from '@/features/auth/schemas/userReferenceSchema';

export const cardDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  dueDate: z.string().nullable(),
  priority: z.enum(['alta', 'media', 'baja']),
  assignedTo: userReferenceSchema.nullable(),
});
