import { Input } from "@core/ui/Input";
import { Textarea } from "@core/ui/Textarea";
import { useContactsList } from "@crm/hooks/useContacts";
import {
  useDealHistory,
  useDeleteDeal,
  usePipelines,
  useUpdateDeal,
} from "@crm/hooks/useDeals";
import { CreateDealInput } from "@crm/types/create-deal-input";
import { Deal } from "@crm/types/deal";
import { DealPipeline } from "@crm/types/deal-pipeline";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { DealStageHistoryRecord } from "@crm/types/deal-stage-history-record";
import { ConfirmModal } from "@shared/components/ConfirmModal";
import { toastManager } from "@shared/components/toast/toastManager";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Loader2,
  Save,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type Tab = "detalle" | "historial";

interface DealDetailSidebarProps {
  open: boolean;
  deal: Deal | null;
  onClose: () => void;
}

const stageDuration = (entered: string, left: string | null): string => {
  const ms =
    (left ? new Date(left) : new Date()).getTime() -
    new Date(entered).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days === 0) return "Menos de 1 día";
  return `${days} día${days !== 1 ? "s" : ""}`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── History Timeline ─────────────────────────────────────────────────────────

const HistoryTimeline: React.FC<{
  records: DealStageHistoryRecord[];
  loading: boolean;
}> = ({ records, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 size={20} className="animate-spin mr-2" />
        Cargando historial…
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
        <Clock size={32} className="opacity-30" />
        <p className="text-sm">Sin historial de etapas</p>
      </div>
    );
  }

  const sorted = [...records].reverse();

  return (
    <ol className="relative flex flex-col gap-0">
      {sorted.map((rec, idx) => {
        const isCurrent = rec.left_at === null;
        const color = rec.stage?.color ?? "#6366f1";
        const isLast = idx === records.length - 1;

        return (
          <li key={rec.id} className="flex gap-4">
            {/* Left: dot + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={`mt-1 w-3 h-3 rounded-full shrink-0 ring-2 ring-slate-900 ${isCurrent ? "ring-offset-1 ring-offset-slate-900" : ""}`}
                style={{ backgroundColor: color }}
              />
              {!isLast && <div className="w-px flex-1 mt-1 mb-0 bg-white/10" />}
            </div>

            {/* Right: content */}
            <div className={`pb-6 min-w-0 ${isLast ? "pb-2" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  {rec.stage?.name ?? "Etapa eliminada"}
                </span>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={10} />
                    En curso
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Entró el {fmtDate(rec.entered_at)}
                {" · "}
                <span
                  className={isCurrent ? "text-emerald-400" : "text-slate-500"}
                >
                  {stageDuration(rec.entered_at, rec.left_at)}
                </span>
              </p>
              {rec.left_at && (
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Salió el {fmtDate(rec.left_at)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const DealDetailSidebar: React.FC<DealDetailSidebarProps> = ({
  open,
  deal,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("detalle");
  const [formData, setFormData] = useState<CreateDealInput>({
    title: "",
    value: 0,
    currency: "USD",
    pipeline_id: "",
    stage_id: "",
    contact_id: "",
    probability: 10,
    expected_close_date: "",
    description: "",
  });
  const [selectedPipeline, setSelectedPipeline] = useState<DealPipeline | null>(
    null,
  );

  const { data: contactsData } = useContactsList({ limit: 100 });
  const { data: pipelines = [] } = usePipelines();
  const { data: history = [], isLoading: loadingHistory } = useDealHistory(
    open ? (deal?.id ?? null) : null,
  );
  const contacts = contactsData?.items ?? [];

  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useUpdateDeal();
  const deleteMutation = useDeleteDeal();
  const isSaving = updateMutation.isPending;
  const stages: DealPipelineStage[] = selectedPipeline?.stages ?? [];

  // Reset tab and populate form when deal changes
  useEffect(() => {
    if (!open || !deal) return;
    setActiveTab("detalle");
    const pipeline =
      deal.pipeline ?? pipelines.find((p) => p.id === deal.pipeline_id) ?? null;
    setSelectedPipeline(pipeline);
    setFormData({
      title: deal.title,
      description: deal.description ?? "",
      value: Number(deal.value),
      currency: deal.currency ?? "USD",
      pipeline_id: deal.pipeline_id,
      stage_id: deal.stage_id,
      contact_id: deal.contact_id,
      assigned_to_id: deal.assigned_to_id ?? undefined,
      team_id: deal.team_id ?? undefined,
      probability: deal.probability,
      expected_close_date: deal.expected_close_date
        ? deal.expected_close_date.split("T")[0]
        : "",
    });
  }, [open, deal?.id, pipelines]);

  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId) ?? null;
    setSelectedPipeline(pipeline);
    const firstStage = pipeline?.stages?.[0];
    setFormData((f) => ({
      ...f,
      pipeline_id: pipelineId,
      stage_id: firstStage?.id ?? "",
      probability: firstStage?.probability_percent ?? f.probability,
    }));
  };

  const handleStageChange = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    setFormData((f) => ({
      ...f,
      stage_id: stageId,
      probability: stage?.probability_percent ?? f.probability,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deal) return;
    try {
      await updateMutation.mutateAsync({ id: deal.id, input: formData });
      onClose();
    } catch (err) {
      console.error("Error updating deal:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deal) return;
    try {
      await deleteMutation.mutateAsync(deal.id);
      toastManager.add({
        title: "Negocio eliminado",
        description: `"${deal.title}" fue eliminado correctamente.`,
        type: "success",
      });
      setConfirmDelete(false);
      onClose();
    } catch (err: any) {
      toastManager.add({
        title: "Error al eliminar",
        description:
          err?.response?.data?.message ?? "No se pudo eliminar el negocio.",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5 shrink-0">
          <div className="min-w-0 pr-4">
            <h3 className="text-xl font-bold text-white truncate">
              {deal?.title ?? "Negocio"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Detalle de la oportunidad
            </p>
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
          {(["detalle", "historial"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "detalle" ? "Detalle" : "Historial"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ── Detalle Tab ── */}
          {activeTab === "detalle" && (
            <form
              id="deal-detail-form"
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <Input
                label="Título del negocio"
                icon={Briefcase}
                required
                placeholder="Ej: Implementación CRM Corporativo"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1 flex items-center gap-1.5">
                  <User size={14} /> Contacto vinculado *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.contact_id}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_id: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Seleccionar contacto...</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email || "Sin email"})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
                {contacts.length === 0 && (
                  <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> No hay contactos disponibles.
                  </p>
                )}
              </div>

              {/* Pipeline */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">
                  Pipeline *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.pipeline_id}
                    onChange={(e) => handlePipelineChange(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Seleccionar pipeline...</option>
                    {pipelines.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.is_default ? " (principal)" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">
                  Etapa *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.stage_id}
                    onChange={(e) => handleStageChange(e.target.value)}
                    disabled={stages.length === 0}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 pr-9 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none disabled:opacity-40"
                  >
                    <option value="">Seleccionar etapa...</option>
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.probability_percent}%)
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
              </div>

              {/* Value + Probability */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor estimado"
                  icon={DollarSign}
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                />
                <Input
                  label="Probabilidad (%)"
                  icon={TrendingUp}
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      probability: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Close date */}
              <Input
                label="Fecha de cierre estimada"
                icon={Calendar}
                type="date"
                value={formData.expected_close_date ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_close_date: e.target.value,
                  })
                }
              />

              <Textarea
                label="Descripción / Notas"
                placeholder="Detalles sobre el alcance, requerimientos, etc."
                rows={4}
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </form>
          )}

          {/* ── Historial Tab ── */}
          {activeTab === "historial" && (
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-5">
                Tiempo que el negocio ha permanecido en cada etapa del pipeline.
              </p>
              <HistoryTimeline records={history} loading={loadingHistory} />
            </div>
          )}
        </div>

        {/* Footer — only for Detalle tab */}
        {activeTab === "detalle" && (
          <div className="p-6 border-t border-white/5 bg-slate-950/30 shrink-0 space-y-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                form="deal-detail-form"
                type="submit"
                disabled={
                  isSaving ||
                  !formData.title ||
                  !formData.contact_id ||
                  !formData.pipeline_id ||
                  !formData.stage_id
                }
                className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Actualizar Negocio
              </button>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={deleteMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-sm font-medium transition-all disabled:opacity-50"
            >
              <Trash2 size={15} />
              Eliminar negocio
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar este negocio?"
        description={`¿Seguro que deseas eliminar "${deal?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
};
