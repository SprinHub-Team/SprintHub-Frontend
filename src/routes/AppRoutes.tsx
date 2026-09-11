import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../views/landing/Landing';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import GroupsDashboard from '../views/dashboard/GroupsDashboard';
import BoardsDashboard from '../views/dashboard/BoardsDashboard';
import KanbanBoard from '../views/board/KanbanBoard';
import ReportDashboard from '../views/dashboard/ReportDashboard';
import BacklogDashboard from '../views/board/BacklogDashboard';
import MembersDashboard from '../views/dashboard/MembersDashboard';
import ProjectDocuments from '../views/dashboard/ProjectDocuments';
import WorkInProgress from '../views/board/WorkInProgress';
import JiraLayout from '../layout/JiraLayout';
import { useAuthStore } from '../store/useAuthStore';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <JiraLayout>{children}</JiraLayout>;
};

export const AppRoutes: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><GroupsDashboard /></ProtectedRoute>} />
      <Route path="/groups/:groupId/boards" element={<ProtectedRoute><BoardsDashboard /></ProtectedRoute>} />
      <Route path="/groups/:groupId/reports" element={<ProtectedRoute><ErrorBoundary><ReportDashboard /></ErrorBoundary></ProtectedRoute>} />
      <Route path="/groups/:groupId/backlog" element={<ProtectedRoute><BacklogDashboard /></ProtectedRoute>} />
      <Route path="/groups/:groupId/members" element={<ProtectedRoute><MembersDashboard /></ProtectedRoute>} />
      <Route path="/groups/:groupId/documents" element={<ProtectedRoute><ProjectDocuments /></ProtectedRoute>} />
      <Route path="/board/:boardId" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
      <Route path="/board/:boardId/reports" element={<ProtectedRoute><ErrorBoundary><ReportDashboard /></ErrorBoundary></ProtectedRoute>} />
      <Route path="/board/:boardId/list" element={<ProtectedRoute><WorkInProgress title="Lista" icon="fas fa-stream" /></ProtectedRoute>} />
      <Route path="/board/:boardId/timeline" element={<ProtectedRoute><WorkInProgress title="Cronograma" icon="fas fa-calendar-alt" /></ProtectedRoute>} />
      <Route path="/board/:boardId/automations" element={<ProtectedRoute><WorkInProgress title="Automatizaciones" icon="fas fa-bolt" /></ProtectedRoute>} />
      <Route path="/wip" element={<ProtectedRoute><WorkInProgress title="Módulo" icon="fas fa-tools" /></ProtectedRoute>} />
    </Routes>
  );
};
