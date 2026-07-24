import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ModuleGuard } from '@core/components/ModuleGuard';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const DrivePage = lazy(() => import('@features/drive/pages/DrivePage'));

const guarded = (element: React.ReactNode) => (
  <PermissionGuard menuKey="drive">
    <ModuleGuard menuKey="drive">
      <SuspenseLoader>{element}</SuspenseLoader>
    </ModuleGuard>
  </PermissionGuard>
);

export const driveRoutes: RouteObject[] = [
  { path: '/drive', element: <Navigate to="/drive/me" replace /> },
  { path: '/drive/:section', element: guarded(<DrivePage />) },
  { path: '/drive/:section/:folderId', element: guarded(<DrivePage />) },
];
