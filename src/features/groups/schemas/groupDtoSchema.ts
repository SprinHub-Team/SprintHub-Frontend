import { z } from 'zod';

export const groupDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  profilePicture: z.string(),
});

export const groupDetailsDtoSchema = groupDtoSchema.extend({
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.enum(['admin', 'collaborator']),
    }),
  ),
});

export const groupDetailsDtoListSchema = z.array(groupDetailsDtoSchema);
