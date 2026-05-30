import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PanelLeft, 
  PanelLeftClose, 
  Crown, 
  Settings, 
  Code2, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { useAuth } from '@features/auth/hooks/useAuth';

interface UserMenuProps {
  isSidebarOpen: boolean;
  onToggleSidebar: (open: boolean) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="mt-auto flex flex-col items-center gap-2 pt-3">
      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => onToggleSidebar(!isSidebarOpen)}
        className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-primary mb-2"
      >
        {isSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
      </button>
      
      <div className="h-px w-8 bg-base-content/10" aria-hidden />
      
      {/* Avatar Dropdown */}
      <div className="dropdown dropdown-hover dropdown-right dropdown-end group/avatar">
        <label tabIndex={0} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content ring-2 ring-primary/30 ring-offset-2 ring-offset-base-300/80 transition-transform group-hover/avatar:scale-110">
          <span className="text-xs font-bold">{initial}</span>
        </label>
        
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-200 border border-base-300 rounded-box w-56">
          <div className="px-4 py-3 border-b border-base-300 mb-2">
            <p className="text-xs font-bold text-base-content/90 truncate">{user?.name}</p>
            <p className="text-[10px] text-base-content/50 truncate">{user?.email}</p>
          </div>
          <li><a className="text-sm py-2" onClick={() => navigate('/billing')}><Crown size={14} className="text-amber-500" /> Upgrade Plan</a></li>
          <li><a className="text-sm py-2" onClick={() => navigate('/settings')}><Settings size={14} /> Settings</a></li>
          <li><a className="text-sm py-2"><Code2 size={14} /> Developers</a></li>
          <li><a className="text-sm py-2"><HelpCircle size={14} /> Help</a></li>
          <div className="h-px bg-base-300 my-1" />
          <li><a onClick={() => logout()} className="text-sm py-2 text-error hover:bg-error/10"><LogOut size={14} /> Log out</a></li>
        </ul>
      </div>
    </div>
  );
};
