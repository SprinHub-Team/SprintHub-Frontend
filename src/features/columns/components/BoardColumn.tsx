import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateCardModal } from '@/features/cards/components/CreateCardModal';
import { DraggableCard, kanbanColumnDropId } from '@/features/cards/components/DraggableCard';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import { useColumnMutations } from '../hooks/useColumnMutations';
import type { BoardColumn as BoardColumnType } from '../types/column.types';

export interface BoardColumnProps {
  column: BoardColumnType;
  members: GroupMemberDto[];
  onOpenCard: (cardId: string) => void;
  draggingCardId?: string | null;
  disabled?: boolean;
}

export function BoardColumn({
  column,
  members,
  onOpenCard,
  draggingCardId,
  disabled = false,
}: BoardColumnProps) {
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(column.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [creatingCard, setCreatingCard] = useState(false);
  const { loading, rename, remove } = useColumnMutations();
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: kanbanColumnDropId(column.id),
    data: { columnId: column.id },
    disabled,
  });

  const isDropTarget = isOver && draggingCardId !== null && draggingCardId !== undefined;

  const startRenaming = () => {
    setDraftName(column.name);
    setRenaming(true);
  };

  useEffect(() => {
    if (renaming) {
      nameInputRef.current?.focus();
    }
  }, [renaming]);

  useEffect(() => {
    if (!confirmingDelete) return undefined;
    const timer = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  const commitRename = async () => {
    const trimmed = draftName.trim();
    if (trimmed.length < 2 || trimmed === column.name) {
      setRenaming(false);
      return;
    }
    const succeeded = await rename(column.id, trimmed);
    if (succeeded) {
      setRenaming(false);
    }
  };

  const handleRenameKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void commitRename();
    }
    if (event.key === 'Escape') {
      setRenaming(false);
    }
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    void remove(column.id);
  };

  return (
    <section
      aria-label={`Columna ${column.name}`}
      className={cn(
        'flex h-fit max-h-full w-72 shrink-0 flex-col rounded-(--radius) border bg-(--ink-raised)',
        'transition-[border-color,background-color,box-shadow] duration-200 ease-out',
        isDropTarget
          ? 'border-(--drop-target-border) bg-(--drop-target-bg) shadow-(--shadow-cream)'
          : 'border-(--border-subtle)',
      )}
    >
      <header className="flex items-center gap-2 border-b border-(--border-subtle) px-3.5 py-3">
        {renaming ? (
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <input
              ref={nameInputRef}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={handleRenameKeys}
              disabled={loading}
              aria-label="Nuevo nombre de la columna"
              className="h-8 min-w-0 flex-1 rounded-(--radius-sm) border border-(--sand) bg-(--ink-soft) px-2.5 text-sm text-(--text-on-dark) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--sand)"
            />
            <button
              type="button"
              onClick={() => void commitRename()}
              disabled={loading}
              aria-label="Guardar nombre"
              className="rounded-(--radius-sm) p-1.5 text-(--sand) transition-colors duration-200 ease-out hover:bg-(--ink-soft)"
            >
              <Check aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setRenaming(false)}
              aria-label="Cancelar"
              className="rounded-(--radius-sm) p-1.5 text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-soft)"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onDoubleClick={startRenaming}
              title="Doble clic para renombrar"
              className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-(--cream)"
            >
              {column.name}
            </button>
            <span className="shrink-0 rounded-full border border-(--border-subtle) px-2 py-0.5 text-xs text-(--text-muted)">
              {column.cards.length}
              <span className="sr-only"> tarjetas</span>
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              aria-label={
                confirmingDelete ? `Confirmar eliminación de ${column.name}` : `Eliminar columna ${column.name}`
              }
              title={confirmingDelete ? 'Haz clic de nuevo para confirmar' : 'Eliminar columna'}
              className={`shrink-0 rounded-(--radius-sm) p-1.5 transition-colors duration-200 ease-out disabled:opacity-50 ${
                confirmingDelete
                  ? 'bg-(--brown) text-(--paper)'
                  : 'text-(--taupe) hover:text-(--cream)'
              }`}
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
            </button>
          </>
        )}
      </header>

      <div
        ref={setNodeRef}
        className="flex max-h-[calc(100vh-19rem)] min-h-16 flex-col gap-2.5 overflow-y-auto p-3"
        aria-label={`Zona de destino de ${column.name}`}
      >
        {column.cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            onOpen={onOpenCard}
            disabled={disabled}
          />
        ))}
        {column.cards.length === 0 ? (
          <p
            className={cn(
              'rounded-(--radius-sm) border border-dashed px-3 py-4 text-center text-xs',
              isDropTarget
                ? 'border-(--drop-target-border) text-(--cream)'
                : 'border-(--border-subtle) text-(--text-muted)',
            )}
          >
            {isDropTarget ? 'Suelta aquí para mover la tarjeta' : 'Sin tarjetas por ahora'}
          </p>
        ) : null}
      </div>

      <footer className="border-t border-(--border-subtle) p-2.5">
        <button
          type="button"
          onClick={() => setCreatingCard(true)}
          disabled={disabled}
          className="flex h-9 w-full items-center gap-2 rounded-(--radius-sm) px-3 text-sm text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-soft) hover:text-(--cream) disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="size-4" />
          Añadir tarjeta
        </button>
      </footer>

      <CreateCardModal
        open={creatingCard}
        onClose={() => setCreatingCard(false)}
        columnId={column.id}
        columnName={column.name}
        members={members}
      />
    </section>
  );
}
