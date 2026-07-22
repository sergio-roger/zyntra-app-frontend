import React from 'react';
import { Clock, LucideIcon } from 'lucide-react';

interface ComingSoonTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ComingSoonTab: React.FC<ComingSoonTabProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="relative mb-5">
      <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-white/10">
        <Icon size={26} className="text-slate-500" strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
    <p className="max-w-xs text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-400">
      <Clock size={11} /> Próximamente
    </span>
  </div>
);
