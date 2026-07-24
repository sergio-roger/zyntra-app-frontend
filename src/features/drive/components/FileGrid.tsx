import React from 'react';
import { DriveFile, DriveFolder } from '@features/drive/types/drive';
import { DriveDragPayload } from '@features/drive/types/drive-item';
import { FileCard } from '@features/drive/components/FileCard';
import { FolderCard } from '@features/drive/components/FolderCard';

interface FileGridProps {
  folders: DriveFolder[];
  files: DriveFile[];
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: DriveFile) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: DriveFolder) => void;
  onFileContextMenu: (event: React.MouseEvent, file: DriveFile) => void;
  onDropItem: (payload: DriveDragPayload, targetFolderId: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
  folders,
  files,
  onOpenFolder,
  onOpenFile,
  onFolderContextMenu,
  onFileContextMenu,
  onDropItem,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onOpen={onOpenFolder}
          onContextMenu={onFolderContextMenu}
          onDropItem={onDropItem}
        />
      ))}
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onOpen={onOpenFile}
          onContextMenu={onFileContextMenu}
        />
      ))}
    </div>
  );
};

export default FileGrid;
