import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { ConstructionPage } from "@shared/components/ConstructionPage";
import { SuspenseLoader } from "@shared/components/SuspenseLoader";
import { AdminGuard } from "@core/routes/AdminGuard";
import { PermissionGuard } from "@core/routes/PermissionGuard";
import { ModuleGuard } from "@core/components/ModuleGuard";

const ChannelStorePage = lazy(() =>
  import("@features/channels/pages/ChannelStorePage").then((m) => ({
    default: m.ChannelStorePage,
  })),
);
const ChannelWizardPage = lazy(() =>
  import("@features/channels/pages/ChannelWizardPage").then((m) => ({
    default: m.ChannelWizardPage,
  })),
);
const ChannelDetailPage = lazy(() =>
  import("@features/channels/pages/ChannelDetailPage").then((m) => ({
    default: m.ChannelDetailPage,
  })),
);
const AiAgentsPage = lazy(() =>
  import("@features/ai-agents/pages/AiAgentsPage").then((m) => ({
    default: m.AiAgentsPage,
  })),
);

const LifecycleConfig = lazy(() =>
  import("@features/settings/components/LifecycleConfig").then((m) => ({
    default: m.LifecycleConfig,
  })),
);
const UsersPage = lazy(() =>
  import("@features/settings/pages/UsersPage").then((m) => ({
    default: m.UsersPage,
  })),
);
const MyAccountPage = lazy(() =>
  import("@features/settings/pages/MyAccountPage").then((m) => ({
    default: m.MyAccountPage,
  })),
);
const TeamsPage = lazy(() =>
  import("@features/settings/pages/TeamsPage").then((m) => ({
    default: m.TeamsPage,
  })),
);
const PermissionsPage = lazy(() =>
  import("@features/settings/pages/PermissionsPage").then((m) => ({
    default: m.PermissionsPage,
  })),
);
const RolePermissionsPage = lazy(() =>
  import("@features/settings/pages/RolePermissionsPage").then((m) => ({
    default: m.RolePermissionsPage,
  })),
);
const PlansPage = lazy(() =>
  import("@shared/pages/PlansPage").then((m) => ({
    default: m.PlansPage,
  })),
);

export const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    children: [
      {
        index: true,
        element: <Navigate to="/settings/configuracion" replace />,
      },
      {
        path: "configuracion",
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
        path: "my-account",
        element: (
          <PermissionGuard menuKey="settings_my_account">
            <SuspenseLoader>
              <MyAccountPage />
            </SuspenseLoader>
          </PermissionGuard>
        ),
      },
      {
        path: "users",
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
        path: "plans",
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
        path: "teams",
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
        path: "lifecycle",
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
        path: "channels",
        element: (
          <PermissionGuard menuKey="settings_channels">
            <ModuleGuard menuKey="settings_channels">
              <SuspenseLoader>
                <ChannelStorePage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "channels/new",
        element: (
          <PermissionGuard menuKey="settings_channels">
            <ModuleGuard menuKey="settings_channels">
              <SuspenseLoader>
                <ChannelWizardPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "channels/:channelId",
        element: (
          <PermissionGuard menuKey="settings_channels">
            <ModuleGuard menuKey="settings_channels">
              <SuspenseLoader>
                <ChannelDetailPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "agents",
        element: (
          <PermissionGuard menuKey="settings_agents">
            <ModuleGuard menuKey="settings_agents">
              <SuspenseLoader>
                <AiAgentsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "permissions",
        element: (
          <AdminGuard>
            <SuspenseLoader>
              <PermissionsPage />
            </SuspenseLoader>
          </AdminGuard>
        ),
      },
      {
        path: "permissions/:role",
        element: (
          <AdminGuard>
            <SuspenseLoader>
              <RolePermissionsPage />
            </SuspenseLoader>
          </AdminGuard>
        ),
      },
      {
        path: "roles",
        element: (
          <PermissionGuard menuKey="settings_roles">
            <SuspenseLoader>
              <PermissionsPage />
            </SuspenseLoader>
          </PermissionGuard>
        ),
      },
      {
        path: "roles/:role",
        element: (
          <PermissionGuard menuKey="settings_roles">
            <SuspenseLoader>
              <RolePermissionsPage />
            </SuspenseLoader>
          </PermissionGuard>
        ),
      },
    ],
  },
];
