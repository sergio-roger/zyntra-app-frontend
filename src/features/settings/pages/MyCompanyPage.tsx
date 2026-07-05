import { Input } from '@core/ui/Input';
import {
  useCompanyQuery,
  useRemoveCompanyLogo,
  useUpdateCompany,
  useUploadCompanyLogo,
} from '@features/settings/hooks/useCompany';
import {
  UpdateCompanyFormValues,
  updateCompanySchema,
} from '@features/settings/schemas/company.schema';
import { toastManager } from '@shared/components/toast/toastManager';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  FileText,
  Globe,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_LOGO_SIZE = 2 * 1024 * 1024;

export const MyCompanyPage: React.FC = () => {
  const { data: company, isLoading } = useCompanyQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const updateCompany = useUpdateCompany();
  const uploadLogo = useUploadCompanyLogo();
  const removeLogo = useRemoveCompanyLogo();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanySchema),
    values: {
      name: company?.name ?? '',
      email: company?.email ?? '',
      phone: company?.phone ?? '',
      address: company?.address ?? '',
      tax_id: company?.tax_id ?? '',
      website: company?.website ?? '',
    },
  });

  const onSubmit = async (data: UpdateCompanyFormValues) => {
    const changedKeys = Object.keys(dirtyFields) as Array<
      keyof UpdateCompanyFormValues
    >;
    if (changedKeys.length === 0) {
      setIsEditing(false);
      return;
    }

    const payload: Record<string, string> = {};
    changedKeys.forEach((key) => {
      payload[key] = data[key] ?? '';
    });

    await updateCompany.mutateAsync(payload);
    setIsEditing(false);
  };

  const handleLogoClick = () => fileInputRef.current?.click();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toastManager.add({
        title: 'Formato no permitido',
        description: 'Solo se aceptan imágenes PNG, JPEG o WEBP.',
        type: 'error',
      });
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      toastManager.add({
        title: 'Archivo muy grande',
        description: 'El tamaño máximo permitido es 2MB.',
        type: 'error',
      });
      return;
    }

    uploadLogo.mutate(file);
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Mi Empresa
        </h2>
        <p className="text-sm text-slate-400">
          Gestiona los datos de contacto y facturación de tu empresa.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/10">
                {company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 size={24} className="text-slate-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white">
                  {company?.name || '—'}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {company?.email || 'Sin correo registrado'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              aria-label={isEditing ? 'Cancelar edición' : 'Editar empresa'}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              {isEditing ? <X size={14} /> : <Pencil size={14} />}
            </button>
          </div>

          <div className="my-5 h-px bg-white/5" />

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                  aria-label="Subir logo"
                />
                <button
                  type="button"
                  onClick={handleLogoClick}
                  disabled={uploadLogo.isPending}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  {uploadLogo.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ImagePlus size={14} />
                  )}
                  Cambiar logo
                </button>
                {company?.logo_url && (
                  <button
                    type="button"
                    onClick={() => removeLogo.mutate()}
                    disabled={removeLogo.isPending}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Quitar
                  </button>
                )}
              </div>

              <Input
                label="Nombre de la empresa"
                icon={Building2}
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Correo de contacto"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Teléfono"
                icon={Phone}
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Dirección"
                icon={MapPin}
                error={errors.address?.message}
                {...register('address')}
              />
              <Input
                label="RUC / Identificación fiscal"
                icon={FileText}
                error={errors.tax_id?.message}
                {...register('tax_id')}
              />
              <Input
                label="Sitio web"
                icon={Globe}
                error={errors.website?.message}
                {...register('website')}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || updateCompany.isPending}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {updateCompany.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <InfoRow icon={Mail} value={company?.email || 'Sin correo registrado'} />
              <InfoRow icon={Phone} value={company?.phone || 'Sin teléfono registrado'} />
              <InfoRow icon={MapPin} value={company?.address || 'Sin dirección registrada'} />
              <InfoRow icon={FileText} value={company?.tax_id || 'Sin RUC registrado'} />
              <InfoRow icon={Globe} value={company?.website || 'Sin sitio web registrado'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: React.ReactNode;
}> = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-3 py-2.5">
    <Icon size={14} className="shrink-0 text-slate-500" />
    <span className="truncate text-sm text-slate-300">{value}</span>
  </div>
);
