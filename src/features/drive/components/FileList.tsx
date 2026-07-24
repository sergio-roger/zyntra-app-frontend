import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { FileTypeIcon } from '@features/drive/components/FileTypeIcon';
import { DriveFile, DriveFolder } from '@features/drive/types/drive';
import { DRIVE_DND_MIME_TYPE, DriveDragPayload } from '@features/drive/types/drive-item';
import { formatBytes, formatDate } from '@features/drive/utils/format';

interface FileListProps {
  folders: DriveFolder[];
  files: DriveFile[];
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: DriveFile) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: DriveFolder) => void;
  onFileContextMenu: (event: React.MouseEvent, file: DriveFile) => void;
  onDropItem: (payload: DriveDragPayload, targetFolderId: string) => void;
}

const FolderRow: React.FC<{
  folder: DriveFolder;
  onOpen: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, folder: DriveFolder) => void;
  onDropItem: (payload: DriveDragPayload, targetFolderId: string) => void;
}> = ({ folder, onOpen, onContextMenu, onDropItem }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <tr
      draggable
      onDragStart={(event) => {
        const payload: DriveDragPayload = { kind: 'folder', id: folder.id };
        event.dataTransfer.setData(DRIVE_DND_MIME_TYPE, JSON.stringify(payload));
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        const raw = event.dataTransfer.getData(DRIVE_DND_MIME_TYPE);
        if (!raw) return;
        const payload = JSON.parse(raw) as DriveDragPayload;
        if (payload.kind === 'folder' && payload.id === folder.id) return;
        onDropItem(payload, folder.id);
      }}
      onDoubleClick={() => onOpen(folder.id)}
      onContextMenu={(event) => onContextMenu(event, folder)}
      className={`cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
        isDragOver ? 'bg-primary/10' : 'hover:bg-white/[0.02]'
      }`}
    >
      <td className="flex items-center gap-2 px-4 py-2.5 font-semibold text-slate-100">
        <Folder size={16} className="text-primary" />
        {folder.name}
      </td>
      <td className="px-4 py-2.5 text-slate-500">—</td>
      <td className="px-4 py-2.5 text-slate-400">{formatDate(folder.updatedAt)}</td>
    </tr>
  );
};

const FileRow: React.FC<{
  file: DriveFile;
  onOpen: (file: DriveFile) => void;
  onContextMenu: (event: React.MouseEvent, file: DriveFile) => void;
}> = ({ file, onOpen, onContextMenu }) => {
  return (
    <tr
      draggable
      onDragStart={(event) => {
        const payload: DriveDragPayload = { kind: 'file', id: file.id };
        event.dataTransfer.setData(DRIVE_DND_MIME_TYPE, JSON.stringify(payload));
      }}
      onDoubleClick={() => onOpen(file)}
      onContextMenu={(event) => onContextMenu(event, file)}
      className="cursor-pointer border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]"
    >
      <td className="flex items-center gap-2 px-4 py-2.5 font-semibold text-slate-100">
        <FileTypeIcon mimeType={file.mimeType} size={16} className="text-slate-400" />
        {file.originalName}
      </td>
      <td className="px-4 py-2.5 text-slate-400">{formatBytes(file.size)}</td>
      <td className="px-4 py-2.5 text-slate-400">{formatDate(file.updatedAt)}</td>
    </tr>
  );
};

export const FileList: React.FC<FileListProps> = ({
  folders,
  files,
  onOpenFolder,
  onOpenFile,
  onFolderContextMenu,
  onFileContextMenu,
  onDropItem,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-white/10 bg-slate-900/80 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Tamaño</th>
            <th className="px-4 py-3 font-semibold">Modificado</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              onOpen={onOpenFolder}
              onContextMenu={onFolderContextMenu}
              onDropItem={onDropItem}
            />
          ))}
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onOpen={onOpenFile}
              onContextMenu={onFileContextMenu}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
