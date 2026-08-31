import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// 30 minutos en milisegundos
const INACTIVITY_LIMIT = 30 * 60 * 1000;

export const useInactivityTimeout = () => {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        alert('Tu sesión ha expirado por inactividad.');
        window.location.href = '/login';
      }, INACTIVITY_LIMIT);
    };

    // Eventos que reinician el temporizador
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Iniciar el temporizador
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, token]);
};
