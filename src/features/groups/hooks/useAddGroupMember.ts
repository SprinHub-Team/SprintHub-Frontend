import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { ApiError } from '@/services/api/errors/ApiError';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { addGroupMemberSchema, type AddGroupMemberFormData } from '../schemas/groupSchema';
import { addGroupMember } from '../services/groupService';
import { useGroupsStore } from '../store/useGroupsStore';

export function useAddGroupMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const upsertGroup = useGroupsStore((state) => state.upsertGroup);
  const toast = useToast();

  const submit = useCallback(
    async (groupId: string, data: AddGroupMemberFormData): Promise<boolean> => {
      const parsed = addGroupMemberSchema.safeParse(data);
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
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        const group = await addGroupMember(groupId, parsed.data);
        upsertGroup(group);
        toast.success('Miembro añadido al grupo', parsed.data.email);
        return true;
      } catch (caught: unknown) {
        setError(errorHandler(caught));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [upsertGroup, toast],
  );

  return { loading, error, submit };
}
