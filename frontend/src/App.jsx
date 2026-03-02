import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './app/store';
import api from './api/axiosInstance';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy loading pages (We will create these soon)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import AdminDashboard from './pages/AdminDashboard';
import History from './pages/History';

function App() {
  const { setUser, logoutUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on load
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        logoutUser();
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [setUser, logoutUser]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/note/:id" element={<NoteEditor />} />
          <Route path="/note/:id/history" element={<History />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
