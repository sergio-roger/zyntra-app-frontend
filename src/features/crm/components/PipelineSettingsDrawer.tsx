import React, { useEffect, useState } from 'react';
import {
  X, Settings2, Plus, Trash2, Loader2, GripVertical, Check, Save, Star, Users,
} from 'lucide-react';
import { useCreateStage, useUpdateStage, useDeleteStage, useUpdatePipeline } from '@crm/hooks/useDeals';
import { useTeamsList } from '@features/settings/hooks/useUsersTeams';
import { DealPipeline } from '@crm/types/crm';
import { EditableStage, StageType } from '@crm/types/pipeline-settings';
import { PIPELINE_STAGE_COLORS, STAGE_TYPE_LABELS } from '@crm/constants/pipeline-settings';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { toastManager } from '@shared/components/toast/toastManager';

type Tab = 'configuracion' | 'etapas';

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
  const [activeTab, setActiveTab] = useState<Tab>('configuracion');

  // ── Config form state ──────────────────────────────────────────────────────
  const [pipelineName, setPipelineName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  // ── Stages state ───────────────────────────────────────────────────────────
  const [stages, setStages] = useState<EditableStage[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingStage, setDeletingStage] = useState<EditableStage | null>(null);

  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const updatePipeline = useUpdatePipeline();
  const { data: teams = [] } = useTeamsList();

  useEffect(() => {
    if (!pipeline) return;
    setActiveTab('configuracion');
    setPipelineName(pipeline.name);
    setIsDefault(pipeline.is_default);
    setTeamId(pipeline.team_id);
    setStages([...pipeline.stages].sort((a, b) => a.position - b.position));
  }, [pipeline?.id]);

  if (!pipeline) return null;

  // ── Config handlers ────────────────────────────────────────────────────────
  const handleSaveConfig = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updatePipeline.mutateAsync({
        id: pipeline.id,
        input: { name: pipelineName.trim(), is_default: isDefault, team_id: teamId },
      });
      toastManager.add({
        title: 'Pipeline actualizado',
        description: 'Los cambios fueron guardados correctamente.',
        type: 'success',
      });
      onClose();
    } catch (err: any) {
      toastManager.add({
        title: 'Error al guardar',
        description: err?.response?.data?.message ?? 'No se pudo actualizar el pipeline.',
        type: 'error',
      });
    }
  };

  // ── Stage handlers ─────────────────────────────────────────────────────────
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

  const handleDeleteStage = (stage: EditableStage) => setDeletingStage(stage);

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
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-lg bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Settings2 size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{pipeline.name}</h3>
              <p className="text-xs text-slate-400">Configuración del pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 shrink-0">
          {(['configuracion', 'etapas'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'configuracion' ? 'Configuración' : 'Etapas'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Configuración Tab ── */}
          {activeTab === 'configuracion' && (
            <form id="pipeline-config-form" onSubmit={handleSaveConfig} className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">
                  Nombre del pipeline *
                </label>
                <input
                  required
                  type="text"
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  placeholder="Ej: Ventas Corporativas"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* is_default toggle */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-800/40 border border-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Star size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Pipeline principal</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Se usa por defecto al crear nuevos negocios.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDefault((v) => !v)}
                  className={`relative shrink-0 mt-0.5 h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                    isDefault ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      isDefault ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Team */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1 flex items-center gap-1.5">
                  <Users size={13} /> Equipo asignado
                </label>
                <select
                  value={teamId ?? ''}
                  onChange={(e) => setTeamId(e.target.value || null)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                >
                  <option value="">Sin equipo asignado</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {teams.length === 0 && (
                  <p className="text-[10px] text-slate-600 ml-1">No hay equipos configurados aún.</p>
                )}
              </div>
            </form>
          )}

          {/* ── Etapas Tab ── */}
          {activeTab === 'etapas' && (
            <div className="p-6 space-y-3">
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
                  <div className="h-0.5 w-full rounded-full -mt-1 mb-2" style={{ backgroundColor: stage.color }} />

                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-slate-600 shrink-0" />
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) => handleFieldChange(stage.id, 'name', e.target.value)}
                      className="flex-1 bg-slate-900/60 border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 pl-5">
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

                    <select
                      value={stage.type}
                      onChange={(e) => handleFieldChange(stage.id, 'type', e.target.value)}
                      className="bg-slate-900/60 border border-white/8 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      {(Object.keys(STAGE_TYPE_LABELS) as StageType[]).map((t) => (
                        <option key={t} value={t}>{STAGE_TYPE_LABELS[t]}</option>
                      ))}
                    </select>

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
          )}
        </div>

        {/* Footer — only for Configuración tab */}
        {activeTab === 'configuracion' && (
          <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="pipeline-config-form"
              type="submit"
              disabled={updatePipeline.isPending || !pipelineName.trim()}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {updatePipeline.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deletingStage !== null}
        onClose={() => setDeletingStage(null)}
        onConfirm={confirmDeleteStage}
        title="¿Eliminar esta etapa?"
        description={`¿Seguro que deseas eliminar la etapa "${deletingStage?.name}"? Esta acción no se puede deshacer y los negocios en esta etapa podrían verse afectados.`}
        confirmText="Confirmar Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
};
