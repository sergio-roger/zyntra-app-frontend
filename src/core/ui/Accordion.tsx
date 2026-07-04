import React from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  containerClassName?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  containerClassName = '',
  className = '',
}) => {
  return (
    <details
      open={defaultOpen}
      className={`group border-t border-white/5 pt-3 ${containerClassName}`}
    >
      <summary className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={12} className="text-slate-500" />}
          <span>{title}</span>
        </div>
        <ChevronDown
          size={14}
          className="text-slate-500 group-open:rotate-180 transition-transform duration-200"
        />
      </summary>
      <div
        className={`mt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
      >
        {children}
      </div>
    </details>
  );
};
