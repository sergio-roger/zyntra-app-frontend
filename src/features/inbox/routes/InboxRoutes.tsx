import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@core/routes/ProtectedRoute';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const ConversationsPage = lazy(() =>
  import('@features/inbox/pages/ConversationsPage').then((m) => ({
    default: m.ConversationsPage,
  })),
);
const ChannelStorePage = lazy(() =>
  import('@features/channels/pages/ChannelStorePage').then((m) => ({
    default: m.ChannelStorePage,
  })),
);
const WebChannelStepFormPage = lazy(() =>
  import('@features/channels/pages/WebChannelStepFormPage').then((m) => ({
    default: m.WebChannelStepFormPage,
  })),
);
const ChannelDetailPage = lazy(() =>
  import('@features/channels/pages/ChannelDetailPage').then((m) => ({
    default: m.ChannelDetailPage,
  })),
);
const ChannelsListPage = lazy(() =>
  import('@features/channels/pages/ChannelsListPage').then((m) => ({
    default: m.ChannelsListPage,
  })),
);

export const inboxRoutes: RouteObject[] = [
  {
    path: '/inbox',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_conversations">
          <ModuleGuard menuKey="inbox_conversations">
            <SuspenseLoader>
              <ConversationsPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/automations',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_automations">
          <ModuleGuard menuKey="inbox_automations">
            <ConstructionPage />
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/channels',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_channels">
          <ModuleGuard menuKey="inbox_channels">
            <SuspenseLoader>
              <ChannelStorePage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/channels/new',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_channels">
          <ModuleGuard menuKey="inbox_channels">
            <SuspenseLoader>
              <WebChannelStepFormPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/channels/:channelId',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_channels">
          <ModuleGuard menuKey="inbox_channels">
            <SuspenseLoader>
              <ChannelDetailPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/channels/:channelId/edit',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_channels">
          <ModuleGuard menuKey="inbox_channels">
            <SuspenseLoader>
              <WebChannelStepFormPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: '/inbox/my-channels',
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_my_channels">
          <ModuleGuard menuKey="inbox_my_channels">
            <SuspenseLoader>
              <ChannelsListPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
];
