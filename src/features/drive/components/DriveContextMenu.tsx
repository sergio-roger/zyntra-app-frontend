import React, { useEffect, useRef } from 'react';
import { Download, FolderInput, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { DriveListItem } from '@features/drive/types/drive-item';

export interface DriveContextMenuPosition {
  x: number;
  y: number;
}

interface DriveContextMenuProps {
  item: DriveListItem | null;
  position: DriveContextMenuPosition | null;
  canMutate: boolean;
  isTrashView: boolean;
  onClose: () => void;
  onRename: (item: DriveListItem) => void;
  onMove: (item: DriveListItem) => void;
  onDownload: (item: DriveListItem) => void;
  onDelete: (item: DriveListItem) => void;
  onRestore: (item: DriveListItem) => void;
  onPermanentDelete: (item: DriveListItem) => void;
}

const MenuButton: React.FC<{
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold transition-colors ${
      danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-200 hover:bg-white/5'
    }`}
  >
    <Icon size={15} />
    {label}
  </button>
);

export const DriveContextMenu: React.FC<DriveContextMenuProps> = ({
  item,
  position,
  canMutate,
  isTrashView,
  onClose,
  onRename,
  onMove,
  onDownload,
  onDelete,
  onRestore,
  onPermanentDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [position, onClose]);

  if (!item || !position) return null;

  const wrap = (action: (item: DriveListItem) => void) => () => {
    action(item);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[110] w-52 overflow-hidden rounded-xl border border-white/10 bg-slate-900 py-1.5 shadow-2xl"
    >
      {isTrashView ? (
        <>
          <MenuButton icon={RotateCcw} label="Restaurar" onClick={wrap(onRestore)} />
          {canMutate && (
            <MenuButton
              icon={Trash2}
              label="Eliminar definitivamente"
              danger
              onClick={wrap(onPermanentDelete)}
            />
          )}
        </>
      ) : (
        <>
          {item.kind === 'file' && (
            <MenuButton icon={Download} label="Descargar" onClick={wrap(onDownload)} />
          )}
          {canMutate && (
            <>
              <MenuButton icon={Pencil} label="Renombrar" onClick={wrap(onRename)} />
              <MenuButton icon={FolderInput} label="Mover" onClick={wrap(onMove)} />
              <MenuButton icon={Trash2} label="Eliminar" danger onClick={wrap(onDelete)} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DriveContextMenu;
