import { useRolePermissions } from '@features/settings/hooks/usePermissions';
import { CardWrapper } from '@shared/components/CardWrapper';
import { ArrowRight, Edit, Shield, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';
import React, { createElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    label: string;
    description: string;
    isEditable: boolean;
    badge?: string | null;
    badgeColor?: string | null;
    iconColor?: string | null;
  };
  totalMenus: number;
  user: any;
  navigate: ReturnType<typeof useNavigate>;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getRoleIcon = (name: string) => {
  switch (name) {
    case 'admin': return ShieldAlert;
    case 'manager': return ShieldCheck;
    default: return Shield;
  }
};

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  totalMenus,
  user,
  navigate,
  onEdit,
  onDelete,
}) => {
  const { data: perms, isLoading } = useRolePermissions(role.name);

  const activeCount = role.name === 'admin' ? totalMenus : (perms?.menu_ids.length ?? 0);
  const isCustomRole = !['admin', 'superAdmin', 'manager', 'agent'].includes(role.name);

  return (
    <CardWrapper className="p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl border ${role.iconColor || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
          {createElement(getRoleIcon(role.name), { size: 24 })}
        </div>
        <div className="flex items-center gap-2">
          {role.isEditable && isCustomRole && user?.plan?.name === 'Core Digital' && (
            <div className="flex items-center gap-1.5 mr-1">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  title="Editar Rol"
                >
                  <Edit size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-error transition-colors"
                  title="Eliminar Rol"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
          {role.badge && (
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${role.badgeColor || 'bg-slate-500/10 text-slate-400'}`}>
              {role.badge}
            </span>
          )}
        </div>
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
    </CardWrapper>
  );
};
