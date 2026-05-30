import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const AgentCenterPage = lazy(() => import('../pages/AgentCenterPage'));

export const agentRoutes: RouteObject[] = [
  {
    path: '/agents/strategy',
    element: (
      <SuspenseLoader>
        <AgentCenterPage />
      </SuspenseLoader>
    )
  },
  {
    path: '/agents/content',
    element: (
      <SuspenseLoader>
        <AgentCenterPage />
      </SuspenseLoader>
    )
  },
  {
    path: '/agents/analysis',
    element: (
      <SuspenseLoader>
        <AgentCenterPage />
      </SuspenseLoader>
    )
  },

  {
    path: '/agents',
    element: <Navigate to="/agents/strategy" replace />
  }
];

