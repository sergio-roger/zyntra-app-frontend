# Configuración (Settings)

- **Carpeta:** `frontend/src/features/settings`
- **Ruta base:** `/settings`
- **Rutas:** `settings/routes/SettingsRoutes.tsx`

La config de navegación agrupa Configuración en 3 sub-grupos (`type: 'group'`): **Ajustes generales**, **Equipo y accesos**, **Configuración del negocio**. Hay además rutas registradas fuera del sidebar (permissions/roles con parámetro, billing).

## Qué existe

| Grupo | Sub-menú | Ruta | Página | Resumen |
|---|---|---|---|---|
| Ajustes generales | Mi cuenta | `/settings/my-account` | `MyAccountPage.tsx` (con test spec) | Perfil de usuario: avatar (`AvatarUploadModal.tsx`, `utils/cropImage.ts`), datos personales, hook `useMyAccount.ts`, schema `my-account.schema.ts` (con test). |
| Ajustes generales | Mi empresa | `/settings/my-company` | `MyBusinessPage.tsx` (con test spec) | Datos de contacto/facturación del negocio (`security.businesses`): header estilo Facebook `BusinessProfileHeader.tsx` (portada + logo, overlays de cámara/basurero al hover), edición vía drawer `BusinessFormDrawer.tsx` (con test spec). Hook `useBusiness.ts`, API `businessApi.ts`, schema `business.schema.ts`. Lectura abierta a cualquier rol autenticado del tenant; edición (datos, logo, portada) restringida a `admin` a nivel de backend (`BusinessController`, guard por-endpoint) y de UI (controles ocultos para no-admin). |
| Ajustes generales | Planes | `/settings/plans` | `PlansPage.tsx` (`shared/pages/`) | Gestión/upgrade de plan de suscripción, guardado bajo `menuKey="billing"`. |
| Equipo y accesos | Usuarios | `/settings/users` | `UsersPage.tsx` (con test spec) | Gestión de usuarios del tenant: `UserFormSidebar.tsx`, hook `useUsersTeams.ts`. |
| Equipo y accesos | Equipo | `/settings/teams` | `TeamsPage.tsx` | Gestión de equipos/teams: `TeamFormSidebar.tsx`. |
| Equipo y accesos | Permisos | `/settings/roles`, `/settings/roles/:role` (alias legado `/settings/permissions*` con `AdminGuard`) | `PermissionsPage.tsx` + `RolePermissionsPage.tsx` | Matriz de permisos por rol: `PermissionMatrix.tsx`, `PermissionToggle.tsx`, `RoleCard.tsx`, `RoleFormSidebar.tsx`. Hooks `usePermissionMatrix.ts`, `usePermissions.ts` (con test spec). |
| Config. del negocio | Configuración | `/settings/configuracion` | `BusinessProfilePage.tsx` (con test spec) | Perfil de marca/negocio (`security.business_profiles`, 1:1 con `businesses`) usado para dar contexto a los agentes de IA: industria (FK a `crm.industries`, reusa `useIndustrys()` del CRM), nicho, propuesta de valor, misión, competidores, audiencia, modelo de negocio, alcance geográfico, tono de marca, colores, objetivo principal, presupuesto, canales activos, tamaño de equipo. UI en tabs horizontales (`Tabs`) — General / Audiencia / Marca / Objetivos — un solo formulario que envía solo los campos modificados. Componentes nuevos reutilizables: `core/ui/TagInput.tsx` (competidores), `core/ui/MultiSelectChips.tsx` (canales activos). Menú (`settings_config`) y endpoints (`BusinessProfileController`) son **admin-only en lectura y escritura** — a diferencia de "Mi empresa", acá ni siquiera managers/agentes pueden ver la pestaña. Hook `useBusinessProfile.ts`, API `businessProfileApi.ts`, schema `business-profile.schema.ts`. Datos demo sembrados por `backend/src/database/seeds/05-business-profiles.seed.ts` (uno por plan demo: agencia de marketing B2B, moda sostenible DTC B2C, SaaS de gestión de propiedades B2B2C). |
| Config. del negocio | Ciclo de vida | `/settings/lifecycle` | `LifecycleConfig.tsx` | Etapas del ciclo de vida de leads/contactos: `LifecycleStageCard.tsx`, hook `useLifecycleConfig.ts`. |

Ver también memorias de proyecto: RBAC Implementation State, Auth Identity Model, Channels Settings Module Audit.

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Facturación | `/billing` (fuera del árbol `settings`, solo en `AppRouter.tsx`) | `ConstructionPage` inline — **posible redundancia** con `/settings/plans`, que ya es funcional |

## Deuda técnica detectada

- Rutas duplicadas `/settings/permissions*` vs `/settings/roles*` apuntando a los mismos componentes — probable resto de una migración de nomenclatura sin terminar de limpiar (candidato a eliminar el alias legado).
- `/billing` vs `/settings/plans`: aclarar si son la misma feature con dos entradas o si Facturación debe cubrir algo distinto (métodos de pago, historial de facturas) que Planes no cubre.

## Pendientes conocidos

- Resolver duplicidad Billing/Plans.
- Limpiar rutas legado `permissions` si `roles` es la nomenclatura definitiva.
