import React from 'react';
import { FolderPlus, LayoutGrid, List, Upload } from 'lucide-react';

export type DriveViewMode = 'grid' | 'list';

interface DriveToolbarProps {
  canMutate: boolean;
  viewMode: DriveViewMode;
  onViewModeChange: (mode: DriveViewMode) => void;
  onNewFolder: () => void;
  onUploadClick: () => void;
}

export const DriveToolbar: React.FC<DriveToolbarProps> = ({
  canMutate,
  viewMode,
  onViewModeChange,
  onNewFolder,
  onUploadClick,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {canMutate && (
          <>
            <button
              onClick={onNewFolder}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-white/5"
            >
              <FolderPlus size={16} /> Nueva carpeta
            </button>
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px hover:shadow-xl active:scale-95"
            >
              <Upload size={16} /> Subir archivo
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/50 p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`rounded-lg p-1.5 transition-colors ${
            viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Vista de cuadrícula"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`rounded-lg p-1.5 transition-colors ${
            viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
          aria-label="Vista de lista"
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
};

export default DriveToolbar;
