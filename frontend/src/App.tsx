import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PlannerPage from './pages/PlannerPage';
import AttendancePage from './pages/AttendancePage';
import AssignmentsPage from './pages/AssignmentsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import LandingPage from './pages/LandingPage';

import AdminDashboardPage from './pages/AdminDashboardPage';

function ProtectedLayout({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useApp();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!requireAdmin && user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = useApp();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace /> : <AuthPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedLayout>
            <PlannerPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedLayout>
            <AttendancePage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedLayout>
            <AssignmentsPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedLayout>
            <AIAssistantPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedLayout requireAdmin>
            <AdminDashboardPage />
          </ProtectedLayout>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
