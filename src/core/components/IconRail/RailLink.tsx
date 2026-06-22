import React from 'react';
import { NavModule } from '@shared/types/nav';
import { usePlanModule } from '@features/auth/hooks/usePlanModule';
import { Lock } from 'lucide-react';

interface RailLinkProps {
  module: NavModule;
  active: boolean;
  onClick: () => void;
}

export const RailLink: React.FC<RailLinkProps> = ({
  module,
  active,
  onClick,
}) => {
  const Icon = module.icon;
  const dbKey = module.key === 'agents' ? 'agents_ia' : module.key;
  const { isLocked } = usePlanModule(dbKey);

  return (
    <li>
      <button
        onClick={onClick}
        aria-label={module.label}
        className={`group flex flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${
          active
            ? 'text-primary'
            : 'text-base-content/45 hover:text-base-content/80'
        }`}
      >
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
            active
              ? 'bg-primary/15 ring-2 ring-primary/60 shadow-lg shadow-primary/20'
              : 'group-hover:bg-base-content/5'
          }`}
        >
          <Icon size={20} strokeWidth={active ? 2 : 1.5} />
          {isLocked && (
            <div className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-warning text-warning-content border border-base-300 shadow">
              <Lock size={10} />
            </div>
          )}
        </div>
        <span
          className={`text-[10px] leading-tight font-medium transition-colors ${
            active ? 'text-primary' : 'text-base-content/40 group-hover:text-base-content/60'
          }`}
        >
          {module.label}
        </span>
      </button>
    </li>
  );
};
