import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
        
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
          <Icon size={40} className="text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="max-w-xs text-sm text-slate-400 leading-relaxed mb-8">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-px active:scale-95 transition-all"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
