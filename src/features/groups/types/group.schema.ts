import { z } from 'zod';

export const groupMemberSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    profilePicture: z.string().optional(),
  }),
  role: z.enum(['admin', 'collaborator', 'visitor']),
});

export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  ownerId: z.string(),
  visibility: z.enum(['private', 'public']),
  profilePicture: z.string().optional(),
  members: z.array(groupMemberSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createGroupSchema = z.object({
  name: z.string().min(1, 'El nombre del grupo es obligatorio').max(50, 'El nombre no puede superar 50 caracteres'),
  description: z.string().max(200, 'La descripción no puede superar 200 caracteres').optional(),
  visibility: z.enum(['private', 'public']).default('private'),
});

export type GroupMember = z.infer<typeof groupMemberSchema>;
export type Group = z.infer<typeof groupSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
