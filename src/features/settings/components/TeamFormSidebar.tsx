import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import {
  useCreateTeam,
  useUpdateTeam,
  useUsersList,
} from '@features/settings/hooks/useUsersTeams';
import { Team } from '@features/settings/types/settings';
import {
  AlignLeft,
  Check,
  Loader2,
  Palette,
  Type,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TeamFormSidebarProps {
  open: boolean;
  team: Team | null;
  onClose: () => void;
}

const COLORS = [
  '#4F46E5',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
];

export const TeamFormSidebar: React.FC<TeamFormSidebarProps> = ({
  open,
  team,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4F46E5',
    member_ids: [] as string[],
  });

  const { data: users = [] } = useUsersList();
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || '',
        color: team.color,
        member_ids: team.members.map((m) => m.id),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#4F46E5',
        member_ids: [],
      });
    }
  }, [team, open]);

  const toggleMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(id)
        ? prev.member_ids.filter((mid) => mid !== id)
        : [...prev.member_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (team) {
      await updateMutation.mutateAsync({ id: team.id, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    onClose();
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
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-indigo-400" />
                {team ? 'Editar Equipo' : 'Nuevo Equipo'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Organiza a tus colaboradores por áreas o funciones
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form
            id="team-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <Input
              label="Nombre del Equipo"
              icon={Type}
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Ventas, Soporte, Desarrollo..."
            />

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <Palette size={14} className="text-slate-500" />
                Color Distintivo
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <UserPlus size={14} className="text-slate-500" />
                Miembros del Equipo
              </label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {users.length === 0 && (
                  <p className="text-[10px] text-slate-500 text-center py-4 bg-slate-950/30 rounded-xl border border-dashed border-white/5">
                    No hay usuarios disponibles para asignar.
                  </p>
                )}
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => toggleMember(u.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      formData.member_ids.includes(u.id)
                        ? 'bg-indigo-500/10 border-indigo-500/30'
                        : 'bg-slate-950/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    {formData.member_ids.includes(u.id) && (
                      <Check size={16} className="text-indigo-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              label="Descripción"
              icon={AlignLeft}
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Añade una breve descripción del equipo..."
            />
          </form>

          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                form="team-form"
                type="submit"
                disabled={isSaving || !formData.name}
                className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {team ? 'Guardar Cambios' : 'Crear Equipo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
