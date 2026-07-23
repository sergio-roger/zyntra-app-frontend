import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChipOption {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  label?: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
  options: ChipOption[];
  value: string[];
  onChange: (value: string[]) => void;
  maxItems: number;
  containerClassName?: string;
}

export const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  label,
  icon: Icon,
  hint,
  error,
  options,
  value,
  onChange,
  maxItems,
  containerClassName = '',
}) => {
  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
      return;
    }
    if (value.length >= maxItems) return;
    onChange([...value, optionValue]);
  };

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
          {Icon && <Icon size={14} className="text-slate-500" />}
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              disabled={!isSelected && value.length >= maxItems}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-40 ${
                isSelected
                  ? 'bg-primary/20 text-primary'
                  : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-[10px] font-medium text-rose-400 ml-1">{error}</p>
      ) : (
        hint && <p className="text-[10px] text-slate-500 ml-1">{hint}</p>
      )}
    </div>
  );
};
