import React from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { Button } from '@core/ui/Button';
import { useDriveFilePreviewUrl } from '@features/drive/hooks/use-drive-files';
import { DriveFile } from '@features/drive/types/drive';
import { isPreviewableMimeType } from '@features/drive/utils/format';

interface FilePreviewModalProps {
  file: DriveFile | null;
  onClose: () => void;
  onDownload: (file: DriveFile) => void;
}

const PreviewBody: React.FC<{ file: DriveFile; url: string }> = ({ file, url }) => {
  if (file.mimeType.startsWith('image/')) {
    return <img src={url} alt={file.originalName} className="max-h-[60vh] rounded-lg object-contain" />;
  }
  return (
    <iframe title={file.originalName} src={url} className="h-[60vh] w-full rounded-lg bg-white" />
  );
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  const canPreview = !!file && isPreviewableMimeType(file.mimeType);
  const { data: url, isLoading } = useDriveFilePreviewUrl(canPreview ? file?.id : undefined);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="truncate text-lg font-bold text-white">{file.originalName}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(file)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              aria-label="Descargar"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex min-h-[200px] items-center justify-center">
          {!canPreview && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="text-sm text-slate-400">
                No hay vista previa disponible para este tipo de archivo.
              </span>
              <Button onClick={() => onDownload(file)} icon={Download}>
                Descargar
              </Button>
            </div>
          )}
          {canPreview && isLoading && <Loader2 size={24} className="animate-spin text-slate-500" />}
          {canPreview && url && <PreviewBody file={file} url={url} />}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
