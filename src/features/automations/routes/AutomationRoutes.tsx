import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const AgentsListPage = lazy(() => import('../pages/AgentsListPage'));
const AgentDetailPage = lazy(() => import('../pages/AgentDetailPage'));

export const automationRoutes: RouteObject[] = [
  {
    path: '/automations/agents',
    element: (
      <PermissionGuard menuKey="automations_agents">
        <ModuleGuard menuKey="automations_agents">
          <SuspenseLoader>
            <AgentsListPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/automations/agents/new',
    element: (
      <PermissionGuard menuKey="automations_agents">
        <ModuleGuard menuKey="automations_agents">
          <SuspenseLoader>
            <AgentDetailPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/automations/agents/:agentId',
    element: (
      <PermissionGuard menuKey="automations_agents">
        <ModuleGuard menuKey="automations_agents">
          <SuspenseLoader>
            <AgentDetailPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
];
