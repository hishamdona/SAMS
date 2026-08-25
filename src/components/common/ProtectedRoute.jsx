import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect user to their own portal rather than showing an empty screen
    const targetPath = authService.getRoleHomePath(currentUser.role);
    return <Navigate to={targetPath} replace />;
  }

  return children;
}
