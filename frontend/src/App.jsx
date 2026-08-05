import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import PasswordResetPage from './pages/PasswordResetPage';
import WeekOverviewPage from './pages/WeekOverviewPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ThemeManagementPage from './pages/ThemeManagementPage';
import ProgressDashboardPage from './pages/ProgressDashboardPage';
import UserSettingsPage from './pages/UserSettingsPage';
import { useAuthStore } from './store/authStore';

function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const initialized = useAuthStore((s) => s.initialized);
  const { pathname } = useLocation();

  useEffect(() => {
    if (token && !initialized) useAuthStore.getState().loadMe();
  }, [token, initialized]);

  if (!token) return <Navigate to="/login" state={{ from: pathname }} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset" element={<PasswordResetPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout>
              <Navigate to="/week" replace />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/week"
        element={
          <RequireAuth>
            <MainLayout>
              <WeekOverviewPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/activity/:instanceId"
        element={
          <RequireAuth>
            <MainLayout>
              <ActivityDetailPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/themes"
        element={
          <RequireAuth>
            <MainLayout>
              <ThemeManagementPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/progress"
        element={
          <RequireAuth>
            <MainLayout>
              <ProgressDashboardPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <MainLayout>
              <UserSettingsPage />
            </MainLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/week" replace />} />
    </Routes>
  );
}