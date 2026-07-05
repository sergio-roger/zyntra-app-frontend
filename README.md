# Portal Frontend de Zyntra App 🌐

Esta es la aplicación frontend en React para Zyntra (también conocida como planchat), una plataforma moderna para la gestión de empresas, agentes de IA multicanal (chatbots) y gestión de relaciones con clientes (CRM).

---

## 🚀 Características Clave

### 1. 🤖 Centro de Agentes de IA
- Configura agentes de IA y lógica de chatbots.
- Configura instrucciones del sistema, identidad del agente, comportamiento y credenciales.
- Asigna agentes dedicados a canales de comunicación específicos.

### 2. 🔌 Integraciones y Tienda de Canales (Channel Store)
- Gestiona y configura integraciones multicanal (widgets de Web Chat, WhatsApp, Instagram, etc.).
- Soporte para múltiples instancias de canales de widgets (permitiendo múltiples widgets activos por empresa).

### 3. 👥 Gestión de CRM y Segmentos
- **Contactos y Empresas**: Operaciones CRUD completas para prospectos (leads) y organizaciones.
- **Segmentos Dinámicos**: Crea segmentos inteligentes utilizando constructores de condiciones personalizados (filtrado por canal, etiquetas, etapa del ciclo de vida, valores).
- **Campos Personalizados y Etiquetas**: Adapta la recopilación de metadatos según la empresa.
- **Importación/Exportación**: Importación masiva a través de interfaces de mapeo de CSV y exportación de datos a CSV.

### 4. ⚙️ Configuración y Administración de Equipos
- **Matriz de Permisos**: Control de acceso completo al espacio de trabajo mapeando menús a roles de usuario (`admin`, `manager`, `agent`, etc.).
- **Gestión de Equipos**: Forma equipos y asigna miembros a los mismos.
- **Cuenta y Planes**: Configura los datos de perfil de usuario, sube avatares y selecciona planes de suscripción.

---

## 🛠️ Tecnologías Utilizadas
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Herramienta de Construcción**: [Vite 8](https://vite.dev/)
- **Gestión de Estado**: [Zustand](https://zustand.docs.pmnd.rs/) (para estados globales de UI y Autenticación)
- **API y Caché**: [React Query (TanStack Query) v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Formularios y Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/) + [DaisyUI v4](https://daisyui.com/)
- **Pruebas**: [Vitest](https://vitest.dev/) (Unitarias/Componentes) + [Playwright](https://playwright.dev/) (E2E)

---

## 📁 Estructura del Proyecto

```
src/
├── core/                  # Enrutamiento principal, diseños globales (layouts), configuraciones
├── features/              # Estructura modular basada en características (features)
│   ├── auth/              # Flujos y componentes de autenticación
│   ├── channels/          # Integraciones, Tienda de Canales y configuraciones
│   ├── crm/               # Contactos de CRM, Empresas, Segmentos, Filtros y Kanban
│   ├── settings/          # Usuarios, Equipos, Permisos, Detalles de cuenta
│   └── ...
├── shared/                # Componentes comunes, hooks, utilidades y configuración de axios
└── main.tsx               # Punto de entrada
```

---

## 🏃 Ejecución Local

### Prerrequisitos
- Node.js (v18+)
- Servicios backend locales ejecutándose o configurados

### Scripts de Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run start:dev
   ```

3. **Compilar el paquete de producción**:
   ```bash
   npm run build
   ```

4. **Ejecutar pruebas unitarias/de componentes (Vitest)**:
   ```bash
   npm run test
   ```

5. **Ejecutar pruebas de integración de extremo a extremo (Playwright)**:
   ```bash
   npm run test:e2e
   ```

6. **Analizar el código (ESLint)**:
   ```bash
   npm run lint
   ```
