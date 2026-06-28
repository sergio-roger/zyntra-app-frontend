import { DealFormFields } from '@crm/components/DealFormFields';
import { Contact } from '@crm/types/contact';
import { Company } from '@crm/types/company';
import {
  useDealHistory,
  useDeleteDeal,
  usePipelines,
  useUpdateDeal,
} from '@crm/hooks/useDeals';
import { CreateDealInput } from '@crm/types/create-deal-input';
import { Deal } from '@crm/types/deal';
import { DealPipeline } from '@crm/types/deal-pipeline';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import { DealStageHistoryRecord } from '@crm/types/deal-stage-history-record';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { toastManager } from '@shared/components/toast/toastManager';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { TaskBoard } from '@crm/components/TaskBoard';
import React, { useEffect, useState } from 'react';

type Tab = 'detalle' | 'historial' | 'tareas';

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
  if (days === 0) return 'Menos de 1 día';
  return `${days} día${days !== 1 ? 's' : ''}`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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
        const color = rec.stage?.color ?? '#6366f1';
        const isLast = idx === records.length - 1;

        return (
          <li key={rec.id} className="flex gap-4">
            {/* Left: dot + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={`mt-1 w-3 h-3 rounded-full shrink-0 ring-2 ring-slate-900 ${isCurrent ? 'ring-offset-1 ring-offset-slate-900' : ''}`}
                style={{ backgroundColor: color }}
              />
              {!isLast && <div className="w-px flex-1 mt-1 mb-0 bg-white/10" />}
            </div>

            {/* Right: content */}
            <div className={`pb-6 min-w-0 ${isLast ? 'pb-2' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  {rec.stage?.name ?? 'Etapa eliminada'}
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
                {' · '}
                <span
                  className={isCurrent ? 'text-emerald-400' : 'text-slate-500'}
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
  const [activeTab, setActiveTab] = useState<Tab>('detalle');
  const [formData, setFormData] = useState<CreateDealInput>({
    title: '',
    value: 0,
    currency: 'USD',
    pipelineId: '',
    stageId: '',
    contactIds: [],
    probability: 10,
    expectedCloseDate: '',
    description: '',
  });
  const [selectedPipeline, setSelectedPipeline] = useState<DealPipeline | null>(
    null,
  );

  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { data: pipelines = [] } = usePipelines();
  const { data: history = [], isLoading: loadingHistory } = useDealHistory(
    open ? (deal?.id ?? null) : null,
  );

  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useUpdateDeal();
  const deleteMutation = useDeleteDeal();
  const isSaving = updateMutation.isPending;
  const stages: DealPipelineStage[] = selectedPipeline?.stages ?? [];

  // Reset tab and populate form when deal changes
  useEffect(() => {
    if (!open || !deal) return;
    setActiveTab('detalle');
    const pipeline =
      deal.pipeline ?? pipelines.find((p) => p.id === (deal.pipelineId || (deal as any).pipeline_id)) ?? null;
    setSelectedPipeline(pipeline);
    setSelectedContacts(deal.contacts || []);
    setSelectedCompany(deal.company || null);
    setFormData({
      title: deal.title,
      description: deal.description ?? '',
      value: Number(deal.value),
      currency: deal.currency ?? 'USD',
      pipelineId: deal.pipelineId || (deal as any).pipeline_id,
      stageId: deal.stageId || (deal as any).stage_id,
      contactIds: deal.contacts?.map((c) => c.id) || [],
      companyId: deal.companyId ?? (deal as any).company_id ?? undefined,
      assignedToId: deal.assignedToId ?? (deal as any).assigned_to_id ?? undefined,
      teamId: deal.teamId ?? (deal as any).team_id ?? undefined,
      probability: deal.probability,
      expectedCloseDate: (deal.expectedCloseDate || (deal as any).expected_close_date)
        ? (deal.expectedCloseDate || (deal as any).expected_close_date).split('T')[0]
        : '',
    });
  }, [open, deal?.id, pipelines]);

  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId) ?? null;
    setSelectedPipeline(pipeline);
    const firstStage = pipeline?.stages?.[0];
    setFormData((f) => ({
      ...f,
      pipelineId: pipelineId,
      stageId: firstStage?.id ?? '',
      probability: firstStage?.probability_percent ?? f.probability,
    }));
  };

  const handleStageChange = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    setFormData((f) => ({
      ...f,
      stageId: stageId,
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
      console.error('Error updating deal:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deal) return;
    try {
      await deleteMutation.mutateAsync(deal.id);
      toastManager.add({
        title: 'Negocio eliminado',
        description: `"${deal.title}" fue eliminado correctamente.`,
        type: 'success',
      });
      setConfirmDelete(false);
      onClose();
    } catch (err: any) {
      toastManager.add({
        title: 'Error al eliminar',
        description:
          err?.response?.data?.message ?? 'No se pudo eliminar el negocio.',
        type: 'error',
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col min-h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 flex items-start justify-between p-6 border-b border-white/5">
          <div className="min-w-0 pr-4">
            <h3 className="text-xl font-bold text-white truncate">
              {deal?.title ?? 'Negocio'}
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
        <div className="sticky top-[89px] z-10 bg-slate-900 flex border-b border-white/5">
          {(['detalle', 'tareas', 'historial'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'detalle' ? 'Detalle' : tab === 'tareas' ? 'Tareas' : 'Historial'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* ── Detalle Tab ── */}
          {activeTab === 'detalle' && (
            <form
              id="deal-detail-form"
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <DealFormFields
                formData={formData}
                onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                selectedContacts={selectedContacts}
                onContactsChange={(contacts) => {
                  setSelectedContacts(contacts);
                }}
                selectedCompany={selectedCompany}
                onCompanyChange={(id, company) => {
                  setFormData((f) => ({ ...f, companyId: id || undefined }));
                  setSelectedCompany(company);
                }}
                pipelines={pipelines}
                stages={stages}
                onPipelineChange={handlePipelineChange}
                onStageChange={handleStageChange}
              />
            </form>
          )}

          {/* ── Historial Tab ── */}
          {activeTab === 'historial' && (
            <div className="p-6">
              <p className="text-xs text-slate-500 mb-5">
                Tiempo que el negocio ha permanecido en cada etapa del pipeline.
              </p>
              <HistoryTimeline records={history} loading={loadingHistory} />
            </div>
          )}

          {/* ── Tareas Tab ── */}
          {activeTab === 'tareas' && (
            <div className="p-6">
              <TaskBoard dealId={deal?.id} contactId={deal?.contact?.id} />
            </div>
          )}
        </div>

        {/* Footer — only for Detalle tab */}
        {activeTab === 'detalle' && (
          <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-white/5 space-y-3">
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
                  !formData.contactIds?.length ||
                  !formData.pipelineId ||
                  !formData.stageId
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
