import { z } from 'zod';

export const projectDocumentDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
  groupId: z.string(),
  uploadedBy: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectDocumentDtoListSchema = z.array(projectDocumentDtoSchema);

export type ProjectDocumentDtoInput = z.infer<typeof projectDocumentDtoSchema>;
