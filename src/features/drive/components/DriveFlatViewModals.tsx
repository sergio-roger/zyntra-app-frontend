import React from 'react';
import { DriveContextMenu } from '@features/drive/components/DriveContextMenu';
import { FilePreviewModal } from '@features/drive/components/FilePreviewModal';
import { MoveItemModal } from '@features/drive/components/MoveItemModal';
import { RenameItemModal } from '@features/drive/components/RenameItemModal';
import { DriveFlatView } from '@features/drive/hooks/use-drive-flat-view';

interface DriveFlatViewModalsProps {
  section: 'recent' | 'trash';
  view: DriveFlatView;
}

export const DriveFlatViewModals: React.FC<DriveFlatViewModalsProps> = ({
  section,
  view,
}) => {
  const moveItemScope = view.moveItem?.data.ownerType === 'business' ? 'company' : 'me';
  const fileName = (item: typeof view.moveItem) =>
    item?.kind === 'file' ? item.data.originalName : '';

  return (
    <>
      <DriveContextMenu
        item={view.contextMenu?.item ?? null}
        position={view.contextMenu?.position ?? null}
        canMutate={view.canMutate}
        isTrashView={section === 'trash'}
        onClose={() => view.setContextMenu(null)}
        onRename={view.setRenameItem}
        onMove={view.setMoveItem}
        onDownload={view.handleDownload}
        onDelete={view.handleDelete}
        onRestore={view.handleRestore}
        onPermanentDelete={view.handlePermanentDelete}
      />

      <RenameItemModal
        isOpen={!!view.renameItem}
        isSubmitting={view.isMutating}
        initialName={fileName(view.renameItem)}
        onClose={() => view.setRenameItem(null)}
        onSubmit={view.handleRenameSubmit}
      />

      <MoveItemModal
        isOpen={!!view.moveItem}
        isSubmitting={view.isMutating}
        scope={moveItemScope}
        itemName={fileName(view.moveItem)}
        onClose={() => view.setMoveItem(null)}
        onConfirm={view.handleMoveConfirm}
      />

      <FilePreviewModal
        file={view.previewFile}
        onClose={() => view.setPreviewFile(null)}
        onDownload={(file) => view.handleDownload({ kind: 'file', data: file })}
      />
    </>
  );
};

export default DriveFlatViewModals;
