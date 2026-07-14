import React, { useCallback } from 'react';
import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { Textarea } from '@core/ui/Textarea';
import { AsyncSelectMultiple } from '@core/ui/AsyncSelectMultiple';
import { DealCompanySearch } from '@crm/components/DealCompanySearch';
import { crmApi } from '@crm/api/crm.api';
import { CreateDealInput } from '@crm/types/create-deal-input';
import { Contact } from '@crm/types/contact';
import { ContactsListResponse } from '@crm/types/contacts-list-response';
import { Company } from '@crm/types/company';
import { DealPipeline } from '@crm/types/deal-pipeline';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  GitBranch,
  Layers,
  TrendingUp,
  Users,
} from 'lucide-react';

interface DealFormFieldsProps {
  formData: CreateDealInput;
  onChange: (patch: Partial<CreateDealInput>) => void;
  selectedContacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  selectedCompany: Company | null;
  onCompanyChange: (id: string, company: Company | null) => void;
  pipelines: DealPipeline[];
  stages: DealPipelineStage[];
  onPipelineChange: (pipelineId: string) => void;
  onStageChange: (stageId: string) => void;
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  accent?: 'slate' | 'indigo' | 'emerald';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  label,
  badge,
  accent = 'slate',
}) => {
  const styles = {
    slate: 'text-slate-300 bg-slate-800 border-white/10',
    indigo: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  };
  const badgeStyles = {
    slate: 'text-slate-500 bg-slate-800/80',
    indigo: 'text-indigo-400/70 bg-indigo-500/10',
    emerald: 'text-emerald-400/70 bg-emerald-500/10',
  };

  return (
    <div className="flex items-center gap-3 pt-1">
      <span
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest shrink-0 ${styles[accent]}`}
      >
        {icon}
        {label}
      </span>
      <div className="flex-1 h-px bg-white/6" />
      {badge && (
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeStyles[accent]}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export const DealFormFields: React.FC<DealFormFieldsProps> = ({
  formData,
  onChange,
  selectedContacts,
  onContactsChange,
  selectedCompany,
  onCompanyChange,
  pipelines,
  stages,
  onPipelineChange,
  onStageChange,
}) => {
  const loadContactOptions = useCallback(
    async ({
      search,
      page,
      limit,
    }: {
      search: string;
      page: number;
      limit: number;
    }) => {
      const res = await crmApi.list({
        search: search || undefined,
        page,
        limit,
      });
      const data = res.data as ContactsListResponse;
      return {
        items: data.items,
        total: data.total,
        hasMore: data.page < data.totalPages,
      };
    },
    [],
  );

  const pipelineOptions = pipelines.map((p) => ({
    value: p.id,
    label: p.isDefault ? `${p.name} ★` : p.name,
  }));

  const stageOptions = stages.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.probabilityPercent}%)`,
  }));

  return (
    <div className="space-y-5">
      {/* ── Negocio ── */}
      <SectionHeader
        icon={<Briefcase size={10} />}
        label="Negocio"
        accent="slate"
      />

      <Input
        label="Título del negocio"
        icon={Briefcase}
        required
        placeholder="Ej: Implementación CRM Corporativo"
        value={formData.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Pipeline"
          icon={GitBranch}
          placeholder="Seleccionar..."
          options={pipelineOptions}
          value={formData.pipelineId || null}
          onChange={(id) => id && onPipelineChange(id)}
        />
        <Select
          label="Etapa"
          icon={Layers}
          placeholder="Seleccionar..."
          options={stageOptions}
          value={formData.stageId || null}
          disabled={stages.length === 0}
          onChange={(id) => id && onStageChange(id)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valor estimado"
          icon={DollarSign}
          type="number"
          required
          placeholder="0.00"
          value={formData.value}
          onChange={(e) => onChange({ value: Number(e.target.value) })}
        />
        <Input
          label="Probabilidad (%)"
          icon={TrendingUp}
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => onChange({ probability: Number(e.target.value) })}
        />
      </div>

      <Input
        label="Fecha de cierre estimada"
        icon={Calendar}
        type="date"
        value={formData.expectedCloseDate ?? ''}
        onChange={(e) => onChange({ expectedCloseDate: e.target.value })}
      />

      <Textarea
        label="Descripción / Notas"
        placeholder="Detalles sobre el alcance, requerimientos, etc."
        rows={3}
        value={formData.description ?? ''}
        onChange={(e) => onChange({ description: e.target.value })}
      />

      {/* ── Contacto ── */}
      <SectionHeader
        icon={<Users size={10} />}
        label="Contactos"
        badge="Requerido"
        accent="emerald"
      />

      <AsyncSelectMultiple<Contact>
        label="Contactos vinculados"
        icon={Users}
        placeholder="Buscar y seleccionar contactos..."
        loadOptions={loadContactOptions}
        getKey={(c) => c.id}
        getLabel={(c) => c.name}
        getDescription={(c) => c.email ?? undefined}
        value={selectedContacts}
        onChange={(contacts) => {
          onContactsChange(contacts);
          onChange({ contactIds: contacts.map((c) => c.id) });
        }}
      />

      {/* ── Empresa ── */}
      <SectionHeader
        icon={<Building2 size={10} />}
        label="Empresa"
        badge="Opcional"
        accent="indigo"
      />

      <DealCompanySearch
        value={formData.companyId ?? ''}
        selectedCompany={selectedCompany}
        onChange={onCompanyChange}
      />
    </div>
  );
};
