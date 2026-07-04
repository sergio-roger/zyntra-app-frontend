import { getCroppedImageFile } from '@features/settings/utils/cropImage';
import { Avatar } from '@shared/components/Avatar';
import { toastManager } from '@shared/components/toast/toastManager';
import { ImagePlus, Loader2, X, ZoomIn } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  currentAvatarUrl?: string | null;
  name?: string | null;
  email?: string | null;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
  currentAvatarUrl,
  name,
  email,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  if (!isOpen) return null;

  const busy = isUploading || isProcessing;

  const handleSelectClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        'avatar.jpg',
      );
      onUpload(file);
    } catch {
      toastManager.add({
        title: 'Error al procesar la imagen',
        description: 'No se pudo recortar la imagen, intenta nuevamente.',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={busy ? undefined : onClose}
      />

      <div
        data-testid="avatar-upload-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl transition-all animate-in zoom-in-95 duration-300"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-white">
            Cambiar foto de perfil
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Subir avatar"
          />

          {imageSrc ? (
            <div className="space-y-4">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-950">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>

              <div className="flex items-center gap-3 px-1">
                <ZoomIn size={16} className="shrink-0 text-slate-500" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                  aria-label="Zoom"
                />
              </div>
            </div>
          ) : (
            <div
              onClick={handleSelectClick}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 bg-slate-950/30 py-10 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
            >
              <Avatar
                name={name}
                email={email}
                avatarUrl={currentAvatarUrl}
                size={88}
                rounded="full"
                className="ring-1 ring-white/10"
              />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-200">
                  Haz clic para seleccionar una imagen
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPEG o WEBP. Máximo 2MB.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/[0.02] px-6 py-4 flex items-center justify-between gap-3 border-t border-white/5">
          {imageSrc ? (
            <button
              type="button"
              onClick={handleSelectClick}
              disabled={busy}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              Elegir otra imagen
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!imageSrc || !croppedAreaPixels || busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ImagePlus size={16} />
              )}
              Guardar foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
