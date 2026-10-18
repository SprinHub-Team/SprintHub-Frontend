import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader/FullScreenLoader';
import { ROUTES } from './routes';

/**
 * Guard de rutas privadas.
 *
 * - Mientras se restaura la sesión (status "checking") muestra el loader
 *   a pantalla completa, para no parpadear un redirect falso.
 * - Si no hay sesión, redirige a /login recordando la ruta original en
 *   state.from, de modo que tras iniciar sesión se vuelva a ella.
 * - Si hay sesión, renderiza las rutas hijas mediante <Outlet />.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) {
    return <FullScreenLoader message="Verificando tu sesión…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
