import { Select } from '@core/ui/Select';
import { crmApi } from '@crm/api/crm.api';
import { SOURCES, SOURCE_LABELS, ContactSource, CrmMember } from '@crm/types/crm';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, X } from 'lucide-react';
import React from 'react';

interface ContactFiltersProps {
  search: string;
  source: ContactSource | '';
  ownerId: string;
  showOwnerFilter: boolean;
  onSearchChange: (v: string) => void;
  onSourceChange: (v: ContactSource | '') => void;
  onOwnerChange: (v: string) => void;
  onReset: () => void;
}

const sourceOptions = SOURCES.map((s) => ({ value: s, label: SOURCE_LABELS[s] }));

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  search,
  source,
  ownerId,
  showOwnerFilter,
  onSearchChange,
  onSourceChange,
  onOwnerChange,
  onReset,
}) => {
  const { data: members = [] } = useQuery<CrmMember[]>({
    queryKey: ['crm-members'],
    queryFn: () => crmApi.listMembers().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: showOwnerFilter,
  });

  const ownerOptions = members.map((m) => ({ value: m.id, label: m.name }));

  const hasFilters = Boolean(search || source || ownerId);

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

      <div className="w-52">
        <Select
          options={sourceOptions}
          value={source || null}
          onChange={(v) => onSourceChange((v as ContactSource) ?? '')}
          placeholder="Todos los orígenes"
          clearable
          clearLabel="Todos los orígenes"
          className="py-2 text-sm"
        />
      </div>

      {showOwnerFilter && (
        <div className="w-52">
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
