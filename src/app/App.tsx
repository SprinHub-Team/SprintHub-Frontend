import { useEffect } from 'react';
import { onUnauthorized } from '@/services/api/client';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './router/AppRoutes';

export function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      useAuthStore.getState().logout();
    });
    return unsubscribe;
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
