import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Clock, HardDrive, Trash2 } from 'lucide-react';
import { DriveSection } from '@features/drive/types/drive';

interface SidebarItem {
  section: DriveSection;
  label: string;
  icon: React.ElementType;
}

const ITEMS: SidebarItem[] = [
  { section: 'me', label: 'Mi unidad', icon: HardDrive },
  { section: 'company', label: 'Empresa', icon: Building2 },
  { section: 'recent', label: 'Recientes', icon: Clock },
  { section: 'trash', label: 'Papelera', icon: Trash2 },
];

export const DriveSidebar: React.FC = () => {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 rounded-xl border border-white/10 bg-slate-900/50 p-2">
      {ITEMS.map((item) => (
        <NavLink
          key={item.section}
          to={`/drive/${item.section}`}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`
          }
        >
          <item.icon size={16} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DriveSidebar;
