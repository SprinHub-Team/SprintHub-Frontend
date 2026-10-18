import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { error: 'El nombre no puede superar 100 caracteres' }),
  description: z
    .string()
    .max(500, { error: 'La descripción no puede superar 500 caracteres' })
    .optional(),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { error: 'El nombre no puede superar 100 caracteres' })
    .optional(),
  description: z.string().optional(),
});

export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;

export const addGroupMemberSchema = z.object({
  email: z.email({ error: 'Debe ser un correo válido' }),
  role: z.enum(['admin', 'collaborator']),
});

export type AddGroupMemberFormData = z.infer<typeof addGroupMemberSchema>;
