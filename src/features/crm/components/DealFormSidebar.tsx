import React, { useEffect, useState } from 'react';
import { X, Save, Loader2, Briefcase, DollarSign, User, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useCreateDeal, useUpdateDeal } from '@crm/hooks/useDeals';
import { useContactsList } from '@crm/hooks/useContacts';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import type { Deal, DealStage } from '@crm/types';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@crm/types';

interface DealFormSidebarProps {
  open: boolean;
  deal: Deal | null;
  onClose: () => void;
}

export const DealFormSidebar: React.FC<DealFormSidebarProps> = ({
  open,
  deal,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: 0,
    stage: 'prospecting' as DealStage,
    contact_id: '',
    probability: 0,
    expected_close_date: '',
  });

  const { data: contactsData } = useContactsList({ limit: 100 });
  const contacts = contactsData?.items || [];

  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description || '',
        value: Number(deal.value),
        stage: deal.stage,
        contact_id: deal.contact_id,
        probability: deal.probability,
        expected_close_date: deal.expected_close_date ? deal.expected_close_date.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        value: 0,
        stage: 'prospecting',
        contact_id: '',
        probability: 10,
        expected_close_date: '',
      });
    }
  }, [deal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
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
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form id="deal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <Input
                label="Título del negocio"
                icon={Briefcase}
                required
                placeholder="Ej: Implementación CRM Corporativo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1 flex items-center gap-1.5">
                  <User size={14} /> Contacto vinculado *
                </label>
                <select
                  required
                  value={formData.contact_id}
                  onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                >
                  <option value="">Seleccionar contacto...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email || 'Sin email'})</option>
                  ))}
                </select>
                {contacts.length === 0 && (
                  <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> No hay contactos disponibles.
                  </p>
                )}
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Etapa del pipeline</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    {DEAL_STAGES.map((s) => (
                      <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Fecha de cierre"
                  icon={Calendar}
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                />
              </div>

              <Textarea
                label="Descripción / Notas"
                placeholder="Detalles sobre el alcance, requerimientos, etc."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>

          {/* Footer Actions */}
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
              disabled={isSaving || !formData.title || !formData.contact_id}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {deal ? 'Actualizar Negocio' : 'Crear Negocio'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
