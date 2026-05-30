import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const LifecycleConfig = lazy(() => import('../components/LifecycleConfig').then(m => ({ default: m.LifecycleConfig })));
const UsersPage = lazy(() => import('../pages/UsersPage').then(m => ({ default: m.UsersPage })));
const TeamsPage = lazy(() => import('../pages/TeamsPage').then(m => ({ default: m.TeamsPage })));

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    children: [
      { index: true, element: <Navigate to="/settings/users" replace /> },
      { path: 'users', element: <SuspenseLoader><UsersPage /></SuspenseLoader> },
      { path: 'teams', element: <SuspenseLoader><TeamsPage /></SuspenseLoader> },
      { path: 'lifecycle', element: <SuspenseLoader><LifecycleConfig /></SuspenseLoader> },
      { 
        path: 'channels', 
        element: <ConstructionPage title="Canales de Comunicación" description="Próximamente podrás integrar WhatsApp, Instagram y otros canales directamente aquí." />
      }
    ]
  }
];
