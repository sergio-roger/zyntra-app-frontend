import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ModuleGuard } from '@core/components/ModuleGuard';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const YoutubeAnalyticsPage = lazy(() =>
  import('@features/youtube-analytics/pages/YoutubeAnalyticsPage').then(
    (m) => ({ default: m.YoutubeAnalyticsPage }),
  ),
);

export const youtubeAnalyticsRoutes: RouteObject[] = [
  {
    path: '/redes-sociales/youtube',
    element: (
      <PermissionGuard menuKey="redes_sociales_youtube">
        <ModuleGuard menuKey="redes_sociales_youtube">
          <SuspenseLoader>
            <YoutubeAnalyticsPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
];
