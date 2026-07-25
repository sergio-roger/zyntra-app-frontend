import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';
import { ConstructionPage } from '@shared/components/ConstructionPage';

const AiAgentsCatalogPage = lazy(() => import('../pages/AiAgentsCatalogPage'));
const AiAgentsTeamPage = lazy(() => import('../pages/AiAgentsTeamPage'));
const AiAgentsChatPage = lazy(() => import('../pages/AiAgentsChatPage'));

export const marketingRoutes: RouteObject[] = [
  {
    path: '/agents/chat',
    element: (
      <PermissionGuard menuKey="agents_chat">
        <ModuleGuard menuKey="agents_chat">
          <SuspenseLoader>
            <AiAgentsChatPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/store',
    element: (
      <PermissionGuard menuKey="agents_store">
        <ModuleGuard menuKey="agents_store">
          <SuspenseLoader>
            <AiAgentsCatalogPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/projects',
    element: (
      <PermissionGuard menuKey="agents_projects">
        <ModuleGuard menuKey="agents_projects">
          <ConstructionPage />
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/team',
    element: (
      <PermissionGuard menuKey="agents_team">
        <ModuleGuard menuKey="agents_team">
          <SuspenseLoader>
            <AiAgentsTeamPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
];
