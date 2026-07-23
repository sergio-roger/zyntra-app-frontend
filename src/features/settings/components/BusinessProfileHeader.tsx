import {
  useRemoveBusinessCover,
  useRemoveBusinessLogo,
  useUploadBusinessCover,
  useUploadBusinessLogo,
} from '@features/settings/hooks/useBusiness';
import { Business } from '@features/settings/types/settings';
import { toastManager } from '@shared/components/toast/toastManager';
import { Building2, Camera, Loader2, Pencil, Trash2 } from 'lucide-react';
import React, { useRef } from 'react';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const MAX_COVER_SIZE = 5 * 1024 * 1024;

const validateImageFile = (file: File, maxSize: number): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Solo se aceptan imágenes PNG, JPEG o WEBP.';
  }
  if (file.size > maxSize) {
    return `El tamaño máximo permitido es ${Math.round(maxSize / (1024 * 1024))}MB.`;
  }
  return null;
};

interface BusinessProfileHeaderProps {
  business?: Business;
  isAdmin: boolean;
  onEdit: () => void;
}

export const BusinessProfileHeader: React.FC<BusinessProfileHeaderProps> = ({
  business,
  isAdmin,
  onEdit,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const uploadCover = useUploadBusinessCover();
  const removeCover = useRemoveBusinessCover();
  const uploadLogo = useUploadBusinessLogo();
  const removeLogo = useRemoveBusinessLogo();

  const handleFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxSize: number,
    mutate: (file: File) => void,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const error = validateImageFile(file, maxSize);
    if (error) {
      toastManager.add({ title: 'Archivo inválido', description: error, type: 'error' });
      return;
    }
    mutate(file);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 shadow-xl">
      <CoverBanner
        coverUrl={business?.coverUrl}
        isEditable={isAdmin}
        isUploading={uploadCover.isPending}
        isRemoving={removeCover.isPending}
        onPick={() => coverInputRef.current?.click()}
        onRemove={() => removeCover.mutate()}
      />
      {isAdmin && (
        <input
          ref={coverInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          aria-label="Subir portada"
          onChange={(e) =>
            handleFileSelected(e, MAX_COVER_SIZE, (file) => uploadCover.mutate(file))
          }
        />
      )}

      <div className="px-6 pb-6">
        <div className="-mt-12 flex items-end justify-between gap-3">
          <LogoAvatar
            name={business?.name}
            logoUrl={business?.logoUrl}
            isEditable={isAdmin}
            isUploading={uploadLogo.isPending}
            isRemoving={removeLogo.isPending}
            onPick={() => logoInputRef.current?.click()}
            onRemove={() => removeLogo.mutate()}
          />
          {isAdmin && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              <Pencil size={14} />
              Editar empresa
            </button>
          )}
        </div>
        {isAdmin && (
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            aria-label="Subir logo"
            onChange={(e) =>
              handleFileSelected(e, MAX_LOGO_SIZE, (file) => uploadLogo.mutate(file))
            }
          />
        )}

        <div className="mt-3 min-w-0">
          <p className="truncate text-base font-bold text-white">
            {business?.name || '—'}
          </p>
          <p className="truncate text-xs text-slate-500">
            {business?.email || 'Sin correo registrado'}
          </p>
        </div>
      </div>
    </div>
  );
};

const ImageHoverButton: React.FC<{
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = ({ onClick, isLoading, variant = 'default', label, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    aria-label={label}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-all disabled:opacity-50 ${
      variant === 'danger'
        ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
        : 'bg-black/40 text-white hover:bg-black/60'
    }`}
  >
    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
  </button>
);

const CoverBanner: React.FC<{
  coverUrl?: string | null;
  isEditable: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  onPick: () => void;
  onRemove: () => void;
}> = ({ coverUrl, isEditable, isUploading, isRemoving, onPick, onRemove }) => (
  <div className="group relative h-40 w-full bg-gradient-to-br from-slate-800 to-slate-900 sm:h-52">
    {coverUrl && (
      <img src={coverUrl} alt="Portada de la empresa" className="h-full w-full object-cover" />
    )}
    {isEditable && (
      <>
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ImageHoverButton onClick={onPick} isLoading={isUploading} label="Cambiar portada" icon={Camera} />
          {coverUrl && (
            <ImageHoverButton
              onClick={onRemove}
              isLoading={isRemoving}
              variant="danger"
              label="Quitar portada"
              icon={Trash2}
            />
          )}
        </div>
      </>
    )}
  </div>
);

const LogoAvatar: React.FC<{
  name?: string;
  logoUrl?: string | null;
  isEditable: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  onPick: () => void;
  onRemove: () => void;
}> = ({ name, logoUrl, isEditable, isUploading, isRemoving, onPick, onRemove }) => (
  <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-800 ring-4 ring-slate-900">
    {logoUrl ? (
      <img src={logoUrl} alt={name || 'Logo'} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <Building2 size={28} className="text-slate-500" />
      </div>
    )}
    {isEditable && (
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
        <ImageHoverButton onClick={onPick} isLoading={isUploading} label="Cambiar logo" icon={Camera} />
        {logoUrl && (
          <ImageHoverButton
            onClick={onRemove}
            isLoading={isRemoving}
            variant="danger"
            label="Quitar logo"
            icon={Trash2}
          />
        )}
      </div>
    )}
  </div>
);
