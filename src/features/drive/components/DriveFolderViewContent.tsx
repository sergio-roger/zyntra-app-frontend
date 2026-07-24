import React, { useRef } from 'react';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from '@shared/components/EmptyState';
import { Breadcrumbs } from '@features/drive/components/Breadcrumbs';
import { DriveToolbar } from '@features/drive/components/DriveToolbar';
import { FileGrid } from '@features/drive/components/FileGrid';
import { FileList } from '@features/drive/components/FileList';
import { UploadDropzone, UploadDropzoneHandle } from '@features/drive/components/UploadDropzone';
import { DriveFolderView } from '@features/drive/hooks/use-drive-folder-view';
import { DriveScope } from '@features/drive/types/drive';

interface DriveFolderViewContentProps {
  scope: DriveScope;
  folderId?: string;
  canMutate: boolean;
  view: DriveFolderView;
}

export const DriveFolderViewContent: React.FC<DriveFolderViewContentProps> = ({
  folderId,
  canMutate,
  view,
}) => {
  const dropzoneRef = useRef<UploadDropzoneHandle>(null);
  const folders = view.children.data?.folders ?? [];
  const files = view.children.data?.files ?? [];
  const isEmpty = folders.length === 0 && files.length === 0;
  const ListComponent = view.viewMode === 'grid' ? FileGrid : FileList;

  return (
    <div className="space-y-4">
      <Breadcrumbs folderId={folderId} onNavigate={view.goToFolder} />
      <DriveToolbar
        canMutate={canMutate}
        viewMode={view.viewMode}
        onViewModeChange={view.setViewMode}
        onNewFolder={() => view.setIsNewFolderOpen(true)}
        onUploadClick={() => dropzoneRef.current?.openFilePicker()}
      />

      <UploadDropzone
        ref={dropzoneRef}
        onFilesSelected={view.handleUpload}
        progress={view.uploadFile.progress}
      >
        {isEmpty ? (
          <EmptyState
            icon={FolderOpen}
            title="Esta carpeta está vacía"
            description="Subí un archivo o creá una carpeta para empezar."
          />
        ) : (
          <ListComponent
            folders={folders}
            files={files}
            onOpenFolder={view.goToFolder}
            onOpenFile={view.setPreviewFile}
            onFolderContextMenu={(event, folder) => view.openContextMenu(event, { kind: 'folder', data: folder })}
            onFileContextMenu={(event, file) => view.openContextMenu(event, { kind: 'file', data: file })}
            onDropItem={view.handleDropItem}
          />
        )}
      </UploadDropzone>
    </div>
  );
};

export default DriveFolderViewContent;
