import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon: Icon, error, className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name;
    const hasError = Boolean(error);
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
        <div className="group relative">
          <Icon
            size={18}
            aria-hidden
            className={`pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors ${
              hasError
                ? 'text-rose-400'
                : 'text-slate-500 group-focus-within:text-indigo-400'
            }`}
          />
          <input
            id={inputId}
            ref={ref}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            className={`w-full rounded-xl border bg-slate-950/60 py-2.5 pr-3 pl-10 text-sm text-slate-100 placeholder-slate-500 shadow-inner outline-none transition-all duration-200 focus:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasError
                ? 'border-rose-500/60 focus:ring-2 focus:ring-rose-500/30'
                : 'border-white/10 hover:border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30'
            } ${className}`}
            {...rest}
          />
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-rose-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
