import { ArrowLeft, KanbanSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { ProfileView } from '../components/ProfileView';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard)}
          aria-label="Volver al dashboard"
          className={styles.backButton}
        >
          <ArrowLeft aria-hidden="true" className="icon-lg" />
          <span className={styles.backLabel}>Volver</span>
        </button>
        <div className={styles.title}>
          <span aria-hidden="true" className={styles.titleIcon}>
            <KanbanSquare className="icon-md" />
          </span>
          <span className={styles.titleText}>
            Mi perfil
          </span>
        </div>
        <span aria-hidden="true" className={styles.spacer} />
      </header>

      <main className={styles.main} aria-label="Perfil del usuario">
        <ProfileView />
      </main>
    </div>
  );
}
