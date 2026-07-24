import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useDriveChildren } from '@features/drive/hooks/use-drive-folders';
import { DriveScope } from '@features/drive/types/drive';

interface FolderTreeNodeProps {
  scope: DriveScope;
  folderId: string;
  name: string;
  depth: number;
  selectedFolderId: string | null;
  disabledFolderId?: string;
  onSelect: (folderId: string) => void;
}

export const FolderTreeNode: React.FC<FolderTreeNodeProps> = ({
  scope,
  folderId,
  name,
  depth,
  selectedFolderId,
  disabledFolderId,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data } = useDriveChildren(scope, isExpanded ? folderId : undefined);
  const subfolders = isExpanded ? (data?.folders ?? []) : [];
  const isDisabled = folderId === disabledFolderId;

  return (
    <div>
      <div
        style={{ paddingLeft: depth * 16 }}
        className={`flex items-center gap-1.5 rounded-lg py-1.5 pr-2 text-sm transition-colors ${
          selectedFolderId === folderId
            ? 'bg-primary/10 text-primary'
            : isDisabled
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-300 hover:bg-white/5'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="shrink-0 text-slate-500"
          aria-label={isExpanded ? 'Contraer' : 'Expandir'}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => !isDisabled && onSelect(folderId)}
          className="flex flex-1 items-center gap-1.5 truncate text-left disabled:cursor-not-allowed"
        >
          <Folder size={14} className="shrink-0" />
          <span className="truncate">{name}</span>
        </button>
      </div>
      {isExpanded &&
        subfolders.map((folder) => (
          <FolderTreeNode
            key={folder.id}
            scope={scope}
            folderId={folder.id}
            name={folder.name}
            depth={depth + 1}
            selectedFolderId={selectedFolderId}
            disabledFolderId={disabledFolderId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
};

export default FolderTreeNode;
