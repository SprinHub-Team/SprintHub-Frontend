import { GripVertical } from 'lucide-react';
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
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id: kanbanCardDragId(card.id),
    data: { cardId: card.id, columnId: card.columnId },
    disabled,
  });
  const { onPointerDown, ...keyboardListeners } = listeners ?? {};

  return (
    <div
      ref={setNodeRef}
      onPointerDown={event => onPointerDown?.(event)}
      data-kanban-draggable
      title="Arrastra para mover de columna, o haz clic para abrir el detalle"
      className={cn(
        'group relative card-arrival transition-opacity duration-200 ease-out',
        isDragging && 'opacity-40',
        disabled && 'cursor-default',
      )}
    >
      <button ref={setActivatorNodeRef} {...attributes} {...keyboardListeners} disabled={disabled}
        type="button" aria-label={`Mover tarjeta ${card.title}`}
        className="absolute top-2.5 left-1 z-10 cursor-grab rounded p-1 text-(--taupe) hover:bg-(--ink-hover) hover:text-(--cream) active:cursor-grabbing">
        <GripVertical className="size-4" />
      </button>
      <CardItem card={card} onOpen={onOpen} className="cursor-grab pl-8 active:cursor-grabbing" />
    </div>
  );
}
