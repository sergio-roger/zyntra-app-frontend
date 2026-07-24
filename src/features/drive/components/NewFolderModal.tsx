import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';

interface NewFolderModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderPlus size={18} />
            </span>
            <h3 className="text-lg font-bold text-white">Nueva carpeta</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <Input
          autoFocus
          label="Nombre"
          placeholder="Ej. Facturas 2026"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" outline onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!name.trim()}>
            Crear carpeta
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewFolderModal;
