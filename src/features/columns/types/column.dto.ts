import type { CardDto } from '@/features/cards/types/card.dto';

export type ColumnDto = {
  id: string;
  name: string;
  boardId: string;
  cards: CardDto[];
};
