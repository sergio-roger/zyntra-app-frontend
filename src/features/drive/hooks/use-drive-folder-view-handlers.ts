import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/store/authStore';
import { driveApi } from '@features/drive/api/drive.api';
import { DriveFolderViewMutations } from '@features/drive/hooks/use-drive-folder-view-mutations';
import { DriveFolderViewState } from '@features/drive/hooks/use-drive-folder-view-state';
import { DriveScope } from '@features/drive/types/drive';
import { DriveDragPayload, DriveListItem } from '@features/drive/types/drive-item';

export function useDriveFolderViewHandlers(
  scope: DriveScope,
  folderId: string | undefined,
  state: DriveFolderViewState,
  mutations: DriveFolderViewMutations,
) {
  const navigate = useNavigate();
  const businessId = useAuthStore((s) => s.user?.businessId);

  const goToFolder = (id: string | undefined) =>
    navigate(`/drive/${scope}${id ? `/${id}` : ''}`);

  const openContextMenu = (event: React.MouseEvent, item: DriveListItem) => {
    event.preventDefault();
    state.setContextMenu({ item, position: { x: event.clientX, y: event.clientY } });
  };

  const moveById = (kind: 'folder' | 'file', id: string, targetFolderId: string) => {
    if (kind === 'folder') {
      mutations.updateFolder.mutate({ folderId: id, payload: { parentId: targetFolderId } });
    } else {
      mutations.moveOrRenameFile.mutate({ fileId: id, payload: { folderId: targetFolderId } });
    }
  };

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach((file) =>
      mutations.uploadFile.mutate({ scope, folderId, file }),
    );
  };

  const handleDropItem = (payload: DriveDragPayload, targetFolderId: string) => {
    moveById(payload.kind, payload.id, targetFolderId);
  };

  const handleDownload = (item: DriveListItem) => {
    if (item.kind !== 'file' || !businessId) return;
    window.open(driveApi.getDownloadUrl(businessId, item.data.id), '_blank');
  };

  return { goToFolder, openContextMenu, moveById, handleUpload, handleDropItem, handleDownload };
}
