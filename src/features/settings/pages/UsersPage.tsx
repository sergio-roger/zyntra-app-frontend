import { Button } from '@core/ui/Button';
import { useAuthStore } from '@features/auth/store/authStore';
import { UserFormSidebar } from '@features/settings/components/UserFormSidebar';
import {
  useUpdateUser,
  useUsersList,
} from '@features/settings/hooks/useUsersTeams';
import { User } from '@features/settings/types/settings';
import { Avatar } from '@shared/components/Avatar';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import { toastManager } from '@shared/components/toast/toastManager';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Shield,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

export const UsersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  const { data: users = [], isLoading, isError, error } = useUsersList();
  const updateMutation = useUpdateUser();

  const openCreate = () => {
    setEditingUser(null);
    setSidebarOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setSidebarOpen(true);
  };

  const limit =
    currentUser?.plan?.userLimit ??
    (currentUser as any)?.plan_object?.userLimit ??
    999999;
  const activeUsersCount = users.filter((u) =>
    u.status ? u.status === 'active' : u.isActive,
  ).length;
  const isLimitReached = activeUsersCount >= limit && limit !== 999999;

  const toggleStatus = async (user: User) => {
    const isCurrentlyActive = user.status
      ? user.status === 'active'
      : user.isActive;
    if (!isCurrentlyActive && isLimitReached) {
      toastManager.add({
        title: 'Límite alcanzado',
        description: `Has alcanzado el límite de ${limit} usuarios activos permitidos en tu plan.`,
        type: 'error',
      });
      return;
    }
    const nextStatus = isCurrentlyActive ? 'inactive' : 'active';
    await updateMutation.mutateAsync({
      id: user.id,
      status: nextStatus,
      isActive: nextStatus === 'active',
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'agent':
        return 'Agente';
      case 'superAdmin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const renderStatusBadge = (user: User) => {
    const status = user.status ?? (user.isActive ? 'active' : 'inactive');
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Activo
        </span>
      );
    }
    if (status === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Suspendido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-base-300 text-base-content/50">
        <span className="w-1.5 h-1.5 rounded-full bg-base-content/40" />
        Inactivo
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Usuarios y Colaboradores"
        subtitle="Gestiona quién tiene acceso a tu plataforma y sus permisos."
        actions={
          <Button
            variant="tertiary"
            onClick={openCreate}
            disabled={isLimitReached}
            icon={Plus}
          >
            Añadir usuario
          </Button>
        }
      >
        <div className="text-xs font-semibold text-base-content/50">
          <span
            className={
              isLimitReached ? 'text-error font-bold' : 'text-base-content/70'
            }
          >
            {activeUsersCount}
          </span>{' '}
          / {limit === 999999 ? '∞' : limit} activos
        </div>
      </PageHeader>

      {isLimitReached && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-content">
          <AlertCircle size={20} className="text-warning" />
          <p>
            Has alcanzado el límite de {limit} usuarios activos permitidos en tu
            plan. Actualiza tu suscripción para añadir más.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-base-content/50 font-medium">
            Cargando personal...
          </p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-error/20 bg-error/5 p-6 text-sm text-error">
          <AlertCircle size={24} className="text-error" />
          <p>{(error as Error).message}</p>
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="Sin colaboradores registrados"
          description="Añade a los miembros de tu equipo para empezar a colaborar y asignarles tareas o conversaciones."
          actionLabel="Añadir primer usuario"
          onAction={openCreate}
        />
      )}

      {!isLoading && users.length > 0 && (
        <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-base-300 bg-base-300/30">
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Colaborador
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Equipos
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Activación
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest">
                    Creado
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-base-content/50 uppercase tracking-widest text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {users.map((user) => {
                  const isActive = user.status
                    ? user.status === 'active'
                    : user.isActive;
                  const firstName = user.firstName ?? '';
                  const lastName = user.lastName ?? '';
                  const fullName =
                    `${firstName} ${lastName}`.trim() || user.name;
                  const avatarUrl = user.avatarUrl;
                  const jobTitle = user.jobTitle;
                  const isAccountActivated = user.isAccountActivated;

                  return (
                    <tr
                      key={user.id}
                      className="group hover:bg-base-300/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={fullName}
                            email={user.email}
                            avatarUrl={avatarUrl}
                            size={40}
                            rounded="2xl"
                            className="ring-1 ring-base-content/10"
                          />
                          <div>
                            <p className="text-sm font-bold text-base-content">
                              {fullName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-base-content/50 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail size={12} />
                                {user.email}
                              </span>
                              {jobTitle && (
                                <span className="flex items-center gap-1 text-primary/80 font-medium">
                                  <Briefcase size={11} />
                                  {jobTitle}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-base-300 border border-base-300 w-fit">
                          <Shield size={12} className="text-primary" />
                          <span className="text-[11px] font-bold text-base-content/70">
                            {getRoleLabel(user.role ?? '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {(user.teams?.length ?? 0) > 0 ? (
                            user.teams!.map((team) => (
                              <div
                                key={team.id}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-base-300/50 border border-base-300 shadow-sm"
                              >
                                <div
                                  className="w-2 h-2 rounded-full shadow-sm"
                                  style={{ backgroundColor: team.color }}
                                />
                                <span className="text-[10px] font-bold text-base-content/70 whitespace-nowrap">
                                  {team.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-base-content/40 italic">
                              Sin equipo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isAccountActivated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Verificada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock size={12} /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{renderStatusBadge(user)}</td>
                      <td className="px-6 py-4 text-xs text-base-content/60 whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleStatus(user)}
                            title={isActive ? 'Desactivar' : 'Activar'}
                            className={`p-2 rounded-xl transition-all ${
                              isActive
                                ? 'text-base-content/50 hover:text-error hover:bg-error/10'
                                : 'text-success hover:bg-success/10'
                            }`}
                          >
                            {isActive ? (
                              <UserMinus size={18} />
                            ) : (
                              <UserCheck size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(user)}
                            title="Editar"
                            className="p-2 text-base-content/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserFormSidebar
        open={sidebarOpen}
        user={editingUser}
        isLimitReached={isLimitReached}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
};
