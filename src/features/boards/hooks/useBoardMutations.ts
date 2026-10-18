import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { ApiError } from '@/lib/api/errors/ApiError';
import { errorHandler } from '@/lib/api/errors/errorHandler';
import { createBoardSchema, type CreateBoardFormData } from '../schemas/boardFormSchema';
import { createBoard, deleteBoard } from '../services/boardService';
import type { BoardDetails } from '../types/board.types';

export function useCreateBoard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const toast = useToast();

  const submit = useCallback(
    async (
      groupId: string,
      data: CreateBoardFormData,
    ): Promise<BoardDetails | null> => {
      const parsed = createBoardSchema.safeParse(data);
      if (!parsed.success) {
        setError(
          new ApiError({
            message: 'Revisa los campos del formulario',
            code: 'validation',
            issues: parsed.error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          }),
        );
        return null;
      }

      setLoading(true);
      setError(null);
      try {
        const board = await createBoard({ ...parsed.data, groupId });
        toast.success(`Tablero “${board.title}” creado`, 'Columnas iniciales listas');
        return board;
      } catch (caught: unknown) {
        setError(errorHandler(caught));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { loading, error, submit };
}

export function useDeleteBoard() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = useCallback(
    async (boardId: string): Promise<boolean> => {
      setLoading(true);
      try {
        await deleteBoard(boardId);
        toast.success('Tablero eliminado exitosamente');
        return true;
      } catch (caught: unknown) {
        const apiError = errorHandler(caught);
        toast.error(apiError.message, 'No se pudo eliminar el tablero');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { loading, submit };
}
