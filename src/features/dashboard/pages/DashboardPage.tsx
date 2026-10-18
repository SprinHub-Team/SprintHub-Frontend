import { Menu, KanbanSquare } from 'lucide-react';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { useGroups } from '@/features/groups';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardMainArea } from '../components/DashboardMainArea';
import { useDashboardStore } from '../store/useDashboardStore';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { groups, status, error, reload } = useGroups();
  const selectedGroupId = useDashboardStore((state) => state.selectedGroupId);
  const selectedBoardId = useDashboardStore((state) => state.selectedBoardId);
  const setMobileSidebarOpen = useDashboardStore((state) => state.setMobileSidebarOpen);
  const setCreateGroupModalOpen = useDashboardStore((state) => state.setCreateGroupModalOpen);

  return (
    <div className={styles.page}>
      <DashboardSidebar />

      <div className={styles.content}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir panel de espacios de trabajo"
            className={styles.mobileMenuButton}
          >
            <Menu aria-hidden="true" className="icon-lg" />
          </button>
          <span aria-hidden="true" className={styles.mobileBrandIcon}>
            <KanbanSquare className="icon-md" />
          </span>
          <span className={styles.mobileBrandName}>SprintHub</span>
        </header>

        <main className={styles.main} aria-label="Área de trabajo">
          {status === 'loading' ? (
            <div className={styles.centered}>
              <LoadingState message="Cargando tus espacios de trabajo…" />
            </div>
          ) : status === 'error' ? (
            <div className={styles.centered}>
              <ErrorState
                title="No se pudieron cargar tus grupos"
                message={error ?? 'Ocurrió un error al comunicarse con el servidor.'}
                onRetry={reload}
                className={styles.bounded}
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
