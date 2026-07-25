import { Button } from '@core/ui/Button';
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
            <Button variant="secondary" outline onClick={onNewFolder} icon={FolderPlus}>
              Nueva carpeta
            </Button>
            <Button variant="tertiary" onClick={onUploadClick} icon={Upload}>
              Subir archivo
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-base-300 bg-base-200 p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`rounded-lg p-1.5 transition-colors ${
            viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-base-content/50 hover:text-base-content/80'
          }`}
          aria-label="Vista de cuadrícula"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`rounded-lg p-1.5 transition-colors ${
            viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-base-content/50 hover:text-base-content/80'
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
