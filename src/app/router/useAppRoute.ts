import { useEffect, useState } from 'react';
import { readCurrentRoute, type AppRoutePath } from './routes';

export function useAppRoute(): AppRoutePath {
  const [route, setRoute] = useState<AppRoutePath>(readCurrentRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(readCurrentRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}
