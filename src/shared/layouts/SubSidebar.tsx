import { useAuthStore } from '@/features/auth/store/authStore';
import { getMenuKeyFromPath } from '@shared/layouts/nav.config';
import { SubNavGroupItem } from '@shared/layouts/SubNavGroupItem';
import { SubNavLink } from '@shared/layouts/SubNavLink';
import { useUiStore } from '@shared/store/uiStore';
import {
  NavModule,
  SubNavEntry,
  SubNavGroup,
  SubNavItem,
} from '@shared/types/nav';
import { X } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const isGroup = (entry: SubNavEntry): entry is SubNavGroup =>
  (entry as SubNavGroup).type === 'group';

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

  const { openGroups, toggleGroup, setOpenGroups } = useUiStore();

  useEffect(() => {
    if (activeGroupKey) {
      if (!openGroups.includes(activeGroupKey)) {
        setOpenGroups([...openGroups, activeGroupKey]);
      }
    }
  }, [activeGroupKey, openGroups, setOpenGroups]);

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
                        isOpen={openGroups.includes(entry.key)}
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
