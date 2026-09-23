import { create } from "zustand";
import type { Group } from "../types/group.schema";

interface GroupState {
    groups: Group[];
    activeGroup: Group | null;
    isLoading: boolean;
    
    setGroups: (groups: Group[]) => void;
    setActiveGroup: (group: Group | null) => void;
    addGroup: (group: Group) => void;
    updateGroupInStore: (group: Group) => void;
    removeGroup: (groupId: string) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
    groups: [],
    activeGroup: null,
    isLoading: false,

    setGroups: (groups) => set({ groups }),
    setActiveGroup: (group) => set({ activeGroup: group }),
    addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
    updateGroupInStore: (updatedGroup) => set((state) => ({
        groups: state.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g),
        activeGroup: state.activeGroup?.id === updatedGroup.id ? updatedGroup : state.activeGroup
    })),
    removeGroup: (groupId) => set((state) => ({
        groups: state.groups.filter(g => g.id !== groupId),
        activeGroup: state.activeGroup?.id === groupId ? null : state.activeGroup
    })),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
