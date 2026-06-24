import React, { useState, useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { ConditionBuilder } from '@crm/components/ConditionBuilder';
import { SegmentPreviewPanel } from '@crm/components/SegmentPreviewPanel';
import { Segment, SegmentCondition } from '@crm/types/crm';

interface SegmentEditorProps {
  segment: Segment | null;
  isPending: boolean;
  onSave: (data: { name: string; description: string; conditions: SegmentCondition[] }) => void;
  onCancel: () => void;
}

export const SegmentEditor: React.FC<SegmentEditorProps> = ({
  segment,
  isPending,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(segment?.name ?? '');
  const [description, setDescription] = useState(segment?.description ?? '');
  const [conditions, setConditions] = useState<SegmentCondition[]>(segment?.conditions ?? []);

  useEffect(() => {
    setName(segment?.name ?? '');
    setDescription(segment?.description ?? '');
    setConditions(segment?.conditions ?? []);
  }, [segment?.id]);

  const isCreating = segment === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), conditions });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-700/40 gap-4">
        <div>
          <h3 className="text-base font-black text-white leading-tight">
            {isCreating ? 'Nuevo Segmento Inteligente' : `Editando: ${segment.name}`}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Define reglas para filtrar contactos automáticamente en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700/60 bg-slate-800/80 text-slate-300 text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
          >
            <X size={13} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Guardar
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col xl:flex-row xl:items-stretch gap-6 h-full">
          {/* Fields + conditions */}
          <div className="flex-1 min-w-0 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nombre del segmento <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Clientes de WhatsApp"
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 placeholder-slate-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Descripción{' '}
                  <span className="text-slate-600 normal-case font-normal tracking-normal">
                    (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el propósito del segmento…"
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-950/20 p-4">
              <ConditionBuilder conditions={conditions} onChange={setConditions} />
            </div>
          </div>

          {/* Preview */}
          <div className="w-full xl:w-[300px] shrink-0 xl:h-full">
            <SegmentPreviewPanel conditions={conditions} enabled />
          </div>
        </div>
      </div>
    </form>
  );
};
