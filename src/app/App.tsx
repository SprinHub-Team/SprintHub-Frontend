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

  useEffect(() => {
    const badge = document.getElementById('nl-badge');
    if (badge) badge.remove();

    const observer = new MutationObserver(() => {
      const dynamicBadge = document.getElementById('nl-badge');
      if (dynamicBadge) {
        dynamicBadge.style.display = 'none';
        dynamicBadge.remove();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
