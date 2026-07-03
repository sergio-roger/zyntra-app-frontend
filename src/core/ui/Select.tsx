import { Check, ChevronDown, LucideIcon } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

export interface SelectOption<TValue = string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface SelectProps<TValue = string> {
  // Data
  options: SelectOption<TValue>[];
  value?: TValue | null;
  onChange: (value: TValue | null) => void;

  // UI
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
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const totalItems = (clearable ? 1 : 0) + options.length;

  // Close on outside click or Escape
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!open) setFocusedIndex(-1);
  }, [open]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const domItems =
      listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
    domItems[focusedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex]);

  const selectAtIndex = (idx: number) => {
    if (clearable && idx === 0) {
      onChange(null);
    } else {
      const opt = options[clearable ? idx - 1 : idx];
      if (opt && !opt.disabled) onChange(opt.value);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(e.key === 'ArrowDown' ? 0 : totalItems - 1);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((i) => (i < totalItems - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) => (i > 0 ? i - 1 : 0));
        break;
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          e.preventDefault();
          selectAtIndex(focusedIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const selectedOption = options.find((o) => o.value === value);
  const hasValue = !!value;

  const triggerLabel = displayValue
    ? displayValue(value ?? null, selectedOption)
    : (selectedOption?.label ?? placeholder);

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
          onClick={() => setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`
            w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-left
            flex items-center justify-between gap-2
            focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${open ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-white/20'}
            ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : ''}
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
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
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
