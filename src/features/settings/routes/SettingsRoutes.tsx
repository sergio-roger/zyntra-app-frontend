import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { AdminGuard } from '@core/routes/AdminGuard';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const LifecycleConfig = lazy(() =>
  import('../components/LifecycleConfig').then((m) => ({
    default: m.LifecycleConfig,
  })),
);
const UsersPage = lazy(() =>
  import('../pages/UsersPage').then((m) => ({ default: m.UsersPage })),
);
const TeamsPage = lazy(() =>
  import('../pages/TeamsPage').then((m) => ({ default: m.TeamsPage })),
);
const PermissionsPage = lazy(() =>
  import('../pages/PermissionsPage').then((m) => ({
    default: m.PermissionsPage,
  })),
);
const RolePermissionsPage = lazy(() =>
  import('../pages/RolePermissionsPage').then((m) => ({
    default: m.RolePermissionsPage,
  })),
);
const PlansPage = lazy(() =>
  import('../../../shared/pages/PlansPage').then((m) => ({
    default: m.PlansPage,
  })),
);

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    children: [
      {
        index: true,
        element: <Navigate to="/settings/configuracion" replace />,
      },
      {
        path: 'configuracion',
        element: (
          <PermissionGuard menuKey="settings_config">
            <SuspenseLoader>
              <ConstructionPage
                title="Configuración General"
                description="Ajustes y preferencias de la plataforma."
              />
            </SuspenseLoader>
          </PermissionGuard>
        ),
      },
      {
        path: 'my-account',
        element: (
          <PermissionGuard menuKey="settings_my_account">
            <SuspenseLoader>
              <ConstructionPage
                title="Mi Cuenta"
                description="Gestiona los datos de tu cuenta de usuario, contraseña y perfil."
              />
            </SuspenseLoader>
          </PermissionGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <PermissionGuard menuKey="settings_users">
            <ModuleGuard menuKey="settings_users">
              <SuspenseLoader>
                <UsersPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: 'plans',
        element: (
          <PermissionGuard menuKey="billing">
            <ModuleGuard menuKey="billing">
              <SuspenseLoader>
                <PlansPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: 'teams',
        element: (
          <PermissionGuard menuKey="settings_teams">
            <ModuleGuard menuKey="settings_teams">
              <SuspenseLoader>
                <TeamsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: 'lifecycle',
        element: (
          <PermissionGuard menuKey="settings_lifecycle">
            <ModuleGuard menuKey="settings_lifecycle">
              <SuspenseLoader>
                <LifecycleConfig />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: 'channels',
        element: (
          <PermissionGuard menuKey="settings_channels">
            <ModuleGuard menuKey="settings_channels">
              <ConstructionPage
                title="Canales de Comunicación"
                description="Próximamente podrás integrar WhatsApp, Instagram y otros canales directamente aquí."
              />
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <AdminGuard>
            <SuspenseLoader>
              <PermissionsPage />
            </SuspenseLoader>
          </AdminGuard>
        ),
      },
      {
        path: 'permissions/:role',
        element: (
          <AdminGuard>
            <SuspenseLoader>
              <RolePermissionsPage />
            </SuspenseLoader>
          </AdminGuard>
        ),
      },
    ],
  },
];
