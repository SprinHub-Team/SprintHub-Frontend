import { useState } from 'react';
import { KanbanSquare, LogOut, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { CreateGroupModal } from '@/features/groups/components/CreateGroupModal';
import { GroupMembersModal } from '@/features/groups/components/GroupMembersModal';
import { WorkspaceGroupItem } from '@/features/groups/components/WorkspaceGroupItem';
import { useGroupsStore } from '@/features/groups/store/useGroupsStore';
import { CreateBoardModal } from '@/features/boards/components/CreateBoardModal';
import { GroupBoardList } from '@/features/boards/components/GroupBoardList';
import { DocumentsModal } from '@/features/documents/components/DocumentsModal';
import { GroupEditModal } from '@/features/groups/components/GroupEditModal';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '../store/useDashboardStore';

export function DashboardSidebar() {
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const groups = useGroupsStore((state) => state.groups);

  const selectedGroupId = useDashboardStore((state) => state.selectedGroupId);
  const selectedBoardId = useDashboardStore((state) => state.selectedBoardId);
  const expandedGroupIds = useDashboardStore((state) => state.expandedGroupIds);
  const mobileOpen = useDashboardStore((state) => state.mobileSidebarOpen);
  const createGroupOpen = useDashboardStore((state) => state.createGroupModalOpen);
  const setCreateGroupOpen = useDashboardStore((state) => state.setCreateGroupModalOpen);
  const selectGroup = useDashboardStore((state) => state.selectGroup);
  const selectBoard = useDashboardStore((state) => state.selectBoard);
  const toggleGroup = useDashboardStore((state) => state.toggleGroup);
  const expandGroup = useDashboardStore((state) => state.expandGroup);
  const removeGroupFromDashboard = useDashboardStore((state) => state.removeGroup);
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);

  const [membersGroupId, setMembersGroupId] = useState<string | null>(null);
  const [createBoardGroupId, setCreateBoardGroupId] = useState<string | null>(null);
  const [documentsGroupId, setDocumentsGroupId] = useState<string | null>(null);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);

  const sessionUserId = session?.user.id ?? null;
  const membersGroup = groups.find((group) => group.id === membersGroupId) ?? null;
  const createBoardGroup = groups.find((group) => group.id === createBoardGroupId) ?? null;
  const documentsGroup = groups.find((group) => group.id === documentsGroupId) ?? null;
  const editGroup = groups.find((group) => group.id === editGroupId) ?? null;

  const isAdminOf = (groupId: string): boolean => {
    if (!sessionUserId) return false;
    return groups
      .find((group) => group.id === groupId)
      ?.members.some((member) => member.id === sessionUserId && member.role === 'admin') ?? false;
  };

  const handleLogout = () => {
    useDashboardStore.getState().resetDashboard();
    useGroupsStore.getState().resetGroups();
    logout();
  };

  const handleGroupCreated = (groupId: string) => {
    selectGroup(groupId);
    expandGroup(groupId);
  };

  const handleBoardDeleted = (boardId: string) => {
    if (selectedBoardId === boardId) {
      useDashboardStore.getState().clearBoard();
    }
  };

  return (
    <>
      {}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        aria-label="Espacios de trabajo"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-(--border-subtle) bg-(--ink-raised)',
          'transition-transform duration-200 ease-out md:static md:z-auto md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <header className="flex items-center justify-between gap-2 border-b border-(--border-subtle) px-4 py-4">
          <button
            type="button"
            className="flex items-center gap-2.5"
            aria-label="SprintHub"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-(--radius-sm) border border-(--border-light) bg-(image:--gradient-main) text-(--brown)"
            >
              <KanbanSquare className="size-5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-(--text-on-dark)">
              SprintHub
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar panel de navegación"
            className="rounded-(--radius-sm) p-2 text-(--text-muted) transition-colors duration-200 ease-out hover:text-(--text-on-dark) md:hidden"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <nav aria-label="Grupos y tableros" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-(--taupe) uppercase">
            Espacios de trabajo
          </p>

          <ul className="flex flex-col gap-1">
            {groups.map((group) => (
              <WorkspaceGroupItem
                key={group.id}
                group={group}
                expanded={expandedGroupIds.includes(group.id)}
                selected={selectedGroupId === group.id}
                onToggle={() => toggleGroup(group.id)}
                onOpenMembers={() => setMembersGroupId(group.id)}
                onOpenDocuments={() => setDocumentsGroupId(group.id)}
                onEdit={() => setEditGroupId(group.id)}
              >
                <GroupBoardList
                  groupId={group.id}
                  selectedBoardId={selectedGroupId === group.id ? selectedBoardId : null}
                  canDeleteBoards={isAdminOf(group.id)}
                  onSelectBoard={(boardId) => selectBoard(group.id, boardId)}
                  onBoardDeleted={handleBoardDeleted}
                  onCreateBoard={() => setCreateBoardGroupId(group.id)}
                />
              </WorkspaceGroupItem>
            ))}
          </ul>

          {groups.length === 0 ? (
            <p className="px-2 py-6 text-sm leading-relaxed text-(--text-muted)">
              Aún no perteneces a ningún grupo. Crea el primero para empezar a trabajar.
            </p>
          ) : null}
        </nav>

        <footer className="flex flex-col gap-3 border-t border-(--border-subtle) px-4 py-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCreateGroupOpen(true)}
            icon={<Plus aria-hidden="true" className="size-4" />}
          >
            Crear grupo
          </Button>
          {session ? (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigateTo(APP_ROUTES.profile)}
                title="Ver y editar mi perfil"
                aria-label={`Perfil de ${session.user.name}`}
                className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-(--radius-sm) p-1.5 text-left transition-colors duration-200 ease-out hover:bg-(--ink-soft)"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border-light) bg-(image:--gradient-main) text-xs font-bold text-(--brown)"
                >
                  {session.user.profilePicture ? (
                    <img src={session.user.profilePicture} alt="" className="size-full object-cover" />
                  ) : (
                    session.user.name.slice(0, 2).toUpperCase()
                  )}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-(--text-on-dark) group-hover:text-(--cream)">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs text-(--text-muted)">
                    {session.user.email}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="shrink-0 rounded-(--radius-sm) p-2 text-(--taupe) transition-colors duration-200 ease-out hover:bg-(--ink-soft) hover:text-(--cream)"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </button>
            </div>
          ) : null}
        </footer>
      </aside>

      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreated={handleGroupCreated}
      />

      <GroupMembersModal
        open={membersGroupId !== null}
        onClose={() => setMembersGroupId(null)}
        group={membersGroup}
        canDeleteGroup={membersGroupId !== null && isAdminOf(membersGroupId)}
        onDeleteGroup={(groupId) => removeGroupFromDashboard(groupId)}
      />

      <DocumentsModal
        open={documentsGroupId !== null}
        onClose={() => setDocumentsGroupId(null)}
        group={documentsGroup}
      />

      <GroupEditModal
        open={editGroupId !== null}
        onClose={() => setEditGroupId(null)}
        group={editGroup}
      />

      {createBoardGroup ? (
        <CreateBoardModal
          open={createBoardGroupId !== null}
          onClose={() => setCreateBoardGroupId(null)}
          groupId={createBoardGroup.id}
          onCreated={(boardId) => selectBoard(createBoardGroup.id, boardId)}
        />
      ) : null}
    </>
  );
}
