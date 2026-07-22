import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const AiAgentsCatalogPage = lazy(() => import('../pages/AiAgentsCatalogPage'));

export const agentRoutes: RouteObject[] = [
  {
    path: '/agents',
    element: (
      <PermissionGuard menuKey="agents_ia">
        <ModuleGuard menuKey="agents_ia">
          <SuspenseLoader>
            <AiAgentsCatalogPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
];
