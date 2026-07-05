import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const ChannelsListPage = lazy(() =>
  import('@features/channels/pages/ChannelsListPage').then((m) => ({
    default: m.ChannelsListPage,
  })),
);

export const channelsRoutes: RouteObject[] = [
  {
    path: '/channels',
    element: (
      <PermissionGuard menuKey="channels">
        <ModuleGuard menuKey="channels">
          <SuspenseLoader>
            <ChannelsListPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
];
