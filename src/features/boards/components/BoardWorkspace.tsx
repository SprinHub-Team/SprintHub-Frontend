import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type CollisionDetection,
  type KeyboardCoordinateGetter,
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

const detectColumn: CollisionDetection = args =>
  args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);

const moveAcrossColumns: KeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
  if (event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') return;
  const columns = context.droppableContainers.getEnabled().flatMap(column => {
    const rect = context.droppableRects.get(column.id);
    return rect ? [{ id: column.id, rect }] : [];
  }).sort((a, b) => a.rect.left - b.rect.left);
  const origin = context.over?.id ?? `kanban-column:${context.active?.data.current?.columnId}`;
  const index = columns.findIndex(column => column.id === origin);
  const target = index >= 0 ? columns[index + (event.code === 'ArrowRight' ? 1 : -1)] : undefined;
  if (!target || !context.collisionRect) return;
  event.preventDefault();
  const { left, width, top, height } = target.rect;
  const card = context.collisionRect;
  return {
    x: currentCoordinates.x + left + width / 2 - (card.left + card.width / 2),
    y: currentCoordinates.y + top + height / 2 - (card.top + card.height / 2),
  };
};

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
  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: moveAcrossColumns });
  const sensors = useSensors(pointerSensor, keyboardSensor);

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
    <div className="flex h-full min-h-0 flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-xl font-semibold text-(--text-on-dark)">{board.title}</h2>
          {board.description ? (
            <p className="text-sm text-(--text-muted)">{board.description}</p>
          ) : null}
        </div>
        <Badge
          tone={realtimeStatus === 'connected' ? 'outline' : 'neutral'}
          icon={<Radio aria-hidden="true" className="size-3" />}
        >
          {realtimeStatus === 'connected' ? 'En vivo' : 'Sincronizando…'}
        </Badge>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={detectColumn}
        autoScroll={{
          canScroll: element => element.hasAttribute('data-board-scroll'),
          threshold: { x: 0.08, y: 0 },
          acceleration: 6,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggingCard(null)}
      >
        <div data-board-scroll className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4">
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

        {createPortal(<DragOverlay dropAnimation={{ duration: 320, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
          {draggingCard ? (
            <div className="drag-lift w-72 rotate-2 scale-[1.04]">
              <CardItem card={draggingCard} onOpen={() => undefined} />
            </div>
          ) : null}
        </DragOverlay>, document.body)}
      </DndContext>

      <CardDetailsModal
        key={openCardId}
        cardId={openCardId}
        columns={board.columns}
        members={members}
        onClose={() => setOpenCardId(null)}
        canDeleteCard={canManageCards}
      />
    </div>
  );
}
