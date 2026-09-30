import { Menu } from 'lucide-react';
import { KanbanSquare } from 'lucide-react';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { useGroups } from '@/features/groups/hooks/useGroups';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardMainArea } from '../components/DashboardMainArea';
import { useDashboardStore } from '../store/useDashboardStore';

export function DashboardPage() {
  const { groups, status, error, reload } = useGroups();
  const selectedGroupId = useDashboardStore((state) => state.selectedGroupId);
  const selectedBoardId = useDashboardStore((state) => state.selectedBoardId);
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);
  const setCreateGroupModalOpen = useDashboardStore((state) => state.setCreateGroupModalOpen);

  return (
    <div className="flex h-dvh overflow-hidden bg-(--ink)">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-(--border-subtle) bg-(--ink-raised) px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir panel de espacios de trabajo"
            className="rounded-(--radius-sm) p-2 text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-soft) hover:text-(--text-on-dark)"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-(--radius-sm) border border-(--border-light) bg-(image:--gradient-main) text-(--brown)"
          >
            <KanbanSquare className="size-4" />
          </span>
          <span className="text-sm font-semibold text-(--text-on-dark)">SprintHub</span>
        </header>

        <main className="min-h-0 flex-1" aria-label="Área de trabajo">
          {status === 'loading' ? (
            <div className="flex h-full items-center justify-center p-6">
              <LoadingState message="Cargando tus espacios de trabajo…" />
            </div>
          ) : status === 'error' ? (
            <div className="flex h-full items-center justify-center p-6">
              <ErrorState
                title="No se pudieron cargar tus grupos"
                message={error ?? 'Ocurrió un error al comunicarse con el servidor.'}
                onRetry={reload}
                className="max-w-lg"
              />
            </div>
          ) : (
            <DashboardMainArea
              groups={groups}
              selectedGroupId={selectedGroupId}
              selectedBoardId={selectedBoardId}
              onCreateGroup={() => setCreateGroupModalOpen(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
