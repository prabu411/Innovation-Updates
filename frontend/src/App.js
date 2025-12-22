import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import MainLogin from './pages/MainLogin'; // Renamed
import StudentAdminLogin from './pages/StudentAdminLogin'; // New
import Signup from './pages/Signup';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentAdminDashboard from './pages/StudentAdminDashboard';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'coordinator') return <Navigate to="/coordinator/dashboard" />;
    if (user.role === 'student_admin') return <Navigate to="/student-admin/dashboard" />;
    return <Navigate to="/student/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MainLogin />} />
          <Route path="/student-admin-login" element={<StudentAdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/coordinator/dashboard" element={<PrivateRoute roles={['coordinator']}><CoordinatorDashboard /></PrivateRoute>} />
          <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
          <Route path="/student-admin/dashboard" element={<PrivateRoute roles={['student_admin']}><StudentAdminDashboard /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
