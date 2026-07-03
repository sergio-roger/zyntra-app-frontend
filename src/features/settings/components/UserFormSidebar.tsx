import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { useAuthStore } from '@features/auth/store/authStore';
import { useRolesList } from '@features/settings/hooks/usePermissions';
import {
  useCreateUser,
  useUpdateUser,
} from '@features/settings/hooks/useUsersTeams';
import { CrmUser, UserRole, UserStatus } from '@features/settings/types/settings';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import {
  Activity,
  Briefcase,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Mail,
  Shield,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface UserFormSidebarProps {
  open: boolean;
  user: CrmUser | null;
  isLimitReached?: boolean;
  onClose: () => void;
}

export const UserFormSidebar: React.FC<UserFormSidebarProps> = ({
  open,
  user,
  isLimitReached,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    avatarUrl: '',
    role: 'agent' as UserRole,
    status: 'active' as UserStatus,
    isAccountActivated: false,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const { data: dbRoles } = useRolesList();

  const currentUser = useAuthStore((s) => s.user);
  const planName =
    currentUser?.plan?.name ||
    (currentUser as any)?.plan_object?.name ||
    'Impulse Pro';

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFormData({
        firstName: user.firstName ?? parts[0] ?? '',
        lastName: user.lastName ?? parts.slice(1).join(' ') ?? '',
        email: user.email,
        jobTitle: user.jobTitle ?? '',
        avatarUrl: user.avatarUrl ?? '',
        role: user.role ?? 'agent',
        status: user.status ?? ((user.isActive) ? 'active' : 'inactive'),
        isAccountActivated: Boolean(user.isAccountActivated),
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        avatarUrl: '',
        role: 'agent',
        status: 'active',
        isAccountActivated: false,
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const isActive = formData.status === 'active';
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...updateFields } = formData;
        await updateMutation.mutateAsync({ id: user.id, ...updateFields, name, isActive });
      } else {
        await createMutation.mutateAsync({ ...formData, name, isActive });
      }
      onClose();
    } catch (error) {
      toastManager.add({
        title: user ? 'Error al actualizar usuario' : 'Error al crear usuario',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    }
  };

  const getRoleLabel = (role: any) => {
    if (role.name === 'admin') return 'Administrador (Acceso Total)';
    if (role.name === 'manager') return 'Gerente (Gestión de CRM y Agentes)';
    if (role.name === 'agent')
      return planName === 'BrandStart'
        ? 'Usuario Estándar (Operación Diaria)'
        : 'Agente (Operación Diaria)';
    return `${role.label} (${role.description || 'Rol Personalizado'})`;
  };

  const displayRoles = dbRoles || [];
  const filteredRoles = displayRoles.filter((role) => {
    if (role.name === 'superAdmin') return false;
    if (role.name === 'manager' && planName === 'BrandStart') return false;
    return true;
  });

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'suspended', label: 'Suspendido' },
  ];

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
                <User size={20} className="text-indigo-400" />
                {user ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {user
                  ? 'Actualiza los datos del colaborador'
                  : 'Añade un nuevo miembro a tu equipo'}
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
            id="user-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-5"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre(s)"
                icon={User}
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Ej: Juan"
              />
              <Input
                label="Apellido(s)"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Ej: Pérez"
              />
            </div>

            <Input
              label="Correo Electrónico"
              icon={Mail}
              type="email"
              required
              disabled={!!user}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="juan@company.com"
            />

            <Input
              label="Cargo / Puesto"
              icon={Briefcase}
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              placeholder="Ej: Gerente de Ventas"
            />

            <Input
              label="Foto de Perfil (URL)"
              icon={ImageIcon}
              value={formData.avatarUrl}
              onChange={(e) =>
                setFormData({ ...formData, avatarUrl: e.target.value })
              }
              placeholder="https://example.com/avatar.jpg"
            />

            <Select
              label="Rol del Usuario"
              icon={Shield}
              options={filteredRoles.map((role) => ({
                value: role.name,
                label: getRoleLabel(role),
              }))}
              value={formData.role}
              onChange={(v) => {
                if (v) setFormData({ ...formData, role: v as UserRole });
              }}
            />

            <Select
              label="Estado de la Cuenta"
              icon={Activity}
              options={statusOptions}
              value={formData.status}
              onChange={(v) => {
                if (v) {
                  const newStatus = v as UserStatus;
                  if (newStatus === 'active' && formData.status !== 'active' && isLimitReached) {
                    toastManager.add({
                      title: 'Límite alcanzado',
                      description: 'Has alcanzado el límite de usuarios activos permitidos en tu plan.',
                      type: 'error',
                    });
                    return;
                  }
                  setFormData({ ...formData, status: newStatus });
                }
              }}
            />

            <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className={
                    formData.isAccountActivated
                      ? 'text-emerald-500'
                      : 'text-slate-600'
                  }
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    Cuenta Activada
                  </p>
                  <p className="text-xs text-slate-500">
                    {formData.isAccountActivated
                      ? 'El usuario ha verificado su cuenta'
                      : 'Pendiente de activación por el usuario'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isAccountActivated: !formData.isAccountActivated,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isAccountActivated ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isAccountActivated ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
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
                form="user-form"
                type="submit"
                disabled={isSaving || (!formData.firstName && !formData.lastName) || !formData.email}
                className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {user ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
