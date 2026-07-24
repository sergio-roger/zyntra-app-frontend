import { DriveFolderViewMutations } from '@features/drive/hooks/use-drive-folder-view-mutations';
import { DriveFolderViewState } from '@features/drive/hooks/use-drive-folder-view-state';

export function useDriveFolderViewCrud(
  state: DriveFolderViewState,
  mutations: DriveFolderViewMutations,
  moveById: (kind: 'folder' | 'file', id: string, targetFolderId: string) => void,
) {
  const handleRenameSubmit = (name: string) => {
    const item = state.renameItem;
    if (!item) return;
    if (item.kind === 'folder') {
      mutations.updateFolder.mutate({ folderId: item.data.id, payload: { name } });
    } else {
      mutations.moveOrRenameFile.mutate({ fileId: item.data.id, payload: { originalName: name } });
    }
    state.setRenameItem(null);
  };

  const handleMoveConfirm = (targetFolderId: string) => {
    const item = state.moveItem;
    if (!item) return;
    moveById(item.kind, item.data.id, targetFolderId);
    state.setMoveItem(null);
  };

  const handleConfirmDelete = () => {
    const item = state.deleteItem;
    if (!item) return;
    if (item.kind === 'folder') mutations.deleteFolder.mutate(item.data.id);
    else mutations.deleteFile.mutate(item.data.id);
    state.setDeleteItem(null);
  };

  return { handleRenameSubmit, handleMoveConfirm, handleConfirmDelete };
}
