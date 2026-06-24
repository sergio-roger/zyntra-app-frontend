import React, { useState } from 'react';
import { X, Save, Loader2, Plus, Trash2, FolderPlus } from 'lucide-react';
import { useCreatePipeline } from '@crm/hooks/useDeals';
import { Input } from '@core/ui/Input';

interface PipelineFormModalProps {
  open: boolean;
  onClose: () => void;
}

interface StageInput {
  name: string;
  color: string;
  probability_percent: number;
}

const PRESET_COLORS = [
  '#4f46e5', // indigo
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export const PipelineFormModal: React.FC<PipelineFormModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [stages, setStages] = useState<StageInput[]>([
    { name: 'Contacto Inicial', color: '#4f46e5', probability_percent: 10 },
    { name: 'Propuesta', color: '#06b6d4', probability_percent: 50 },
    { name: 'Ganado', color: '#10b981', probability_percent: 100 },
  ]);

  const createMutation = useCreatePipeline();

  if (!open) return null;

  const handleAddStage = () => {
    const nextColor = PRESET_COLORS[stages.length % PRESET_COLORS.length];
    setStages([
      ...stages,
      { name: '', color: nextColor, probability_percent: 50 },
    ]);
  };

  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleStageChange = (index: number, field: keyof StageInput, value: any) => {
    setStages(
      stages.map((stage, i) => {
        if (i === index) {
          return { ...stage, [field]: value };
        }
        return stage;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      // Create pipeline
      await createMutation.mutateAsync({
        name: name.trim(),
        is_default: false,
      });
      
      onClose();
      setName('');
    } catch (err) {
      console.error('Error creating pipeline:', err);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl z-[70] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nuevo Pipeline</h3>
              <p className="text-xs text-slate-400">Crea un flujo de ventas para organizar tus tratos.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Nombre del pipeline"
            required
            placeholder="Ej: Ventas Corporativas, Renovaciones, etc."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Etapas Iniciales
              </label>
            </div>
            <p className="text-xs text-slate-500">
              El pipeline se creará con las fases estándar (Prospección, Contactado, Propuesta, Negociación, Ganado, Perdido) las cuales puedes personalizar después desde la configuración.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5 bg-slate-950/30 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Crear Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
