import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      containerClassName = '',
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            {Icon && <Icon size={14} className="text-slate-500" />}
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && !label && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-transparent border-b border-white/10 py-2.5 px-1 text-sm text-white placeholder-slate-600 
              focus:outline-none focus:border-primary focus:ring-0
              ${Icon && !label ? 'pl-10' : ''}
              ${error ? 'border-rose-500/50 focus:border-rose-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] font-medium text-rose-400 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
