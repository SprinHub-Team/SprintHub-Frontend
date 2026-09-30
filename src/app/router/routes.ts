export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

const ROUTE_PATHS: readonly string[] = Object.values(APP_ROUTES);

export function navigateTo(path: AppRoutePath): void {
  if (typeof window === 'undefined') return;
  window.location.hash = `#${path}`;
}

export function readCurrentRoute(): AppRoutePath {
  if (typeof window === 'undefined') return APP_ROUTES.home;
  const hash = window.location.hash.replace(/^#/, '');
  return (ROUTE_PATHS.includes(hash) ? hash : APP_ROUTES.home) as AppRoutePath;
}
