import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/authStore';

export const PermissionGuard: React.FC<{
  menuKey: string;
  children: React.ReactNode;
}> = ({ menuKey, children }) => {
  const { allowedMenus } = useAuthStore();
  const isAdmin = useAuthStore(
    (s) => s.user?.role === 'admin' || s.user?.role === 'superAdmin',
  );

  if (isAdmin) return <>{children}</>;

  const checkHasPermission = (menus: any[] | null | undefined, key: string): boolean => {
    if (!menus) return false;
    for (const m of menus) {
      if (m.key === key) return true;
      if (m.children && m.children.length > 0) {
        if (checkHasPermission(m.children, key)) return true;
      }
    }
    return false;
  };

  const hasPermission = checkHasPermission(allowedMenus, menuKey);

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
