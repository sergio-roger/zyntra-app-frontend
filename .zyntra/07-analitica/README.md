# Analítica

- **Carpeta:** no existe (`frontend/src/features/analytics` no está creado).
- **Ruta:** `/analytics/*` registrada solo en `AppRouter.tsx` como placeholder:

```tsx
{ path: '/analytics/*', element: <ModuleGuard menuKey="analytics"><ConstructionPage /></ModuleGuard> }
```

## Qué existe

- Nada implementado. La config de navegación (`navigation.ts`) ya define 4 sub-secciones planeadas: **General, Conversaciones, Leads, Rendimiento** — pero ninguna tiene ruta ni página propia; todo el árbol `/analytics/*` cae en el mismo `ConstructionPage` genérico sin distinguir sub-sección.

## Qué falta

- Las 4 sub-secciones planeadas en el menú:
  - **General** — métricas globales del negocio.
  - **Conversaciones** — métricas de Inbox (volumen, tiempo de respuesta, resolución).
  - **Leads** — métricas de CRM (conversión, origen, embudo).
  - **Rendimiento** — métricas de equipo/agentes.

## Pendientes conocidos

- Es, junto con Drive, el módulo menos desarrollado del panel a pesar de tener ya la estructura de sub-menús diseñada.
- Definir fuente de datos (backend endpoints de analítica) antes de construir el frontend.
