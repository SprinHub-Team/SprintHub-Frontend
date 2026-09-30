import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { deleteGroup, removeGroupMember } from '../services/groupService';
import { useGroupsStore } from '../store/useGroupsStore';

export function useDeleteGroup() {
  const [loading, setLoading] = useState(false);
  const removeGroup = useGroupsStore((state) => state.removeGroup);
  const toast = useToast();

  const submit = useCallback(
    async (groupId: string): Promise<boolean> => {
      setLoading(true);
      try {
        await deleteGroup(groupId);
        removeGroup(groupId);
        toast.success('Grupo eliminado exitosamente');
        return true;
      } catch (caught: unknown) {
        const apiError = errorHandler(caught);
        toast.error(apiError.message, 'No se pudo eliminar el grupo');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [removeGroup, toast],
  );

  return { loading, submit };
}

export function useRemoveGroupMember() {
  const [loading, setLoading] = useState(false);
  const upsertGroup = useGroupsStore((state) => state.upsertGroup);
  const toast = useToast();

  const submit = useCallback(
    async (groupId: string, userId: string): Promise<boolean> => {
      setLoading(true);
      try {
        const group = await removeGroupMember(groupId, userId);
        upsertGroup(group);
        toast.success('Miembro retirado del grupo');
        return true;
      } catch (caught: unknown) {
        const apiError = errorHandler(caught);
        toast.error(apiError.message, 'No se pudo retirar el miembro');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [upsertGroup, toast],
  );

  return { loading, submit };
}
