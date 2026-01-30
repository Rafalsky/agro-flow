import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import ActivatePage from './pages/ActivatePage';
import WorkerDashboard from './pages/WorkerDashboard';
import BoardView from './pages/BoardView';
import WorkersPage from './pages/WorkersPage';
import CyclesPage from './pages/CyclesPage';
import ShiftsPage from './pages/ShiftsPage';
import NotFound from './pages/NotFound';
import ZooLayout from './layouts/ZooLayout';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, allowedRole }: { children: ReactNode, allowedRole?: 'WORKER' | 'ZOOTECHNICIAN' }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Simple role check
  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to their home
    if (user?.role === 'WORKER') return <Navigate to="/" replace />;
    if (user?.role === 'ZOOTECHNICIAN') return <Navigate to="/board" replace />;
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/activate" element={<ActivatePage />} />

            {/* Worker Home */}
            <Route path="/" element={
              <ProtectedRoute allowedRole="WORKER">
                <WorkerDashboard />
              </ProtectedRoute>
            } />

            {/* Zootechnician Routes */}
            <Route element={
              <ProtectedRoute allowedRole="ZOOTECHNICIAN">
                <ZooLayout />
              </ProtectedRoute>
            }>
              <Route path="/board" element={<BoardView />} />
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/cycles" element={<CyclesPage />} />
              <Route path="/shifts" element={<ShiftsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
