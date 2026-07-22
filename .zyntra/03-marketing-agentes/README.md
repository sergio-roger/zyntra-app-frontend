# Marketing (Agentes IA)

- **Carpeta:** `frontend/src/features/agents` (+ `frontend/src/features/ai-agents`, capa de API/tipos secundaria reutilizada por Inbox → Canales para asignar un agente IA a un canal; no tiene rutas propias)
- **Ruta base:** `/agents`
- **Rutas:** `agents/routes/AgentRoutes.tsx`
- **Label en sidebar:** "Marketing" (la key interna y descripciones internas dicen "agentes de IA")

## Qué existe

| Sub-menú | Ruta | Estado | Resumen |
|---|---|---|---|
| Tienda Agentes | `/agents/store` | Implementado (con test spec) | `AiAgentsCatalogPage.tsx`: catálogo de agentes de IA del sistema (marketing strategist, content creator, SEO specialist, etc.) con iconos por slug. Hooks `useSystemAgentsCatalog`, `useOrchestratorRun`, `useTriggerOrchestratorRun` (`agents/hooks/use-agents-catalog.ts`), API `agents/api/agents.api.ts`. Modal `AgentRunModal` para ejecutar un agente sobre un "orchestrator run". |

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Proyectos | `/agents/projects` | `ConstructionPage` (placeholder), guard `agents_projects` |
| Equipo de Agentes | `/agents/team` | `ConstructionPage` (placeholder), guard `agents_team` |

2 de 3 sub-secciones del menú están sin implementar.

## Pendientes conocidos

- Definir alcance de "Proyectos" (¿campañas? ¿agrupación de agentes por objetivo de marketing?).
- Definir alcance de "Equipo de Agentes" (¿gestión colaborativa de varios agentes IA trabajando juntos?).
