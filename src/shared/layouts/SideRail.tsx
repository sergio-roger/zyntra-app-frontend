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
    <aside className={`
      fixed inset-y-0 left-0 z-50 flex w-[72px] shrink-0 flex-col items-center border-r border-base-content/5 bg-base-300/80 py-3 overflow-visible
      transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 md:z-auto md:flex
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
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
