import React from 'react';
import { FileTypeIcon } from '@features/drive/components/FileTypeIcon';
import { DriveFile } from '@features/drive/types/drive';
import { DRIVE_DND_MIME_TYPE, DriveDragPayload } from '@features/drive/types/drive-item';
import { formatBytes } from '@features/drive/utils/format';

interface FileCardProps {
  file: DriveFile;
  onOpen: (file: DriveFile) => void;
  onContextMenu: (event: React.MouseEvent, file: DriveFile) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onOpen, onContextMenu }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(event) => {
        const payload: DriveDragPayload = { kind: 'file', id: file.id };
        event.dataTransfer.setData(DRIVE_DND_MIME_TYPE, JSON.stringify(payload));
      }}
      onDoubleClick={() => onOpen(file)}
      onKeyDown={(event) => event.key === 'Enter' && onOpen(file)}
      onContextMenu={(event) => onContextMenu(event, file)}
      className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/50 p-3 transition-colors hover:bg-white/[0.04]"
    >
      <FileTypeIcon mimeType={file.mimeType} size={28} className="text-slate-400" />
      <span
        className="truncate text-sm font-semibold text-slate-100"
        title={file.originalName}
      >
        {file.originalName}
      </span>
      <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
    </div>
  );
};

export default FileCard;
