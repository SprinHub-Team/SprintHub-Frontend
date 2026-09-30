import { useEffect } from 'react';
import { HomePage } from '@/features/home';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { ProfilePage } from '@/features/profile';
import { APP_ROUTES } from './routes';
import { useAppRoute } from './useAppRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

export function AppRoutes() {
  const route = useAppRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  switch (route) {
    case APP_ROUTES.login:
      return (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      );

    case APP_ROUTES.register:
      return (
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      );

    case APP_ROUTES.dashboard:
      return (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      );

    case APP_ROUTES.profile:
      return (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      );

    case APP_ROUTES.home:
    default:
      return <HomePage />;
  }
}
