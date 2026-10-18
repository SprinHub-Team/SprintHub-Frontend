import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { onUnauthorized } from '@/lib/api/client';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './AppRoutes';

/**
 * Restaura la posición de scroll al cambiar de ruta, imitando el
 * comportamiento clásico de una navegación de servidor completo.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
