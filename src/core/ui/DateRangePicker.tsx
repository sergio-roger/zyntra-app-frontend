import { Calendar, Check, ChevronDown, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface DateRange {
  from: string;
  to: string;
}

type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'custom';

interface DateRangePickerProps {
  label?: string;
  value: DateRange | null;
  onChange: (v: DateRange | null) => void;
  className?: string;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'year', label: 'Este año' },
  { key: 'custom', label: 'Personalizado' },
];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function presetToRange(preset: Exclude<DatePreset, 'custom'>): DateRange {
  const today = new Date();
  switch (preset) {
    case 'today':
      return { from: startOfDay(today).toISOString(), to: endOfDay(today).toISOString() };
    case 'yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: startOfDay(y).toISOString(), to: endOfDay(y).toISOString() };
    }
    case 'week': {
      const start = new Date(today);
      const dayOfWeek = start.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      start.setDate(start.getDate() + diff);
      return { from: startOfDay(start).toISOString(), to: endOfDay(today).toISOString() };
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: startOfDay(start).toISOString(), to: endOfDay(today).toISOString() };
    }
    case 'year': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { from: startOfDay(start).toISOString(), to: endOfDay(today).toISOString() };
    }
  }
}

function detectPreset(value: DateRange): DatePreset {
  for (const { key } of PRESETS) {
    if (key === 'custom') continue;
    const range = presetToRange(key);
    if (range.from === value.from && range.to === value.to) return key;
  }
  return 'custom';
}

function formatTrigger(value: DateRange, preset: DatePreset): string {
  if (preset !== 'custom') {
    return PRESETS.find((p) => p.key === preset)?.label ?? '';
  }
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  return `${fmt(value.from)} – ${fmt(value.to)}`;
}

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label = 'Fecha de inicio',
  value,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<DatePreset | null>(
    value ? detectPreset(value) : null,
  );
  const [customFrom, setCustomFrom] = useState(value ? toDateInputValue(value.from) : '');
  const [customTo, setCustomTo] = useState(value ? toDateInputValue(value.to) : '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (!value) {
      setActivePreset(null);
      setCustomFrom('');
      setCustomTo('');
    }
  }, [value]);

  const handlePreset = (preset: DatePreset) => {
    setActivePreset(preset);
    if (preset !== 'custom') {
      onChange(presetToRange(preset));
      setOpen(false);
    }
  };

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) return;
    onChange({
      from: startOfDay(new Date(`${customFrom}T00:00:00`)).toISOString(),
      to: endOfDay(new Date(`${customTo}T00:00:00`)).toISOString(),
    });
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePreset(null);
    setCustomFrom('');
    setCustomTo('');
    onChange(null);
  };

  const hasValue = !!value;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 px-3 text-sm text-left
          flex items-center justify-between gap-2
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
          ${open ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-white/20'}
        `}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Calendar size={14} className="text-slate-500 shrink-0" />
          <span className={`truncate ${hasValue ? 'text-white' : 'text-slate-500'}`}>
            {hasValue && activePreset ? formatTrigger(value, activePreset) : label}
          </span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {hasValue && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="text-slate-500 hover:text-white transition-colors p-0.5 rounded"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-1 left-0 w-56 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Clear option */}
          <button
            type="button"
            onClick={() => { onChange(null); setActivePreset(null); setOpen(false); }}
            className={`w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5 flex items-center justify-between ${!hasValue ? 'text-white bg-primary/10' : 'text-slate-400'}`}
          >
            <span>Cualquier fecha</span>
            {!hasValue && <Check size={12} className="text-primary" />}
          </button>

          <div className="border-t border-white/5" />

          {/* Preset options */}
          {PRESETS.map(({ key, label: pLabel }) => {
            const isActive = activePreset === key;

            return (
              <React.Fragment key={key}>
                {key === 'custom' && <div className="border-t border-white/5" />}

                <button
                  type="button"
                  onClick={() => handlePreset(key)}
                  className={`w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5 flex items-center justify-between ${isActive ? 'text-white bg-primary/10' : 'text-slate-300'}`}
                >
                  <span>{pLabel}</span>
                  {isActive && key !== 'custom' && <Check size={12} className="text-primary" />}
                </button>

                {/* Custom date inputs */}
                {key === 'custom' && activePreset === 'custom' && (
                  <div className="px-4 py-3 space-y-2.5 bg-slate-900/60 border-t border-white/5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                        Desde
                      </label>
                      <input
                        type="date"
                        value={customFrom}
                        max={customTo || undefined}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                        Hasta
                      </label>
                      <input
                        type="date"
                        value={customTo}
                        min={customFrom || undefined}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 [color-scheme:dark]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!customFrom || !customTo}
                      onClick={handleApplyCustom}
                      className="w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Aplicar rango
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
