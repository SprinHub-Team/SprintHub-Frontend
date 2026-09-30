import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
  description: z
    .string()
    .max(2000, { error: 'La descripción no puede superar 2000 caracteres' })
    .optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['alta', 'media', 'baja']).default('media'),
});

export type CreateCardFormData = z.infer<typeof createCardSchema>;

export const updateCardSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
});

export type UpdateCardFormData = z.infer<typeof updateCardSchema>;
