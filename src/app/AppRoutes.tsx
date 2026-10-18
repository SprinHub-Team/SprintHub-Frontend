import { Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFoundPage } from './NotFoundPage';
import { ROUTES } from './routes';
import { HomePage } from '@/features/home';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { ProfilePage } from '@/features/profile';

/**
 * Tabla de rutas de la aplicación.
 *
 * Estructura declarativa con react-router-dom:
 * - Rutas públicas agrupadas bajo <PublicRoute /> (layout guard que
 *   redirige a usuarios autenticados).
 * - Rutas privadas agrupadas bajo <ProtectedRoute /> (layout guard que
 *   exige sesión y recuerda el origen en state.from).
 * - La ruta comodín `*` captura cualquier camino desconocido (404).
 *
 * Para añadir una página: se declara su path en ROUTES (routes.ts) y se
 * cuelga su <Route> en el grupo que corresponda. Nada más.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.profile} element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
