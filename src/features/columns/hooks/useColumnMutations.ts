import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { createColumn, deleteColumn, updateColumn } from '@/services/socket/socketService';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { CreateColumnFormData } from '../schemas/columnFormSchema';

export function useColumnMutations() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const create = useCallback(
    async (boardId: string, data: CreateColumnFormData): Promise<boolean> => {
      setLoading(true);
      try {
        const column = await createColumn({ name: data.name, boardId });
        useActiveBoardStore.getState().addColumn(column);
        toast.success(`Columna “${column.name}” creada`);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo crear la columna');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const rename = useCallback(
    async (columnId: string, name: string): Promise<boolean> => {
      setLoading(true);
      try {
        const column = await updateColumn({ columnId, name });
        useActiveBoardStore.getState().changeColumn(column);
        toast.success('Columna actualizada');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo actualizar la columna');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const remove = useCallback(
    async (columnId: string): Promise<boolean> => {
      setLoading(true);
      try {
        await deleteColumn(columnId);
        useActiveBoardStore.getState().removeColumn(columnId);
        toast.success('Columna eliminada');
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo eliminar la columna');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { loading, create, rename, remove };
}
