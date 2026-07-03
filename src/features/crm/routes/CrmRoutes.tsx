import { ModuleGuard } from "@core/components/ModuleGuard";
import { PermissionGuard } from "@core/routes/PermissionGuard";
import { SuspenseLoader } from "@shared/components/SuspenseLoader";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const ContactListPage = lazy(() =>
  import("@crm/pages/ContactListPage").then((m) => ({
    default: m.ContactListPage,
  })),
);
const InboxLeadsPage = lazy(() =>
  import("@crm/pages/InboxLeadsPage").then((m) => ({
    default: m.InboxLeadsPage,
  })),
);
const TagsPage = lazy(() =>
  import("@crm/pages/TagsPage").then((m) => ({ default: m.TagsPage })),
);
const CustomFieldsPage = lazy(() =>
  import("@crm/pages/CustomFieldsPage").then((m) => ({
    default: m.CustomFieldsPage,
  })),
);
const TasksPage = lazy(() =>
  import("@crm/pages/TasksPage").then((m) => ({ default: m.TasksPage })),
);
const DealsPage = lazy(() =>
  import("@crm/pages/DealsPage").then((m) => ({ default: m.DealsPage })),
);
const SegmentsPage = lazy(() =>
  import("@crm/pages/SegmentsPage").then((m) => ({ default: m.SegmentsPage })),
);
const CompanyListPage = lazy(() =>
  import("@crm/pages/CompanyListPage").then((m) => ({
    default: m.CompanyListPage,
  })),
);

export const crmRoutes: RouteObject[] = [
  {
    path: "/crm",
    children: [
      { index: true, element: <Navigate to="/crm/contacts" replace /> },
      {
        path: "contacts",
        element: (
          <PermissionGuard menuKey="crm_contacts">
            <ModuleGuard menuKey="crm_contacts">
              <SuspenseLoader>
                <ContactListPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "leads",
        element: (
          <PermissionGuard menuKey="crm_leads">
            <ModuleGuard menuKey="crm_leads">
              <SuspenseLoader>
                <InboxLeadsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "deals",
        element: (
          <PermissionGuard menuKey="crm_deals">
            <ModuleGuard menuKey="crm_deals">
              <SuspenseLoader>
                <DealsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "tags",
        element: (
          <PermissionGuard menuKey="crm_tags">
            <ModuleGuard menuKey="crm_tags">
              <SuspenseLoader>
                <TagsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "tasks",
        element: (
          <PermissionGuard menuKey="crm_tasks">
            <ModuleGuard menuKey="crm_tasks">
              <SuspenseLoader>
                <TasksPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "fields",
        element: (
          <PermissionGuard menuKey="crm_fields">
            <ModuleGuard menuKey="crm_fields">
              <SuspenseLoader>
                <CustomFieldsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "segments",
        element: (
          <PermissionGuard menuKey="crm_segments">
            <ModuleGuard menuKey="crm_segments">
              <SuspenseLoader>
                <SegmentsPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
      {
        path: "companies",
        element: (
          <PermissionGuard menuKey="crm_companies">
            <ModuleGuard menuKey="crm_companies">
              <SuspenseLoader>
                <CompanyListPage />
              </SuspenseLoader>
            </ModuleGuard>
          </PermissionGuard>
        ),
      },
    ],
  },
];
