import { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Radio } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { CardDetailsModal } from '@/features/cards/components/CardDetailsModal';
import { CardItem } from '@/features/cards/components/CardItem';
import {
  parseKanbanCardDragId,
  parseKanbanColumnDropId,
} from '@/features/cards/components/DraggableCard';
import { useCardMutations } from '@/features/cards/hooks/useCardMutations';
import { BoardColumn } from '@/features/columns/components/BoardColumn';
import { CreateColumnForm } from '@/features/columns/components/CreateColumnForm';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import { useActiveBoard, useRealtimeStatus } from '../hooks/useActiveBoard';
import type { Card } from '@/features/cards/types/card.types';
import styles from './BoardWorkspace.module.css';

export interface BoardWorkspaceProps {
  boardId: string;
  members: GroupMemberDto[];
  canManageCards?: boolean;
}

export function BoardWorkspace({ boardId, members, canManageCards = false }: BoardWorkspaceProps) {
  const { board, status, error } = useActiveBoard(boardId);
  const realtimeStatus = useRealtimeStatus();
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);
  const { movingCardId, move } = useCardMutations();

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 6 },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const cardId = parseKanbanCardDragId(String(event.active.id));
      if (!cardId || !board) {
        setDraggingCard(null);
        return;
      }
      const card = board.columns
        .flatMap((column) => column.cards)
        .find((candidate) => candidate.id === cardId) ?? null;
      setDraggingCard(card);
    },
    [board],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const cardId = parseKanbanCardDragId(String(event.active.id));
      const targetColumnId = event.over ? parseKanbanColumnDropId(String(event.over.id)) : null;
      setDraggingCard(null);
      if (!cardId || !targetColumnId) return;
      void move(cardId, targetColumnId);
    },
    [move],
  );

  if (status === 'loading') {
    return <LoadingState message="Cargando tablero…" />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="No se pudo abrir el tablero"
        message={error ?? 'Ocurrió un error al sincronizar con el servidor.'}
      />
    );
  }

  if (!board) {
    return null;
  }

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>{board.title}</h2>
          {board.description ? (
            <p className={styles.description}>{board.description}</p>
          ) : null}
        </div>
        <Badge
          tone={realtimeStatus === 'connected' ? 'outline' : 'neutral'}
          icon={<Radio aria-hidden="true" className={styles.badgeIcon} />}
        >
          {realtimeStatus === 'connected' ? 'En vivo' : 'Sincronizando…'}
        </Badge>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggingCard(null)}
      >
        <div className={styles.columns}>
          {board.columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              members={members}
              onOpenCard={(cardId) => setOpenCardId(cardId)}
              draggingCardId={draggingCard?.id ?? null}
              disabled={movingCardId !== null}
            />
          ))}
          <CreateColumnForm boardId={board.id} />
        </div>

        <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {draggingCard ? (
            <div className={styles.dragOverlay}>
              <CardItem card={draggingCard} onOpen={() => undefined} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailsModal
        cardId={openCardId}
        columns={board.columns}
        members={members}
        onClose={() => setOpenCardId(null)}
        canDeleteCard={canManageCards}
      />
    </div>
  );
}
