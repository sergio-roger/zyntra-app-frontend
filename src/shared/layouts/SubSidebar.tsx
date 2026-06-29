import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePlanModule } from '@features/auth/hooks/usePlanModule';
import { X, Lock, ChevronDown } from 'lucide-react';
import { getMenuKeyFromPath } from './nav.config';
import { NavModule, SubNavItem, SubNavGroup, SubNavEntry } from '@shared/types/nav';
import { useAuthStore } from '@features/auth/store/authStore';

// ─── Type guard ────────────────────────────────────────────────────────────────

const isGroup = (entry: SubNavEntry): entry is SubNavGroup =>
  (entry as SubNavGroup).type === 'group';

// ─── Leaf nav link ─────────────────────────────────────────────────────────────

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

// ─── Group accordion ───────────────────────────────────────────────────────────

interface SubNavGroupItemProps {
  group: SubNavGroup;
  isOpen: boolean;
  onToggle: () => void;
  allowedChildrenKeys: Set<string>;
  onClose: () => void;
}

const SubNavGroupItem: React.FC<SubNavGroupItemProps> = ({
  group,
  isOpen,
  onToggle,
  allowedChildrenKeys,
  onClose,
}) => {
  const { label, icon: Icon, description, children } = group;

  const visibleChildren = children.filter((child) =>
    allowedChildrenKeys.has(getMenuKeyFromPath(child.to)),
  );

  if (visibleChildren.length === 0) return null;

  return (
    <li>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-base-content/5 text-left"
      >
        <Icon size={15} className="shrink-0 text-base-content/35 mt-0.5" />
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
            {label}
          </span>
          {description && (
            <p className="text-[10px] leading-snug text-base-content/30">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          size={13}
          className={`shrink-0 text-base-content/30 transition-transform duration-200 mt-0.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-0.5 mt-1 ml-5 pl-3 border-l border-base-content/10">
          {visibleChildren.map((child) => (
            <SubNavLink key={child.to} item={child} onClose={onClose} />
          ))}
        </ul>
      </div>
    </li>
  );
};

// ─── SubSidebar ────────────────────────────────────────────────────────────────

interface SubSidebarProps {
  module: NavModule;
  isOpen: boolean;
  onClose: () => void;
}

export const SubSidebar: React.FC<SubSidebarProps> = ({
  module,
  isOpen,
  onClose,
}) => {
  const { pathname } = useLocation();
  const { allowedMenus } = useAuthStore();

  const dbModuleKey = module.key === 'agents' ? 'agents_ia' : module.key;

  // Build a map: parentKey → Set<childKey> from the backend menu tree (supports 3 levels)
  const allowedChildrenMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    if (!allowedMenus) return map;

    const moduleNode = allowedMenus.find((m) => m.key === dbModuleKey);
    if (!moduleNode) return map;

    map.set(dbModuleKey, new Set(moduleNode.children.map((c) => c.key)));

    for (const child of moduleNode.children) {
      if (child.children?.length) {
        map.set(child.key, new Set(child.children.map((c) => c.key)));
      }
    }

    return map;
  }, [allowedMenus, dbModuleKey]);

  // Which group key is currently active based on pathname
  const activeGroupKey = useMemo(() => {
    for (const entry of module.children ?? []) {
      if (!isGroup(entry)) continue;
      for (const child of entry.children) {
        if (pathname === child.to || pathname.startsWith(child.to + '/')) {
          return entry.key;
        }
      }
    }
    return null;
  }, [pathname, module.children]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() =>
    activeGroupKey ? new Set([activeGroupKey]) : new Set(),
  );

  // Auto-open group when navigating to a child route
  useEffect(() => {
    if (activeGroupKey) {
      setOpenGroups((prev) => {
        if (prev.has(activeGroupKey)) return prev;
        return new Set([...prev, activeGroupKey]);
      });
    }
  }, [activeGroupKey]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const level1Keys = allowedChildrenMap.get(dbModuleKey) ?? new Set<string>();

  const visibleEntries = (module.children ?? []).filter((entry) => {
    if (!allowedMenus) return false;
    if (isGroup(entry)) return level1Keys.has(entry.key);
    return level1Keys.has(getMenuKeyFromPath((entry as SubNavItem).to));
  });

  const hasChildren = visibleEntries.length > 0;

  return (
    <>
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
            <nav className="flex-1 px-3 overflow-y-auto">
              <ul className="flex flex-col gap-1.5">
                {visibleEntries.map((entry) => {
                  if (isGroup(entry)) {
                    return (
                      <SubNavGroupItem
                        key={entry.key}
                        group={entry}
                        isOpen={openGroups.has(entry.key)}
                        onToggle={() => toggleGroup(entry.key)}
                        allowedChildrenKeys={
                          allowedChildrenMap.get(entry.key) ?? new Set()
                        }
                        onClose={onClose}
                      />
                    );
                  }
                  return (
                    <SubNavLink
                      key={(entry as SubNavItem).to}
                      item={entry as SubNavItem}
                      onClose={onClose}
                    />
                  );
                })}
              </ul>
            </nav>
          )}

          {!hasChildren && <div className="flex-1" />}

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
