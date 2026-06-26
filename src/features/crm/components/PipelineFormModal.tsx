import React, { useState } from 'react';
import { X, Save, Loader2, FolderPlus, Users } from 'lucide-react';
import { useCreatePipeline } from '@crm/hooks/useDeals';
import { useTeamsList } from '@features/settings/hooks/useUsersTeams';
import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';

interface PipelineFormModalProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_STAGES = [
  { name: 'Prospección', color: '#4f46e5', probability_percent: 10,  type: 'active' },
  { name: 'Contactado',  color: '#06b6d4', probability_percent: 20,  type: 'active' },
  { name: 'Propuesta',   color: '#f59e0b', probability_percent: 40,  type: 'active' },
  { name: 'Negociación', color: '#8b5cf6', probability_percent: 60,  type: 'active' },
  { name: 'Ganado',      color: '#10b981', probability_percent: 100, type: 'won'    },
  { name: 'Perdido',     color: '#ef4444', probability_percent: 0,   type: 'lost'   },
] as const;

const TYPE_LABEL: Record<string, string> = {
  active: 'Activa',
  won: 'Ganado',
  lost: 'Perdido',
};

export const PipelineFormModal: React.FC<PipelineFormModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState<string | null>(null);
  const createMutation = useCreatePipeline();
  const { data: teams = [] } = useTeamsList();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        is_default: false,
        team_id: teamId,
      });
      onClose();
      setName('');
      setTeamId(null);
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
        {/* Header */}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Nombre del pipeline"
            required
            placeholder="Ej: Ventas Corporativas, Renovaciones..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Team selector */}
          <Select
            label="Equipo responsable"
            icon={Users}
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
            value={teamId}
            onChange={setTeamId}
            clearable
            clearLabel="Sin equipo asignado"
            placeholder="Sin equipo asignado (opcional)"
          />

          {/* Default stages preview */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Etapas que se crearán automáticamente
            </p>
            <div className="rounded-xl border border-white/5 bg-slate-950/40 divide-y divide-white/[0.04] overflow-hidden">
              {DEFAULT_STAGES.map((s) => (
                <div key={s.name} className="flex items-center gap-3 px-4 py-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="flex-1 text-sm text-slate-200 font-medium">{s.name}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border"
                    style={{
                      color: s.color,
                      borderColor: `${s.color}40`,
                      backgroundColor: `${s.color}15`,
                    }}
                  >
                    {TYPE_LABEL[s.type]}
                  </span>
                  <span className="text-[10px] text-slate-500 w-9 text-right">{s.probability_percent}%</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 ml-1">
              Puedes editar, reordenar o eliminar etapas desde el botón ⚙ del pipeline.
            </p>
          </div>

          {/* Footer */}
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
              Crear Pipeline
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
