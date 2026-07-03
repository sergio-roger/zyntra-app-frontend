import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

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
      containerClassName = "",
      className = "",
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
              w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 
              focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
              ${Icon && !label ? "pl-10" : ""}
              ${error ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20" : ""}
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

Input.displayName = "Input";
