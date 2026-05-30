import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import type { NavModule } from './nav.config';

interface SubSidebarProps {
  module: NavModule;
  isOpen: boolean;
  onClose: () => void;
}

export const SubSidebar: React.FC<SubSidebarProps> = ({ module, isOpen, onClose }) => {
  const hasChildren = module.children && module.children.length > 0;

  return (
    <aside 
      className={`relative flex shrink-0 flex-col border-r border-base-content/5 bg-base-200/60 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'
      }`}
    >
      <div className="flex w-64 flex-col h-full"> {/* Fixed width wrapper to prevent content squishing */}
      {/* Module Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h2 className="text-base font-semibold text-base-content/90">{module.label}</h2>
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
            {module.children!.map(({ to, label, icon: Icon, description }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
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
                          className={`text-[14px] font-semibold transition-colors duration-300 ${
                            isActive
                              ? 'text-primary'
                              : 'text-base-content/80 group-hover:text-base-content/95'
                          }`}
                        >
                          {label}
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
            ))}
          </ul>
        </nav>
      )}

      {!hasChildren && <div className="flex-1" />}
      
      {/* Bottom padding or small indicator */}
      <div className="p-4 text-center">
        <p className="text-[10px] text-base-content/20 uppercase tracking-widest font-bold">Zyntra AI Platform</p>
      </div>
      </div>
    </aside>
  );
};
