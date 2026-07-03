import { LucideIcon } from "lucide-react";

export interface TabItem<TKey extends string = string> {
  key: TKey;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
}

interface TabsProps<TKey extends string = string> {
  tabs: TabItem<TKey>[];
  active: TKey;
  onChange: (key: TKey) => void;
  className?: string;
  compact?: boolean;
}

export function Tabs<TKey extends string = string>({
  tabs,
  active,
  onChange,
  className = "",
  compact = false,
}: TabsProps<TKey>) {
  return (
    <div className={`flex border-b border-white/5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold capitalize transition-colors ${
            compact ? "px-5 min-w-[120px]" : "flex-1"
          } ${
            active === tab.key
              ? "text-indigo-400 border-b-2 border-indigo-500"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {tab.icon && <tab.icon size={14} />}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${
                active === tab.key
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/5 text-slate-500"
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
