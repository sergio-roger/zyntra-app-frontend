import React from 'react';
import { AlertCircle, Code2, Loader2, X } from 'lucide-react';
import { CopyButton } from '@shared/components/CopyButton';
import { useEmbedSnippetQuery } from '../hooks/channels.queries';

interface EmbedSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
}

export const EmbedSnippetModal: React.FC<EmbedSnippetModalProps> = ({
  isOpen,
  onClose,
  channelId,
  channelName,
}) => {
  const { data, isLoading, isError } = useEmbedSnippetQuery(
    isOpen ? channelId : '',
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        data-testid="embed-snippet-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl transition-all animate-in zoom-in-95 duration-300"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-primary" />
            <h3 className="text-base font-bold text-white">
              Código de integración · {channelName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertCircle size={16} />
              No se pudo cargar el código de integración.
            </div>
          )}

          {data && (
            <div className="space-y-3">
              <div className="flex items-center justify-end">
                <CopyButton
                  text={data.snippet}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
                />
              </div>
              <pre className="text-xs font-mono bg-slate-950 border border-white/5 rounded-xl p-4 whitespace-pre-wrap break-all overflow-x-auto max-h-72 text-slate-300">
                {data.snippet}
              </pre>
              <p className="text-xs text-slate-500">
                Inserta este código antes del cierre de la etiqueta{' '}
                <code>&lt;/body&gt;</code> en tu sitio web.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
