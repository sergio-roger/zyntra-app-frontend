# Marketing (Agentes IA)

- **Carpeta:** `frontend/src/features/marketing` (+ `frontend/src/features/ai-agents`, capa de API/tipos secundaria reutilizada por Inbox → Canales para asignar un agente IA a un canal; no tiene rutas propias)
- **Ruta base:** `/agents`
- **Rutas:** `marketing/routes/MarketingRoutes.tsx`
- **Label en sidebar:** "Marketing" (la key interna y descripciones internas dicen "agentes de IA")

## Qué existe

| Sub-menú | Ruta | Estado | Resumen |
|---|---|---|---|
| Tienda Agentes | `/agents/store` | Implementado (con test spec) | `AiAgentsCatalogPage.tsx`: catálogo de System Agents (marketing strategist, content creator, SEO specialist, etc.) agrupados en tabs horizontales por `AgentCategory` (`marketing.agent_categories`, color hex por categoría → ícono con fondo de color) + filtro de Estado. Botón "Importar" (`useImportAgent`) agrega el agente al `business_system_agents` del negocio; deshabilitado si el agente sigue `coming_soon` o ya fue importado. Hooks en `marketing/hooks/use-agents-catalog.ts`, API en `marketing/api/agents.api.ts`. Componentes compartidos con Team: `marketing/components/AgentCard.tsx`, `AgentRunModal.tsx`, `CategoryTabs.tsx`. |
| Equipo de Agentes | `/agents/team` | Implementado (con test spec) | `AiAgentsTeamPage.tsx`: lista los System Agents que el negocio importó (`useImportedAgents`), reusando `AgentCard` con botón "Ver Detalles" que abre `AgentRunModal` para disparar una corrida del orquestador (solo funciona hoy para `marketing-strategist`, el único `status='active'`). Empty state si no importó ninguno, con link a `/agents/store`. |

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Proyectos | `/agents/projects` | `ConstructionPage` (placeholder), guard `agents_projects` |

1 de 3 sub-secciones del menú sigue sin implementar.

## Modelo de datos (backend)

- `workflows.system_agents` — catálogo global de System Agents (no cambia de schema); ahora con `category_id` (FK cross-schema a `marketing.agent_categories`), `tasks_done_today`, `tasks_total_today`, `efficiency` (stats persistidas pero sin lógica de cálculo todavía — deuda anotada).
- `marketing.agent_categories` — categorías para las tabs del store (slug, name, color, sort_order).
- `marketing.business_system_agents` — join `business_id` + `system_agent_id` (`UNIQUE`), registra qué agentes importó cada negocio a su equipo.
- Endpoints: `GET /agents-catalog` (catálogo completo con `category`), `GET /businesses/:businessId/system-agents` (importados), `POST /businesses/:businessId/system-agents/:systemAgentId/import`.

## Pendientes conocidos

- Definir alcance de "Proyectos" (¿campañas? ¿agrupación de agentes por objetivo de marketing?).
- `tasksDoneToday`/`tasksTotalToday`/`efficiency` no tienen lógica real de tracking todavía — quedan en 0 hasta implementarse.
- Solo `marketing-strategist` es `status='active'`; el resto del catálogo (7 agentes) sigue `coming_soon` y no es importable.
