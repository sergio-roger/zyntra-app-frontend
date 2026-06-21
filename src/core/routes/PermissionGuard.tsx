import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/authStore';

export const PermissionGuard: React.FC<{ menuKey: string; children: React.ReactNode }> = ({ menuKey, children }) => {
  const { allowedMenus } = useAuthStore();
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  if (isAdmin) return <>{children}</>;

  // Verificar si la key existe en el árbol de permisos permitidos
  const hasPermission = allowedMenus?.some(
    (m) => m.key === menuKey || m.children?.some((c) => c.key === menuKey)
  );

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
