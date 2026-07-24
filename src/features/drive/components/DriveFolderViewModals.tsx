import React from 'react';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { DriveContextMenu } from '@features/drive/components/DriveContextMenu';
import { FilePreviewModal } from '@features/drive/components/FilePreviewModal';
import { MoveItemModal } from '@features/drive/components/MoveItemModal';
import { NewFolderModal } from '@features/drive/components/NewFolderModal';
import { RenameItemModal } from '@features/drive/components/RenameItemModal';
import { DriveFolderView } from '@features/drive/hooks/use-drive-folder-view';
import { DriveScope } from '@features/drive/types/drive';

interface DriveFolderViewModalsProps {
  scope: DriveScope;
  canMutate: boolean;
  view: DriveFolderView;
}

export const DriveFolderViewModals: React.FC<DriveFolderViewModalsProps> = ({
  scope,
  canMutate,
  view,
}) => {
  const itemLabel = (item: typeof view.deleteItem) =>
    item?.kind === 'folder' ? item.data.name : (item?.data.originalName ?? '');

  return (
    <>
      <DriveContextMenu
        item={view.contextMenu?.item ?? null}
        position={view.contextMenu?.position ?? null}
        canMutate={canMutate}
        isTrashView={false}
        onClose={() => view.setContextMenu(null)}
        onRename={view.setRenameItem}
        onMove={view.setMoveItem}
        onDownload={view.handleDownload}
        onDelete={view.setDeleteItem}
        onRestore={() => {}}
        onPermanentDelete={() => {}}
      />

      <NewFolderModal
        isOpen={view.isNewFolderOpen}
        isSubmitting={view.createFolder.isPending}
        onClose={() => view.setIsNewFolderOpen(false)}
        onSubmit={(name) =>
          view.createFolder.mutate(
            { scope, name, parentId: view.children.data?.folderId },
            { onSuccess: () => view.setIsNewFolderOpen(false) },
          )
        }
      />

      <RenameItemModal
        isOpen={!!view.renameItem}
        isSubmitting={view.updateFolder.isPending || view.moveOrRenameFile.isPending}
        initialName={itemLabel(view.renameItem)}
        onClose={() => view.setRenameItem(null)}
        onSubmit={view.handleRenameSubmit}
      />

      <MoveItemModal
        isOpen={!!view.moveItem}
        isSubmitting={view.updateFolder.isPending || view.moveOrRenameFile.isPending}
        scope={scope}
        itemName={itemLabel(view.moveItem)}
        excludeFolderId={view.moveItem?.kind === 'folder' ? view.moveItem.data.id : undefined}
        onClose={() => view.setMoveItem(null)}
        onConfirm={view.handleMoveConfirm}
      />

      <ConfirmModal
        isOpen={!!view.deleteItem}
        onClose={() => view.setDeleteItem(null)}
        onConfirm={view.handleConfirmDelete}
        title={view.deleteItem?.kind === 'folder' ? 'Eliminar carpeta' : 'Eliminar archivo'}
        description={`¿Seguro que querés mover "${itemLabel(view.deleteItem)}" a la papelera?`}
        confirmText="Eliminar"
        variant="danger"
      />

      <FilePreviewModal
        file={view.previewFile}
        onClose={() => view.setPreviewFile(null)}
        onDownload={(file) => view.handleDownload({ kind: 'file', data: file })}
      />
    </>
  );
};

export default DriveFolderViewModals;
