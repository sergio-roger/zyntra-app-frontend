import { useState } from 'react';
import { DriveContextMenuPosition } from '@features/drive/components/DriveContextMenu';
import { DriveFile } from '@features/drive/types/drive';
import { DriveListItem } from '@features/drive/types/drive-item';

export function useDriveFolderViewState() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<DriveListItem | null>(null);
  const [moveItem, setMoveItem] = useState<DriveListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DriveListItem | null>(null);
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    item: DriveListItem;
    position: DriveContextMenuPosition;
  } | null>(null);

  return {
    viewMode,
    setViewMode,
    isNewFolderOpen,
    setIsNewFolderOpen,
    renameItem,
    setRenameItem,
    moveItem,
    setMoveItem,
    deleteItem,
    setDeleteItem,
    previewFile,
    setPreviewFile,
    contextMenu,
    setContextMenu,
  };
}

export type DriveFolderViewState = ReturnType<typeof useDriveFolderViewState>;
