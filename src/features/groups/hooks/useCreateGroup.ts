import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { ApiError } from '@/services/api/errors/ApiError';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { createGroupSchema, type CreateGroupFormData } from '../schemas/groupSchema';
import { createGroup } from '../services/groupService';
import { useGroupsStore } from '../store/useGroupsStore';
import type { Group } from '../types/group.types';

export type CreateGroupSubmitData = CreateGroupFormData & { file?: File | null };

export function useCreateGroup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const toast = useToast();

  const submit = useCallback(
    async (data: CreateGroupSubmitData): Promise<Group | null> => {
      const { file, ...textData } = data;
      const parsed = createGroupSchema.safeParse(textData);
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
        const group = await createGroup({ ...parsed.data, file: file ?? null });
        toast.success(`Grupo “${group.name}” creado`, 'Ya puedes añadir tableros');
        await useGroupsStore.getState().loadGroups();
        return group;
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
