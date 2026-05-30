import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@core/routes/ProtectedRoute';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const ConversationsPage = lazy(() => import('@features/chatbot/pages/ConversationsPage').then(m => ({ default: m.ConversationsPage })));

export const chatbotRoutes: RouteObject[] = [
  { 
    path: '/inbox', 
    element: <ProtectedRoute><SuspenseLoader><ConversationsPage /></SuspenseLoader></ProtectedRoute> 
  },
  { 
    path: '/inbox/automations', 
    element: <ProtectedRoute><ConstructionPage /></ProtectedRoute> 
  },
  { 
    path: '/inbox/channels', 
    element: <ProtectedRoute><ConstructionPage /></ProtectedRoute> 
  },
  { 
    path: '/chatbot', 
    element: <ProtectedRoute><SuspenseLoader><ConversationsPage /></SuspenseLoader></ProtectedRoute> 
  }
];