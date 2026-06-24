import { useAuth } from '@features/auth/hooks/useAuth';
import { useAuthStore } from '@features/auth/store/authStore';
import { useUiStore } from '../../../shared/store/uiStore';
import { Code2, CreditCard, HelpCircle, LogOut, Settings, Zap } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { isUserMenuOpen, setUserMenuOpen, toggleUserMenu } = useUiStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, setUserMenuOpen]);

  return (
    <div className="mt-auto flex flex-col items-center gap-2 pt-3" ref={containerRef}>

      {/* Avatar Dropdown */}
      <div className={`dropdown dropdown-right dropdown-end ${isUserMenuOpen ? 'dropdown-open' : ''}`}>
        <label
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            toggleUserMenu();
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content ring-2 ring-primary/30 ring-offset-2 ring-offset-base-300/80 transition-transform hover:scale-110"
        >
          <span className="text-xs font-bold">{initial}</span>
        </label>

        {isUserMenuOpen && (
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-200 border border-base-300 rounded-box w-56 z-[200]">
            <div className="px-4 py-3 border-b border-base-300 mb-2">
              <p className="text-xs font-bold text-base-content/90 truncate">{user?.name}</p>
              <p className="text-[10px] text-base-content/50 truncate">{user?.email}</p>
              {user?.plan && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.plan_status === 'active' ? 'bg-primary/15 text-primary' : 'bg-base-content/10 text-base-content/50'}`}>
                    <Zap size={9} />
                    {user.plan.name}
                  </span>
                  {user.plan_status !== 'active' && (
                    <span className="text-[10px] text-warning">inactivo</span>
                  )}
                </div>
              )}
            </div>
            <li><a className="text-sm py-2" onClick={() => handleNavigate('/billing')}><CreditCard size={14} className="text-primary" /> Facturación</a></li>
            <li><a className="text-sm py-2" onClick={() => handleNavigate('/settings/plans')}><Zap size={14} className="text-warning" /> Planes</a></li>
            <li><a className="text-sm py-2" onClick={() => handleNavigate('/settings')}><Settings size={14} /> Configuración</a></li>
            <li><a className="text-sm py-2" onClick={() => handleNavigate('/construction')}><Code2 size={14} /> Developers</a></li>
            <li><a className="text-sm py-2" onClick={() => handleNavigate('/construction')}><HelpCircle size={14} /> Help</a></li>
            <div className="h-px bg-base-300 my-1" />
            <li><a onClick={handleLogout} className="text-sm py-2 text-error hover:bg-error/10"><LogOut size={14} /> Log out</a></li>
          </ul>
        )}
      </div>
    </div>
  );
};
