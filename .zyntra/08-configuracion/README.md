# Configuración (Settings)

- **Carpeta:** `frontend/src/features/settings`
- **Ruta base:** `/settings`
- **Rutas:** `settings/routes/SettingsRoutes.tsx`

La config de navegación agrupa Configuración en 3 sub-grupos (`type: 'group'`): **Ajustes generales**, **Equipo y accesos**, **Configuración del negocio**. Hay además rutas registradas fuera del sidebar (permissions/roles con parámetro, billing).

## Qué existe

| Grupo | Sub-menú | Ruta | Página | Resumen |
|---|---|---|---|---|
| Ajustes generales | Mi cuenta | `/settings/my-account` | `MyAccountPage.tsx` (con test spec) | Perfil de usuario: avatar (`AvatarUploadModal.tsx`, `utils/cropImage.ts`), datos personales, hook `useMyAccount.ts`, schema `my-account.schema.ts` (con test). |
| Ajustes generales | Mi empresa | `/settings/my-company` | `MyCompanyPage.tsx` | Datos del negocio/tenant, hook `useCompany.ts`, API `companyApi.ts`, schema `company.schema.ts`. |
| Ajustes generales | Planes | `/settings/plans` | `PlansPage.tsx` (`shared/pages/`) | Gestión/upgrade de plan de suscripción, guardado bajo `menuKey="billing"`. |
| Equipo y accesos | Usuarios | `/settings/users` | `UsersPage.tsx` (con test spec) | Gestión de usuarios del tenant: `UserFormSidebar.tsx`, hook `useUsersTeams.ts`. |
| Equipo y accesos | Equipo | `/settings/teams` | `TeamsPage.tsx` | Gestión de equipos/teams: `TeamFormSidebar.tsx`. |
| Equipo y accesos | Permisos | `/settings/roles`, `/settings/roles/:role` (alias legado `/settings/permissions*` con `AdminGuard`) | `PermissionsPage.tsx` + `RolePermissionsPage.tsx` | Matriz de permisos por rol: `PermissionMatrix.tsx`, `PermissionToggle.tsx`, `RoleCard.tsx`, `RoleFormSidebar.tsx`. Hooks `usePermissionMatrix.ts`, `usePermissions.ts` (con test spec). |
| Config. del negocio | Ciclo de vida | `/settings/lifecycle` | `LifecycleConfig.tsx` | Etapas del ciclo de vida de leads/contactos: `LifecycleStageCard.tsx`, hook `useLifecycleConfig.ts`. |

Ver también memorias de proyecto: RBAC Implementation State, Auth Identity Model, Channels Settings Module Audit.

## Qué falta

| Sub-menú | Ruta | Estado |
|---|---|---|
| Configuración del negocio → "Configuración" | `/settings/configuracion` | `ConstructionPage` inline (sin página dedicada) |
| Facturación | `/billing` (fuera del árbol `settings`, solo en `AppRouter.tsx`) | `ConstructionPage` inline — **posible redundancia** con `/settings/plans`, que ya es funcional |

## Deuda técnica detectada

- Rutas duplicadas `/settings/permissions*` vs `/settings/roles*` apuntando a los mismos componentes — probable resto de una migración de nomenclatura sin terminar de limpiar (candidato a eliminar el alias legado).
- `/billing` vs `/settings/plans`: aclarar si son la misma feature con dos entradas o si Facturación debe cubrir algo distinto (métodos de pago, historial de facturas) que Planes no cubre.

## Pendientes conocidos

- Implementar "Configuración" general del negocio (alcance por definir).
- Resolver duplicidad Billing/Plans.
- Limpiar rutas legado `permissions` si `roles` es la nomenclatura definitiva.
