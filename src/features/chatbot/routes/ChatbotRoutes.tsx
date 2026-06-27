import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@core/routes/ProtectedRoute";
import { ConstructionPage } from "@shared/components/ConstructionPage";
import { SuspenseLoader } from "@shared/components/SuspenseLoader";
import { PermissionGuard } from "@core/routes/PermissionGuard";
import { ModuleGuard } from "@core/components/ModuleGuard";

const ConversationsPage = lazy(() =>
  import("@features/chatbot/pages/ConversationsPage").then((m) => ({
    default: m.ConversationsPage,
  })),
);

export const chatbotRoutes: RouteObject[] = [
  {
    path: "/inbox",
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_conversations">
          <ModuleGuard menuKey="inbox_conversations">
            <SuspenseLoader>
              <ConversationsPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inbox/automations",
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_automations">
          <ModuleGuard menuKey="inbox_automations">
            <ConstructionPage />
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inbox/channels",
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_channels">
          <ModuleGuard menuKey="inbox_channels">
            <ConstructionPage />
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chatbot",
    element: (
      <ProtectedRoute>
        <PermissionGuard menuKey="inbox_conversations">
          <ModuleGuard menuKey="inbox_conversations">
            <SuspenseLoader>
              <ConversationsPage />
            </SuspenseLoader>
          </ModuleGuard>
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
];
