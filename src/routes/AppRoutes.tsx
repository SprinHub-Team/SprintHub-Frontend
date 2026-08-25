import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import { useAuthStore } from '../store/useAuthStore';

// Un componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Vistas simuladas para el flujo
const DashboardPlaceholder = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido, {user?.name}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
      <p>Aquí irá la vista de Grupos y Tableros.</p>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
