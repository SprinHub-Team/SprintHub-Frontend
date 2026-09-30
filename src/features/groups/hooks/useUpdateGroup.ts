import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { updateGroupSchema, type UpdateGroupFormData } from '../schemas/groupSchema';
import { updateGroup as updateGroupRequest } from '../services/groupService';
import { useGroupsStore } from '../store/useGroupsStore';

export type UpdateGroupSubmitData = UpdateGroupFormData & { file?: File | null };

export function useUpdateGroup() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = useCallback(
    async (groupId: string, data: UpdateGroupSubmitData): Promise<boolean> => {
      const { file, ...textData } = data;
      const parsed = updateGroupSchema.safeParse(textData);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        toast.error(
          firstIssue?.message ?? 'Revisa los campos del formulario',
          'No se pudo actualizar el grupo',
        );
        return false;
      }

      setLoading(true);
      try {
        const group = await updateGroupRequest(groupId, {
          name: parsed.data.name,
          description: parsed.data.description,
          file: file ?? null,
        });
        useGroupsStore.getState().upsertGroup(group);
        toast.success(`Grupo “${group.name}” actualizado`);
        return true;
      } catch (caught: unknown) {
        toast.error(errorHandler(caught).message, 'No se pudo actualizar el grupo');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { loading, submit };
}
