import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import GroupsDashboard from '../views/dashboard/GroupsDashboard';
import BoardsDashboard from '../views/dashboard/BoardsDashboard';
import KanbanBoard from '../views/board/KanbanBoard';
import { useAuthStore } from '../store/useAuthStore';

// Un componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><GroupsDashboard /></ProtectedRoute>} />
      <Route path="/groups/:groupId/boards" element={<ProtectedRoute><BoardsDashboard /></ProtectedRoute>} />
      <Route path="/board/:boardId" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
    </Routes>
  );
};
