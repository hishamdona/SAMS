import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import LecturerLayout from './layouts/LecturerLayout';
import CoordinatorLayout from './layouts/CoordinatorLayout';
import StudentLayout from './layouts/StudentLayout';
import LoginPage from './pages/auth/LoginPage';
import NotFoundPage from './pages/error/NotFoundPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import StudentsPage from './pages/admin/StudentsPage';
import CoursesPage from './pages/admin/CoursesPage';
import SettingsPage from './pages/admin/SettingsPage';

// Lecturer Portal Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerCoursesPage from './pages/lecturer/LecturerCoursesPage';
import AttendancePage from './pages/lecturer/AttendancePage';
import CaScoresPage from './pages/lecturer/CaScoresPage';

// Level Coordinator Portal Pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CoordinatorStudentsPage from './pages/coordinator/CoordinatorStudentsPage';
import AtRiskPage from './pages/coordinator/AtRiskPage';
import AlertsPage from './pages/coordinator/AlertsPage';
import ReportsPage from './pages/coordinator/ReportsPage';

// Student Portal Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentPerformancePage from './pages/student/StudentPerformancePage';
import StudentAlertsPage from './pages/student/StudentAlertsPage';

import { authService } from './services/authService';

function HomeRedirect() {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={authService.getRoleHomePath(user.role)} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Public Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Administrator Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Course Lecturer Routes */}
          <Route
            path="/lecturer"
            element={
              <ProtectedRoute allowedRoles={['lecturer', 'admin']}>
                <LecturerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="dashboard" element={<LecturerDashboard />} />
            <Route path="courses" element={<LecturerCoursesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="ca-scores" element={<CaScoresPage />} />
          </Route>

          {/* Level Coordinator Routes */}
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute allowedRoles={['coordinator', 'admin']}>
                <CoordinatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/coordinator/dashboard" replace />} />
            <Route path="dashboard" element={<CoordinatorDashboard />} />
            <Route path="students" element={<CoordinatorStudentsPage />} />
            <Route path="at-risk" element={<AtRiskPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Student Portal Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'coordinator']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="performance" element={<StudentPerformancePage />} />
            <Route path="alerts" element={<StudentAlertsPage />} />
          </Route>

          {/* 404 Fallback Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
