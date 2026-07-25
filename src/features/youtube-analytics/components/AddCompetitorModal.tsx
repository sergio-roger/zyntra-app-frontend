import { useCreateCompetitor } from '@features/youtube-analytics/hooks/useCompetitors';
import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { AtSign, X } from 'lucide-react';
import React, { useState } from 'react';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [handle, setHandle] = useState('');
  const createCompetitor = useCreateCompetitor();

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!handle.trim()) return;

    createCompetitor.mutate(
      { channelHandleOrUrl: handle.trim() },
      {
        onSuccess: () => {
          setHandle('');
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-base-200 border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-base-content leading-6">
                  Agregar canal de competencia
                </h3>
                <p className="mt-2 text-sm text-base-content/60 leading-relaxed">
                  Usá el @handle o la URL completa del canal de YouTube.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-300/50 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4">
              <Input
                icon={AtSign}
                placeholder="@competidor o https://youtube.com/@competidor"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="bg-base-300/20 px-6 py-4 flex flex-row-reverse gap-3 border-t border-base-300">
            <Button
              type="submit"
              loading={createCompetitor.isPending}
              disabled={!handle.trim()}
            >
              Agregar
            </Button>
            <Button type="button" variant="secondary" outline onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
