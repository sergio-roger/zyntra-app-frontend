import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { AdminGuard } from '@core/routes/AdminGuard';
import { PermissionGuard } from '@core/routes/PermissionGuard';

const LifecycleConfig = lazy(() => import('../components/LifecycleConfig').then(m => ({ default: m.LifecycleConfig })));
const UsersPage = lazy(() => import('../pages/UsersPage').then(m => ({ default: m.UsersPage })));
const TeamsPage = lazy(() => import('../pages/TeamsPage').then(m => ({ default: m.TeamsPage })));
const PermissionsPage = lazy(() => import('../pages/PermissionsPage').then(m => ({ default: m.PermissionsPage })));
const RolePermissionsPage = lazy(() => import('../pages/RolePermissionsPage').then(m => ({ default: m.RolePermissionsPage })));

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    children: [
      { index: true, element: <Navigate to="/settings/users" replace /> },
      { path: 'users', element: <PermissionGuard menuKey="settings_users"><SuspenseLoader><UsersPage /></SuspenseLoader></PermissionGuard> },
      { path: 'teams', element: <PermissionGuard menuKey="settings_teams"><SuspenseLoader><TeamsPage /></SuspenseLoader></PermissionGuard> },
      { path: 'lifecycle', element: <PermissionGuard menuKey="settings_lifecycle"><SuspenseLoader><LifecycleConfig /></SuspenseLoader></PermissionGuard> },
      { 
        path: 'channels', 
        element: <PermissionGuard menuKey="settings_channels"><ConstructionPage title="Canales de Comunicación" description="Próximamente podrás integrar WhatsApp, Instagram y otros canales directamente aquí." /></PermissionGuard>
      },
      {
        path: 'permissions',
        element: <AdminGuard><SuspenseLoader><PermissionsPage /></SuspenseLoader></AdminGuard>
      },
      {
        path: 'permissions/:role',
        element: <AdminGuard><SuspenseLoader><RolePermissionsPage /></SuspenseLoader></AdminGuard>
      }
    ]
  }
];
