import { Suspense } from 'react';
import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from '@features/auth/routes/AuthRoutes';
import { crmRoutes } from '@crm/routes/CrmRoutes';
import { agentRoutes } from '@features/agents/routes/AgentRoutes';
import { chatbotRoutes } from '@features/chatbot/routes/ChatbotRoutes';
import { settingsRoutes } from '@features/settings/routes/SettingsRoutes';
import { ProtectedRoute } from '@core/routes/ProtectedRoute';
import { AppShell } from '@shared/layouts/AppShell';
import { DashboardLoader, DashboardFallback } from '@features/dashboard/DashboardLoader';
import { ConstructionPage } from '@shared/components/ConstructionPage';

const AppRoutes = () => {
  return useRoutes([
    ...authRoutes,
    {
      element: (
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      ),
      children: [
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
        },
        ...crmRoutes,
        ...chatbotRoutes,
        ...agentRoutes,
        ...settingsRoutes,
        { path: '/funnels/*', element: <ConstructionPage /> },
        { path: '/avatar/*', element: <ConstructionPage /> },
        { path: '/analytics/*', element: <ConstructionPage /> },
        { path: '/construction', element: <ConstructionPage /> }
      ]
    },
    { path: '/', element: <Navigate to="/login" /> },
    { path: '*', element: <Navigate to="/login" /> }
  ]);
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
