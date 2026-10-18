import { useAuthStore } from '../store/useAuthStore';

/**
 * Puerta de lectura del estado de autenticación.
 *
 * Traduce el estado interno del store (status: checking | authenticated
 * | guest) al vocabulario que consumen guards y componentes:
 * isAuthenticated / isChecking / user. Toda la app habla de
 * "isAuthenticated", y solo este hook sabe cómo se calcula.
 */
export function useAuth() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateSessionUser = useAuthStore((state) => state.updateSessionUser);

  const isChecking = status === 'checking';
  const isAuthenticated = status === 'authenticated';

  return {
    status,
    isChecking,
    isAuthenticated,
    user: session?.user ?? null,
    login,
    register,
    logout,
    updateSessionUser,
  };
}
