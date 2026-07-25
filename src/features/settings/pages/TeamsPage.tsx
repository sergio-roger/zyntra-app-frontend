import { Button } from '@core/ui/Button';
import {
  useDeleteTeam,
  useTeamsList,
} from '@features/settings/hooks/useUsersTeams';
import { Team } from '@features/settings/types/settings';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import {
  AlertCircle,
  Loader2,
  MessageCircle,
  Plus,
  Settings2,
  Trash2,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { TeamFormSidebar } from '../components/TeamFormSidebar';

export const TeamsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const { data: teams = [], isLoading, isError, error } = useTeamsList();
  const deleteMutation = useDeleteTeam();

  const openCreate = () => {
    setEditingTeam(null);
    setSidebarOpen(true);
  };

  const openEdit = (team: Team) => {
    setEditingTeam(team);
    setSidebarOpen(true);
  };

  const handleDelete = async () => {
    if (deletingTeamId) {
      await deleteMutation.mutateAsync(deletingTeamId);
      setDeletingTeamId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Equipos de Trabajo"
        subtitle="Organiza a tus agentes para una mejor distribución de tareas"
        actions={
          <Button variant="tertiary" onClick={openCreate} icon={Plus}>
            Crear Equipo
          </Button>
        }
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-base-content/50 font-medium">
            Cargando equipos...
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-error/20 bg-error/5 p-6 text-sm text-error">
          <AlertCircle size={24} className="text-error" />
          <p>{(error as Error).message}</p>
        </div>
      )}

      {!isLoading && teams.length === 0 && (
        <EmptyState
          icon={Users}
          title="No hay equipos creados"
          description="Organiza a tus colaboradores por departamentos o funciones para facilitar la asignación de tareas."
          actionLabel="Crear Primer Equipo"
          onAction={openCreate}
        />
      )}

      {!isLoading && teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="group relative bg-base-200 border border-base-300 rounded-xl p-6 hover:border-base-content/20 transition-all hover:bg-base-200/80 shadow-md"
            >
              <div className="absolute top-6 right-6 flex items-center gap-1">
                <button
                  onClick={() => openEdit(team)}
                  className="p-2 text-base-content/50 hover:text-base-content hover:bg-base-300/50 rounded-xl transition-all"
                >
                  <Settings2 size={18} />
                </button>
                <button
                  onClick={() => setDeletingTeamId(team.id)}
                  className="p-2 text-base-content/50 hover:text-error hover:bg-error/10 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: team.color }}
                  >
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-base-content">
                      {team.name}
                    </h3>
                    <p className="text-xs text-base-content/50 font-medium">
                      {(team.members || []).length} Miembros
                    </p>
                  </div>
                </div>

                {team.description && (
                  <p className="text-sm text-base-content/60 line-clamp-2 h-10 italic">
                    "{team.description}"
                  </p>
                )}

                <div className="pt-4 border-t border-base-300">
                  <div className="flex -space-x-3 overflow-hidden">
                    {(team.members || []).slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        title={m.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-base-200 bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content cursor-help"
                      >
                        {m.name.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                    {(team.members || []).length > 5 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-base-200 bg-base-300 text-[10px] font-bold text-base-content">
                        +{(team.members || []).length - 5}
                      </div>
                    )}
                    {(team.members || []).length === 0 && (
                      <p className="text-[10px] text-base-content/40">
                        Sin miembros asignados
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-base-300/50 hover:bg-base-300 text-[10px] font-black text-base-content/70 uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <MessageCircle size={12} /> Chat de Equipo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamFormSidebar
        open={sidebarOpen}
        team={editingTeam}
        onClose={() => setSidebarOpen(false)}
      />

      <ConfirmModal
        isOpen={!!deletingTeamId}
        onClose={() => setDeletingTeamId(null)}
        onConfirm={handleDelete}
        title="Eliminar Equipo"
        description="¿Estás seguro de que deseas eliminar este equipo? Los usuarios asignados no serán eliminados, pero ya no pertenecerán a este grupo."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};
