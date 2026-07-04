import { Input } from '@core/ui/Input';
import { Tabs } from '@core/ui/Tabs';
import { FormField } from '@features/auth/components/FormField';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import { useAuthStore } from '@features/auth/store/authStore';
import {
  useChangePassword,
  useRemoveAvatar,
  useUpdateProfile,
  useUploadAvatar,
} from '@features/settings/hooks/useMyAccount';
import {
  ChangePasswordFormValues,
  changePasswordSchema,
  UpdateProfileFormValues,
  updateProfileSchema,
} from '@features/settings/schemas/my-account.schema';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { toastManager } from '@shared/components/toast/toastManager';
import { Avatar } from '@shared/components/Avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Activity,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Lock,
  LucideIcon,
  Mail,
  Pencil,
  Save,
  Shield,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type MockActivity = {
  id: string;
  actorName: string;
  action: string;
  date: string;
};

const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: '1',
    actorName: 'Nicholas Swatz',
    action: 'Inició sesión',
    date: '02 Jul 2026, 09:34',
  },
  {
    id: '2',
    actorName: 'Marisa Suñol',
    action: 'Actualizó el cargo del perfil',
    date: '28 Jun 2026, 15:10',
  },
  {
    id: '3',
    actorName: 'Tammy Collier',
    action: 'Cambió la contraseña',
    date: '20 Jun 2026, 11:22',
  },
  {
    id: '4',
    actorName: 'John Miller',
    action: 'Subió una nueva foto de perfil',
    date: '12 Jun 2026, 08:47',
  },
  {
    id: '5',
    actorName: 'Nicholas Swatz',
    action: 'Creó la cuenta',
    date: '05 Jun 2026, 17:03',
  },
];

const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  agent: 'Agente',
  superAdmin: 'Super Admin',
};

type AccountTab = 'perfil' | 'seguridad';

const ProfileInfoRow: React.FC<{
  icon: LucideIcon;
  value: React.ReactNode;
  children?: React.ReactNode;
}> = ({ icon: Icon, value, children }) => (
  <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-3 py-2.5">
    <Icon size={14} className="shrink-0 text-slate-500" />
    <span className="truncate text-sm text-slate-300">{value}</span>
    {children}
  </div>
);

export const MyAccountPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>('perfil');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const changePassword = useChangePassword();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: {
      errors: profileErrors,
      dirtyFields,
      isSubmitting: isProfileSubmitting,
    },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      jobTitle: user?.jobTitle ?? '',
    },
  });

  const onProfileSubmit = async (data: UpdateProfileFormValues) => {
    const changedKeys = Object.keys(dirtyFields) as Array<
      keyof UpdateProfileFormValues
    >;
    if (changedKeys.length === 0) {
      setIsEditingProfile(false);
      return;
    }

    const payload: Record<string, string> = {};
    changedKeys.forEach((key) => {
      payload[key] = data[key] ?? '';
    });

    await updateProfile.mutateAsync(payload);
    setIsEditingProfile(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toastManager.add({
        title: 'Formato no permitido',
        description: 'Solo se aceptan imágenes PNG, JPEG o WEBP.',
        type: 'error',
      });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toastManager.add({
        title: 'Archivo muy grande',
        description: 'El tamaño máximo permitido es 2MB.',
        type: 'error',
      });
      return;
    }

    uploadAvatar.mutate(file);
  };

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    setPasswordError(null);
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPasswordForm();
    } catch (error) {
      setPasswordError(getApiErrorMessage(error));
    }
  };

  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    user?.name ||
    '';
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '—';

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Mi Cuenta
        </h2>
        <p className="text-sm text-slate-400">
          Gestiona los datos de tu cuenta de usuario, contraseña y perfil.
        </p>
      </div>

      <div className="w-full bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <Tabs
          tabs={[
            { key: 'perfil', label: 'Perfil', icon: UserIcon },
            { key: 'seguridad', label: 'Seguridad', icon: Lock },
          ]}
          active={activeTab}
          onChange={setActiveTab}
          compact
          className="px-6"
        />

        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[360px_1fr]">
            {/* Columna izquierda: tarjeta de perfil */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={fullName}
                    email={user?.email}
                    avatarUrl={user?.avatarUrl}
                    size={56}
                    rounded="2xl"
                    className="ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-white">
                      {fullName || '—'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.jobTitle || roleLabel}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile((v) => !v)}
                  aria-label={
                    isEditingProfile ? 'Cancelar edición' : 'Editar perfil'
                  }
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                >
                  {isEditingProfile ? <X size={14} /> : <Pencil size={14} />}
                </button>
              </div>

              <div className="my-5 h-px bg-white/5" />

              {isEditingProfile ? (
                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                      aria-label="Subir avatar"
                    />
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={uploadAvatar.isPending}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                      {uploadAvatar.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ImagePlus size={14} />
                      )}
                      Cambiar foto
                    </button>
                    {user?.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => removeAvatar.mutate()}
                        disabled={removeAvatar.isPending}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Quitar
                      </button>
                    )}
                  </div>

                  <Input
                    label="Nombre(s)"
                    icon={UserIcon}
                    error={profileErrors.firstName?.message}
                    {...registerProfile('firstName')}
                  />
                  <Input
                    label="Apellido(s)"
                    error={profileErrors.lastName?.message}
                    {...registerProfile('lastName')}
                  />
                  <Input
                    label="Cargo / Puesto"
                    icon={Briefcase}
                    error={profileErrors.jobTitle?.message}
                    {...registerProfile('jobTitle')}
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isProfileSubmitting || updateProfile.isPending}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                    >
                      {updateProfile.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Guardar cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Cuenta
                    </h4>
                    <ProfileInfoRow icon={Mail} value={user?.email ?? '—'}>
                      {user?.isAccountActivated ? (
                        <span className="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={10} /> Verificada
                        </span>
                      ) : (
                        <span className="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock size={10} /> Sin verificar
                        </span>
                      )}
                    </ProfileInfoRow>
                    <ProfileInfoRow icon={Shield} value={roleLabel} />
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Antigüedad
                    </h4>
                    <ProfileInfoRow
                      icon={Calendar}
                      value={
                        user?.createdAt
                          ? `Miembro desde ${new Date(
                              user.createdAt,
                            ).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}`
                          : '—'
                      }
                    />
                  </section>
                </div>
              )}
            </div>

            {/* Columna derecha: actividad */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Actividad reciente
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Usuario
                      </th>
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Actividad
                      </th>
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_ACTIVITIES.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={activity.actorName} size={24} />
                            <span className="text-sm text-slate-200 whitespace-nowrap">
                              {activity.actorName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-400">
                          {activity.action}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-500 text-right whitespace-nowrap">
                          {activity.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguridad' && (
          <div className="p-6">
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              noValidate
              className="flex max-w-md flex-col gap-4"
            >
              <FormField
                label="Contraseña actual"
                icon={Lock}
                type="password"
                autoComplete="current-password"
                error={passwordErrors.currentPassword?.message}
                disabled={isPasswordSubmitting}
                {...registerPassword('currentPassword')}
              />
              <FormField
                label="Nueva contraseña"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                error={passwordErrors.newPassword?.message}
                disabled={isPasswordSubmitting}
                {...registerPassword('newPassword')}
              />
              <FormField
                label="Confirmar nueva contraseña"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                error={passwordErrors.confirmPassword?.message}
                disabled={isPasswordSubmitting}
                {...registerPassword('confirmPassword')}
              />

              {passwordError && (
                <p role="alert" className="text-xs text-rose-400">
                  {passwordError}
                </p>
              )}

              <SubmitButton
                loading={isPasswordSubmitting || changePassword.isPending}
              >
                Cambiar contraseña
              </SubmitButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
