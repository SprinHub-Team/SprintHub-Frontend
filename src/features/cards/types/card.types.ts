import type { CardDto, CardPriority } from './card.dto';

export type Card = CardDto;

export type { CardPriority, CardDto };

export type CardFile = Card['files'][number];

export const CARD_PRIORITIES: Record<CardPriority, { label: string }> = {
  alta: { label: 'Prioridad alta' },
  media: { label: 'Prioridad media' },
  baja: { label: 'Prioridad baja' },
};
