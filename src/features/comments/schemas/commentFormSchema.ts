import { z } from 'zod';

export const createCommentSchema = z.object({
  name: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
  description: z.string().min(2, { error: 'El comentario debe tener al menos 2 caracteres' }),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  name: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).optional(),
  description: z.string().min(2, { error: 'El comentario debe tener al menos 2 caracteres' }).optional(),
});

export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
