import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_MODULES } from '../../../shared/layouts/nav.config';
import { RailLink } from './RailLink';

interface RailNavigationProps {
  activeKey?: string;
  onToggleSidebar: (open: boolean) => void;
}

export const RailNavigation: React.FC<RailNavigationProps> = ({ 
  activeKey, 
  onToggleSidebar 
}) => {
  const navigate = useNavigate();
  
  const RAIL_MODULES = NAV_MODULES.filter(m =>
    ['dashboard', 'crm', 'agents', 'funnels', 'avatar', 'inbox', 'analytics', 'settings'].includes(m.key)
  );

  return (
    <nav className="flex-1">
      <ul className="flex flex-col items-center gap-0.5">
        {RAIL_MODULES.map((m) => (
          <RailLink 
            key={m.key} 
            module={m} 
            active={activeKey === m.key} 
            onClick={() => {
              navigate(m.to);
              onToggleSidebar(!!(m.children && m.children.length > 0));
            }}
          />
        ))}
      </ul>
    </nav>
  );
};
