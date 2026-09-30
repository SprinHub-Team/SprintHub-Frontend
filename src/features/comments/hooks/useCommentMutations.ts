import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { createComment, deleteComment, updateComment } from '@/services/socket/socketService';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { CreateCommentFormData } from '../schemas/commentFormSchema';

export function useCommentMutations() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const create = useCallback(
    async (cardId: string, data: CreateCommentFormData): Promise<boolean> => {
      setLoading(true);
      try {
        const comment = await createComment({
          name: data.name,
          description: data.description,
          cardId,
        });
        useActiveBoardStore.getState().addComment(comment);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo publicar el comentario');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const update = useCallback(
    async (commentId: string, data: { name?: string; description?: string }): Promise<boolean> => {
      setLoading(true);
      try {
        const comment = await updateComment({
          commentId,
          name: data.name,
          description: data.description,
        });
        useActiveBoardStore.getState().changeComment(comment);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo actualizar el comentario');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const remove = useCallback(
    async (commentId: string): Promise<boolean> => {
      setLoading(true);
      try {
        await deleteComment(commentId);
        useActiveBoardStore.getState().removeComment(commentId);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo eliminar el comentario');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { loading, create, update, remove };
}
