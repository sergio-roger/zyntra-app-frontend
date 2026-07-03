import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const AgentCenterPage = lazy(() => import('../pages/AgentCenterPage'));

export const agentRoutes: RouteObject[] = [
  {
    path: '/agents/strategy',
    element: (
      <PermissionGuard menuKey="agents_strategy">
        <ModuleGuard menuKey="agents_strategy">
          <SuspenseLoader>
            <AgentCenterPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/content',
    element: (
      <PermissionGuard menuKey="agents_content">
        <ModuleGuard menuKey="agents_content">
          <SuspenseLoader>
            <AgentCenterPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/analysis',
    element: (
      <PermissionGuard menuKey="agents_analysis">
        <ModuleGuard menuKey="agents_analysis">
          <SuspenseLoader>
            <AgentCenterPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },

  {
    path: '/agents',
    element: <Navigate to="/agents/strategy" replace />,
  },
];
