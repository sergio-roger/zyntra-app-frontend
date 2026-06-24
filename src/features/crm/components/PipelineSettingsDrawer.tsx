import React, { useEffect, useState } from 'react';
import {
  X, Settings2, Plus, Trash2, Loader2, GripVertical, Check,
} from 'lucide-react';
import { useCreateStage, useUpdateStage, useDeleteStage, useReorderStages } from '@crm/hooks/useDeals';
import { DealPipeline } from '@crm/types/crm';
import { EditableStage, StageType } from '@crm/types/pipeline-settings';
import { PIPELINE_STAGE_COLORS, STAGE_TYPE_LABELS } from '@crm/constants/pipeline-settings';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { toastManager } from '@shared/components/toast/toastManager';

interface PipelineSettingsDrawerProps {
  open: boolean;
  pipeline: DealPipeline | null;
  onClose: () => void;
}

export const PipelineSettingsDrawer: React.FC<PipelineSettingsDrawerProps> = ({
  open,
  pipeline,
  onClose,
}) => {
  const [stages, setStages] = useState<EditableStage[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingStage, setDeletingStage] = useState<EditableStage | null>(null);

  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const reorderStages = useReorderStages();

  useEffect(() => {
    if (pipeline) {
      setStages([...pipeline.stages].sort((a, b) => a.position - b.position));
    }
  }, [pipeline]);

  if (!pipeline) return null;

  const handleFieldChange = (id: string, field: keyof EditableStage, value: any) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value, _dirty: true } : s)),
    );
  };

  const handleSaveStage = async (stage: EditableStage) => {
    setSavingId(stage.id);
    try {
      await updateStage.mutateAsync({
        stageId: stage.id,
        input: {
          name: stage.name,
          color: stage.color,
          probability_percent: stage.probability_percent,
          type: stage.type as StageType,
        },
      });
      setStages((prev) => prev.map((s) => (s.id === stage.id ? { ...s, _dirty: false } : s)));
    } finally {
      setSavingId(null);
    }
  };


  const handleDeleteStage = async (stage: EditableStage) => {
    setDeletingStage(stage);
  };

  const confirmDeleteStage = async () => {
    if (!deletingStage) return;
    const stageName = deletingStage.name;
    const stageId = deletingStage.id;
    setDeletingId(stageId);
    setDeletingStage(null);
    try {
      await deleteStage.mutateAsync(stageId);
      setStages((prev) => prev.filter((s) => s.id !== stageId));
      toastManager.add({
        title: 'Etapa eliminada',
        description: `La etapa "${stageName}" fue eliminada correctamente.`,
        type: 'success',
      });
    } catch (err: any) {
      toastManager.add({
        title: 'Error al eliminar',
        description: err?.response?.data?.message ?? 'No se pudo eliminar la etapa.',
        type: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddStage = async () => {
    const nextColor = PIPELINE_STAGE_COLORS[stages.length % PIPELINE_STAGE_COLORS.length];
    try {
      const res = await createStage.mutateAsync({
        pipelineId: pipeline.id,
        input: {
          name: 'Nueva etapa',
          color: nextColor,
          position: stages.length,
          type: 'active',
          probability_percent: 30,
        },
      });
      setStages((prev) => [...prev, res]);
    } catch {
      /* handled by react-query */
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-lg bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Settings2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{pipeline.name}</h3>
                <p className="text-xs text-slate-400">Configurar etapas del pipeline</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Etapas ({stages.length})
              </p>
              <button
                onClick={handleAddStage}
                disabled={createStage.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold hover:bg-indigo-600/30 transition-colors disabled:opacity-50"
              >
                {createStage.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Agregar etapa
              </button>
            </div>

            {stages.map((stage) => (
              <div
                key={stage.id}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-4 space-y-3"
              >
                {/* Color bar */}
                <div className="h-0.5 w-full rounded-full -mt-1 mb-2" style={{ backgroundColor: stage.color }} />

                {/* Name row */}
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-600 shrink-0" />
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => handleFieldChange(stage.id, 'name', e.target.value)}
                    className="flex-1 bg-slate-900/60 border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>

                {/* Color + type + probability */}
                <div className="flex items-center gap-3 pl-5">
                  {/* Color picker */}
                  <div className="flex gap-1.5 flex-wrap">
                    {PIPELINE_STAGE_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleFieldChange(stage.id, 'color', c)}
                        className="h-5 w-5 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: c,
                          borderColor: stage.color === c ? 'white' : 'transparent',
                        }}
                      />
                    ))}
                  </div>

                  {/* Type */}
                  <select
                    value={stage.type}
                    onChange={(e) => handleFieldChange(stage.id, 'type', e.target.value)}
                    className="bg-slate-900/60 border border-white/8 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    {(Object.keys(STAGE_TYPE_LABELS) as StageType[]).map((t) => (
                      <option key={t} value={t}>{STAGE_TYPE_LABELS[t]}</option>
                    ))}
                  </select>

                  {/* Probability */}
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={stage.probability_percent}
                      onChange={(e) => handleFieldChange(stage.id, 'probability_percent', Number(e.target.value))}
                      className="w-14 bg-slate-900/60 border border-white/8 rounded-lg px-2 py-1 text-xs text-white focus:outline-none text-center"
                    />
                    <span>%</span>
                  </div>
                </div>

                {/* Actions */}
                {stage._dirty && (
                  <div className="flex justify-end gap-2 pl-5">
                    <button
                      onClick={() => handleSaveStage(stage)}
                      disabled={savingId === stage.id}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                      {savingId === stage.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                      Guardar
                    </button>
                  </div>
                )}

                {!stage._dirty && (
                  <div className="flex justify-end pl-5">
                    <button
                      onClick={() => handleDeleteStage(stage)}
                      disabled={deletingId === stage.id}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      {deletingId === stage.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}

            {stages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-50">
                <Settings2 size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-400 font-medium">Sin etapas</p>
                <p className="text-xs text-slate-500 mt-1">Agrega una etapa para comenzar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deletingStage !== null}
        onClose={() => setDeletingStage(null)}
        onConfirm={confirmDeleteStage}
        title="¿Eliminar esta etapa?"
        description={`¿Seguro que deseas eliminar la etapa "${deletingStage?.name}"? Esta acción no se puede deshacer y los tratos activos en esta fase podrían verse afectados.`}
        confirmText="Confirmar Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
};
