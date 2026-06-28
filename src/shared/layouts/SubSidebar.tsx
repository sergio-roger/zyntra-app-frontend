import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePlanModule } from '@features/auth/hooks/usePlanModule';
import { X, Lock } from 'lucide-react';
import { getMenuKeyFromPath } from './nav.config';
import { NavModule, SubNavItem } from '@shared/types/nav';
import { useAuthStore } from '@features/auth/store/authStore';

interface SubSidebarProps {
  module: NavModule;
  isOpen: boolean;
  onClose: () => void;
}

interface SubNavLinkProps {
  item: SubNavItem;
  onClose: () => void;
}

const SubNavLink: React.FC<SubNavLinkProps> = ({ item, onClose }) => {
  const { to, label, icon: Icon, description } = item;
  const itemKey = getMenuKeyFromPath(to);
  const { isLocked, isReadOnly } = usePlanModule(itemKey);

  return (
    <li>
      <NavLink
        to={to}
        end
        onClick={onClose}
        className={({ isActive }) =>
          `group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-primary/10 to-transparent'
              : 'hover:bg-gradient-to-r hover:from-base-content/5 hover:to-transparent'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={20}
              className={`shrink-0 transition-colors duration-300 ${
                isActive
                  ? 'text-primary'
                  : 'text-base-content/40 group-hover:text-base-content/80'
              }`}
            />
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-[14px] font-semibold transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary'
                    : 'text-base-content/80 group-hover:text-base-content/95'
                }`}
              >
                {label}
                {isLocked && (
                  <Lock size={12} className="text-warning shrink-0" />
                )}
                {isReadOnly && (
                  <span className="badge badge-warning badge-outline text-[9px] h-4 font-extrabold uppercase shrink-0">
                    Solo Lectura
                  </span>
                )}
              </span>
              {description && (
                <p
                  className={`text-[11px] leading-snug transition-colors duration-300 ${
                    isActive
                      ? 'text-primary/60'
                      : 'text-base-content/40 group-hover:text-base-content/60'
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </NavLink>
    </li>
  );
};

export const SubSidebar: React.FC<SubSidebarProps> = ({
  module,
  isOpen,
  onClose,
}) => {
  const { allowedMenus, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';

  const dbModuleKey = module.key === 'agents' ? 'agents_ia' : module.key;
  const currentModuleAllowed = allowedMenus?.find((m) => m.key === dbModuleKey);
  const allowedSubKeys = currentModuleAllowed?.children.map((c) => c.key) ?? [];

  const visibleItems =
    module.children?.filter((item) => {
      if (!allowedMenus) return false;

      const itemKey = getMenuKeyFromPath(item.to);
      if (itemKey === 'settings_permissions') return isAdmin;

      return allowedSubKeys.includes(itemKey);
    }) ?? [];

  const hasChildren = visibleItems.length > 0;

  return (
    <>
      {/* Sidebar — mobile: fixed drawer; desktop: flow panel with width animation */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col w-60
          border-r border-base-content/5 bg-base-200/60
          transition-transform duration-300 ease-in-out
          md:relative md:inset-y-auto md:left-auto md:z-auto
          md:shrink-0 md:overflow-hidden
          md:transition-all md:duration-300 md:ease-in-out
          ${
            isOpen
              ? 'translate-x-[72px] md:translate-x-0 md:w-64 md:opacity-100'
              : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:border-none'
          }
        `}
      >
        <div className="flex flex-col h-full w-60 md:w-64">
          {/* Module Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="text-base font-semibold text-base-content/90">
              {module.label}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          {hasChildren && (
            <nav className="flex-1 px-3">
              <ul className="flex flex-col gap-1.5">
                {visibleItems.map((item) => (
                  <SubNavLink key={item.to} item={item} onClose={onClose} />
                ))}
              </ul>
            </nav>
          )}

          {!hasChildren && <div className="flex-1" />}

          {/* Bottom padding or small indicator */}
          <div className="p-4 text-center">
            <p className="text-[10px] text-base-content/20 uppercase tracking-widest font-bold">
              Zyntra AI Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
