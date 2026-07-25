import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Accordion } from '@core/ui/Accordion';
import { Tabs } from '@core/ui/Tabs';
import { SubmitButton } from '@features/auth/components/SubmitButton';
import { useAuthStore } from '@features/auth/store/authStore';
import { AvatarUploadModal } from '@features/settings/components/AvatarUploadModal';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from '@shared/components/Avatar';
import { PageHeader } from '@shared/components/PageHeader';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import {
  Activity,
  Briefcase,
  Calendar,
  CheckCircle2,
  ImagePlus,
  Info,
  Lock,
  LucideIcon,
  Mail,
  Phone,
  Save,
  Shield,
  Trash2,
  User as UserIcon,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
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
  <div className="flex items-center gap-2 rounded-xl bg-base-300/40 px-3 py-2.5">
    <Icon size={14} className="shrink-0 text-base-content/50" />
    <span className="truncate text-sm text-base-content/80">{value}</span>
    {children}
  </div>
);

export const MyAccountPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccountTab>('perfil');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);


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
      firstName: user?.firstName || (user?.name ? user.name.split(' ')[0] : ''),
      lastName: user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : ''),
      jobTitle: user?.jobTitle ?? '',
      phone: user?.phone ?? '',
      bio: user?.bio ?? '',
    },
  });

  const onProfileSubmit = async (data: UpdateProfileFormValues) => {
    const changedKeys = Object.keys(dirtyFields) as Array<
      keyof UpdateProfileFormValues
    >;
    if (changedKeys.length === 0) {
      return;
    }

    const payload: Record<string, string> = {};
    changedKeys.forEach((key) => {
      payload[key] = data[key] ?? '';
    });

    await updateProfile.mutateAsync(payload);
  };

  const handleAvatarUpload = (file: File) => {
    uploadAvatar.mutate(file, {
      onSuccess: () => setIsAvatarModalOpen(false),
    });
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
      <PageHeader
        title="Mi Cuenta"
        subtitle="Gestiona los datos de tu cuenta de usuario, contraseña y perfil."
      />

      <div className="w-full bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-md">
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
            {/* Columna izquierda: tarjeta de perfil directamente editable */}
            <div className="rounded-xl border border-base-300 bg-base-200/60 p-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={fullName}
                    email={user?.email}
                    avatarUrl={user?.avatarUrl}
                    size={56}
                    rounded="2xl"
                    className="ring-1 ring-base-content/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-base-content">
                      {fullName || '—'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-base-content/50">
                      <Shield size={12} className="text-base-content/40" />
                      <span>{roleLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsAvatarModalOpen(true)}
                    disabled={uploadAvatar.isPending}
                    loading={uploadAvatar.isPending}
                    icon={ImagePlus}
                  >
                    Cambiar foto
                  </Button>
                  {user?.avatarUrl && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeAvatar.mutate()}
                      disabled={removeAvatar.isPending}
                      loading={removeAvatar.isPending}
                      icon={Trash2}
                    >
                      Quitar
                    </Button>
                  )}
                </div>

                <div className="h-px bg-base-300" />

                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className="space-y-4"
                  id="profile-edit-form"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nombre(s)"
                      icon={UserIcon}
                      placeholder="Ingresa tu nombre"
                      error={profileErrors.firstName?.message}
                      {...registerProfile('firstName')}
                    />
                    <Input
                      label="Apellido(s)"
                      placeholder="Ingresa tu apellido"
                      error={profileErrors.lastName?.message}
                      {...registerProfile('lastName')}
                    />
                  </div>
                  <Input
                    label="Correo electrónico"
                    icon={Mail}
                    value={user?.email ?? ''}
                    disabled
                    readOnly
                    className="!border-none !text-base-content/40 cursor-not-allowed"
                  />

                  <Input
                    label="Cargo / Puesto"
                    icon={Briefcase}
                    placeholder="Sin cargo especificado"
                    error={profileErrors.jobTitle?.message}
                    {...registerProfile('jobTitle')}
                  />
                  <Input
                    label="Teléfono / Celular"
                    icon={Phone}
                    placeholder="Sin teléfono especificado"
                    error={profileErrors.phone?.message}
                    {...registerProfile('phone')}
                  />
                  
                  <Textarea
                    label="Biografía"
                    icon={Info}
                    rows={3}
                    maxLength={280}
                    placeholder="No has añadido una biografía todavía."
                    error={profileErrors.bio?.message}
                    {...registerProfile('bio')}
                  />

                  <Accordion title="Información adicional">
                    {(user?.teams?.length ?? 0) > 0 && (
                      <section className="space-y-2">
                        <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-base-content/50">
                          <Users size={12} />
                          Equipos
                        </h4>
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {user!.teams!.map((team) => (
                            <div
                              key={team.id}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-base-300/40 border border-base-300"
                            >
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: team.color }}
                              />
                              <span className="text-[10px] font-bold text-base-content/80 whitespace-nowrap">
                                {team.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/50">
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
                      {user?.isAccountActivated && user?.activatedAt && (
                        <ProfileInfoRow
                          icon={CheckCircle2}
                          value={`Cuenta activada el ${new Date(
                            user.activatedAt,
                          ).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}`}
                        />
                      )}
                    </section>
                  </Accordion>
                </form>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  form="profile-edit-form"
                  variant="tertiary"
                  disabled={isProfileSubmitting}
                  loading={updateProfile.isPending}
                  icon={Save}
                  fullWidth
                >
                  Guardar cambios
                </Button>
              </div>
            </div>

            {/* Columna derecha: actividad */}
            <div className="rounded-xl border border-base-300 bg-base-200/60 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-base-content">
                  Actividad reciente
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-base-300">
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-base-content/50">
                        Usuario
                      </th>
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-base-content/50">
                        Actividad
                      </th>
                      <th className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-base-content/50 text-right">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {MOCK_ACTIVITIES.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-base-content/[0.02] transition-colors"
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={activity.actorName} size={24} />
                            <span className="text-sm text-base-content/80 whitespace-nowrap">
                              {activity.actorName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-base-content/60">
                          {activity.action}
                        </td>
                        <td className="px-3 py-3 text-xs text-base-content/50 text-right whitespace-nowrap">
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
              <Input
                label="Contraseña actual"
                icon={Lock}
                type="password"
                autoComplete="current-password"
                error={passwordErrors.currentPassword?.message}
                disabled={isPasswordSubmitting}
                {...registerPassword('currentPassword')}
              />
              <Input
                label="Nueva contraseña"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                error={passwordErrors.newPassword?.message}
                disabled={isPasswordSubmitting}
                {...registerPassword('newPassword')}
              />
              <Input
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

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpload={handleAvatarUpload}
        isUploading={uploadAvatar.isPending}
        currentAvatarUrl={user?.avatarUrl}
        name={fullName}
        email={user?.email}
      />
    </div>
  );
};
