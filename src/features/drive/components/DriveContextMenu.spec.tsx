import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DriveContextMenu } from '@features/drive/components/DriveContextMenu';
import { DriveListItem } from '@features/drive/types/drive-item';

const folderItem: DriveListItem = {
  kind: 'folder',
  data: { id: 'folder-1', name: 'Contratos' } as never,
};

const fileItem: DriveListItem = {
  kind: 'file',
  data: { id: 'file-1', originalName: 'test.png' } as never,
};

const baseProps = {
  position: { x: 10, y: 10 },
  canMutate: true,
  isTrashView: false,
  onClose: vi.fn(),
  onRename: vi.fn(),
  onMove: vi.fn(),
  onDownload: vi.fn(),
  onDelete: vi.fn(),
  onRestore: vi.fn(),
  onPermanentDelete: vi.fn(),
};

describe('DriveContextMenu', () => {
  it('renders nothing without an item or position', () => {
    const { container } = render(<DriveContextMenu {...baseProps} item={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows rename/move/delete for a mutable folder and no download option', () => {
    render(<DriveContextMenu {...baseProps} item={folderItem} />);
    expect(screen.getByText('Renombrar')).toBeInTheDocument();
    expect(screen.getByText('Mover')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.queryByText('Descargar')).not.toBeInTheDocument();
  });

  it('shows download for files', () => {
    render(<DriveContextMenu {...baseProps} item={fileItem} />);
    expect(screen.getByText('Descargar')).toBeInTheDocument();
  });

  it('hides mutating actions when canMutate is false', () => {
    render(<DriveContextMenu {...baseProps} item={folderItem} canMutate={false} />);
    expect(screen.queryByText('Renombrar')).not.toBeInTheDocument();
    expect(screen.queryByText('Mover')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });

  it('shows restore and permanent delete in trash view', () => {
    render(<DriveContextMenu {...baseProps} item={fileItem} isTrashView />);
    expect(screen.getByText('Restaurar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar definitivamente')).toBeInTheDocument();
    expect(screen.queryByText('Renombrar')).not.toBeInTheDocument();
  });

  it('calls the action handler and closes the menu', () => {
    const onRename = vi.fn();
    const onClose = vi.fn();
    render(<DriveContextMenu {...baseProps} item={folderItem} onRename={onRename} onClose={onClose} />);

    fireEvent.click(screen.getByText('Renombrar'));

    expect(onRename).toHaveBeenCalledWith(folderItem);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
