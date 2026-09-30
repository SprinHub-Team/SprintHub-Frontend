import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { APP_ROUTES, navigateTo } from './routes';

type AppRoutePathLike = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

function Redirect({ to }: { to: AppRoutePathLike }) {
  useEffect(() => {
    navigateTo(to);
  }, [to]);
  return null;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === 'checking') {
    return <FullScreenLoader message="Verificando tu sesión…" />;
  }

  if (status === 'guest') {
    return <Redirect to={APP_ROUTES.login} />;
  }

  return <>{children}</>;
}
