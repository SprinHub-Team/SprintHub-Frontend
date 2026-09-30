import { ArrowDown, ArrowUp, Minus, MessageSquare, Paperclip, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import type { Card, CardPriority } from '../types/card.types';

const PRIORITY_META: Record<CardPriority, { label: string; icon: typeof ArrowUp }> = {
  alta: { label: 'Alta', icon: ArrowUp },
  media: { label: 'Media', icon: Minus },
  baja: { label: 'Baja', icon: ArrowDown },
};

export interface CardItemProps {
  card: Card;
  onOpen: (cardId: string) => void;
}

export function CardItem({ card, onOpen }: CardItemProps) {
  const priority = PRIORITY_META[card.priority];
  const PriorityIcon = priority.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(card.id)}
      className="flex w-full flex-col gap-3 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-raised) p-3.5 text-left shadow-(--shadow-soft) transition-[border-color,box-shadow] duration-200 ease-out hover:border-(--border-dark) hover:shadow-(--shadow)"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug text-(--text-on-dark)">
          {card.title}
        </span>
        <Badge
          tone={card.priority === 'alta' ? 'outline' : card.priority === 'media' ? 'neutral' : 'muted'}
          icon={<PriorityIcon aria-hidden="true" className="size-3" />}
        >
          {priority.label}
        </Badge>
      </div>

      {card.description ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-(--text-muted)">
          {card.description}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-2 text-xs text-(--text-muted)">
        <span className="flex items-center gap-1.5">
          <span className="flex items-center gap-1">
            <MessageSquare aria-hidden="true" className="size-3.5" />
            {card.comments.length}
            <span className="sr-only">
              {card.comments.length === 1 ? 'comentario' : 'comentarios'}
            </span>
          </span>
          {card.files.length > 0 ? (
            <span className="flex items-center gap-1 border-l border-(--border-subtle) pl-1.5">
              <Paperclip aria-hidden="true" className="size-3" />
              {card.files.length}
              <span className="sr-only">
                {card.files.length === 1 ? 'archivo adjunto' : 'archivos adjuntos'}
              </span>
            </span>
          ) : null}
        </span>
        {card.assignedTo ? (
          <span className="flex items-center gap-1.5 text-(--cream)">
            <span
              aria-hidden="true"
              className="flex size-5 items-center justify-center rounded-full border border-(--border-light) bg-(image:--gradient-main) text-[10px] font-bold text-(--brown)"
            >
              {initials(card.assignedTo.name)}
            </span>
            <span className="sr-only">Asignada a {card.assignedTo.name}</span>
            <span aria-hidden="true" className="max-w-28 truncate">
              {card.assignedTo.name}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <UserRound aria-hidden="true" className="size-3.5 text-(--taupe)" />
            <span className="sr-only">Sin responsable asignado</span>
          </span>
        )}
      </div>
    </button>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
