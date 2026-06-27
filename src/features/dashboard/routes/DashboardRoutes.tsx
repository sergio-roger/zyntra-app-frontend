import { Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import {
  DashboardLoader,
  DashboardFallback,
} from "@features/dashboard/DashboardLoader";
import { useAuthStore } from "@features/auth/store/authStore";

const DashboardRedirect = () => {
  const allowedMenus = useAuthStore((s) => s.allowedMenus);
  const dashboardModule = allowedMenus?.find((m) => m.key === "dashboard");

  if (
    dashboardModule &&
    dashboardModule.children &&
    dashboardModule.children.length > 0
  ) {
    return <Navigate to={dashboardModule.children[0].path} replace />;
  }

  return <Navigate to="/dashboard/home" replace />;
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    children: [
      { path: "", element: <DashboardRedirect /> },
      {
        path: "home",
        element: (
          <Suspense fallback={<DashboardFallback />}>
            <DashboardLoader />
          </Suspense>
        ),
      },
    ],
  },
];
