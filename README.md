# Zyntra App — Frontend Portal 🌐

This is the React frontend application for Zyntra (also known as planchat), a modern platform for managing businesses, multi-channel AI agents (chatbots), and customer relationship management (CRM).

---

## 🚀 Key Features

### 1. 🤖 AI Agent Center
- Configure AI agents and chatbot logic.
- Set up system instructions, agent identity, behavior, and credentials.
- Assign dedicated agents to specific communication channels.

### 2. 🔌 Integrations & Channel Store
- Manage and configure multi-channel integrations (Web Chat widgets, WhatsApp, Instagram, etc.).
- Multi-instance widget channels support (allowing multiple active widgets per business).

### 3. 👥 CRM & Segment Management
- **Contacts & Companies**: Full CRUD operations for leads and organizations.
- **Dynamic Segments**: Create smart segments using custom condition builders (filtering by channel, tags, lifecycle stage, values).
- **Custom Fields & Tags**: Tailor metadata collection per business.
- **Import/Export**: Bulk import via CSV mapping interfaces and export data to CSV.

### 4. ⚙️ Settings & Team Administration
- **Permissions Matrix**: Complete workspace access control mapping menus to user roles (`admin`, `manager`, `agent`, etc.).
- **Team Management**: Form teams and assign members to them.
- **Account & Plans**: Configure user profile data, upload avatars, and select subscription tiers.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) (for global UI & Auth states)
- **API & Cache**: [React Query (TanStack Query) v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + [DaisyUI v4](https://daisyui.com/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Component) + [Playwright](https://playwright.dev/) (E2E)

---

## 📁 Project Structure

```
src/
├── core/                  # Core routing, global layouts, configurations
├── features/              # Feature-based modular structure
│   ├── auth/              # Authentication flows and components
│   ├── channels/          # Integrations, Channel Store, and configurations
│   ├── crm/               # CRM Contacts, Companies, Segments, Filters, and Kanban
│   ├── settings/          # Users, Teams, Permissions, Account details
│   └── ...
├── shared/                # Common components, hooks, utilities, and axios setup
└── main.tsx               # Entry point
```

---

## 🏃 Run Locally

### Prerequisites
- Node.js (v18+)
- Local backend services running or set up

### Development Scripts

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run start:dev
   ```

3. **Build the production package**:
   ```bash
   npm run build
   ```

4. **Run component/unit tests (Vitest)**:
   ```bash
   npm run test
   ```

5. **Run end-to-end integration tests (Playwright)**:
   ```bash
   npm run test:e2e
   ```

6. **Lint codebase (ESLint)**:
   ```bash
   npm run lint
   ```
