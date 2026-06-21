import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useMenusList, useRolePermissions, useRolesList } from '@features/settings/hooks/usePermissions';

export const PermissionsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: allMenus = [], isLoading: loadingMenus } = useMenusList();
  const { data: dbRoles = [], isLoading: loadingRoles } = useRolesList();
  const { data: managerPerms, isLoading: loadingManager } = useRolePermissions('manager');
  const { data: agentPerms, isLoading: loadingAgent } = useRolePermissions('agent');

  const totalMenus = allMenus.length;
  const isLoading = loadingMenus || loadingRoles || loadingManager || loadingAgent;

  const getRoleIcon = (name: string) => {
    switch (name) {
      case 'admin': return ShieldAlert;
      case 'manager': return ShieldCheck;
      default: return Shield;
    }
  };

  const getRoleActiveCount = (name: string) => {
    switch (name) {
      case 'admin': return totalMenus;
      case 'manager': return managerPerms?.menu_ids.length ?? 0;
      case 'agent': return agentPerms?.menu_ids.length ?? 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Permisos de Acceso</h2>
        <p className="text-sm text-slate-400">Define qué secciones y funcionalidades puede ver cada rol en la plataforma</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium">Cargando información de roles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbRoles.map((role) => {
            const Icon = getRoleIcon(role.name);
            const activeCount = getRoleActiveCount(role.name);

            return (
              <div
                key={role.id}
                className="flex flex-col bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl relative group hover:border-white/10 transition-all hover:-translate-y-0.5"
              >
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
                    <span className="text-2xl font-extrabold text-white">{activeCount}</span>
                    <span className="text-xs text-slate-500 font-bold ml-1">/ {totalMenus} permisos</span>
                  </div>

                  {role.isEditable ? (
                    <button
                      onClick={() => navigate(`/settings/permissions/${role.name}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white transition-all group-hover:text-primary"
                    >
                      Configurar <ArrowRight size={16} />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-600 font-bold italic">No editable</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
