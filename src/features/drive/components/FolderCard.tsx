import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { DriveFolder } from '@features/drive/types/drive';
import { DRIVE_DND_MIME_TYPE, DriveDragPayload } from '@features/drive/types/drive-item';

interface FolderCardProps {
  folder: DriveFolder;
  onOpen: (folderId: string) => void;
  onContextMenu: (event: React.MouseEvent, folder: DriveFolder) => void;
  onDropItem: (payload: DriveDragPayload, targetFolderId: string) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onOpen,
  onContextMenu,
  onDropItem,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const raw = event.dataTransfer.getData(DRIVE_DND_MIME_TYPE);
    if (!raw) return;
    const payload = JSON.parse(raw) as DriveDragPayload;
    if (payload.kind === 'folder' && payload.id === folder.id) return;
    onDropItem(payload, folder.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
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
      onDrop={handleDrop}
      onDoubleClick={() => onOpen(folder.id)}
      onKeyDown={(event) => event.key === 'Enter' && onOpen(folder.id)}
      onContextMenu={(event) => onContextMenu(event, folder)}
      className={`group flex cursor-pointer flex-col gap-2 rounded-xl border p-3 transition-colors ${
        isDragOver
          ? 'border-primary bg-primary/10'
          : 'border-white/10 bg-slate-900/50 hover:bg-white/[0.04]'
      }`}
    >
      <Folder size={28} className="text-primary" />
      <span className="truncate text-sm font-semibold text-slate-100" title={folder.name}>
        {folder.name}
      </span>
    </div>
  );
};

export default FolderCard;
