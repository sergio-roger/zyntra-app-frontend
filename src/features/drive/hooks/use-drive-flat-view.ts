import { useState } from 'react';
import { useAuthStore } from '@features/auth/store/authStore';
import { driveApi } from '@features/drive/api/drive.api';
import {
  useDeleteDriveFile,
  useDriveRecentFiles,
  useDriveTrashFiles,
  useMoveOrRenameDriveFile,
  usePermanentlyDeleteDriveFile,
  useRestoreDriveFile,
} from '@features/drive/hooks/use-drive-files';
import { canMutateCompanyScope } from '@features/drive/utils/permissions';
import { DriveFile } from '@features/drive/types/drive';
import { DriveListItem } from '@features/drive/types/drive-item';
import { DriveContextMenuPosition } from '@features/drive/components/DriveContextMenu';

function useDriveFlatViewState() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [renameItem, setRenameItem] = useState<DriveListItem | null>(null);
  const [moveItem, setMoveItem] = useState<DriveListItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    item: DriveListItem;
    position: DriveContextMenuPosition;
  } | null>(null);

  return {
    viewMode,
    setViewMode,
    previewFile,
    setPreviewFile,
    renameItem,
    setRenameItem,
    moveItem,
    setMoveItem,
    contextMenu,
    setContextMenu,
  };
}

type DriveFlatViewState = ReturnType<typeof useDriveFlatViewState>;

function useDriveFlatViewHandlers(state: DriveFlatViewState) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const moveOrRenameFile = useMoveOrRenameDriveFile();
  const deleteFile = useDeleteDriveFile();
  const restoreFile = useRestoreDriveFile();
  const permanentlyDeleteFile = usePermanentlyDeleteDriveFile();

  const openContextMenu = (event: React.MouseEvent, file: DriveFile) => {
    event.preventDefault();
    state.setContextMenu({
      item: { kind: 'file', data: file },
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleDownload = (item: DriveListItem) => {
    if (item.kind !== 'file' || !businessId) return;
    window.open(driveApi.getDownloadUrl(businessId, item.data.id), '_blank');
  };

  const handleRenameSubmit = (name: string) => {
    if (!state.renameItem) return;
    moveOrRenameFile.mutate({ fileId: state.renameItem.data.id, payload: { originalName: name } });
    state.setRenameItem(null);
  };

  const handleMoveConfirm = (targetFolderId: string) => {
    if (!state.moveItem) return;
    moveOrRenameFile.mutate({ fileId: state.moveItem.data.id, payload: { folderId: targetFolderId } });
    state.setMoveItem(null);
  };

  return {
    moveOrRenameFile,
    openContextMenu,
    handleDownload,
    handleRenameSubmit,
    handleMoveConfirm,
    handleDelete: (item: DriveListItem) => deleteFile.mutate(item.data.id),
    handleRestore: (item: DriveListItem) => restoreFile.mutate(item.data.id),
    handlePermanentDelete: (item: DriveListItem) => permanentlyDeleteFile.mutate(item.data.id),
  };
}

export function useDriveFlatView(section: 'recent' | 'trash') {
  const role = useAuthStore((s) => s.user?.role);
  const canMutate = canMutateCompanyScope(role);

  const recent = useDriveRecentFiles();
  const trash = useDriveTrashFiles();
  const { data, isLoading } = section === 'recent' ? recent : trash;

  const state = useDriveFlatViewState();
  const handlers = useDriveFlatViewHandlers(state);

  return {
    canMutate,
    files: data ?? [],
    isLoading,
    isMutating: handlers.moveOrRenameFile.isPending,
    ...state,
    ...handlers,
  };
}

export type DriveFlatView = ReturnType<typeof useDriveFlatView>;
