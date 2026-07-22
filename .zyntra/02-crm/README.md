# CRM

- **Carpeta:** `frontend/src/features/crm`
- **Ruta base:** `/crm`
- **Rutas:** `crm/routes/CrmRoutes.tsx`

Es el módulo más completo y maduro del proyecto (+100 archivos entre pages, components, hooks, types, schemas, store). Todas las sub-secciones usan `PermissionGuard` + `ModuleGuard` + lazy loading.

## Qué existe

| Sub-menú | Ruta | Página | Resumen |
|---|---|---|---|
| Contactos | `/crm/contacts` | `ContactListPage.tsx` | Listado/gestión con filtros (`ContactFilters.tsx`), tabla (`ContactTable.tsx`), sidebar crear/editar (`ContactFormSidebar.tsx`), campos personalizados (`ContactCustomFieldsSidebar.tsx`), import/export CSV. Hooks `useContacts`, `useCustomFields`, `useTags`, `useUserPreferences`. |
| Inbox Leads | `/crm/leads` | `InboxLeadsPage.tsx` | Bandeja de leads entrantes para archivar o convertir en negocio (`ConvertToDealSidebar.tsx`). Hook `useLeads`. |
| Empresas | `/crm/companies` | `CompanyListPage.tsx` | Análogo a Contactos: tabla, filtros, sidebar, campos personalizados, import/export. Hook `useCompanies`. |
| Negocios (Deals) | `/crm/deals` | `DealsPage.tsx` | Pipeline tipo Kanban (`DealsKanban.tsx`, `DealsColumn.tsx`, `DealCard.tsx`, `DealDetailSidebar.tsx`, `DealFormSidebar.tsx`, `PipelineFormModal.tsx`, `PipelineSettingsDrawer.tsx`, `StageEditSidebar.tsx`). Store dedicado `crm/store/kanbanStore.ts`. Búsqueda de contacto/empresa asociada. Con test spec. |
| Etiquetas | `/crm/tags` | `TagsPage.tsx` | CRUD de tags, `TagFormSidebar.tsx`, hook `useTags`. |
| Tareas | `/crm/tasks` | `TasksPage.tsx` | Tablero de tareas/actividades (`TaskBoard.tsx`, `TaskFormSidebar.tsx`), hook `useCrmTasks`. |
| Campos | `/crm/fields` | `CustomFieldsPage.tsx` | Campos personalizados para contactos/empresas (`CustomFieldFormSidebar.tsx`, `CustomFieldConditionBuilder.tsx`, `CustomFieldFilterSidebar.tsx`). |
| Segmentos | `/crm/segments` | `SegmentsPage.tsx` | Listas inteligentes con reglas condicionales (`SegmentEditor.tsx`, `SegmentListPanel.tsx`, `SegmentPreviewPanel.tsx`, `SegmentDetail.tsx`, `ConditionBuilder.tsx`). |

Ciclo de vida (lifecycle stages) se referencia desde CRM pero se configura en Configuración → Ciclo de vida (ver [08-configuracion](../08-configuracion/README.md)).

## Qué falta

- No se detectaron placeholders ni `ConstructionPage` en este módulo.
- Es el módulo con mayor cobertura de tests (`DealsKanban.spec.tsx`, `ContactFilters.spec.tsx`, `CompanyFilters.spec.tsx`).

## Pendientes conocidos

- Ninguno crítico identificado en el código. Revisar backlog de producto para features nuevas (no derivables del código).
