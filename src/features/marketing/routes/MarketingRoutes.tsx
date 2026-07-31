import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';
import { ModuleGuard } from '@core/components/ModuleGuard';

const AiAgentsCatalogPage = lazy(() => import('../pages/AiAgentsCatalogPage'));
const AiAgentsTeamPage = lazy(() => import('../pages/AiAgentsTeamPage'));
const AiAgentsChatPage = lazy(() => import('../pages/AiAgentsChatPage'));
const MarketingProjectsListPage = lazy(() => import('@features/marketing-projects/pages/MarketingProjectsListPage'));
const CreateMarketingProjectPage = lazy(() => import('@features/marketing-projects/pages/CreateMarketingProjectPage'));
const MarketingProjectDetailPage = lazy(() => import('@features/marketing-projects/pages/MarketingProjectDetailPage'));

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
          <SuspenseLoader>
            <MarketingProjectsListPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/projects/new',
    element: (
      <PermissionGuard menuKey="agents_projects">
        <ModuleGuard menuKey="agents_projects">
          <SuspenseLoader>
            <CreateMarketingProjectPage />
          </SuspenseLoader>
        </ModuleGuard>
      </PermissionGuard>
    ),
  },
  {
    path: '/agents/projects/:id',
    element: (
      <PermissionGuard menuKey="agents_projects">
        <ModuleGuard menuKey="agents_projects">
          <SuspenseLoader>
            <MarketingProjectDetailPage />
          </SuspenseLoader>
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
