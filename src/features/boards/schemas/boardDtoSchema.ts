import { z } from 'zod';
import { columnDtoSchema } from '@/features/columns/schemas/columnDtoSchema';

export const boardDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  groupId: z.string(),
});

export const boardDetailsDtoSchema = boardDtoSchema.extend({
  columns: z.array(columnDtoSchema),
});

export const boardTemplateDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  columns: z.array(
    z.object({
      title: z.string(),
      order: z.number(),
    }),
  ),
});
