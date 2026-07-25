import { FileText } from 'lucide-react';
import React from 'react';
import { FileMockItem } from '@features/marketing/types/chat-mock';

interface FilesTabContentProps {
  files: FileMockItem[];
}

export const FilesTabContent: React.FC<FilesTabContentProps> = ({ files }) => (
  <div className="p-4 flex flex-col gap-2">
    {files.map((file) => (
      <div
        key={file.name}
        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-base-200 border border-base-300"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-secondary shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-base-content/40">{file.ownerDisplayName}</p>
          </div>
        </div>
        <span className="text-xs text-base-content/50 whitespace-nowrap">{file.sizeLabel}</span>
      </div>
    ))}
  </div>
);
