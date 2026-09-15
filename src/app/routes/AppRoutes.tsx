import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PublicRoute from '@/components/common/PublicRoute';
import LoginPage from '@/features/auth/Pages/LoginPage';
import RegisterPage from '@/features/auth/Pages/RegisterPage';


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
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<div>Dashboard</div>}
                />
            </Route>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

            <Route
                path="*"
                element={<div>404</div>}
            />
        </Routes>
    );
}

export default AppRoutes;