import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Bell, ChevronRight, LayoutDashboard, Menu, Search } from 'lucide-react';
import { SideRail } from './SideRail';
import { SubSidebar } from './SubSidebar';
import { findActiveModule, type NavModule } from './nav.config';
import { useAuthStore } from '@features/auth/store/authStore';

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
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const [isMobileRailOpen, setIsMobileRailOpen] = React.useState(false);
  const [isSubSidebarOpen, setIsSubSidebarOpen] = React.useState(true);
  const activeModule = findActiveModule(pathname);

  React.useEffect(() => {
    if (activeModule && (!activeModule.children || activeModule.children.length === 0)) {
      const timer = setTimeout(() => {
        setIsSubSidebarOpen(false);
        setIsMobileRailOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeModule]);

  return (
    <div className="flex h-screen overflow-hidden bg-base-100 text-base-content">
      {/* Mobile overlay */}
      {(isMobileRailOpen || isSubSidebarOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => {
            setIsMobileRailOpen(false);
            setIsSubSidebarOpen(false);
          }}
        />
      )}

      <SideRail 
        activeKey={activeModule?.key} 
        onToggleSidebar={(open) => {
          setIsSubSidebarOpen(open);
          if (!open) {
            setIsMobileRailOpen(false);
          }
        }}
        isSidebarOpen={isMobileRailOpen}
      />

      <SubSidebar 
        isOpen={isSubSidebarOpen}
        module={activeModule || DEFAULT_MODULE} 
        onClose={() => {
          setIsSubSidebarOpen(false);
          setIsMobileRailOpen(false);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-base-content/5 bg-base-100 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger — always visible below md */}
            <button
              onClick={() => {
                setIsMobileRailOpen(!isMobileRailOpen);
                setIsSubSidebarOpen(false);
              }}
              aria-label="Abrir navegación"
              className="btn btn-ghost btn-sm btn-circle md:hidden"
            >
              <Menu size={20} />
            </button>
            {/* Desktop chevron — only when subsidebar is closed */}
            {!isSubSidebarOpen && (
              <button
                onClick={() => setIsSubSidebarOpen(true)}
                className="btn btn-ghost btn-sm btn-circle hidden md:flex"
              >
                <ChevronRight size={20} />
              </button>
            )}
            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user?.plan && (
              <div className="hidden sm:flex items-center gap-1.5 bg-base-200/50 border border-base-content/10 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-base-content/50 font-bold uppercase tracking-wider text-[10px]">Plan:</span>
                <span className="text-primary font-extrabold">{user.plan.name}</span>
              </div>
            )}
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
