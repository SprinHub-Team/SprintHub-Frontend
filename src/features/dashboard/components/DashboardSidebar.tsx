import { useState } from 'react';
import { KanbanSquare, LogOut, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from '@/app/routes';
import { useAuth } from '@/features/auth';
import { CreateGroupModal } from '@/features/groups';
import { GroupMembersModal } from '@/features/groups';
import { WorkspaceGroupItem } from '@/features/groups';
import { useGroupsStore } from '@/features/groups';
import { useDeleteGroup } from '@/features/groups';
import { CreateBoardModal } from '@/features/boards';
import { GroupBoardList } from '@/features/boards';
import { GroupEditModal } from '@/features/groups';
import { useDashboardStore } from '../store/useDashboardStore';
import styles from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const deleteGroupMutation = useDeleteGroup();

  const sessionUserId = user?.id ?? null;
  const membersGroup = groups.find((group) => group.id === membersGroupId) ?? null;
  const createBoardGroup = groups.find((group) => group.id === createBoardGroupId) ?? null;
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

  const handleDeleteGroup = (groupId: string) => {
    if (membersGroupId === groupId) setMembersGroupId(null);
    if (editGroupId === groupId) setEditGroupId(null);
    if (createBoardGroupId === groupId) setCreateBoardGroupId(null);
    void deleteGroupMutation.submit(groupId).then((succeeded) => {
      if (succeeded) {
        removeGroupFromDashboard(groupId);
      }
    });
  };

  return (
    <>
      {mobileOpen ? (
        <div
          className={styles.backdrop}
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        aria-label="Espacios de trabajo"
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
      >
        <header className={styles.header}>
          <button
            type="button"
            className={styles.brand}
            aria-label="SprintHub"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <span aria-hidden="true" className={styles.brandIcon}>
              <KanbanSquare className="icon-lg" />
            </span>
            <span className={styles.brandName}>
              SprintHub
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar panel de navegación"
            className={styles.closeButton}
          >
            <X aria-hidden="true" className="icon-lg" />
          </button>
        </header>

        <nav aria-label="Grupos y tableros" className={styles.nav}>
          <p className={styles.navTitle}>
            Espacios de trabajo
          </p>

          <ul className={styles.groupList}>
            {groups.map((group) => (
              <WorkspaceGroupItem
                key={group.id}
                group={group}
                expanded={expandedGroupIds.includes(group.id)}
                selected={selectedGroupId === group.id}
                onToggle={() => toggleGroup(group.id)}
                onOpenMembers={() => setMembersGroupId(group.id)}
                onEdit={() => setEditGroupId(group.id)}
                canEditGroup={isAdminOf(group.id)}
                canDeleteGroup={isAdminOf(group.id)}
                onDeleteGroup={() => handleDeleteGroup(group.id)}
                deletingGroup={deleteGroupMutation.loading}
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
            <p className={styles.emptyGroups}>
              Aún no perteneces a ningún grupo. Crea el primero para empezar a trabajar.
            </p>
          ) : null}
        </nav>

        <footer className={styles.footer}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCreateGroupOpen(true)}
            icon={<Plus aria-hidden="true" className="icon-md" />}
          >
            Crear grupo
          </Button>
          {user ? (
            <div className={styles.session}>
              <button
                type="button"
                onClick={() => navigate(ROUTES.profile)}
                title="Ver y editar mi perfil"
                aria-label={`Perfil de ${user.name}`}
                className={styles.sessionButton}
              >
                <span aria-hidden="true" className={styles.sessionAvatar}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="" className={styles.sessionImage} />
                  ) : (
                    user.name.slice(0, 2).toUpperCase()
                  )}
                </span>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionName}>
                    {user.name}
                  </span>
                  <span className={styles.sessionEmail}>
                    {user.email}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className={styles.logoutButton}
              >
                <LogOut aria-hidden="true" className="icon-md" />
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
