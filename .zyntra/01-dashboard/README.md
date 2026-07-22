# Dashboard

- **Carpeta:** `frontend/src/features/dashboard`
- **Ruta base:** `/dashboard` → redirige a `/dashboard/home`
- **Rutas:** `dashboard/routes/DashboardRoutes.tsx`

## Qué existe

| Página | Ruta | Resumen |
|---|---|---|
| `Dashboard.tsx` (vía `DashboardLoader.tsx`) | `/dashboard/home` | Home genérico: mapea `NAV_MODULES` a tarjetas de acceso rápido a cada módulo (título/ícono/color/descripción tomados de la config de navegación). |

## Qué falta

- No hay dashboard analítico real: sin KPIs, sin gráficas, sin métricas de negocio (conversaciones, deals, leads, etc.).
- Es funcionalmente un launcher de módulos, no un panel de control.

## Ideas para implementación futura

- KPIs de CRM (deals abiertos, valor de pipeline, contactos nuevos).
- KPIs de Inbox (conversaciones activas, tiempo de respuesta promedio).
- Widgets configurables por rol/plan.
