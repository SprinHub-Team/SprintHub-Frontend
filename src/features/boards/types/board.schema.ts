import { z } from 'zod';

export const boardSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  groupId: z.string(),
  ownerId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createBoardSchema = z.object({
  title: z.string().min(1, 'El título del tablero es obligatorio').max(100, 'El título no puede superar 100 caracteres'),
  description: z.string().max(250, 'La descripción no puede superar 250 caracteres').optional(),
  groupId: z.string().min(1, 'El ID del grupo es obligatorio'),
});

export type Board = z.infer<typeof boardSchema>;
export type CreateBoardFormData = z.infer<typeof createBoardSchema>;
