import React, { useEffect, useState } from "react";
import { X, Save, Loader2, Layers } from "lucide-react";
import { useUpdateStage } from "@crm/hooks/useDeals";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { StageType } from "@crm/types/pipeline-settings";
import {
  PIPELINE_STAGE_COLORS,
  STAGE_TYPE_LABELS,
} from "@crm/constants/pipeline-settings";
import { toastManager } from "@shared/components/toast/toastManager";

interface StageEditSidebarProps {
  open: boolean;
  stage: DealPipelineStage | null;
  onClose: () => void;
}

export const StageEditSidebar: React.FC<StageEditSidebarProps> = ({
  open,
  stage,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(PIPELINE_STAGE_COLORS[0]);
  const [type, setType] = useState<StageType>("active");
  const [probability, setProbability] = useState(30);

  const updateStage = useUpdateStage();

  useEffect(() => {
    if (!stage) return;
    setName(stage.name);
    setColor(stage.color);
    setType(stage.type as StageType);
    setProbability(stage.probability_percent);
  }, [stage?.id]);

  if (!stage) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateStage.mutateAsync({
        stageId: stage.id,
        input: {
          name: name.trim(),
          color,
          type,
          probability_percent: probability,
        },
      });
      toastManager.add({
        title: "Etapa actualizada",
        description: `"${name.trim()}" fue guardada correctamente.`,
        type: "success",
      });
      onClose();
    } catch (err: any) {
      toastManager.add({
        title: "Error al guardar",
        description:
          err?.response?.data?.message ?? "No se pudo actualizar la etapa.",
        type: "error",
      });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-sm bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Layers size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                Editar etapa
              </h3>
              <p className="text-xs text-slate-400 truncate">{stage.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Color bar */}
        <div
          className="h-1 w-full shrink-0"
          style={{ backgroundColor: color }}
        />

        {/* Form */}
        <form
          id="stage-edit-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1">
              Nombre de la etapa *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Propuesta enviada"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 ml-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2.5 px-1">
              {PIPELINE_STAGE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "white" : "transparent",
                    boxShadow: color === c ? `0 0 8px ${c}80` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1">
              Tipo de etapa
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STAGE_TYPE_LABELS) as StageType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    type === t
                      ? t === "won"
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : t === "lost"
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                          : "bg-indigo-500/15 border-indigo-500/40 text-indigo-400"
                      : "bg-slate-800/50 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {STAGE_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Probability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-medium text-slate-400">
                Probabilidad de cierre
              </label>
              <span className="text-sm font-bold" style={{ color }}>
                {probability}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={probability}
              onChange={(e) => setProbability(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-medium px-0.5">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-white/5 bg-slate-800/30 p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Vista previa
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-bold text-white">
                {name || "Nombre de la etapa"}
              </span>
              <span
                className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                style={{
                  color,
                  borderColor: `${color}40`,
                  backgroundColor: `${color}15`,
                }}
              >
                {probability}%
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            form="stage-edit-form"
            type="submit"
            disabled={updateStage.isPending || !name.trim()}
            className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {updateStage.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Guardar Etapa
          </button>
        </div>
      </div>
    </>
  );
};
