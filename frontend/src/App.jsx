import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreDashboard from './pages/StoreDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user?.role)) return <Navigate to="/" />;

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/store" />;
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute roles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="/store" element={
              <ProtectedRoute roles={['STORE_OWNER']}>
                <StoreDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={<DashboardRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
