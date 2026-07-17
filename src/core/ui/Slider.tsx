import React, { forwardRef, useId } from 'react';
import { LucideIcon } from 'lucide-react';

interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  containerClassName?: string;
  value: number;
  formatValue?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      icon: Icon,
      error,
      containerClassName = '',
      className = '',
      value,
      formatValue,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const sliderId = props.id || autoId;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <div className="flex items-center justify-between gap-2 ml-1">
          {label && (
            <label
              htmlFor={sliderId}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              {Icon && <Icon size={14} className="text-slate-500" />}
              {label}
            </label>
          )}
          <span className="text-xs font-bold text-indigo-400 tabular-nums">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
        <input
          ref={ref}
          id={sliderId}
          type="range"
          value={value}
          className={`
            w-full h-1.5 rounded-full bg-white/10 accent-indigo-500 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/40
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-medium text-rose-400 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Slider.displayName = 'Slider';
