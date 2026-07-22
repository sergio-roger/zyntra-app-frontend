# Inbox

- **Carpetas:** `frontend/src/features/chatbot` (conversaciones) + `frontend/src/features/channels` (canales — registrados bajo `/settings/channels` y `/settings/my-channels`, pero agrupados visualmente bajo el menú "Inbox" en `NAV_MODULES`)
- **Ruta base:** `/inbox`
- **Rutas:** `chatbot/routes/ChatbotRoutes.tsx` (conversaciones) + rutas de canales dentro de `settings/routes/SettingsRoutes.tsx`

## Qué existe

| Sub-menú | Ruta | Página | Resumen |
|---|---|---|---|
| Conversaciones | `/inbox` | `ConversationsPage.tsx` (la página más grande del proyecto) | Chat en tiempo real multicanal. Websockets (`lib/chatSocket.ts`, `useConversationSocket.ts`), sonido de notificación (`lib/notificationSound.ts`, `lib/audioContext.ts`, `useInboxSoundSetting.ts`), asignación a agente humano (`useAssignConversation.ts`, `AssignUserCombobox.tsx`, `useAssignableUsers.ts`), panel de contacto (`ContactPanel.tsx`), marcar como leído (`useMarkConversationAsRead.ts`), cambio de estado (`useUpdateConversationStatus.ts`), envío de mensajes (`useSendAgentMessage.ts`), filtro por canal (`useChannels.ts`), listado (`useConversations.ts`, `useConversationDetail.ts`). |
| Canales (catálogo) | `/settings/channels` | `ChannelStorePage.tsx` | Catálogo de tipos de canal disponibles (WhatsApp, Web widget, etc.). |
| Canales → nuevo/editar | `/settings/channels/new`, `/:channelId/edit` | `WebChannelStepFormPage.tsx` | Wizard multi-paso para configurar canal Web Widget: `StepIdentity`, `StepAvailability`, `StepAgent` (asocia agente IA vía feature `ai-agents`), `StepSecurity`, `StepSummary`, `StepIndicator`. Preview en vivo (`WidgetPreview.tsx`), modal de snippet de embed (`EmbedSnippetModal.tsx`). Validación Zod (`web-channel.schema.ts`, con test). Store `channels/store/useChannelsStore.ts`. Buena cobertura de tests. |
| Canales → detalle | `/settings/channels/:channelId` | `ChannelDetailPage.tsx` | Vista/edición de un canal ya creado. |
| Mis Canales | `/settings/my-channels` | `ChannelsListPage.tsx` | Listado de canales ya conectados al negocio (instancias, no catálogo). |

Ver también memoria de proyecto: Web Channel Architecture y Widget Session Auth State para detalle del flujo widget→backend→DB.

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Respuestas rápidas | `/inbox/automations` | `ConstructionPage` (placeholder), guard `inbox_automations` |

## Pendientes conocidos

- Implementar "Respuestas rápidas" (plantillas/atajos de respuesta para agentes humanos en Conversaciones).
- Solo el canal "Web Widget" está completamente implementado según auditoría previa del módulo de canales (ver memoria `channels-settings-module.md`) — otros tipos de canal (WhatsApp, etc.) pueden estar solo en catálogo sin flujo funcional real.
