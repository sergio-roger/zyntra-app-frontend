import { PermissionMatrix } from '@features/settings/components/PermissionMatrix';
import { useRolesList } from '@features/settings/hooks/usePermissions';
import { useAuthStore } from '@features/auth/store/authStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@shared/components/PageHeader';

export const RolePermissionsPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: dbRoles = [], isLoading } = useRolesList();

  const roleInfo = dbRoles.find((r) => r.name === role);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm text-slate-500 font-medium">
          Cargando información del rol...
        </p>
      </div>
    );
  }

  if (user?.plan?.name !== 'Core Digital') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/settings/permissions')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Volver a permisos
        </button>
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-12 text-center text-slate-400">
          Tu plan actual no permite la edición dinámica de permisos. Actualiza a{' '}
          <span className="font-semibold text-primary">Core Digital</span> para
          desbloquear esta funcionalidad.
        </div>
      </div>
    );
  }

  if (!roleInfo || ['admin', 'superAdmin'].includes(role || '')) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/settings/permissions')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Volver a permisos
        </button>
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-12 text-center text-slate-400">
          Rol no válido o no configurable.
        </div>
      </div>
    );
  }

  const configRoleKey = role as string;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <button
          onClick={() => navigate('/settings/permissions')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider mb-2"
        >
          <ArrowLeft size={14} /> Volver a permisos
        </button>
        <PageHeader
          title={`Configurar Permisos: ${roleInfo.label}`}
          subtitle={roleInfo.description}
        />
      </div>

      <div className="bg-slate-950/20 border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="mb-6 bg-slate-900/40 border border-indigo-500/10 rounded-2xl p-4 text-xs text-indigo-300">
          Nota: Los cambios realizados en la matriz de permisos se guardan de
          forma automática e inmediata.
        </div>
        <PermissionMatrix roleKey={configRoleKey} />
      </div>
    </div>
  );
};
