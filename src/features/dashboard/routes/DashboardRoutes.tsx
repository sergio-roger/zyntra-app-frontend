import { Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { DashboardLoader, DashboardFallback } from '@features/dashboard/DashboardLoader';

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    children: [
      { path: '', element: <Navigate to="/dashboard/home" replace /> },
      {
        path: 'home',
        element: (
          <Suspense fallback={<DashboardFallback />}>
            <DashboardLoader />
          </Suspense>
        )
      }
    ]
  }
];
