import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/authStore';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useAuthStore((s) => s.user?.role);

  if (role !== 'admin') {
    return <Navigate to="/settings/users" replace />;
  }

  return <>{children}</>;
};
