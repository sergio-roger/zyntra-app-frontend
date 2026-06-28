import React from 'react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { DealContactSearch } from '@crm/components/DealContactSearch';
import { CreateDealInput } from '@crm/types/create-deal-input';
import { Contact } from '@crm/types/contact';
import { DealPipeline } from '@crm/types/deal-pipeline';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import { Briefcase, Calendar, ChevronDown, DollarSign, TrendingUp } from 'lucide-react';

interface DealFormFieldsProps {
  formData: CreateDealInput;
  onChange: (patch: Partial<CreateDealInput>) => void;
  selectedContact: Contact | null;
  onContactChange: (id: string, contact: Contact | null) => void;
  pipelines: DealPipeline[];
  stages: DealPipelineStage[];
  onPipelineChange: (pipelineId: string) => void;
  onStageChange: (stageId: string) => void;
}

export const DealFormFields: React.FC<DealFormFieldsProps> = ({
  formData,
  onChange,
  selectedContact,
  onContactChange,
  pipelines,
  stages,
  onPipelineChange,
  onStageChange,
}) => (
  <div className="space-y-5">
    <Input
      label="Título del negocio"
      icon={Briefcase}
      required
      placeholder="Ej: Implementación CRM Corporativo"
      value={formData.title}
      onChange={(e) => onChange({ title: e.target.value })}
    />

    <DealContactSearch
      value={formData.contactId}
      selectedContact={selectedContact}
      onChange={onContactChange}
      required
    />

    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 ml-1">Pipeline *</label>
      <div className="relative">
        <select
          required
          value={formData.pipelineId}
          onChange={(e) => onPipelineChange(e.target.value)}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
        >
          <option value="">Seleccionar pipeline...</option>
          {pipelines.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}{p.is_default ? ' (principal)' : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 ml-1">Etapa *</label>
      <div className="relative">
        <select
          required
          value={formData.stageId}
          onChange={(e) => onStageChange(e.target.value)}
          disabled={stages.length === 0}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none disabled:opacity-40"
        >
          <option value="">Seleccionar etapa...</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.probability_percent}%)
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
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
      rows={4}
      value={formData.description ?? ''}
      onChange={(e) => onChange({ description: e.target.value })}
    />
  </div>
);
