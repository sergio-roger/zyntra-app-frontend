import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, ShieldCheck, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useMenusList, useRolePermissions, useRolesList, useCreateRole } from '@features/settings/hooks/usePermissions';
import { useAuthStore } from '@features/auth/store/authStore';

// Subcomponente de tarjeta para manejo dinámico de permisos de cada rol
interface RoleCardProps {
  role: {
    id: string;
    name: string;
    label: string;
    description: string;
    isEditable: boolean;
    badge?: string;
    badgeColor?: string;
    iconColor?: string;
  };
  totalMenus: number;
  user: any;
  navigate: ReturnType<typeof useNavigate>;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, totalMenus, user, navigate }) => {
  const { data: perms, isLoading } = useRolePermissions(role.name);

  const getRoleIcon = (name: string) => {
    switch (name) {
      case 'admin': return ShieldAlert;
      case 'manager': return ShieldCheck;
      default: return Shield;
    }
  };

  const Icon = getRoleIcon(role.name);
  const activeCount = role.name === 'admin' ? totalMenus : (perms?.menu_ids.length ?? 0);

  return (
    <div className="flex flex-col bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl relative group hover:border-white/10 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl border ${role.iconColor || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
          <Icon size={24} />
        </div>
        {role.badge && (
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${role.badgeColor || 'bg-slate-500/10 text-slate-400'}`}>
            {role.badge}
          </span>
        )}
      </div>

      <div className="mt-6 flex-1 space-y-2">
        <h3 className="text-lg font-bold text-white">{role.label}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{role.description}</p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div>
          {isLoading ? (
            <span className="loading loading-spinner loading-xs text-slate-500"></span>
          ) : (
            <>
              <span className="text-2xl font-extrabold text-white">{activeCount}</span>
              <span className="text-xs text-slate-500 font-bold ml-1">/ {totalMenus} permisos</span>
            </>
          )}
        </div>

        {role.isEditable && user?.plan?.name === 'Core Digital' ? (
          <button
            onClick={() => navigate(`/settings/permissions/${role.name}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white transition-all group-hover:text-primary"
          >
            Configurar <ArrowRight size={16} />
          </button>
        ) : (
          <span className="text-xs text-slate-600 font-bold italic">
            {user?.plan?.name !== 'Core Digital' && role.isEditable ? 'Requiere Core Digital' : 'No editable'}
          </span>
        )}
      </div>
    </div>
  );
};

export const PermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: allMenus = [], isLoading: loadingMenus } = useMenusList();
  const { data: dbRoles = [], isLoading: loadingRoles } = useRolesList();
  const createRoleMutation = useCreateRole();

  // Estados del modal de creación de roles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleBadge, setRoleBadge] = useState('');
  const [roleIconColor, setRoleIconColor] = useState('text-primary bg-primary/10 border-primary/20');
  const [createError, setCreateError] = useState('');

  const totalMenus = allMenus.length;
  const isLoading = loadingMenus || loadingRoles;

  const resetForm = () => {
    setRoleName('');
    setRoleLabel('');
    setRoleDesc('');
    setRoleBadge('');
    setRoleIconColor('text-primary bg-primary/10 border-primary/20');
    setCreateError('');
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    // Validar nombre del rol (solo minúsculas y guiones bajos / letras para evitar problemas en url)
    const sanitizedName = roleName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!/^[a-z0-9_]+$/.test(sanitizedName)) {
      setCreateError('El identificador del rol solo puede contener letras minúsculas, números y guiones bajos.');
      return;
    }

    try {
      await createRoleMutation.mutateAsync({
        name: sanitizedName,
        label: roleLabel.trim(),
        description: roleDesc.trim(),
        badge: roleBadge.trim() || undefined,
        iconColor: roleIconColor,
        badgeColor: roleIconColor.replace('bg-', 'bg-').replace('text-', 'text-'), // reutiliza colores
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Error al crear el rol. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Permisos de Acceso</h2>
          <p className="text-sm text-slate-400">Define qué secciones y funcionalidades puede ver cada rol en la plataforma.</p>
        </div>

        {/* Botón de crear rol si cuenta con el plan con permisos (Core Digital) */}
        {user?.plan?.name === 'Core Digital' ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-content font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={16} />
            Crear nuevo rol
          </button>
        ) : (
          user?.plan && (
            <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2.5 rounded-2xl">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Plan Activo:</span>
              <span className="text-sm text-indigo-400 font-extrabold">{user.plan.name}</span>
              {user.plan_status && (
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  user.plan_status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {user.plan_status === 'active' ? 'Activo' : user.plan_status}
                </span>
              )}
            </div>
          )
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium">Cargando información de roles y permisos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              totalMenus={totalMenus}
              user={user}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear Rol */}
      {isModalOpen && (
        <div className="modal modal-open z-[250]">
          <div className="modal-box bg-slate-950 border border-white/10 rounded-3xl p-6 text-white max-w-md shadow-2xl">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Shield className="text-primary animate-pulse" /> Crear Nuevo Rol
            </h3>
            
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">Identificador del Rol (Único en minúsculas)</label>
                <input
                  type="text"
                  placeholder="ej. manager_ventas"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white"
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">Nombre Visible (Label)</label>
                <input
                  type="text"
                  placeholder="ej. Gerente de Ventas"
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white"
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">Descripción</label>
                <textarea
                  placeholder="Describe las responsabilidades de este rol..."
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="textarea textarea-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl h-20 mt-1 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">Badge (Etiqueta)</label>
                  <input
                    type="text"
                    placeholder="ej. Ventas"
                    value={roleBadge}
                    onChange={(e) => setRoleBadge(e.target.value)}
                    className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white"
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">Color del Rol / Icono</label>
                  <select
                    value={roleIconColor}
                    onChange={(e) => setRoleIconColor(e.target.value)}
                    className="select select-bordered w-full bg-slate-900 border-white/10 text-sm rounded-xl mt-1 text-white"
                  >
                    <option value="text-primary bg-primary/10 border-primary/20">Violeta</option>
                    <option value="text-emerald-400 bg-emerald-500/10 border-emerald-500/20">Esmeralda</option>
                    <option value="text-blue-400 bg-blue-500/10 border-blue-500/20">Azul</option>
                    <option value="text-amber-400 bg-amber-500/10 border-amber-500/20">Ambar</option>
                    <option value="text-rose-400 bg-rose-500/10 border-rose-500/20">Rosa</option>
                  </select>
                </div>
              </div>

              {createError && (
                <p className="text-xs text-error font-medium bg-error/10 p-2.5 rounded-xl border border-error/20">{createError}</p>
              )}

              <div className="modal-action mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-ghost border-white/5 hover:bg-white/5 text-sm font-bold rounded-xl"
                  disabled={createRoleMutation.isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white text-sm font-bold rounded-xl px-6"
                  disabled={createRoleMutation.isPending}
                >
                  {createRoleMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
