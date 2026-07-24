import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { DriveToolbar } from '@features/drive/components/DriveToolbar';
import { FileGrid } from '@features/drive/components/FileGrid';
import { FileList } from '@features/drive/components/FileList';
import { DriveFlatView } from '@features/drive/hooks/use-drive-flat-view';

interface DriveFlatViewContentProps {
  section: 'recent' | 'trash';
  view: DriveFlatView;
}

export const DriveFlatViewContent: React.FC<DriveFlatViewContentProps> = ({
  section,
  view,
}) => {
  if (view.files.length === 0) {
    return (
      <EmptyState
        icon={section === 'recent' ? Clock : Trash2}
        title={section === 'recent' ? 'Sin archivos recientes' : 'La papelera está vacía'}
        description={
          section === 'recent'
            ? 'Los archivos que subas o modifiques van a aparecer acá.'
            : 'Los archivos eliminados aparecen acá antes de borrarse definitivamente.'
        }
      />
    );
  }

  const ListComponent = view.viewMode === 'grid' ? FileGrid : FileList;

  return (
    <div className="space-y-4">
      <DriveToolbar
        canMutate={false}
        viewMode={view.viewMode}
        onViewModeChange={view.setViewMode}
        onNewFolder={() => {}}
        onUploadClick={() => {}}
      />
      <ListComponent
        folders={[]}
        files={view.files}
        onOpenFolder={() => {}}
        onOpenFile={view.setPreviewFile}
        onFolderContextMenu={() => {}}
        onFileContextMenu={view.openContextMenu}
        onDropItem={() => {}}
      />
    </div>
  );
};

export default DriveFlatViewContent;
