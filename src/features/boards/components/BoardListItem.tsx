import { KanbanSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Board } from '../types/board.types';

export interface BoardListItemProps {
  board: Board;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

export function BoardListItem({ board, selected, onSelect, onDelete, deleting }: BoardListItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-1 rounded-(--radius-sm) transition-colors duration-200 ease-out',
        selected ? 'bg-(--ink-raised)' : 'hover:bg-(--ink-raised)/60',
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? 'true' : undefined}
        className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2 text-left"
      >
        <KanbanSquare
          aria-hidden="true"
          className={cn('size-4 shrink-0', selected ? 'text-(--sand)' : 'text-(--taupe)')}
        />
        <span
          className={cn(
            'truncate text-sm',
            selected ? 'font-medium text-(--cream)' : 'text-(--text-on-dark)',
          )}
        >
          {board.title}
        </span>
      </button>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Eliminar tablero ${board.title}`}
          title="Eliminar tablero"
          className="mr-1 shrink-0 rounded-(--radius-sm) p-1.5 text-(--taupe) opacity-0 transition-[opacity,color] duration-200 ease-out group-hover:opacity-100 hover:text-(--cream) focus-visible:opacity-100 disabled:opacity-50"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
