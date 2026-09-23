import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/features/auth/Pages/LoginPage';
import RegisterPage from '@/features/auth/Pages/RegisterPage';
import ProfilePage from '@/features/auth/Pages/ProfilePage';
import HomePage from '@/features/home/pages/HomePage';

import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import GroupsPage from '@/features/groups/pages/GroupsPage';
import GroupDetailPage from '@/features/groups/pages/GroupDetailPage';
import BoardPage from '@/features/boards/pages/BoardPage';

function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/"
                    element={<HomePage />}
                />

            </Route>

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />
                <Route
                    path="/groups"
                    element={<GroupsPage />}
                />
                <Route
                    path="/groups/:id"
                    element={<GroupDetailPage />}
                />
                <Route
                    path="/boards/:id"
                    element={<BoardPage />}
                />
                <Route
                    path="/profile"
                    element={<ProfilePage />}
                />
            </Route>

            <Route
                path="*"
                element={<div>404</div>}
            />
        </Routes>
    );
}

export default AppRoutes;