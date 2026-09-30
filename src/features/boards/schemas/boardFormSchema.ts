import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(2, { error: 'El título debe tener al menos 2 caracteres' })
    .max(150, { error: 'El título no puede superar 150 caracteres' }),
  description: z
    .string()
    .max(500, { error: 'La descripción no puede superar 500 caracteres' })
    .optional(),
  templateId: z.string().optional(),
});

export type CreateBoardFormData = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  title: z
    .string()
    .min(2, { error: 'El título debe tener al menos 2 caracteres' })
    .max(150, { error: 'El título no puede superar 150 caracteres' })
    .optional(),
  description: z.string().optional(),
});

export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>;
