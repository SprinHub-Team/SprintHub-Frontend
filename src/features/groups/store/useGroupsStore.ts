import { create } from 'zustand';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { getMyGroups } from '../services/groupService';
import type { GroupDetails } from '../types/group.types';

export type GroupsStatus = 'idle' | 'loading' | 'success' | 'error';

interface GroupsState {
  groups: GroupDetails[];
  status: GroupsStatus;
  error: string | null;

  loadGroups: () => Promise<void>;
  upsertGroup: (group: GroupDetails) => void;
  removeGroup: (groupId: string) => void;
  resetGroups: () => void;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  status: 'idle',
  error: null,

  loadGroups: async () => {
    set({ status: 'loading', error: null });
    try {
      const groups = await getMyGroups();
      set({ groups, status: 'success' });
    } catch (error: unknown) {
      const apiError = errorHandler(error);
      set({ status: 'error', error: apiError.message });
    }
  },

  upsertGroup: (group) => {
    const current = get().groups;
    const index = current.findIndex((candidate) => candidate.id === group.id);
    if (index === -1) {
      set({ groups: [...current, group] });
      return;
    }
    const next = [...current];
    next[index] = group;
    set({ groups: next });
  },

  removeGroup: (groupId) => {
    set((state) => ({ groups: state.groups.filter((group) => group.id !== groupId) }));
  },

  resetGroups: () => {
    set({ groups: [], status: 'idle', error: null });
  },
}));
