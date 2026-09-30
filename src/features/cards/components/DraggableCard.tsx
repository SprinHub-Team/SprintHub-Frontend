import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { CardItem } from './CardItem';
import type { Card } from '../types/card.types';

export interface DraggableCardProps {
  card: Card;
  onOpen: (cardId: string) => void;
  disabled?: boolean;
}

export const KANBAN_CARD_DROPPABLE_PREFIX = 'kanban-card:';
export const KANBAN_COLUMN_DROPPABLE_PREFIX = 'kanban-column:';

export function kanbanCardDragId(cardId: string): string {
  return `${KANBAN_CARD_DROPPABLE_PREFIX}${cardId}`;
}

export function kanbanColumnDropId(columnId: string): string {
  return `${KANBAN_COLUMN_DROPPABLE_PREFIX}${columnId}`;
}

export function parseKanbanCardDragId(id: string): string | null {
  return id.startsWith(KANBAN_CARD_DROPPABLE_PREFIX)
    ? id.slice(KANBAN_CARD_DROPPABLE_PREFIX.length)
    : null;
}

export function parseKanbanColumnDropId(id: string): string | null {
  return id.startsWith(KANBAN_COLUMN_DROPPABLE_PREFIX)
    ? id.slice(KANBAN_COLUMN_DROPPABLE_PREFIX.length)
    : null;
}

export function DraggableCard({ card, onOpen, disabled = false }: DraggableCardProps) {
  const { listeners, setNodeRef, isDragging } = useDraggable({
    id: kanbanCardDragId(card.id),
    data: { cardId: card.id, columnId: card.columnId },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      data-kanban-draggable
      aria-hidden={false}
      title="Arrastra para mover de columna, o haz clic para abrir el detalle"
      className={cn(
        'transition-opacity duration-200 ease-out',
        isDragging && 'opacity-40',
        disabled && 'cursor-default',
      )}
    >
      <CardItem card={card} onOpen={onOpen} />
    </div>
  );
}
