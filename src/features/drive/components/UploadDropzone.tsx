import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export interface UploadDropzoneHandle {
  openFilePicker: () => void;
}

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  progress: number | null;
  children: React.ReactNode;
}

export const UploadDropzone = forwardRef<UploadDropzoneHandle, UploadDropzoneProps>(
  ({ onFilesSelected, progress, children }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    useImperativeHandle(ref, () => ({
      openFilePicker: () => inputRef.current?.click(),
    }));

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
      if (event.dataTransfer.files.length > 0) {
        onFilesSelected(event.dataTransfer.files);
      }
    };

    return (
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className="relative"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) onFilesSelected(event.target.files);
            event.target.value = '';
          }}
        />

        {isDragOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-primary/10 backdrop-blur-sm">
            <UploadCloud size={32} className="text-primary" />
            <span className="text-sm font-bold text-primary">
              Soltá los archivos para subirlos
            </span>
          </div>
        )}

        {progress !== null && (
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5">
            <span className="text-xs font-semibold text-slate-400">Subiendo…</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-400">{progress}%</span>
          </div>
        )}

        {children}
      </div>
    );
  },
);

UploadDropzone.displayName = 'UploadDropzone';

export default UploadDropzone;
