import { getMenuKeyFromPath } from '@shared/layouts/nav.config';
import { SubNavLink } from '@shared/layouts/SubNavLink';
import { SubNavGroup } from '@shared/types/nav';
import { ChevronDown } from 'lucide-react';
import React from 'react';

export interface SubNavGroupItemProps {
  group: SubNavGroup;
  isOpen: boolean;
  onToggle: () => void;
  allowedChildrenKeys: Set<string>;
  onClose: () => void;
}

export const SubNavGroupItem: React.FC<SubNavGroupItemProps> = ({
  group,
  isOpen,
  onToggle,
  allowedChildrenKeys,
  onClose,
}) => {
  const { label, icon: Icon, description, children } = group;

  const visibleChildren = children.filter((child) =>
    allowedChildrenKeys.has(getMenuKeyFromPath(child.to)),
  );

  if (visibleChildren.length === 0) return null;

  return (
    <li>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-base-content/5 text-left"
      >
        <Icon size={15} className="shrink-0 text-base-content/35 mt-0.5" />
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/45">
            {label}
          </span>
          {description && (
            <p className="text-[10px] leading-snug text-base-content/30">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          size={13}
          className={`shrink-0 text-base-content/30 transition-transform duration-200 mt-0.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-0.5 mt-1 ml-5 pl-3 border-l border-base-content/10">
          {visibleChildren.map((child) => (
            <SubNavLink key={child.to} item={child} onClose={onClose} />
          ))}
        </ul>
      </div>
    </li>
  );
};
