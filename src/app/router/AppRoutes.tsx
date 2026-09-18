import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/features/auth/Pages/LoginPage';
import RegisterPage from '@/features/auth/Pages/RegisterPage';
import HomePage from '@/features/home/pages/HomePage';


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
                    element={<div>Dashboard</div>}
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