import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ConstructionPage } from '@shared/components/ConstructionPage';
import { SuspenseLoader } from '@shared/components/SuspenseLoader';
import { PermissionGuard } from '@core/routes/PermissionGuard';

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
      { path: 'contacts', element: <PermissionGuard menuKey="crm_contacts"><SuspenseLoader><ContactListPage /></SuspenseLoader></PermissionGuard> },
      { path: 'leads', element: <PermissionGuard menuKey="crm_leads"><SuspenseLoader><InboxLeadsPage /></SuspenseLoader></PermissionGuard> },
      { path: 'deals', element: <PermissionGuard menuKey="crm_deals"><SuspenseLoader><DealsPage /></SuspenseLoader></PermissionGuard> },
      { path: 'pipeline', element: <PermissionGuard menuKey="crm_deals"><SuspenseLoader><PipelinePage /></SuspenseLoader></PermissionGuard> },
      { path: 'tags', element: <PermissionGuard menuKey="crm_tags"><SuspenseLoader><TagsPage /></SuspenseLoader></PermissionGuard> },
      { path: 'tasks', element: <PermissionGuard menuKey="crm_tasks"><SuspenseLoader><TasksPage /></SuspenseLoader></PermissionGuard> },
      { path: 'fields', element: <PermissionGuard menuKey="crm_fields"><SuspenseLoader><CustomFieldsPage /></SuspenseLoader></PermissionGuard> },
      { path: 'segments', element: <PermissionGuard menuKey="crm_segments"><ConstructionPage title="Segmentos Inteligentes" description="Crea listas dinámicas que se actualizan solas según el comportamiento de tus leads." /></PermissionGuard> }
    ]
  }
];

