import { DealFormFields } from "@crm/components/DealFormFields";
import {
  useCreateDeal,
  usePipelines,
  useUpdateDeal,
} from "@crm/hooks/useDeals";
import { Company } from "@crm/types/company";
import { Contact } from "@crm/types/contact";
import { CreateDealInput } from "@crm/types/create-deal-input";
import { Deal } from "@crm/types/deal";
import { DealPipeline } from "@crm/types/deal-pipeline";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { Loader2, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DealFormSidebarProps {
  open: boolean;
  deal: Deal | null;
  defaultPipelineId?: string;
  stageOverrideId?: string;
  onClose: () => void;
}

const emptyForm = (): CreateDealInput => ({
  title: "",
  value: 0,
  currency: "USD",
  pipelineId: "",
  stageId: "",
  contactIds: [],
  probability: 10,
  expectedCloseDate: "",
  description: "",
});

export const DealFormSidebar: React.FC<DealFormSidebarProps> = ({
  open,
  deal,
  defaultPipelineId,
  stageOverrideId,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateDealInput>(emptyForm());
  const [selectedPipeline, setSelectedPipeline] = useState<DealPipeline | null>(
    null,
  );
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { data: pipelines = [] } = usePipelines();

  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const stages: DealPipelineStage[] = selectedPipeline?.stages ?? [];

  // When pipelines load or open changes, set default pipeline
  useEffect(() => {
    if (!open) return;

    if (deal) {
      const pipeline =
        deal.pipeline ??
        pipelines.find(
          (p) => p.id === (deal.pipelineId || (deal as any).pipeline_id),
        ) ??
        null;
      setSelectedPipeline(pipeline);
      setSelectedContacts(deal.contacts || []);
      setSelectedCompany(deal.company || null);
      setFormData({
        title: deal.title,
        description: deal.description || "",
        value: Number(deal.value),
        currency: deal.currency || "USD",
        pipelineId: deal.pipelineId || (deal as any).pipeline_id,
        stageId: deal.stageId || (deal as any).stage_id,
        contactIds: deal.contacts?.map((c) => c.id) || [],
        companyId: deal.companyId ?? (deal as any).company_id ?? undefined,
        assignedToId:
          deal.assignedToId ?? (deal as any).assigned_to_id ?? undefined,
        teamId: deal.teamId ?? (deal as any).team_id ?? undefined,
        probability: deal.probability,
        expectedCloseDate:
          deal.expectedCloseDate || (deal as any).expected_close_date
            ? (
                deal.expectedCloseDate || (deal as any).expected_close_date
              ).split("T")[0]
            : "",
      });
    } else {
      let targetPipeline = pipelines.find((p) => p.id === defaultPipelineId);
      let targetStage: DealPipelineStage | undefined;

      if (stageOverrideId) {
        // Find pipeline that contains this stage
        for (const p of pipelines) {
          const st = p.stages?.find((s) => s.id === stageOverrideId);
          if (st) {
            targetPipeline = p;
            targetStage = st;
            break;
          }
        }
      }

      if (!targetPipeline) {
        targetPipeline =
          pipelines.find((p) => p.is_default) ?? pipelines[0] ?? null;
      }

      setSelectedPipeline(targetPipeline);
      const activeStage = targetStage ?? targetPipeline?.stages?.[0];

      setFormData({
        ...emptyForm(),
        pipelineId: targetPipeline?.id ?? "",
        stageId: activeStage?.id ?? "",
        probability: activeStage?.probability_percent ?? 10,
      });
      setSelectedContacts([]);
      setSelectedCompany(null);
    }
  }, [deal, open, pipelines, defaultPipelineId, stageOverrideId]);

  // When pipeline changes, reset stage to first stage
  const handlePipelineChange = (pipelineId: string) => {
    const pipeline = pipelines.find((p) => p.id === pipelineId) ?? null;
    setSelectedPipeline(pipeline);
    const firstStage = pipeline?.stages?.[0];
    setFormData((f) => ({
      ...f,
      pipelineId: pipelineId,
      stageId: firstStage?.id ?? "",
      probability: firstStage?.probability_percent ?? f.probability,
    }));
  };

  // When stage changes, auto-fill probability from stage
  const handleStageChange = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    setFormData((f) => ({
      ...f,
      stageId: stageId,
      probability: stage?.probability_percent ?? f.probability,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (deal) {
        await updateMutation.mutateAsync({ id: deal.id, input: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving deal:", err);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col min-h-full">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">
                {deal ? "Editar Negocio" : "Nuevo Negocio"}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {deal
                  ? "Actualiza los detalles de la oportunidad"
                  : "Registra una nueva oportunidad de venta"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            id="deal-form"
            onSubmit={handleSubmit}
            className="flex-1 p-6 space-y-5 pb-10"
          >
            <DealFormFields
              formData={formData}
              onChange={(patch) =>
                setFormData((prev) => ({ ...prev, ...patch }))
              }
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

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-white/5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="deal-form"
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
              {deal ? "Actualizar Negocio" : "Crear Negocio"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
