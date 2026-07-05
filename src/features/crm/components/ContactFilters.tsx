import { Select } from '@core/ui/Select';
import { DateRange, DateRangePicker } from '@core/ui/DateRangePicker';
import { useCrmMembers } from '@crm/hooks/useCrmMembers';
import { useLifecycleStages } from '@crm/hooks/useLifecycleStages';
import { useChannelsQuery } from '@features/channels/hooks/channels.queries';
import { SegmentCondition } from '@crm/types/segment-condition';
import {
  Download,
  FilterX,
  Layers,
  Search,
  Settings2,
  SlidersHorizontal,
  Users,
  Variable,
} from 'lucide-react';
import React, { useState } from 'react';

interface ContactFiltersProps {
  search: string;
  channelId: string;
  ownerId: string;
  lifecycleStageId: string;
  createdAtFrom: string;
  createdAtTo: string;
  lastActivityAtFrom: string;
  lastActivityAtTo: string;
  customFieldConditions: SegmentCondition[];
  showOwnerFilter: boolean;
  onSearchChange: (v: string) => void;
  onChannelChange: (v: string) => void;
  onOwnerChange: (v: string) => void;
  onLifecycleStageChange: (v: string) => void;
  onDateRangeChange: (range: DateRange | null) => void;
  onLastActivityDateChange: (range: DateRange | null) => void;
  onOpenCustomFieldFilters: () => void;
  onExportCsv: () => void;
  onCustomizeColumns?: () => void;
  onReset: () => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  search,
  channelId,
  ownerId,
  lifecycleStageId,
  createdAtFrom,
  createdAtTo,
  lastActivityAtFrom,
  lastActivityAtTo,
  customFieldConditions,
  showOwnerFilter,
  onSearchChange,
  onChannelChange,
  onOwnerChange,
  onLifecycleStageChange,
  onDateRangeChange,
  onLastActivityDateChange,
  onOpenCustomFieldFilters,
  onExportCsv,
  onCustomizeColumns,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: members = [] } = useCrmMembers({ enabled: showOwnerFilter });
  const { data: stages = [] } = useLifecycleStages();
  const { data: channels = [] } = useChannelsQuery();

  const ownerOptions = members.map((m) => ({ value: m.id, label: m.name }));
  const stageOptions = stages.map((s) => ({
    value: s.id,
    label: `${s.icon ?? ''} ${s.name}`.trim(),
  }));
  const channelOptions = channels.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const dateRangeValue: DateRange | null =
    createdAtFrom && createdAtTo
      ? { from: createdAtFrom, to: createdAtTo }
      : null;

  const lastActivityDateValue: DateRange | null =
    lastActivityAtFrom && lastActivityAtTo
      ? { from: lastActivityAtFrom, to: lastActivityAtTo }
      : null;

  const hasCustomFieldFilters = customFieldConditions.length > 0;
  const hasAdvancedFilters = Boolean(
    channelId ||
    ownerId ||
    lifecycleStageId ||
    createdAtFrom ||
    createdAtTo ||
    lastActivityAtFrom ||
    lastActivityAtTo ||
    hasCustomFieldFilters,
  );
  const hasFilters = Boolean(search || hasAdvancedFilters);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
      {/* Row 1: Search + action buttons */}
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-80 md:w-100 shrink-0">
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

        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5"
        >
          <Download size={14} /> Exportar CSV
        </button>

        {onCustomizeColumns && (
          <button
            onClick={onCustomizeColumns}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <Settings2 size={14} /> Columnas
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowAdvanced((p) => !p)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              showAdvanced
                ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={14} /> Filtros avanzados
          </button>
          {hasAdvancedFilters && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-slate-900" />
          )}
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10"
          >
            <FilterX size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Row 2: Advanced filters (collapsible) */}
      {showAdvanced && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white/5 pt-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="w-48">
            <Select
              options={channelOptions}
              value={channelId || null}
              onChange={(v) => onChannelChange(v ?? '')}
              placeholder="Todos los canales"
              clearable
              clearLabel="Todos los canales"
              className="py-2 text-sm"
            />
          </div>

          <div className="w-48">
            <Select
              options={stageOptions}
              value={lifecycleStageId || null}
              onChange={(v) => onLifecycleStageChange(v ?? '')}
              placeholder="Todos los ciclos"
              clearable
              clearLabel="Todos los ciclos"
              icon={Layers}
              className="py-2 text-sm"
            />
          </div>

          {showOwnerFilter && (
            <div className="w-48">
              <Select
                options={ownerOptions}
                value={ownerId || null}
                onChange={(v) => onOwnerChange(v ?? '')}
                placeholder="Todos los colaboradores"
                clearable
                clearLabel="Todos los colaboradores"
                icon={Users}
                className="py-2 text-sm"
              />
            </div>
          )}

          <div className="w-52">
            <DateRangePicker
              label="Fecha de registro"
              value={dateRangeValue}
              onChange={onDateRangeChange}
            />
          </div>

          <div className="w-52">
            <DateRangePicker
              label="Fecha de contacto"
              value={lastActivityDateValue}
              onChange={onLastActivityDateChange}
            />
          </div>

          <div className="relative">
            <button
              onClick={onOpenCustomFieldFilters}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                hasCustomFieldFilters
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20'
                  : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <Variable size={14} /> Otros campos
            </button>
            {hasCustomFieldFilters && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-slate-900" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
