import { z } from 'zod';

export const createColumnSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(150, { error: 'El nombre no puede superar 150 caracteres' }),
});

export type CreateColumnFormData = z.infer<typeof createColumnSchema>;

export const updateColumnSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(150, { error: 'El nombre no puede superar 150 caracteres' }),
});

export type UpdateColumnFormData = z.infer<typeof updateColumnSchema>;
