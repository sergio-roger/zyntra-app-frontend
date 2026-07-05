import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_MODULES } from '../../../shared/layouts/nav.config';
import { RailLink } from './RailLink';
import { useAuthStore } from '@features/auth/store/authStore';

import { NavModule } from '@shared/types/nav';

interface RailNavigationProps {
  activeKey?: string;
  onToggleSidebar: (open: boolean) => void;
  onSelectModuleOverride: (module: NavModule) => void;
}

export const RailNavigation: React.FC<RailNavigationProps> = ({
  activeKey,
  onToggleSidebar,
  onSelectModuleOverride,
}) => {
  const navigate = useNavigate();
  const { allowedMenus } = useAuthStore();

  const RAIL_MODULES = NAV_MODULES.filter((m) => {
    if (!allowedMenus) return false;
    const dbKey = m.key === 'agents' ? 'agents_ia' : m.key;
    return allowedMenus.some((allowed) => allowed.key === dbKey);
  });

  return (
    <nav className="flex-1">
      <ul className="flex flex-col items-center gap-0.5">
        {RAIL_MODULES.map((m) => {
          const hasChildren = m.children && m.children.length > 0;
          return (
            <RailLink
              key={m.key}
              module={m}
              active={activeKey === m.key}
              onClick={() => {
                if (hasChildren) {
                  // Si tiene submenú, solo abre el subsidebar y actualiza el módulo temporal
                  onSelectModuleOverride(m);
                  onToggleSidebar(true);
                } else {
                  navigate(m.to);
                  onToggleSidebar(false);
                }
              }}
            />
          );
        })}
      </ul>
    </nav>
  );
};
