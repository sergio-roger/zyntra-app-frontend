import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, LayoutDashboard, Menu, Search } from 'lucide-react';
import { SideRail } from './SideRail';
import { SubSidebar } from './SubSidebar';
import { findActiveModule, type NavModule } from './nav.config';

const DEFAULT_MODULE: NavModule = {
  key: 'dashboard',
  label: 'Zyntra',
  icon: LayoutDashboard,
  match: '/dashboard',
  to: '/dashboard',
  description: '',
  color: '',
};

const Breadcrumbs: React.FC<{ pathname: string }> = ({ pathname }) => {
  const module = findActiveModule(pathname);
  const sub = module?.children?.find(
    (c) => pathname === c.to || pathname.startsWith(`${c.to}/`),
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-base-content/60"
    >
      {module ? (
        <Link
          to={module.to}
          className="font-medium text-base-content transition-colors hover:text-primary"
        >
          {module.label}
        </Link>
      ) : (
        <span className="font-medium text-base-content">Zyntra</span>
      )}
      {sub && (
        <>
          <ChevronRight size={14} className="text-base-content/35" />
          <span className="text-base-content/80">{sub.label}</span>
        </>
      )}
    </nav>
  );
};

export const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const activeModule = findActiveModule(pathname);

  // Close sidebar if clicking a module without children
  React.useEffect(() => {
    if (activeModule && (!activeModule.children || activeModule.children.length === 0)) {
      const timer = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeModule]);

  return (
    <div className="flex h-screen overflow-hidden bg-base-100 text-base-content">
      <SideRail 
        activeKey={activeModule?.key} 
        onToggleSidebar={(open) => setIsSidebarOpen(open)}
        isSidebarOpen={isSidebarOpen}
      />

      <SubSidebar 
        isOpen={isSidebarOpen}
        module={activeModule || DEFAULT_MODULE} 
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-base-content/5 bg-base-100 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger — always visible below md */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Abrir navegación"
              className="btn btn-ghost btn-sm btn-circle md:hidden"
            >
              <Menu size={20} />
            </button>
            {/* Desktop chevron — only when subsidebar is closed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn btn-ghost btn-sm btn-circle hidden md:flex"
              >
                <ChevronRight size={20} />
              </button>
            )}
            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <label className="input input-sm input-bordered hidden h-9 w-64 items-center gap-2 rounded-lg bg-base-200/50 border-base-content/10 md:flex">
              <Search size={14} className="text-base-content/40" />
              <input
                type="search"
                placeholder="Buscar…"
                className="grow text-sm placeholder:text-base-content/40"
              />
              <kbd className="kbd kbd-xs bg-base-300/50 border-base-content/10">⌘K</kbd>
            </label>

            {/* Notifications */}
            <button
              aria-label="Notificaciones"
              className="btn btn-ghost btn-sm btn-circle indicator"
            >
              <span className="indicator-item badge badge-primary badge-xs">3</span>
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
