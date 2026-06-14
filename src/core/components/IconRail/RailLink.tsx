import React from 'react';
import { NavModule } from '../../../shared/layouts/nav.config';

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
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
            active
              ? 'bg-primary/15 ring-2 ring-primary/60 shadow-lg shadow-primary/20'
              : 'group-hover:bg-base-content/5'
          }`}
        >
          <Icon size={20} strokeWidth={active ? 2 : 1.5} />
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
