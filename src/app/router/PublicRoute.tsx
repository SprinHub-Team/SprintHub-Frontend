import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { APP_ROUTES, navigateTo } from './routes';

function Redirect({ to }: { to: AppRoutePathLike }) {
  useEffect(() => {
    navigateTo(to);
  }, [to]);
  return null;
}

type AppRoutePathLike = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export function PublicRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === 'checking') {
    return <FullScreenLoader message="Restaurando tu sesión…" />;
  }

  if (status === 'authenticated') {
    return <Redirect to={APP_ROUTES.dashboard} />;
  }

  return <>{children}</>;
}
