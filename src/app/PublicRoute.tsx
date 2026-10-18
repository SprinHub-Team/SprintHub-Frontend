import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader/FullScreenLoader';
import { ROUTES } from './routes';

/**
 * Guard de rutas públicas (landing, login y registro).
 *
 * - Mientras se restaura la sesión (status "checking") muestra el loader
 *   a pantalla completa, para no parpadear un redirect falso.
 * - Si ya hay sesión, envía al usuario directo al dashboard: no tiene
 *   sentido ver marketing o volver a loguearse.
 * - Si no hay sesión, renderiza las rutas hijas mediante <Outlet />.
 */
export function PublicRoute() {
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking) {
    return <FullScreenLoader message="Restaurando tu sesión…" />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
