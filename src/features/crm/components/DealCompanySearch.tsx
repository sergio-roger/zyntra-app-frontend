import React, { useEffect, useRef, useState } from 'react';
import { useCompaniesList, useCreateCompany, useIndustrys } from '@crm/hooks/useCompanies';
import { Select } from '@core/ui/Select';
import { Company } from '@crm/types/company';
import {
  Building2,
  Globe,
  Hash,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import { TAX_TYPE_OPTIONS, EMPLOYEE_RANGE_OPTIONS } from '@crm/constants/company-options';

type Mode = 'select' | 'create';

interface DealCompanySearchProps {
  value: string;
  selectedCompany: Company | null;
  onChange: (companyId: string, company: Company | null) => void;
}

const fieldCls =
  'w-full bg-slate-950/60 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 focus:bg-slate-950/80 transition-all';

const FieldLabel: React.FC<{ icon?: React.ReactNode; text: string; required?: boolean }> = ({
  icon,
  text,
  required,
}) => (
  <label className="flex items-center gap-1 text-[11px] font-medium text-slate-400 ml-0.5">
    {icon}
    {text}
    {required && <span className="text-rose-400 ml-0.5">*</span>}
  </label>
);

export const DealCompanySearch: React.FC<DealCompanySearchProps> = ({
  value,
  selectedCompany,
  onChange,
}) => {
  const [mode, setMode] = useState<Mode>('select');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [newName, setNewName] = useState('');
  const [newTaxType, setNewTaxType] = useState<string | null>('RUC');
  const [newIdentification, setNewIdentification] = useState('');
  const [newEmployeeRange, setNewEmployeeRange] = useState<string | null>(null);
  const [newWebsite, setNewWebsite] = useState('');
  const [newIndustryId, setNewIndustryId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: listData } = useCompaniesList(
    { search: search || undefined, limit: 20 },
    { enabled: dropdownOpen && mode === 'select' },
  );
  const { data: industries = [] } = useIndustrys();
  const results = listData?.items ?? [];

  const createMutation = useCreateCompany();

  const industryOptions = industries.map((i) => ({ value: i.id, label: i.name }));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (c: Company) => {
    onChange(c.id, c);
    setDropdownOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('', null);
    setSearch('');
    setMode('select');
  };

  const resetCreateForm = () => {
    setNewName('');
    setNewTaxType('RUC');
    setNewIdentification('');
    setNewEmployeeRange(null);
    setNewWebsite('');
    setNewIndustryId(null);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const company = await createMutation.mutateAsync({
        name: newName.trim(),
        taxType: newTaxType ?? 'RUC',
        identification: newIdentification.trim(),
        employeeRange: newEmployeeRange ?? '',
        website: newWebsite.trim(),
        industryId: newIndustryId ?? '',
        description: '',
        lifecycleStageId: '',
        ownerId: '',
        tagIds: [],
        customFields: {},
      });
      onChange(company.id, company);
      resetCreateForm();
    } catch {
      // handled silently
    }
  };

  // ── Selected card ───────────────────────────────────────────────────────────
  if (value && selectedCompany) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-950/40 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{selectedCompany.name}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {selectedCompany.identification && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Hash size={9} />
                  {selectedCompany.taxType && (
                    <span className="text-slate-600">{selectedCompany.taxType}:</span>
                  )}
                  {selectedCompany.identification}
                </span>
              )}
              {selectedCompany.industry && (
                <span className="text-[11px] text-indigo-400/70 flex items-center gap-1">
                  <Layers size={9} />
                  {selectedCompany.industry.name}
                </span>
              )}
              {selectedCompany.employeeRange && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Users size={9} />
                  {selectedCompany.employeeRange}
                </span>
              )}
              {selectedCompany.website && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                  <Globe size={9} />
                  {selectedCompany.website}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            title="Quitar empresa"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        <div className="border-t border-white/5 px-4 py-2 flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <Pencil size={10} />
            Cambiar empresa
          </button>
        </div>
      </div>
    );
  }

  // ── Mode tabs + content ─────────────────────────────────────────────────────
  return (
    <div className="space-y-3" ref={containerRef}>

      {/* Tab toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('select')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === 'select'
              ? 'bg-slate-800 text-white shadow-sm border border-white/10'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Search size={11} />
          Seleccionar existente
        </button>
        <button
          type="button"
          onClick={() => { setMode('create'); setDropdownOpen(false); }}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mode === 'create'
              ? 'bg-indigo-600/25 text-indigo-300 shadow-sm border border-indigo-500/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Plus size={11} />
          Crear nueva
        </button>
      </div>

      {/* ── Select mode ── */}
      {mode === 'select' && (
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-all"
          />

          {dropdownOpen && (
            <div className="absolute z-50 mt-1.5 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              {results.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-slate-500 gap-2">
                  <Building2 size={20} className="opacity-25" />
                  <p className="text-xs">
                    {search ? 'Sin resultados para esa búsqueda' : 'Escribe para buscar...'}
                  </p>
                </div>
              ) : (
                <ul className="max-h-52 overflow-y-auto py-1">
                  {results.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(c)}
                        className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-md bg-slate-800 border border-white/5 flex items-center justify-center shrink-0">
                          <Building2 size={13} className="text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{c.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {c.industry && (
                              <span className="text-[10px] text-indigo-400/70">{c.industry.name}</span>
                            )}
                            {c.identification && (
                              <span className="text-[10px] text-slate-500">{c.identification}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Create mode ── */}
      {mode === 'create' && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5">
          {/* Card header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-500/10 bg-indigo-500/5 rounded-t-xl">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Building2 size={13} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-300">Nueva empresa</p>
              <p className="text-[10px] text-indigo-400/60">Los datos se guardarán en tu CRM</p>
            </div>
          </div>

          {/* Fields */}
          <div className="p-4 space-y-3">

            {/* Nombre */}
            <div className="space-y-1">
              <FieldLabel text="Nombre de la empresa" required />
              <input
                type="text"
                placeholder="Ej: Corporación Andina S.A."
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={fieldCls}
              />
            </div>

            {/* Tipo de identificación + Número */}
            <div className="space-y-1">
              <FieldLabel icon={<Hash size={10} />} text="Identificación" />
              <div className="flex gap-2">
                <div className="w-[38%]">
                  <Select
                    options={TAX_TYPE_OPTIONS}
                    value={newTaxType}
                    onChange={(v) => setNewTaxType(v ?? 'RUC')}
                    placeholder="Tipo..."
                  />
                </div>
                <input
                  type="text"
                  placeholder="Ej: 0990012345001"
                  value={newIdentification}
                  onChange={(e) => setNewIdentification(e.target.value)}
                  className={`flex-1 ${fieldCls}`}
                />
              </div>
            </div>

            {/* Industria */}
            <Select
              label="Industria"
              icon={Layers}
              placeholder="Seleccionar industria..."
              options={industryOptions}
              value={newIndustryId}
              onChange={(id) => setNewIndustryId(id)}
              clearable
              clearLabel="— Sin industria"
            />

            {/* Número de empleados */}
            <Select
              label="Número de empleados"
              icon={Users}
              placeholder="Seleccionar rango..."
              options={EMPLOYEE_RANGE_OPTIONS}
              value={newEmployeeRange}
              onChange={(v) => setNewEmployeeRange(v)}
              clearable
              clearLabel="— Sin definir"
            />

            {/* Sitio web */}
            <div className="space-y-1">
              <FieldLabel icon={<Globe size={10} />} text="Sitio web" />
              <input
                type="text"
                placeholder="www.empresa.com"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                className={fieldCls}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setMode('select'); resetCreateForm(); }}
                className="px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-slate-400 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newName.trim() || createMutation.isPending}
                onClick={handleCreate}
                className="flex-1 px-3 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
              >
                {createMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Plus size={13} />
                )}
                Guardar y vincular empresa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
