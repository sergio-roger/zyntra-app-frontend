# Drive

- **Carpeta:** no existe (`frontend/src/features/drive` no está creado).
- **Ruta:** `/drive/*` registrada solo en `AppRouter.tsx` como placeholder:

```tsx
{ path: '/drive/*', element: <ModuleGuard menuKey="drive"><ConstructionPage /></ModuleGuard> }
```

## Qué existe

- Nada — solo la entrada de menú + guard de plan (`menuKey="drive"`) + `ConstructionPage` genérica.

## Qué falta

- Todo el módulo: no hay sub-secciones, componentes, hooks ni servicios propios.
- Definir alcance funcional (¿gestión de archivos/documentos del negocio? ¿almacenamiento adjunto a contactos/deals?) antes de empezar a implementar.

## Pendientes conocidos

- Diseño de UX y modelo de datos aún no iniciado.
