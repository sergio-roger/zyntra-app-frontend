import React from 'react';
import { BrandLogo } from '../../core/components/IconRail/BrandLogo';
import { RailNavigation } from '../../core/components/IconRail/RailNavigation';
import { UserMenu } from '../../core/components/IconRail/UserMenu';

interface SideRailProps {
  activeKey?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: (open: boolean) => void;
}

export const SideRail: React.FC<SideRailProps> = ({ 
  activeKey, 
  isSidebarOpen, 
  onToggleSidebar 
}) => {
  return (
    <aside className="relative flex w-[72px] shrink-0 flex-col items-center border-r border-base-content/5 bg-base-300/80 py-3 z-50 overflow-visible">
      <BrandLogo isSidebarOpen={isSidebarOpen} onToggle={onToggleSidebar} />
      
      <RailNavigation 
        activeKey={activeKey} 
        onToggleSidebar={onToggleSidebar} 
      />

      <UserMenu 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={onToggleSidebar} 
      />
    </aside>
  );
};
