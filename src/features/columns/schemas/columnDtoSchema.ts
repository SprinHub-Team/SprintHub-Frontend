import { z } from 'zod';
import { cardDtoSchema } from '@/features/cards/schemas/cardDtoSchema';

export const columnDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  boardId: z.string(),
  cards: z.array(cardDtoSchema),
});
