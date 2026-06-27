import React, { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  FileText,
  Globe,
  Hash,
  Loader2,
  Save,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { Input } from "@core/ui/Input";
import { Select } from "@core/ui/Select";
import { Tabs } from "@core/ui/Tabs";
import { Textarea } from "@core/ui/Textarea";
import { useCreateCompany, useUpdateCompany, useIndustrys } from "@crm/hooks/useCompanies";
import { useTags } from "@crm/hooks/useTags";
import { useCrmUsers } from "@crm/hooks/useCrmUsers";
import { Company, CompanyFormData } from "@crm/types/company";
import { LifecycleStage } from "@crm/types/lifecycle-stage";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CompanyFormSidebarProps {
  open: boolean;
  company: Company | null;
  onClose: () => void;
}

function defaultFormData(): CompanyFormData {
  return {
    name: "",
    identification: "",
    tax_type: "RUC",
    website: "",
    employee_range: "",
    description: "",
    industry_id: "",
    lifecycle_stage_id: "",
    owner_id: "",
    tag_ids: [],
    custom_fields: {},
  };
}

function formDataFromCompany(c: Company): CompanyFormData {
  return {
    name: c.name,
    identification: c.identification ?? "",
    tax_type: c.tax_type ?? "RUC",
    website: c.website ?? "",
    employee_range: c.employee_range ?? "",
    description: c.description ?? "",
    industry_id: c.industry_id ?? "",
    lifecycle_stage_id: c.lifecycle_stage_id ?? "",
    owner_id: c.owner_id ?? "",
    tag_ids: (c.tags ?? []).map((t) => t.id),
    custom_fields: c.custom_fields ?? {},
  };
}

export const CompanyFormSidebar: React.FC<CompanyFormSidebarProps> = ({
  open,
  company,
  onClose,
}) => {
  const [formData, setFormData] = useState<CompanyFormData>(defaultFormData);
  const [activeTab, setActiveTab] = useState<"info" | "advanced">("info");

  const { data: industries = [] } = useIndustrys();
  const { data: users = [] } = useCrmUsers();
  const { data: stages = [] } = useQuery<LifecycleStage[]>({
    queryKey: ["lifecycle-stages"],
    queryFn: () =>
      import("@shared/api/axios").then((m) =>
        m.default.get("/lifecycle/stages").then((r) => r.data),
      ),
    staleTime: 10 * 60 * 1000,
  });
  const { data: availableTags = [] } = useTags("company");

  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    setFormData(company ? formDataFromCompany(company) : defaultFormData());
    setActiveTab("info");
  }, [company, open]);

  const set = (patch: Partial<CompanyFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      identification: formData.identification || undefined,
      tax_type: formData.tax_type || undefined,
      website: formData.website || undefined,
      employee_range: formData.employee_range || undefined,
      description: formData.description || undefined,
      industry_id: formData.industry_id || undefined,
      lifecycle_stage_id: formData.lifecycle_stage_id || undefined,
      owner_id: formData.owner_id || undefined,
      tag_ids: formData.tag_ids,
      custom_fields: Object.keys(formData.custom_fields).length > 0
        ? formData.custom_fields
        : undefined,
    };

    if (company) {
      await updateMutation.mutateAsync({ id: company.id, input: payload });
    } else {
      await createMutation.mutateAsync(payload as any);
    }
    onClose();
  };

  const industryOptions = industries.map((s) => ({ value: s.id, label: s.name }));
  const ownerOptions = users.map((u) => ({ value: u.id, label: u.name }));
  
  const taxTypeOptions = [
    { value: "RUC", label: "RUC" },
    { value: "NIF", label: "NIF" },
    { value: "DNI", label: "DNI" },
    { value: "PASAPORTE", label: "Pasaporte" },
  ];

  const employeeRangeOptions = [
    { value: "1-10", label: "1-10 empleados" },
    { value: "11-50", label: "11-50 empleados" },
    { value: "51-200", label: "51-200 empleados" },
    { value: "201-500", label: "201-500 empleados" },
    { value: "501+", label: "501+ empleados" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">
                {company ? "Editar empresa" : "Nueva empresa"}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {company
                  ? "Actualiza la información de la empresa"
                  : "Registra una nueva empresa en tu CRM"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <Tabs
            active={activeTab}
            onChange={(k) => setActiveTab(k as "info" | "advanced")}
            className="mt-4"
            tabs={[
              { key: "info", label: "Información", icon: Building2 },
              { key: "advanced", label: "Avanzado", icon: FileText },
            ]}
          />

          {/* Form */}
          <form
            id="company-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-8"
          >
            {activeTab === "info" ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                    <Building2 size={14} />
                    Información básica
                  </div>
                  <div className="space-y-3">
                    <Input
                      label="Nombre de la empresa"
                      icon={Building2}
                      required
                      placeholder="Ej: Acme Corp S.A."
                      value={formData.name}
                      onChange={(e) => set({ name: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <Select
                          options={taxTypeOptions}
                          value={formData.tax_type}
                          onChange={(v) => set({ tax_type: v ?? "RUC" })}
                          label="Tipo"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          label="Identificación"
                          icon={Hash}
                          placeholder="Ej: 0912345678001"
                          value={formData.identification}
                          onChange={(e) => set({ identification: e.target.value })}
                        />
                      </div>
                    </div>
                    <Input
                      label="Sitio web"
                      icon={Globe}
                      type="url"
                      placeholder="https://ejemplo.com"
                      value={formData.website}
                      onChange={(e) => set({ website: e.target.value })}
                    />
                    <Select
                      label="Rango de empleados"
                      options={employeeRangeOptions}
                      value={formData.employee_range || null}
                      onChange={(v) => set({ employee_range: v ?? "" })}
                      clearable
                      clearLabel="Sin definir"
                      placeholder="Selecciona el tamaño"
                    />

                    {industryOptions.length > 0 && (
                      <Select
                        label="Industria"
                        options={industryOptions}
                        value={formData.industry_id || null}
                        onChange={(v) => set({ industry_id: v ?? "" })}
                        clearable
                        clearLabel="Sin industria"
                        placeholder="Selecciona una industria"
                      />
                    )}
                    
                    {ownerOptions.length > 0 && (
                      <Select
                        label="Propietario de la empresa"
                        options={ownerOptions}
                        value={formData.owner_id || null}
                        onChange={(v) => set({ owner_id: v ?? "" })}
                        clearable
                        clearLabel="Sin propietario"
                        placeholder="Asignar a un usuario..."
                      />
                    )}
                  </div>
                </div>

                {/* Lifecycle Stage */}
                {stages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <ChevronRight size={14} />
                      Etapa del ciclo de vida
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {stages.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => set({ lifecycle_stage_id: s.id })}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                            formData.lifecycle_stage_id === s.id
                              ? "bg-primary/10 border-primary text-white shadow-lg shadow-primary/10"
                              : "bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/20"
                          }`}
                        >
                          <span className="text-lg">{s.icon}</span>
                          <span className="text-xs font-medium truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                    <TagIcon size={14} />
                    Etiquetas
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = formData.tag_ids.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? formData.tag_ids.filter((id) => id !== tag.id)
                              : [...formData.tag_ids, tag.id];
                            set({ tag_ids: next });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                            isSelected
                              ? "text-white border-transparent"
                              : "bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                          style={isSelected ? { backgroundColor: tag.color } : {}}
                        >
                          <span className="text-xs font-medium">{tag.name}</span>
                          {isSelected && <Check size={12} />}
                        </button>
                      );
                    })}
                    {availableTags.length === 0 && (
                      <p className="text-xs text-slate-500 italic">
                        No hay etiquetas creadas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <Textarea
                  label="Descripción"
                  icon={FileText}
                  rows={6}
                  placeholder="Describe brevemente la empresa, su actividad, notas relevantes..."
                  value={formData.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="company-form"
              type="submit"
              disabled={isSaving || !formData.name}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {company ? "Actualizar empresa" : "Guardar empresa"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
