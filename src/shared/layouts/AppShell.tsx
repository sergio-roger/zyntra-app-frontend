import { useAuthStore } from '@features/auth/store/authStore';
import { Breadcrumbs } from '@shared/components/Breadcrumbs';
import { SideRail } from '@shared/layouts/SideRail';
import { SubSidebar } from '@shared/layouts/SubSidebar';
import { findActiveModule } from '@shared/layouts/nav.config';
import { NavModule } from '@shared/types/nav';
import { Bell, LayoutDashboard, Menu, Search, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const DEFAULT_MODULE: NavModule = {
  key: 'dashboard',
  label: 'Zyntra',
  icon: LayoutDashboard,
  match: '/dashboard',
  to: '/dashboard',
  description: '',
  color: '',
};

export const AppShell: React.FC = () => {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const [isMobileRailOpen, setIsMobileRailOpen] = useState(false);
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [selectedModuleOverride, setSelectedModuleOverride] = useState<NavModule | null>(null);
  
  const activeModule = findActiveModule(pathname);
  
  useEffect(() => {
    setSelectedModuleOverride(null);
  }, [pathname]);

  useEffect(() => {
    const currentModule = selectedModuleOverride || activeModule;
    if (
      currentModule &&
      (!currentModule.children || currentModule.children.length === 0)
    ) {
      const timer = setTimeout(() => {
        setIsSubSidebarOpen(false);
        setIsMobileRailOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeModule, selectedModuleOverride]);

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
        activeKey={selectedModuleOverride?.key || activeModule?.key}
        onToggleSidebar={(open) => {
          setIsSubSidebarOpen(open);
          if (!open) {
            setIsMobileRailOpen(false);
          }
        }}
        isSidebarOpen={isMobileRailOpen}
        onSelectModuleOverride={setSelectedModuleOverride}
      />

      <SubSidebar
        isOpen={isSubSidebarOpen}
        module={selectedModuleOverride || activeModule || DEFAULT_MODULE}
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
                <Menu size={20} />
              </button>
            )}
            <Breadcrumbs pathname={pathname} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user?.plan && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-primary/20 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                <Zap size={11} className="text-primary animate-pulse" />
                <span className="text-base-content/60 font-semibold text-[10px] hidden sm:inline">
                  Plan:
                </span>
                <span className="text-primary font-extrabold text-[11px]">
                  {user.plan.name}
                </span>
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
              <kbd className="kbd kbd-xs bg-base-300/50 border-base-content/10">
                ⌘K
              </kbd>
            </label>

            {/* Notifications */}
            <button
              aria-label="Notificaciones"
              className="btn btn-ghost btn-sm btn-circle indicator"
            >
              <span className="indicator-item badge badge-primary badge-xs">
                3
              </span>
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
