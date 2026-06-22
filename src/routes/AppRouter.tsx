import { ModuleGuard } from '@core/components/ModuleGuard';
import { ProtectedRoute } from '@core/routes/ProtectedRoute';
import { crmRoutes } from '@crm/routes/CrmRoutes';
import { agentRoutes } from '@features/agents/routes/AgentRoutes';
import { authRoutes } from '@features/auth/routes/AuthRoutes';
import { chatbotRoutes } from '@features/chatbot/routes/ChatbotRoutes';
import { dashboardRoutes } from '@features/dashboard/routes/DashboardRoutes';
import { settingsRoutes } from '@features/settings/routes/SettingsRoutes';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { PlansPage } from '../shared/pages/PlansPage';
import { AppShell } from '@shared/layouts/AppShell';
import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';

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
        ...dashboardRoutes,
        ...crmRoutes,
        ...chatbotRoutes,
        ...agentRoutes,
        ...settingsRoutes,
        { path: '/funnels/*', element: <ModuleGuard menuKey="funnels"><ConstructionPage /></ModuleGuard> },
        { path: '/avatar/*', element: <ModuleGuard menuKey="avatar"><ConstructionPage /></ModuleGuard> },
        { path: '/analytics/*', element: <ModuleGuard menuKey="analytics"><ConstructionPage /></ModuleGuard> },
        { path: '/billing', element: <ConstructionPage title="Facturación" description="Gestiona tu plan y métodos de pago." /> },
        { path: '/plans', element: <PlansPage /> },
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
