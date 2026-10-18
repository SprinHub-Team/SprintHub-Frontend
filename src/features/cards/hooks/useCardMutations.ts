import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/lib/api/errors/errorHandler';
import {
  createCard,
  deleteCard,
  updateCard,
} from '@/lib/socket/socketService';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { CardPriority } from '../types/card.dto';
import type { CreateCardFormData, UpdateCardFormData } from '../schemas/cardFormSchema';

export function useCardMutations() {
  const [loading, setLoading] = useState(false);
  const [movingCardId, setMovingCardId] = useState<string | null>(null);
  const toast = useToast();

  const create = useCallback(
    async (
      columnId: string,
      data: Omit<CreateCardFormData, 'assignedTo'> & { assignedTo?: string },
    ): Promise<boolean> => {
      setLoading(true);
      try {
        const card = await createCard({
          title: data.title,
          description: data.description ?? '',
          columnId,
          assignedTo: data.assignedTo && data.assignedTo.length > 0 ? data.assignedTo : undefined,
          priority: data.priority,
        });
        useActiveBoardStore.getState().addCard(card);
        toast.success(`Tarjeta “${card.title}” creada`);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo crear la tarjeta');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const update = useCallback(
    async (
      cardId: string,
      currentColumnId: string,
      targetColumnId: string,
      data: UpdateCardFormData,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        const card = await updateCard({
          cardId,
          title: data.title,
          description: data.description,
          columnId: targetColumnId || currentColumnId,
          assignedTo:
            data.assignedTo === undefined
              ? undefined
              : data.assignedTo.length > 0
                ? data.assignedTo
                : undefined,
          priority: data.priority,
        });
        useActiveBoardStore.getState().changeCard(card);
        toast.success('Tarjeta actualizada');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo actualizar la tarjeta');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const remove = useCallback(
    async (cardId: string): Promise<boolean> => {
      setLoading(true);
      try {
        await deleteCard(cardId);
        useActiveBoardStore.getState().removeCard(cardId);
        toast.success('Tarjeta eliminada');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo eliminar la tarjeta');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const move = useCallback(
    async (cardId: string, targetColumnId: string): Promise<boolean> => {
      const board = useActiveBoardStore.getState().board;
      if (!board) return false;
      const card = board.columns
        .flatMap((column) => column.cards)
        .find((candidate) => candidate.id === cardId);
      if (!card || card.columnId === targetColumnId) return true;

      setMovingCardId(cardId);
      try {
        const updated = await updateCard({
          cardId,
          columnId: targetColumnId,
        });
        useActiveBoardStore.getState().changeCard(updated);
        toast.success(`“${updated.title}” movida a ${
          board.columns.find((column) => column.id === targetColumnId)?.name ?? 'otra columna'
        }`);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo mover la tarjeta');
        return false;
      } finally {
        setMovingCardId(null);
      }
    },
    [toast],
  );

  return { loading, movingCardId, create, update, remove, move };
}

export type { CardPriority };
