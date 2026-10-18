/**
 * Definición centralizada de las rutas de la aplicación.
 *
 * Única fuente de verdad para los caminos de la app: la tabla de rutas
 * (AppRoutes), los guards (PublicRoute / ProtectedRoute), los enlaces y
 * la navegación imperativa importan ROUTES en lugar de escribir strings
 * sueltos, de modo que ninguna ruta quede huérfana ni duplicada.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
} as const;

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Estado de localización escrito por ProtectedRoute al redirigir a /login. */
export interface LocationState {
  from?: { pathname: string };
}

/**
 * Lee la ruta de retorno dejada por ProtectedRoute en state.from.
 *
 * Tras un login correcto se navega a ella; si no existe (o es la propia
 * pantalla de login, para evitar bucles) se usa el fallback indicado.
 */
export function readReturnPath(state: unknown, fallback: AppRoutePath): string {
  const from = (state as LocationState | null | undefined)?.from?.pathname;
  return from && from !== ROUTES.login ? from : fallback;
}
