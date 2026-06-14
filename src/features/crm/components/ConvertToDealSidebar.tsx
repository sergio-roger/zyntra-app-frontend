import React, { useEffect, useState } from 'react';
import { X, Loader2, Briefcase, DollarSign, Calendar, ArrowRightCircle } from 'lucide-react';
import { useConvertToDeal } from '@crm/hooks/useLeads';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Contact, DealStage, ConvertToDealInput } from '@crm/types';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@crm/types';

interface ConvertToDealSidebarProps {
  open: boolean;
  lead: Contact | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConvertToDealSidebar: React.FC<ConvertToDealSidebarProps> = ({
  open,
  lead,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ConvertToDealInput>({
    title: '',
    value: 0,
    stage: 'prospecting',
    expected_close_date: '',
    description: '',
  });

  const convertMutation = useConvertToDeal();

  useEffect(() => {
    if (lead) {
      setFormData({
        title: `Negocio con ${lead.name}`,
        value: lead.deal_value ? Number(lead.deal_value) : 0,
        stage: 'prospecting',
        expected_close_date: '',
        description: '',
      });
    }
  }, [lead, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    try {
      const input: ConvertToDealInput = {
        ...formData,
        expected_close_date: formData.expected_close_date || undefined,
        description: formData.description || undefined,
      };
      await convertMutation.mutateAsync({ id: lead.id, input });
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

      <div className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ArrowRightCircle size={18} className="text-primary" />
                <h3 className="text-xl font-bold text-white">Convertir a Negocio</h3>
              </div>
              {lead && (
                <p className="text-sm text-slate-400">
                  Lead: <span className="text-white font-medium">{lead.name}</span>
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

          <form id="convert-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <Input
              label="Título del negocio"
              icon={Briefcase}
              required
              placeholder="Ej: Implementación CRM Corporativo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valor estimado"
                icon={DollarSign}
                type="number"
                min="0"
                placeholder="0.00"
                value={formData.value ?? ''}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
              <Input
                label="Fecha de cierre"
                icon={Calendar}
                type="date"
                value={formData.expected_close_date ?? ''}
                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 ml-1">Etapa inicial</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
              >
                {DEAL_STAGES.filter((s) => s !== 'won' && s !== 'lost').map((s) => (
                  <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>

            <Textarea
              label="Notas del negocio"
              placeholder="Contexto, necesidades o detalles del cliente..."
              rows={4}
              value={formData.description ?? ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {lead && (
              <div className="rounded-xl bg-slate-800/40 border border-white/5 p-4 space-y-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Datos del lead</p>
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
                    <p className="text-white truncate">{lead.company_name || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Fuente</span>
                    <p className="text-white capitalize">{lead.source}</p>
                  </div>
                </div>
              </div>
            )}
          </form>

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
              disabled={convertMutation.isPending || !formData.title}
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
