import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Briefcase, DollarSign, User, TrendingUp, Calendar, AlertCircle, ChevronDown } from 'lucide-react';
import { useCreateDeal, useUpdateDeal, usePipelines } from '@crm/hooks/useDeals';
import { useContactsList } from '@crm/hooks/useContacts';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Deal, DealPipeline, DealPipelineStage, CreateDealInput } from '@crm/types/crm';

interface DealFormSidebarProps {
  open: boolean;
  deal: Deal | null;
  defaultPipelineId?: string;
  stageOverrideId?: string;
  onClose: () => void;
}

const emptyForm = (): CreateDealInput => ({
  title: '',
  value: 0,
  currency: 'USD',
  pipeline_id: '',
  stage_id: '',
  contact_id: '',
  probability: 10,
  expected_close_date: '',
  description: '',
});

export const DealFormSidebar: React.FC<DealFormSidebarProps> = ({
  open,
  deal,
  defaultPipelineId,
  stageOverrideId,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateDealInput>(emptyForm());
  const [selectedPipeline, setSelectedPipeline] = useState<DealPipeline | null>(null);

  const { data: contactsData } = useContactsList({ limit: 100 });
  const { data: pipelines = [] } = usePipelines();
  const contacts = contactsData?.items || [];

  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Resolve stages from selected pipeline
  const stages: DealPipelineStage[] = selectedPipeline?.stages ?? [];

  // When pipelines load or open changes, set default pipeline
  useEffect(() => {
    if (!open) return;

    if (deal) {
      const pipeline = deal.pipeline ?? pipelines.find((p) => p.id === deal.pipeline_id) ?? null;
      setSelectedPipeline(pipeline);
      setFormData({
        title: deal.title,
        description: deal.description || '',
        value: Number(deal.value),
        currency: deal.currency || 'USD',
        pipeline_id: deal.pipeline_id,
        stage_id: deal.stage_id,
        contact_id: deal.contact_id,
        assigned_to_id: deal.assigned_to_id ?? undefined,
        team_id: deal.team_id ?? undefined,
        probability: deal.probability,
        expected_close_date: deal.expected_close_date
          ? deal.expected_close_date.split('T')[0]
          : '',
      });
    } else {
      let targetPipeline = pipelines.find((p) => p.id === defaultPipelineId);
      let targetStage: DealPipelineStage | undefined;

      if (stageOverrideId) {
        // Find pipeline that contains this stage
        for (const p of pipelines) {
          const st = p.stages?.find((s) => s.id === stageOverrideId);
          if (st) {
            targetPipeline = p;
            targetStage = st;
            break;
          }
        }
      }

      if (!targetPipeline) {
        targetPipeline =
          pipelines.find((p) => p.is_default) ??
          pipelines[0] ??
          null;
      }

      setSelectedPipeline(targetPipeline);
      const activeStage = targetStage ?? targetPipeline?.stages?.[0];

      setFormData({
        ...emptyForm(),
        pipeline_id: targetPipeline?.id ?? '',
        stage_id: activeStage?.id ?? '',
        probability: activeStage?.probability_percent ?? 10,
      });
    }
  }, [deal, open, pipelines, defaultPipelineId, stageOverrideId]);

  // When pipeline changes, reset stage to first stage
  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId) ?? null;
    setSelectedPipeline(pipeline);
    const firstStage = pipeline?.stages?.[0];
    setFormData((f) => ({
      ...f,
      pipeline_id: pipelineId,
      stage_id: firstStage?.id ?? '',
      probability: firstStage?.probability_percent ?? f.probability,
    }));
  };

  // When stage changes, auto-fill probability from stage
  const handleStageChange = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    setFormData((f) => ({
      ...f,
      stage_id: stageId,
      probability: stage?.probability_percent ?? f.probability,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (deal) {
        await updateMutation.mutateAsync({ id: deal.id, input: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving deal:', err);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">
                {deal ? 'Editar Negocio' : 'Nuevo Negocio'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {deal ? 'Actualiza los detalles de la oportunidad' : 'Registra una nueva oportunidad de venta'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form id="deal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <Input
              label="Título del negocio"
              icon={Briefcase}
              required
              placeholder="Ej: Implementación CRM Corporativo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            {/* Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1 flex items-center gap-1.5">
                <User size={14} /> Contacto vinculado *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.contact_id}
                  onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                >
                  <option value="">Seleccionar contacto...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email || 'Sin email'})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
              {contacts.length === 0 && (
                <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> No hay contactos disponibles.
                </p>
              )}
            </div>

            {/* Pipeline selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">Pipeline *</label>
              <div className="relative">
                <select
                  required
                  value={formData.pipeline_id}
                  onChange={(e) => handlePipelineChange(e.target.value)}
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

            {/* Stage selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">Etapa *</label>
              <div className="relative">
                <select
                  required
                  value={formData.stage_id}
                  onChange={(e) => handleStageChange(e.target.value)}
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

            {/* Value + Probability */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valor estimado"
                icon={DollarSign}
                type="number"
                required
                placeholder="0.00"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
              <Input
                label="Probabilidad (%)"
                icon={TrendingUp}
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              />
            </div>

            {/* Close date */}
            <Input
              label="Fecha de cierre estimada"
              icon={Calendar}
              type="date"
              value={formData.expected_close_date ?? ''}
              onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
            />

            <Textarea
              label="Descripción / Notas"
              placeholder="Detalles sobre el alcance, requerimientos, etc."
              rows={4}
              value={formData.description ?? ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="deal-form"
              type="submit"
              disabled={isSaving || !formData.title || !formData.contact_id || !formData.pipeline_id || !formData.stage_id}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {deal ? 'Actualizar Negocio' : 'Crear Negocio'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
