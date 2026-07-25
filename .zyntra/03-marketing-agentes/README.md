# Marketing (Agentes IA)

- **Carpeta:** `frontend/src/features/marketing` (+ `frontend/src/features/ai-agents`, capa de API/tipos secundaria reutilizada por Inbox → Canales para asignar un agente IA a un canal; no tiene rutas propias)
- **Ruta base:** `/agents`
- **Rutas:** `marketing/routes/MarketingRoutes.tsx`
- **Label en sidebar:** "Marketing" (la key interna y descripciones internas dicen "agentes de IA")

## Qué existe

| Sub-menú | Ruta | Estado | Resumen |
|---|---|---|---|
| Tienda Agentes | `/agents/store` | Implementado (con test spec) | `AiAgentsCatalogPage.tsx`: catálogo de System Agents (marketing strategist, content creator, SEO specialist, etc.) agrupados en tabs horizontales por `AgentCategory` (`marketing.agent_categories`, color hex por categoría → ícono con fondo de color) + filtro de Estado. Botón "Importar" (`useImportAgent`) agrega el agente al `business_system_agents` del negocio; deshabilitado si el agente sigue `coming_soon` o ya fue importado. Hooks en `marketing/hooks/use-agents-catalog.ts`, API en `marketing/api/agents.api.ts`. Componentes compartidos con Team: `marketing/components/AgentCard.tsx`, `AgentDetailModal.tsx`, `AgentRunModal.tsx`, `CategoryTabs.tsx`. |
| Equipo de Agentes | `/agents/team` | Implementado (con test spec, spec desactualizado) | `AiAgentsTeamPage.tsx`: lista los System Agents que el negocio importó (`useImportedAgents`), reusando `AgentCard` con botón "Detalle" que abre `AgentDetailModal` (info de solo lectura: avatar, categoría, estado, `personaPrompt`, `functions`, `AgentStatsRow`); su botón primario encadena a `AgentRunModal` para disparar una corrida del orquestador (solo funciona hoy para `marketing-strategist`, el único `status='active'`; el botón ya no se deshabilita por status). Empty state si no importó ninguno, con link a `/agents/store`. `AiAgentsTeamPage.spec.tsx` todavía busca el botón "Ver Detalles" (texto viejo) — actualizar el spec. |
| Chat con el Equipo | `/agents/chat` | **Mockup visual, no funcional** | `AiAgentsChatPage.tsx`: sin `PageHeader` (se sacó el título para ganar altura) — el panel de chat abre directo con una fila header propia: stack de avatares superpuestos (`ChatTeamAvatarStack`, máx. 5 + "+N") con "Ver equipo" a la izquierda, botones "Nuevo objetivo"/"⋯" a la derecha. Click en el stack abre `TeamRosterPopover` (lista vertical del equipo con status). El hilo de chat tiene tarjetas de plan/entregables/métricas. El panel derecho (`TeamProcessPanel`) es una sidebar colapsable: expandida muestra tabs "Proceso del equipo"/"Herramientas"/"Tareas"/"Archivos"; colapsada (toggle `PanelToggleHeader`) se reduce a un riel de ~64px con solo íconos de tab (`PanelCollapsedTabRail`), y el chat ocupa casi todo el ancho. Todo el contenido sale de `marketing/constants/chat-mock-data.ts` (tipos en `marketing/types/chat-mock.ts`, íconos/estados de agente en `marketing/constants/chat-agent-visuals.ts`) — no pega a ningún endpoint. Estado real: texto del composer, tab activa, colapso del panel y apertura del popover (todo `useState` local); el resto de los botones son decorativos. Componentes en `marketing/components/chat/` (uno por archivo). |

## Identidad y avatares de los agentes

- Migración `20260724_add_identity_to_system_agents.sql` agrega a `workflows.system_agents`: `avatar_object_key` (nullable), `persona_prompt` (`TEXT NOT NULL DEFAULT ''`), `functions` (simple-array, `TEXT NOT NULL DEFAULT ''`). Backfill de los 8 agentes con nombre de persona (Adrián, Valentina, Diego, Nova, Camila, Marcos, Axel, Elena), `role` como título de cara al usuario, `personaPrompt` y `functions` por agente; `avatarObjectKey = 'shared/system-agents/<slug>.jpg'` para los primeros 6 (automation-agent y data-analyst siguen sin avatar).
- Resolución de URL: `SystemAgentsService.resolveAvatarUrl()` → `StorageClientService.getSharedAssetSignedUrl(avatarObjectKey)` → `GET {STORAGE_SERVICE_URL}/storage/shared/signed-url?key=...` (solo `x-service-token`, sin `x-company-id` porque no es un asset tenant-owned).
- `zyntra-storage`: nuevo endpoint `StorageController.getSharedAssetSignedUrl()` (`GET /storage/shared/signed-url`), exige que la key empiece con `SHARED_ASSET_KEY_PREFIX = 'shared/'` (`constants/shared-asset.constants.ts`), firma con TTL configurable `sharedAssetSignedUrlTtlSeconds` (env `SHARED_ASSET_SIGNED_URL_TTL_SECONDS`, default 3600s), protegido por `ServiceTokenGuard` sin scoping de company.
- Carga de imágenes: `zyntra-storage/scripts/upload-system-agent-avatars.ts` es un script one-off (no endpoint) que sube los archivos de `others/mokcup agents/agents-images/` a R2 bajo `shared/system-agents/<slug>.jpg` — paso manual de seeding, no está conectado a ninguna UI de admin.
- Frontend: `AgentAvatar.tsx` renderiza `agent.avatarUrl` si existe, si no cae a un ícono de `lucide-react` por slug (`SLUG_ICONS`) tinteado con `agent.category.color`; soporta `shape="circle"|"panel"` y `bleed` (usado en el hero de `AgentDetailModal`).

## Qué falta

- Definir alcance de "Proyectos" (`/agents/projects`, guard `agents_projects`, sigue `ConstructionPage`).
- "Chat con el Equipo" tiene UI de mockup pero **cero funcionalidad real**: no hay orquestador de chat, no hay backend de mensajería con el equipo de agentes, no hay streaming ni persistencia — hace falta diseñar ese backend desde cero antes de conectar la vista.

1 de 4 sub-secciones del menú sigue sin ningún tipo de UI (Proyectos); Chat tiene UI mockup pero no es funcional.

## Modelo de datos (backend)

- `workflows.system_agents` — catálogo global de System Agents; `category_id` (FK cross-schema a `marketing.agent_categories`), `tasks_done_today`, `tasks_total_today`, `efficiency` (stats persistidas pero sin lógica de cálculo todavía — deuda anotada), + columnas de identidad (`avatar_object_key`, `persona_prompt`, `functions`) descriptas arriba.
- `marketing.agent_categories` — categorías para las tabs del store (slug, name, color, sort_order).
- `marketing.business_system_agents` — join `business_id` + `system_agent_id` (`UNIQUE`), registra qué agentes importó cada negocio a su equipo.
- Endpoints: `GET /agents-catalog` (catálogo completo con `category`, `avatarUrl`, `personaPrompt`, `functions`), `GET /businesses/:businessId/system-agents` (importados), `POST /businesses/:businessId/system-agents/:systemAgentId/import`. Sin endpoints nuevos en este cambio — `agents.module.ts` no cambió estructuralmente.

## Pendientes conocidos

- Definir alcance de "Proyectos" (¿campañas? ¿agrupación de agentes por objetivo de marketing?).
- "Chat con el Equipo" es solo mockup visual (ver arriba) — falta definir y construir el backend real (orquestador multi-agente conversacional, persistencia de mensajes/eventos, ejecución de herramientas) antes de que deje de ser data hardcodeada.
- `tasksDoneToday`/`tasksTotalToday`/`efficiency` no tienen lógica real de tracking todavía — quedan en 0 hasta implementarse.
- Solo `marketing-strategist` es `status='active'`; el resto del catálogo (7 agentes) sigue `coming_soon` y no es importable.
- `automation-agent` y `data-analyst` no tienen avatar subido todavía (sin `avatar_object_key`).
- `AiAgentsTeamPage.spec.tsx` quedó desactualizado: sigue buscando el botón "Ver Detalles", pero el texto actual es "Detalle" (`AgentCard.tsx:43`).
