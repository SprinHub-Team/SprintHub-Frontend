import { create } from 'zustand';

interface DashboardState {
  selectedGroupId: string | null;
  selectedBoardId: string | null;
  expandedGroupIds: string[];
  mobileSidebarOpen: boolean;
  createGroupModalOpen: boolean;

  selectGroup: (groupId: string) => void;
  selectBoard: (groupId: string, boardId: string) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCreateGroupModalOpen: (open: boolean) => void;
  clearBoard: () => void;
  removeGroup: (groupId: string) => void;
  resetDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedGroupId: null,
  selectedBoardId: null,
  expandedGroupIds: [],
  mobileSidebarOpen: false,
  createGroupModalOpen: false,

  selectGroup: (groupId) =>
    set((state) => ({
      selectedGroupId: groupId,
      expandedGroupIds: state.expandedGroupIds.includes(groupId)
        ? state.expandedGroupIds
        : [...state.expandedGroupIds, groupId],
    })),

  selectBoard: (groupId, boardId) =>
    set((state) => ({
      selectedGroupId: groupId,
      selectedBoardId: boardId,
      expandedGroupIds: state.expandedGroupIds.includes(groupId)
        ? state.expandedGroupIds
        : [...state.expandedGroupIds, groupId],
      mobileSidebarOpen: false,
    })),

  toggleGroup: (groupId) =>
    set((state) => ({
      expandedGroupIds: state.expandedGroupIds.includes(groupId)
        ? state.expandedGroupIds.filter((id) => id !== groupId)
        : [...state.expandedGroupIds, groupId],
    })),

  expandGroup: (groupId) =>
    set((state) => ({
      expandedGroupIds: state.expandedGroupIds.includes(groupId)
        ? state.expandedGroupIds
        : [...state.expandedGroupIds, groupId],
    })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setCreateGroupModalOpen: (open) => set({ createGroupModalOpen: open }),

  clearBoard: () => set({ selectedBoardId: null }),

  removeGroup: (groupId) =>
    set((state) => ({
      expandedGroupIds: state.expandedGroupIds.filter((id) => id !== groupId),
      selectedGroupId: state.selectedGroupId === groupId ? null : state.selectedGroupId,
      selectedBoardId:
        state.selectedGroupId === groupId ? null : state.selectedBoardId,
    })),

  resetDashboard: () =>
    set({
      selectedGroupId: null,
      selectedBoardId: null,
      expandedGroupIds: [],
      mobileSidebarOpen: false,
      createGroupModalOpen: false,
    }),
}));
