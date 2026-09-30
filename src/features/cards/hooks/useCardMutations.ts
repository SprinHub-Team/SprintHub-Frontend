import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import {
  addCardFile as addCardFileRequest,
  createCard,
  deleteCard,
  removeCardFile as removeCardFileRequest,
  updateCard,
} from '@/services/socket/socketService';
import { fileToUint8Array } from '@/services/uploads/fileBinary';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { CardPriority } from '../types/card.dto';
import type { CreateCardFormData, UpdateCardFormData } from '../schemas/cardFormSchema';

export function useCardMutations() {
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
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

  const addFile = useCallback(
    async (cardId: string, file: File): Promise<boolean> => {
      setUploadingFile(true);
      try {
        const buffer = await fileToUint8Array(file);
        const card = await addCardFileRequest({
          cardId,
          fileData: { fileName: file.name, buffer },
        });
        useActiveBoardStore.getState().changeCard(card);
        toast.success(`Archivo “${file.name}” adjuntado`);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo adjuntar el archivo');
        return false;
      } finally {
        setUploadingFile(false);
      }
    },
    [toast],
  );

  const removeFile = useCallback(
    async (cardId: string, filePath: string): Promise<boolean> => {
      setLoading(true);
      try {
        const card = await removeCardFileRequest({ cardId, filePath });
        useActiveBoardStore.getState().changeCard(card);
        toast.success('Archivo retirado');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo retirar el archivo');
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

  return { loading, uploadingFile, movingCardId, create, update, remove, addFile, removeFile, move };
}

export type { CardPriority };
