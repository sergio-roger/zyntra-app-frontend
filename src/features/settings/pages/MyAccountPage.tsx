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
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Lock,
  Mail,
  Save,
  Shield,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  agent: 'Agente',
  superAdmin: 'Super Admin',
};

type AccountTab = 'perfil' | 'seguridad';

export const MyAccountPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>('perfil');

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
    if (changedKeys.length === 0) return;

    const payload: Record<string, string> = {};
    changedKeys.forEach((key) => {
      payload[key] = data[key] ?? '';
    });

    await updateProfile.mutateAsync(payload);
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
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/10 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {fullName.substring(0, 2).toUpperCase() || '??'}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                  aria-label="Subir avatar"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploadAvatar.isPending}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all disabled:opacity-50"
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
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Quitar
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  PNG, JPEG o WEBP. Máximo 2MB.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    <Mail size={14} className="text-slate-500" />
                    Correo Electrónico
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950/30 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-slate-300">
                    <span className="truncate">{user?.email}</span>
                    {user?.isAccountActivated ? (
                      <span className="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={10} /> Verificada
                      </span>
                    ) : (
                      <span className="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={10} /> Sin verificar
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    <Shield size={14} className="text-slate-500" />
                    Rol
                  </label>
                  <div className="bg-slate-950/30 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-slate-300">
                    {roleLabel}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    <Calendar size={14} className="text-slate-500" />
                    Miembro desde
                  </label>
                  <div className="bg-slate-950/30 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-slate-300">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isProfileSubmitting || updateProfile.isPending}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {updateProfile.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Guardar cambios
                </button>
              </div>
            </form>
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
