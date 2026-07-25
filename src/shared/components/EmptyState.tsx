import { Button } from '@core/ui/Button';
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
        <div className="absolute inset-0 bg-tertiary/20 blur-2xl rounded-full scale-150 animate-pulse" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-base-200 border border-base-300 shadow-lg">
          <Icon size={40} className="text-tertiary" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-base-content mb-2 tracking-tight">
        {title}
      </h3>

      <p className="max-w-xs text-sm text-base-content/60 leading-relaxed mb-8">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="tertiary" onClick={onAction} icon={Plus}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
