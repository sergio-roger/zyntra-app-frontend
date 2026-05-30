import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';

const ContactListPage = lazy(() => import('@crm/pages/ContactListPage').then(m => ({ default: m.ContactListPage })));
const PipelinePage = lazy(() => import('@crm/pages/PipelinePage').then(m => ({ default: m.PipelinePage })));
const InboxLeadsPage = lazy(() => import('@crm/pages/InboxLeadsPage').then(m => ({ default: m.InboxLeadsPage })));
const TagsPage = lazy(() => import('@crm/pages/TagsPage').then(m => ({ default: m.TagsPage })));
const CustomFieldsPage = lazy(() => import('@crm/pages/CustomFieldsPage').then(m => ({ default: m.CustomFieldsPage })));
const TasksPage = lazy(() => import('@crm/pages/TasksPage').then(m => ({ default: m.TasksPage })));
const DealsPage = lazy(() => import('@crm/pages/DealsPage').then(m => ({ default: m.DealsPage })));

export const crmRoutes: RouteObject[] = [
  {
    path: '/crm',
    children: [
      { index: true, element: <Navigate to="/crm/contacts" replace /> },
      { path: 'contacts', element: <SuspenseLoader><ContactListPage /></SuspenseLoader> },
      { path: 'leads', element: <SuspenseLoader><InboxLeadsPage /></SuspenseLoader> },
      { path: 'deals', element: <SuspenseLoader><DealsPage /></SuspenseLoader> },
      { path: 'pipeline', element: <SuspenseLoader><PipelinePage /></SuspenseLoader> },
      { path: 'tags', element: <SuspenseLoader><TagsPage /></SuspenseLoader> },
      { path: 'tasks', element: <SuspenseLoader><TasksPage /></SuspenseLoader> },
      { path: 'fields', element: <SuspenseLoader><CustomFieldsPage /></SuspenseLoader> },
      { path: 'segments', element: <ConstructionPage title="Segmentos Inteligentes" description="Crea listas dinámicas que se actualizan solas según el comportamiento de tus leads." /> }
    ]
  }
];

