import { SelectOption } from '@core/ui/select.types';
import { useSelect } from '@core/ui/useSelect';
import { findSelectedOption, getTriggerLabel } from '@core/ui/utils/select.utils';
import { Check, ChevronDown, LucideIcon } from 'lucide-react';
import React, { forwardRef } from 'react';

interface SelectProps<TValue = string> {
  // Data
  options: SelectOption<TValue>[];
  value?: TValue | null;
  onChange: (value: TValue | null) => void;

  // UI
  id?: string;
  label?: string;
  icon?: LucideIcon;
  placeholder?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
  disabled?: boolean;

  clearable?: boolean;
  clearLabel?: string;
  inline?: boolean;

  displayValue?: (
    value: TValue | null,
    option: SelectOption<TValue> | undefined,
  ) => string;

  renderOption?: (
    option: SelectOption<TValue>,
    isSelected: boolean,
  ) => React.ReactNode;
}

function SelectInner<TValue = string>(
  {
    options,
    value,
    onChange,
    id,
    label,
    icon: Icon,
    placeholder = 'Seleccionar...',
    error,
    containerClassName = '',
    className = '',
    disabled = false,
    clearable = false,
    clearLabel = '— Sin selección',
    inline = false,
    displayValue,
    renderOption,
  }: SelectProps<TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    open,
    focusedIndex,
    setOpen,
    containerRef,
    listRef,
    handleKeyDown,
    selectAtIndex,
  } = useSelect(id, options, clearable, onChange);

  const selectedOption = findSelectedOption(options, value);
  const hasValue = !!value;

  const triggerLabel = getTriggerLabel(
    value,
    selectedOption,
    placeholder,
    displayValue,
  );

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
          {Icon && <Icon size={14} className="text-slate-500" />}
          {label}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`
            w-full bg-transparent border-b border-white/10 py-2.5 px-1 text-sm text-left
            flex items-center justify-between gap-2
            focus:outline-none focus:border-primary focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${open ? 'border-primary' : ''}
            ${error ? 'border-rose-500/50 focus:border-rose-500' : ''}
            ${className}
          `}
        >
          <span
            className={`truncate ${hasValue ? 'text-white' : 'text-slate-500'}`}
          >
            {triggerLabel}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            ref={listRef}
            role="listbox"
            className={`w-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${inline ? '' : 'absolute z-20'}`}
          >
            {clearable && (
              <button
                type="button"
                role="option"
                aria-selected={!hasValue}
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between
                  ${!hasValue ? 'text-white bg-primary/10' : 'text-slate-400'}
                  ${focusedIndex === 0 ? 'bg-white/10' : 'hover:bg-white/5'}
                `}
              >
                <span>{clearLabel}</span>
                {!hasValue && (
                  <Check size={12} className="text-primary shrink-0" />
                )}
              </button>
            )}

            {options.map((option, i) => {
              const itemIdx = clearable ? i + 1 : i;
              const isSelected = option.value === value;
              const isFocused = focusedIndex === itemIdx;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => selectAtIndex(itemIdx)}
                  className={`
                    w-full px-4 py-2.5 text-sm text-left transition-colors
                    flex items-center justify-between
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isSelected ? 'text-white bg-primary/10' : 'text-slate-300'}
                    ${isFocused ? 'bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <>
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check size={12} className="text-primary shrink-0" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <TValue = string>(
  props: SelectProps<TValue> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement | null;

(Select as React.FC).displayName = 'Select';
