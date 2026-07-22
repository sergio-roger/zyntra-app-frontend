# Planificación por módulo — Zyntra Admin Panel

Documentación de estado real (código) por cada menú principal del panel, para tener planificación organizada y ver qué falta implementar. Generado el 2026-07-21 a partir de un mapeo exhaustivo del router (`frontend/src/routes/AppRouter.tsx`), la config de navegación (`frontend/src/shared/constants/navigation.ts`) y las carpetas `frontend/src/features/*`.

Cada carpeta de módulo tiene un `README.md` con: sub-secciones existentes, resumen de qué hace cada una, y lo que falta implementar.

## Índice de módulos

| # | Módulo | Estado general |
|---|---|---|
| [01-dashboard](01-dashboard/README.md) | Dashboard | Placeholder — solo launcher de tarjetas, sin KPIs reales |
| [02-crm](02-crm/README.md) | CRM | Maduro — el módulo más completo del proyecto |
| [03-marketing-agentes](03-marketing-agentes/README.md) | Marketing (Agentes IA) | Parcial — 1 de 3 sub-secciones funcional |
| [04-workflows-automations](04-workflows-automations/README.md) | Workflows | Parcial — Formularios y Agentes de Flujo OK, builder visual sin implementar |
| [05-inbox](05-inbox/README.md) | Inbox | Maduro — Conversaciones y Canales muy desarrollados, falta Respuestas rápidas |
| [06-drive](06-drive/README.md) | Drive | Sin implementar — no existe carpeta de feature |
| [07-analitica](07-analitica/README.md) | Analítica | Sin implementar — no existe carpeta de feature |
| [08-configuracion](08-configuracion/README.md) | Configuración | Mayormente maduro — quedan 2 placeholders y rutas duplicadas por limpiar |

## Notas transversales

- Rutas sin implementar usan el componente compartido `ConstructionPage` (`frontend/src/shared/components/ConstructionPage.tsx`).
- Acceso combinando dos guards: `PermissionGuard` (rol) y `ModuleGuard` (plan de suscripción, vía `usePlanModule`).
- No hay `TODO`/`FIXME` reales en el código — la señal de incompletitud es el patrón `ConstructionPage` / `ComingSoonTab`, o la ausencia física de la carpeta del feature.
- Mantener estos README actualizados a mano cuando se implemente algo nuevo — no se regeneran automáticamente.
