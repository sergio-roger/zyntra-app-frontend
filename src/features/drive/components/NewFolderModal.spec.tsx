import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewFolderModal } from '@features/drive/components/NewFolderModal';

describe('NewFolderModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <NewFolderModal isOpen={false} isSubmitting={false} onClose={vi.fn()} onSubmit={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not submit an empty name', () => {
    const onSubmit = vi.fn();
    render(
      <NewFolderModal isOpen={true} isSubmitting={false} onClose={vi.fn()} onSubmit={onSubmit} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /crear carpeta/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed folder name', () => {
    const onSubmit = vi.fn();
    render(
      <NewFolderModal isOpen={true} isSubmitting={false} onClose={vi.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: '  Facturas 2026  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /crear carpeta/i }));

    expect(onSubmit).toHaveBeenCalledWith('Facturas 2026');
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(
      <NewFolderModal isOpen={true} isSubmitting={false} onClose={onClose} onSubmit={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
