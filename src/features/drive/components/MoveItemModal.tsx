import React, { useState } from 'react';
import { FolderTree, X } from 'lucide-react';
import { Button } from '@core/ui/Button';
import { useDriveChildren } from '@features/drive/hooks/use-drive-folders';
import { DriveScope } from '@features/drive/types/drive';
import { FolderTreeNode } from '@features/drive/components/FolderTreeNode';

interface MoveItemModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  scope: DriveScope;
  itemName: string;
  excludeFolderId?: string;
  onClose: () => void;
  onConfirm: (targetFolderId: string) => void;
}

export const MoveItemModal: React.FC<MoveItemModalProps> = ({
  isOpen,
  isSubmitting,
  scope,
  itemName,
  excludeFolderId,
  onClose,
  onConfirm,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { data: rootChildren } = useDriveChildren(scope, undefined);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[70vh] w-full max-w-md flex-col rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderTree size={18} />
            </span>
            <h3 className="text-lg font-bold text-white">Mover &quot;{itemName}&quot;</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/50 p-2">
          {rootChildren && (
            <>
              <button
                type="button"
                onClick={() => setSelectedFolderId(rootChildren.folderId)}
                className={`mb-1 flex w-full items-center gap-1.5 rounded-lg py-1.5 px-2 text-left text-sm font-semibold transition-colors ${
                  selectedFolderId === rootChildren.folderId
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Raíz
              </button>
              {rootChildren.folders.map((folder) => (
                <FolderTreeNode
                  key={folder.id}
                  scope={scope}
                  folderId={folder.id}
                  name={folder.name}
                  depth={1}
                  selectedFolderId={selectedFolderId}
                  disabledFolderId={excludeFolderId}
                  onSelect={setSelectedFolderId}
                />
              ))}
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" outline onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            loading={isSubmitting}
            disabled={!selectedFolderId}
            onClick={() => selectedFolderId && onConfirm(selectedFolderId)}
          >
            Mover aquí
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoveItemModal;
