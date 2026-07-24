# Drive

Implementado siguiendo `Storage.md` (raíz del repo). Contexto técnico completo en ese
archivo; este README refleja el estado real después de la implementación.

## Qué existe

- **Carpeta:** `frontend/src/features/drive/` (api, hooks, types, utils, components, pages, routes).
- **Ruta:** `/drive/:section/:folderId?` con `section ∈ {me, company, recent, trash}`,
  registrada en `AppRouter.tsx` vía `driveRoutes` (reemplazó el placeholder `ConstructionPage`).
- **Backend monolito:** `backend/src/modules/drive/` (`DriveController` + `DriveService`),
  montado en `businesses/:businessId/drive/*`, `@RequiresModule('drive')`.
- **Backend storage-service:** `zyntra-storage/src/folders/` (CRUD de carpetas + cascada de
  papelera) y extensión de `src/storage/`/`src/files/` (trash, restore, permanent delete,
  move/rename, `folderId`/`ownerType`/`ownerId` en `files`).
- **DB:** tabla `folders` nueva en storage-service; columnas `folder_id`, `owner_type`,
  `owner_id`, `is_starred` agregadas a `files`; `drive_root_folder_id` en
  `security.businesses` y `security.users` (puntero lógico, resuelto perezosamente la
  primera vez que cada owner entra a Drive).

## Funcionalidad implementada

- **Mi unidad** y **Empresa**: navegación por carpetas con breadcrumbs, grid/lista,
  crear/renombrar/mover/eliminar (papelera en cascada) carpetas, subir archivos con barra
  de progreso, drag&drop de archivos del SO y drag&drop interno para mover ítems entre
  carpetas, menú contextual (click derecho), modal de mover con selector de árbol de
  carpetas, preview de imágenes/PDF, descarga.
- **Recientes**: cruza "Mi unidad" + "Empresa", solo archivos, sin carpetas.
- **Papelera**: ídem, cruza ambos scopes; restaurar y eliminar definitivamente.
- **Permisos**: scope "Empresa" restringe mutaciones a ADMIN/MANAGER/SUPER_ADMIN
  (`@Roles` a nivel de acción, un solo `menuKey: 'drive'`). Scope "Mi unidad" solo permite
  al dueño real del recurso (verificado server-side contra el registro real, no confiando
  en lo que declare el cliente).

## Pendiente conocido

- **Destacados** (`is_starred`): columna ya existe en `folders`/`files`, pero no hay UI
  para marcar/ver favoritos ni endpoint dedicado de listado. Quedó explícitamente pospuesto
  (decisión del usuario, 2026-07-23) — es de baja prioridad según `Storage.md`.
- **Fase 2 de `Storage.md`** (fuera de esta ronda): compartir por enlace / "Compartido
  conmigo", historial de versiones, búsqueda avanzada por tipo/tags.

## Decisiones que se apartan de `Storage.md`

- Los endpoints de carpetas del storage-service viven en un `FoldersController`/`FoldersModule`
  dedicados (no metidos en `storage.controller.ts`) — mejor alineado con SOLID (S) dado que
  no tocan R2, a diferencia de `StorageController`.
- Se agregó `GET /storage/files/:id` y `GET /storage/folders/:id` (no estaban en el doc
  original): son necesarios para que el monolito verifique el dueño real de un recurso antes
  de mutarlo — el doc no contemplaba ese control de acceso y sin él cualquier usuario
  autenticado de la empresa podía mover/renombrar/borrar archivos o carpetas personales de
  otro usuario con solo conocer su id.
- `listChildren` en el monolito devuelve también el `folderId` resuelto (necesario para que
  el frontend sepa el id real de la carpeta raíz perezosa al mover ítems hacia "Raíz").
