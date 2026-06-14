# Arquitectura Moderna React para Apps SaaS

## Stack principal

```txt
React
+ TypeScript
+ Feature Architecture
+ TanStack Query
+ Zustand
+ React Hook Form
+ Zod
```

---

# Objetivo de esta arquitectura

Esta arquitectura busca resolver:

- escalabilidad
- mantenibilidad
- separación de responsabilidades
- clean code
- reutilización
- organización modular
- manejo moderno de estado

---

# Conceptos fundamentales

## 1. UI ≠ lógica ≠ estado ≠ API

La idea principal:

```txt
UI
↓
Hooks
↓
Query/API
↓
Backend
```

Cada capa tiene una responsabilidad específica.

---

# Arquitectura Feature-Based

## Problema clásico

Muchas apps React empiezan así:

```txt
components/
hooks/
services/
pages/
```

Cuando el proyecto crece:

- todo se mezcla
- difícil mantener
- difícil escalar
- difícil trabajar en equipo

---

# Solución: Feature Architecture

Organizar por funcionalidades.

## Ejemplo

```txt
src/
│
├── features/
│   ├── auth/
│   ├── projects/
│   ├── billing/
│   └── users/
```

Cada feature es una mini app.

---

# Estructura profesional de un feature

## Feature: projects

```txt
features/projects/
│
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── store/
├── types/
└── utils/
```

---

# Responsabilidad de cada capa

| Carpeta | Responsabilidad |
|---|---|
| api | HTTP/API/backend |
| components | UI |
| hooks | lógica React |
| pages | composición |
| schemas | validación |
| store | estado global cliente |
| types | tipado TypeScript |
| utils | helpers |

---

# Flujo completo de arquitectura

```txt
Page
 ↓
Hook
 ↓
TanStack Query
 ↓
API Layer
 ↓
Backend
```

---

# Ejemplo completo REAL

# Feature: Projects

Objetivo:

- listar proyectos
- crear proyectos
- editar proyectos
- abrir modal global
- validar formularios
- cachear datos

---

# 1. TypeScript Layer

## `types/project.ts`

```ts
export interface Project {
  id: number;
  name: string;
  status: "active" | "completed";
}
```

## Responsabilidad

TypeScript:

- define contratos
- evita errores
- documenta estructuras
- mejora autocomplete

---

# Variantes reales

## Proyecto pequeño

Puedes usar tipos inline.

## Proyecto enterprise

Separas:

```txt
ProjectDto
ProjectEntity
ProjectViewModel
```

---

# 2. API Layer

## `api/getProjects.ts`

```ts
export async function getProjects() {
  const response = await fetch("/api/projects");

  if (!response.ok) {
    throw new Error("Error loading projects");
  }

  return response.json();
}
```

---

# Principios importantes

La capa API:

✅ SOLO HTTP

❌ NO UI

❌ NO loading

❌ NO useState

❌ NO lógica React

---

# Variantes reales

## REST API

```txt
fetch
axios
```

## GraphQL

```txt
Apollo Client
Relay
urql
```

## Enterprise

A veces existe:

```txt
repository layer
```

---

# 3. TanStack Query

## Instalación

```bash
npm install @tanstack/react-query
```

---

# Provider Global

## `app/providers/QueryProvider.tsx`

```tsx
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({
  children,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

# Hook Query

## `hooks/useProjects.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/getProjects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}
```

---

# ¿Qué resuelve TanStack Query?

Antes manejabas manualmente:

```txt
loading
error
cache
retry
refetch
sync
```

Ahora TanStack Query lo hace automáticamente.

---

# Principio importante

# Server State

Datos que vienen del backend.

Ejemplos:

- users
- projects
- invoices
- tasks

---

# NO usar Zustand para API data

Incorrecto:

```txt
projects list en Zustand
```

Correcto:

```txt
projects → TanStack Query
modal abierta → Zustand
```

---

# Casos reales

## Dashboard grande

Muchos componentes usan los mismos datos.

TanStack Query cachea automáticamente.

Resultado:

- 1 request
- muchos componentes reutilizan cache

---

# Optimistic Updates

Ejemplo:

Apps tipo:

- Trello
- Notion
- Linear

La UI cambia INMEDIATAMENTE
antes de que el backend responda.

TanStack Query soporta:

```txt
onMutate
rollback
cache update
```

---

# 4. UI Components

## `components/ProjectCard.tsx`

```tsx
interface Props {
  project: Project;
}

export function ProjectCard({
  project,
}: Props) {
  return (
    <div>
      <h3>{project.name}</h3>
    </div>
  );
}
```

---

# Principio importante

# Componentes deben ser tontos

Responsabilidades:

✅ renderizar

✅ recibir props

---

# Componentes NO deben:

❌ hacer fetch complejo

❌ manejar lógica enorme

❌ manejar validaciones

❌ manejar reglas de negocio

---

# Variantes reales

## Presentational Components

UI pura.

## Smart Components

A veces usan hooks.

## Design Systems

Empresas grandes separan:

```txt
ui/
domain/
```

---

# 5. React Hook Form

## Instalación

```bash
npm install react-hook-form
```

---

# Problema clásico

```tsx
const [name, setName] = useState("");
```

por cada input.

---

# Solución RHF

## `CreateProjectForm.tsx`

```tsx
import { useForm } from "react-hook-form";

export function CreateProjectForm() {
  const {
    register,
    handleSubmit,
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name")}
      />

      <button type="submit">
        Save
      </button>
    </form>
  );
}
```

---

# Beneficios

✅ menos renders

✅ menos boilerplate

✅ formularios limpios

✅ mejor rendimiento

---

# Variantes reales

## Formularios simples

RHF básico.

## Enterprise

Puedes tener:

- form builders
- multi-step forms
- autosave
- formularios dinámicos

---

# 6. Zod

## Instalación

```bash
npm install zod @hookform/resolvers
```

---

# Schema

## `schemas/projectSchema.ts`

```ts
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3),
});
```

---

# Integración con RHF

```tsx
import { zodResolver } from "@hookform/resolvers/zod";

useForm({
  resolver: zodResolver(projectSchema),
});
```

---

# Beneficios

Zod:

✅ valida

✅ tipa

✅ documenta

✅ centraliza reglas

---

# Shared Schemas

Muy usado hoy.

Frontend y backend comparten schemas.

```txt
shared/schema
```

Muy común con:

```txt
Next.js
NestJS
tRPC
```

---

# 7. Zustand

## Instalación

```bash
npm install zustand
```

---

# Store

## `store/projectUiStore.ts`

```ts
import { create } from "zustand";

interface ProjectUiStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useProjectUiStore =
  create<ProjectUiStore>((set) => ({
    isModalOpen: false,

    openModal: () =>
      set({ isModalOpen: true }),

    closeModal: () =>
      set({ isModalOpen: false }),
  }));
```

---

# Principio importante

# Client State

Estado SOLO de UI.

Ejemplos:

- modal abierta
- sidebar
- theme
- selected tab
- filtros temporales

---

# NO guardar en Zustand

❌ users API

❌ projects API

❌ invoices

Eso es trabajo de TanStack Query.

---

# Variantes reales

## Pequeño proyecto

Context API.

## Mediano/grande

Zustand.

## Enterprise gigante

Redux Toolkit.

---

# 8. Pages Layer

## `pages/ProjectsPage.tsx`

```tsx
import { useProjects } from "../hooks/useProjects";

export function ProjectsPage() {
  const { data } = useProjects();

  return (
    <div>
      {data?.map(project => (
        <p key={project.id}>
          {project.name}
        </p>
      ))}
    </div>
  );
}
```

---

# Responsabilidad

Las pages:

✅ coordinan

✅ conectan piezas

✅ manejan layout

---

# Las pages NO deben:

❌ tener lógica enorme

❌ tener fetch directo

❌ tener reglas de negocio gigantes

---

# Comunicación entre capas

# Flujo API

```txt
Page
 ↓
Hook
 ↓
TanStack Query
 ↓
API Layer
 ↓
Backend
```

---

# Flujo Formularios

```txt
Form
 ↓
React Hook Form
 ↓
Zod
 ↓
Mutation
 ↓
Backend
```

---

# Flujo Estado UI

```txt
Component
 ↓
Zustand Store
 ↓
Other Components
```

---

# Casos reales IMPORTANTES

---

# Caso 1 — Modal global

Problema:

Abrir modal desde cualquier componente.

## Solución

Zustand:

```txt
selectedProject
isEditModalOpen
```

---

# Caso 2 — Dashboard grande

Problema:

Muchos widgets usan la misma información.

## Solución

TanStack Query cachea automáticamente.

---

# Caso 3 — Filtros persistentes

Problema:

Los filtros deben mantenerse en URL.

## Solución

```txt
?page=2&status=active
```

URL State.

Muy usado en:

- dashboards
- tablas
- analytics

---

# Caso 4 — Shared Schemas

Frontend y backend usan:

```txt
projectSchema
```

Beneficios:

✅ menos bugs

✅ validación consistente

---

# Arquitecturas derivadas

---

# 1. Feature Architecture

La más popular hoy.

Ideal para:

- SaaS
- startups
- dashboards
- proyectos medianos/grandes

---

# 2. Clean Architecture

Más enterprise.

```txt
domain/
application/
infrastructure/
presentation/
```

Ideal para:

- fintech
- banca
- enterprise gigante

---

# 3. Atomic Design

Organización UI.

```txt
atoms/
molecules/
organisms/
```

Muy usada en:

- design systems
- component libraries

---

# 4. Microfrontends

Apps gigantes.

Cada feature es una mini app independiente.

Muy usado por:

- Amazon
- Spotify
- grandes empresas

---

# Recomendación REAL

## Para aprender y trabajar hoy

Usa:

```txt
React
+ TypeScript
+ Feature Architecture
+ TanStack Query
+ Zustand
+ RHF
+ Zod
```

Porque enseña:

✅ separación responsabilidades

✅ arquitectura moderna

✅ clean code

✅ estado moderno

✅ escalabilidad

---

# Regla MÁS importante

# Cada capa debe tener UNA responsabilidad

---

# UI Layer

Renderizar.

---

# Hooks Layer

Conectar lógica.

---

# API Layer

HTTP.

---

# Store Layer

Estado cliente global.

---

# Validation Layer

Schemas.

---

# Conclusión

Cuando entiendes esta arquitectura:

- dejas de pensar solo en componentes
- empiezas a pensar en sistemas
- puedes escalar proyectos grandes
- trabajas mejor en equipo
- escribes clean code real

La clave no es memorizar librerías.

La clave es entender:

```txt
qué responsabilidad pertenece a cada capa
```

Ese es el fundamento de una arquitectura frontend profesional.

