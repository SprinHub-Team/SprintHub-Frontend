import { KanbanSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Board } from '../types/board.types';
import styles from './BoardListItem.module.css';

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
        styles.item,
        selected ? styles.itemSelected : styles.itemIdle,
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? 'true' : undefined}
        className={styles.selectButton}
      >
        <KanbanSquare
          aria-hidden="true"
          className={cn('icon-md', styles.boardIcon, selected ? styles.iconSelected : styles.iconIdle)}
        />
        <span
          className={cn(
            styles.boardTitle,
            selected ? styles.titleSelected : styles.titleIdle,
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
          className={styles.deleteButton}
        >
          <Trash2 aria-hidden="true" className={styles.deleteIcon} />
        </button>
      ) : null}
    </div>
  );
}
