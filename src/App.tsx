import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Staff } from './pages/Staff';
import { StaffDetail } from './pages/StaffDetail';
import { Messages } from './pages/Messages';
import { Forum } from './pages/Forum';
import { Deliverables } from './pages/Deliverables';
import { Uploads } from './pages/Uploads';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ManagerOnly({ children }: { children: ReactNode }) {
  const { isManager } = useAuth();
  if (!isManager) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="staff"
          element={
            <ManagerOnly>
              <Staff />
            </ManagerOnly>
          }
        />
        <Route
          path="staff/:id"
          element={
            <ManagerOnly>
              <StaffDetail />
            </ManagerOnly>
          }
        />
        <Route path="messages" element={<Messages />} />
        <Route path="forum" element={<Forum />} />
        <Route path="deliverables" element={<Deliverables />} />
        <Route path="uploads" element={<Uploads />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
