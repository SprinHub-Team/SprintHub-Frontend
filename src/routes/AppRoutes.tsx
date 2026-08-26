import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import GroupsDashboard from '../views/dashboard/GroupsDashboard';
import { useAuthStore } from '../store/useAuthStore';

// Un componente para proteger rutas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
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
            <GroupsDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
