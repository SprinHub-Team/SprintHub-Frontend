import { KanbanSquare, LayoutGrid, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { BoardWorkspace } from '@/features/boards/components/BoardWorkspace';
import type { GroupDetails } from '@/features/groups/types/group.types';
import { useDashboardStore } from '../store/useDashboardStore';

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
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  if (groups.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<Users className="size-8" />}
          title="Crear un grupo"
          description="Comienza creando tu primer grupo: será el espacio de trabajo donde vivan tus tableros y tu equipo."
          action={
            <Button onClick={onCreateGroup} icon={<Plus aria-hidden="true" className="size-4" />}>
              Crear grupo
            </Button>
          }
          className="max-w-lg"
        />
      </div>
    );
  }

  if (!selectedBoardId) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<LayoutGrid className="size-8" />}
          title="Elige un tablero para empezar"
          description={
            selectedGroup
              ? `Abre el panel lateral, expande “${selectedGroup.name}” y selecciona o crea un tablero. También puedes crear un grupo nuevo.`
              : 'Abre el panel lateral, expande un espacio de trabajo y selecciona o crea un tablero. También puedes crear un grupo nuevo.'
          }
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => setMobileSidebarOpen(true)}
                icon={<KanbanSquare aria-hidden="true" className="size-4" />}
                className="md:hidden"
              >
                Ver espacios de trabajo
              </Button>
              <Button variant="secondary" onClick={onCreateGroup}>
                Crear un grupo
              </Button>
            </div>
          }
          className="max-w-xl"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <BoardWorkspace
        boardId={selectedBoardId}
        members={selectedGroup?.members ?? []}
      />
    </div>
  );
}
