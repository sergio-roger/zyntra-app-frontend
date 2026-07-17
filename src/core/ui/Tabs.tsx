import { LucideIcon } from 'lucide-react';

export interface TabItem<TKey extends string = string> {
  key: TKey;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps<TKey extends string = string> {
  tabs: TabItem<TKey>[];
  active: TKey;
  onChange: (key: TKey) => void;
  className?: string;
  compact?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function Tabs<TKey extends string = string>({
  tabs,
  active,
  onChange,
  className = '',
  compact = false,
  orientation = 'horizontal',
}: TabsProps<TKey>) {
  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-left transition-colors ${
              active === tab.key
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400' : ''}`}
          >
            {tab.icon && <tab.icon size={15} className="shrink-0" />}
            <span className="flex-1 truncate">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  active === tab.key
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-white/5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          disabled={tab.disabled}
          onClick={() => onChange(tab.key)}
          className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold capitalize transition-colors ${
            compact ? 'px-5 min-w-[120px]' : 'flex-1'
          } ${
            active === tab.key
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-500 hover:text-slate-300'
          } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {tab.icon && <tab.icon size={14} />}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${
                active === tab.key
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-white/5 text-slate-500'
              }`}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
