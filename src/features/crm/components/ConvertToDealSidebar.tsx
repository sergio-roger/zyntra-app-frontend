import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { usePipelines } from '@crm/hooks/useDeals';
import { useConvertToDeal } from '@crm/hooks/useLeads';
import { Contact } from '@crm/types/contact';
import { ConvertToDealInput } from '@crm/types/convert-to-deal-input';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import {
  ArrowRightCircle,
  Briefcase,
  Calendar,
  ChevronDown,
  DollarSign,
  Loader2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ConvertToDealSidebarProps {
  open: boolean;
  lead: Contact | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const emptyForm = (): ConvertToDealInput => ({
  title: '',
  value: 0,
  pipeline_id: '',
  stage_id: '',
  expected_close_date: '',
  description: '',
});

export const ConvertToDealSidebar: React.FC<ConvertToDealSidebarProps> = ({
  open,
  lead,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ConvertToDealInput>(emptyForm());
  const [stages, setStages] = useState<DealPipelineStage[]>([]);

  const { data: pipelines = [] } = usePipelines();
  const convertMutation = useConvertToDeal();

  useEffect(() => {
    if (!open) return;

    const defaultPipeline =
      pipelines.find((p) => p.is_default) ?? pipelines[0] ?? null;
    const firstStage = defaultPipeline?.stages?.[0];
    setStages(defaultPipeline?.stages ?? []);

    setFormData({
      title: lead ? `Negocio con ${lead.name}` : '',
      value: lead?.dealValue ? Number(lead.dealValue) : 0,
      pipeline_id: defaultPipeline?.id ?? '',
      stage_id: firstStage?.id ?? '',
      expected_close_date: '',
      description: '',
    });
  }, [lead, open, pipelines]);

  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId) ?? null;
    const newStages = pipeline?.stages ?? [];
    setStages(newStages);
    const firstStage = newStages[0];
    setFormData((f) => ({
      ...f,
      pipeline_id: pipelineId,
      stage_id: firstStage?.id ?? '',
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!lead) return;
    try {
      await convertMutation.mutateAsync({
        id: lead.id,
        input: {
          ...formData,
          expected_close_date: formData.expected_close_date || undefined,
          description: formData.description || undefined,
        },
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error converting lead:', err);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ArrowRightCircle size={18} className="text-primary" />
                <h3 className="text-xl font-bold text-white">
                  Convertir a Negocio
                </h3>
              </div>
              {lead && (
                <p className="text-sm text-slate-400">
                  Lead:{' '}
                  <span className="text-white font-medium">{lead.name}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            id="convert-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            <Input
              label="Título del negocio"
              icon={Briefcase}
              required
              placeholder="Ej: Implementación CRM Corporativo"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valor estimado"
                icon={DollarSign}
                type="number"
                min="0"
                placeholder="0.00"
                value={formData.value ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
              />
              <Input
                label="Fecha de cierre"
                icon={Calendar}
                type="date"
                value={formData.expected_close_date ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_close_date: e.target.value,
                  })
                }
              />
            </div>

            {/* Pipeline */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Pipeline *
              </label>
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
                      {p.name}
                      {p.is_default ? ' (principal)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">
                Etapa inicial *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.stage_id}
                  onChange={(e) =>
                    setFormData({ ...formData, stage_id: e.target.value })
                  }
                  disabled={stages.length === 0}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none disabled:opacity-40"
                >
                  <option value="">Seleccionar etapa...</option>
                  {stages
                    .filter((s) => s.type === 'active')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.probability_percent}%)
                      </option>
                    ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>

            <Textarea
              label="Notas del negocio"
              placeholder="Contexto, necesidades o detalles del cliente..."
              rows={4}
              value={formData.description ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Lead info panel */}
            {lead && (
              <div className="rounded-xl bg-slate-800/40 border border-white/5 p-4 space-y-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Datos del lead
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Email</span>
                    <p className="text-white truncate">{lead.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Teléfono</span>
                    <p className="text-white">{lead.phone || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Empresa</span>
                    <p className="text-white truncate">
                      {lead.company?.name || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Fuente</span>
                    <p className="text-white capitalize">{lead.source}</p>
                  </div>
                </div>
              </div>
            )}
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
              form="convert-form"
              type="submit"
              disabled={
                convertMutation.isPending ||
                !formData.title ||
                !formData.pipeline_id ||
                !formData.stage_id
              }
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {convertMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ArrowRightCircle size={18} />
              )}
              Convertir a Negocio
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
