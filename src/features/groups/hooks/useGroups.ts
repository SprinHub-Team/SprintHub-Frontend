import { useCallback, useEffect } from 'react';
import { useGroupsStore } from '../store/useGroupsStore';

export function useGroups() {
  const groups = useGroupsStore((state) => state.groups);
  const status = useGroupsStore((state) => state.status);
  const error = useGroupsStore((state) => state.error);
  const loadGroups = useGroupsStore((state) => state.loadGroups);

  useEffect(() => {
    if (status === 'idle') {
      void loadGroups();
    }
  }, [status, loadGroups]);

  const reload = useCallback(() => loadGroups(), [loadGroups]);

  return { groups, status, error, reload };
}
