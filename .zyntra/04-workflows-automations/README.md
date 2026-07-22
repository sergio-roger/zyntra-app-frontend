# Workflows

- **Carpeta:** `frontend/src/features/automations`
- **Ruta base:** `/automations`
- **Rutas:** `automations/routes/AutomationRoutes.tsx`

## Qué existe

| Sub-menú | Ruta | Página | Resumen |
|---|---|---|---|
| Agentes de Flujo | `/automations/agents`, `/new`, `/:agentId` | `AgentsListPage.tsx` + `AgentDetailPage.tsx` | CRUD de agentes conversacionales configurables (distinto del catálogo de "Marketing"). Detalle con tabs: **Identidad** (`IdentityTab.tsx`, schema `agent-identity.schema.ts`, funcional), **Herramientas** (`ToolsTab.tsx`, funcional), **Conocimiento** (`KnowledgeTab.tsx`, hook `use-agent-knowledge.ts`, API `knowledge.api.ts`, funcional), **Probar agente** (`TestAgentTab.tsx`, funcional — permite chatear con el agente para probarlo). Hooks: `use-agents.ts`, `use-agent-channel.ts` (vincula el agente a un canal). |
| Formularios | `/automations/forms`, `/new`, `/:formId` | `FormsListPage.tsx` + `FormDetailPage.tsx` | Constructor de formularios: tabs `FormDetailsTab.tsx`, `FormFieldsTab.tsx` (con `FormFieldSidebar.tsx`), `FormSubmissionsTab.tsx` (envíos). Schema `form-template.schema.ts`, API `forms.api.ts`, hook `use-forms.ts`. |

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Workflows (builder visual de flujos) | `/automations/workflows` | `ConstructionPage`, registrado solo en `AppRouter.tsx` — **no tiene ni carpeta de página dedicada**, guard `automations_workflows` |
| Agentes de Flujo → tab "Memoria" | (dentro de `/automations/agents/:agentId`) | `ComingSoonTab` explícito ("La configuración de memoria y contexto para agentes va a estar disponible próximamente") |

## Notas técnicas

- La tab "Probar agente" no tiene key propia en el árbol de menús/permisos — hereda el guard del módulo padre (comentario en `AgentDetailPage.tsx` ~línea 130). Señal de que el sistema de permisos por sub-tab aún está en evolución.

## Pendientes conocidos

- Diseñar e implementar el builder visual de Workflows (drag & drop de nodos, triggers, condiciones) — es la sub-sección más prominente del menú y la única totalmente ausente.
- Implementar tab de Memoria para Agentes de Flujo (contexto persistente / historial configurable).
