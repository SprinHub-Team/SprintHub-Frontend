import { KanbanSquare, LayoutGrid, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { BoardWorkspace } from '@/features/boards';
import { useAuth } from '@/features/auth';
import type { GroupDetails } from '@/features/groups';
import { useDashboardStore } from '../store/useDashboardStore';
import styles from './DashboardMainArea.module.css';

export interface DashboardMainAreaProps {
  groups: GroupDetails[];
  selectedGroupId: string | null;
  selectedBoardId: string | null;
  onCreateGroup: () => void;
}

export function DashboardMainArea({
  groups,
  selectedGroupId,
  selectedBoardId,
  onCreateGroup,
}: DashboardMainAreaProps) {
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);
  const { user } = useAuth();
  const sessionUserId = user?.id ?? null;
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;
  const isAdminOfSelectedGroup =
    selectedGroup?.members.some(
      (member) => member.id === sessionUserId && member.role === 'admin',
    ) ?? false;

  if (groups.length === 0) {
    return (
      <div className={styles.centered}>
        <EmptyState
          icon={<Users className={styles.emptyIcon} />}
          title="Crear un grupo"
          description="Comienza creando tu primer grupo: será el espacio de trabajo donde vivan tus tableros y tu equipo."
          action={
            <Button onClick={onCreateGroup} icon={<Plus aria-hidden="true" className="icon-md" />}>
              Crear grupo
            </Button>
          }
          className={styles.bounded}
        />
      </div>
    );
  }

  if (!selectedBoardId) {
    return (
      <div className={styles.centered}>
        <EmptyState
          icon={<LayoutGrid className={styles.emptyIcon} />}
          title="Elige un tablero para empezar"
          description={
            selectedGroup
              ? `Abre el panel lateral, expande “${selectedGroup.name}” y selecciona o crea un tablero. También puedes crear un grupo nuevo.`
              : 'Abre el panel lateral, expande un espacio de trabajo y selecciona o crea un tablero. También puedes crear un grupo nuevo.'
          }
          action={
            <div className={styles.actions}>
              <Button
                variant="secondary"
                onClick={() => setMobileSidebarOpen(true)}
                icon={<KanbanSquare aria-hidden="true" className="icon-md" />}
                className={styles.mobileOnly}
              >
                Ver espacios de trabajo
              </Button>
              <Button variant="secondary" onClick={onCreateGroup}>
                Crear un grupo
              </Button>
            </div>
          }
          className={styles.boundedWide}
        />
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      <BoardWorkspace
        boardId={selectedBoardId}
        members={selectedGroup?.members ?? []}
        canManageCards={isAdminOfSelectedGroup}
      />
    </div>
  );
}
