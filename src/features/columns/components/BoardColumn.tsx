import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateCardModal } from '@/features/cards/components/CreateCardModal';
import { DraggableCard, kanbanColumnDropId } from '@/features/cards/components/DraggableCard';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import { useColumnMutations } from '../hooks/useColumnMutations';
import type { BoardColumn as BoardColumnType } from '../types/column.types';
import styles from './BoardColumn.module.css';

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
        styles.column,
        isDropTarget ? styles.columnDropTarget : styles.columnIdle,
      )}
    >
      <header className={styles.header}>
        {renaming ? (
          <div className={styles.rename}>
            <input
              ref={nameInputRef}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={handleRenameKeys}
              disabled={loading}
              aria-label="Nuevo nombre de la columna"
              className={styles.renameInput}
            />
            <button
              type="button"
              onClick={() => void commitRename()}
              disabled={loading}
              aria-label="Guardar nombre"
              className={styles.renameConfirm}
            >
              <Check aria-hidden="true" className="icon-md" />
            </button>
            <button
              type="button"
              onClick={() => setRenaming(false)}
              aria-label="Cancelar"
              className={styles.renameCancel}
            >
              <X aria-hidden="true" className="icon-md" />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onDoubleClick={startRenaming}
              title="Doble clic para renombrar"
              className={styles.nameButton}
            >
              {column.name}
            </button>
            <span className={styles.count}>
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
              className={cn(
                styles.deleteButton,
                confirmingDelete ? styles.deleteConfirming : undefined,
              )}
            >
              <Trash2 aria-hidden="true" className={styles.deleteIcon} />
            </button>
          </>
        )}
      </header>

      <div
        ref={setNodeRef}
        className={styles.dropZone}
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
              styles.empty,
              isDropTarget ? styles.emptyDropTarget : styles.emptyIdle,
            )}
          >
            {isDropTarget ? 'Suelta aquí para mover la tarjeta' : 'Sin tarjetas por ahora'}
          </p>
        ) : null}
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          onClick={() => setCreatingCard(true)}
          disabled={disabled}
          className={styles.addCardButton}
        >
          <Plus aria-hidden="true" className="icon-md" />
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
