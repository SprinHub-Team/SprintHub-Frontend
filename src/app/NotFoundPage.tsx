import { Compass, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from './routes';
import styles from './NotFoundPage.module.css';

/**
 * Vista 404: la ruta visitada no existe en la tabla de AppRoutes.
 *
 * Se alcanza por la ruta comodín `path="*"`. Ofrece dos salidas claras:
 * volver a la landing o ir al dashboard (que a su vez manda a /login
 * si no hay sesión).
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <Compass aria-hidden="true" size={40} className={styles.icon} />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p className={styles.description}>
        La dirección que visitaste no existe o cambió de lugar. Revisa la URL
        o vuelve a una sección conocida de SprintHub.
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate(ROUTES.home)}>
          Volver al inicio
        </Button>
        <Button icon={<LogIn aria-hidden="true" size={16} />} onClick={() => navigate(ROUTES.dashboard)}>
          Ir al dashboard
        </Button>
      </div>
    </main>
  );
}
