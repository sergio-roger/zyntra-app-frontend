import React, { useState } from 'react';
import { 
  Plus, 
  Loader2, 
  AlertCircle, 
  Shield, 
  MoreVertical,
  Mail,
  UserCheck,
  UserMinus,
  Users
} from 'lucide-react';
import { useUsersList, useUpdateUser } from '@features/settings/hooks/useUsersTeams';
import { UserFormSidebar } from '../components/UserFormSidebar';
import { EmptyState } from '@shared/components/EmptyState';
import type { CrmUser } from '@features/settings/types';

export const UsersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CrmUser | null>(null);

  const { data: users = [], isLoading, isError, error } = useUsersList();
  const updateMutation = useUpdateUser();

  const openCreate = () => {
    setEditingUser(null);
    setSidebarOpen(true);
  };

  const openEdit = (user: CrmUser) => {
    setEditingUser(user);
    setSidebarOpen(true);
  };

  const toggleStatus = async (user: CrmUser) => {
    await updateMutation.mutateAsync({ id: user.id, is_active: !user.is_active });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'agent': return 'Agente';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Usuarios y Colaboradores</h2>
          <p className="text-sm text-slate-400">Gestiona quién tiene acceso a tu plataforma y sus permisos</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px hover:shadow-xl active:scale-95"
        >
          <Plus size={18} /> Añadir Usuario
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium">Cargando personal...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-300">
          <AlertCircle size={24} className="text-rose-500" />
          <p>{(error as Error).message}</p>
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="Sin colaboradores registrados"
          description="Añade a los miembros de tu equipo para empezar a colaborar y asignarles tareas o conversaciones."
          actionLabel="Añadir Primer Usuario"
          onAction={openCreate}
        />
      )}

      {!isLoading && users.length > 0 && (
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Colaborador</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rol</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Equipos</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-white/5 w-fit">
                        <Shield size={12} className="text-indigo-400" />
                        <span className="text-[11px] font-bold text-slate-300">{getRoleLabel(user.role)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.teams.length > 0 ? (
                          user.teams.map((team) => (
                            <div 
                              key={team.id}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 shadow-sm"
                            >
                              <div 
                                className="w-2 h-2 rounded-full shadow-sm"
                                style={{ backgroundColor: team.color }}
                              />
                              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">
                                {team.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">Sin equipo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        user.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(user)}
                          title={user.is_active ? 'Desactivar' : 'Activar'}
                          className={`p-2 rounded-xl transition-all ${
                            user.is_active 
                              ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-400/10' 
                              : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                        >
                          {user.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button 
                          onClick={() => openEdit(user)}
                          className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserFormSidebar
        open={sidebarOpen}
        user={editingUser}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
};
