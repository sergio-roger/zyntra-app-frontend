import React from 'react';
import { Search, X } from 'lucide-react';
import {
  SOURCES,
  SOURCE_LABELS,
  ContactSource,
} from '@crm/types/crm';

interface LifecycleStage {
  id: string;
  name: string;
}

interface ContactFiltersProps {
  search: string;
  lifecycleStageId: string;
  source: ContactSource | '';
  stages: LifecycleStage[];
  onSearchChange: (v: string) => void;
  onStageChange: (v: string) => void;
  onSourceChange: (v: ContactSource | '') => void;
  onReset: () => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  search,
  lifecycleStageId,
  source,
  stages,
  onSearchChange,
  onStageChange,
  onSourceChange,
  onReset,
}) => {
  const hasFilters = Boolean(search || lifecycleStageId || source);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3">
      <div className="relative min-w-[180px] flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-slate-950/60 py-2 pr-3 pl-9 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>

      <select
        value={lifecycleStageId}
        onChange={(e) => onStageChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
      >
        <option value="">Todas las etapas</option>
        {stages.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={source}
        onChange={(e) => onSourceChange(e.target.value as ContactSource | '')}
        className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
      >
        <option value="">Todos los orígenes</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>
            {SOURCE_LABELS[s]}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5"
        >
          <X size={14} /> Limpiar
        </button>
      )}
    </div>
  );
};
