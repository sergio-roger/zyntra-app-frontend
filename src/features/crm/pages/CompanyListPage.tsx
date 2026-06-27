import { DateRange } from "@core/ui/DateRangePicker";
import { CompanyCustomFieldsSidebar } from "@crm/components/CompanyCustomFieldsSidebar";
import { CompanyExportModal } from "@crm/components/CompanyExportModal";
import { CompanyFilters } from "@crm/components/CompanyFilters";
import { CompanyFormSidebar } from "@crm/components/CompanyFormSidebar";
import { CompanyImportModal } from "@crm/components/CompanyImportModal";
import { CompanyTable } from "@crm/components/CompanyTable";
import { Pagination } from "@crm/components/Pagination";
import { DEFAULT_COMPANY_COLUMNS } from "@crm/constants/company-columns";
import { useCompaniesList, useDeleteCompany } from "@crm/hooks/useCompanies";
import { useCustomFields } from "@crm/hooks/useCustomFields";
import { useUpdateUserPreference, useUserPreference } from "@crm/hooks/useUserPreferences";
import { Company } from "@crm/types/company";
import { useAuthStore } from "@features/auth/store/authStore";
import { ColumnCustomizerModal } from "@shared/components/ColumnCustomizerModal";
import { ConfirmModal } from "@shared/components/ConfirmModal";
import { AlertCircle, FileSpreadsheet, Loader2, Plus } from "lucide-react";
import React, { useState } from "react";

interface Filters {
  search: string;
  sectorTypeId: string;
  lifecycleStageId: string;
  createdAtFrom: string;
  createdAtTo: string;
  page: number;
}

const defaultFilters = (): Filters => ({
  search: "",
  sectorTypeId: "",
  lifecycleStageId: "",
  createdAtFrom: "",
  createdAtTo: "",
  page: 1,
});

const LIMIT = 20;

export const CompanyListPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [customFieldsCompany, setCustomFieldsCompany] = useState<Company | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const { data: customFields = [] } = useCustomFields("company");
  const { data: columnPreference } = useUserPreference("companies_table_columns");
  const updatePreferenceMutation = useUpdateUserPreference();
  const currentColumnConfig = columnPreference || DEFAULT_COMPANY_COLUMNS;

  const currentUser = useAuthStore((s) => s.user);
  const isAdminOrManager =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  const set = (patch: Partial<Filters>) => {
    const resetPage = !("page" in patch);
    setFilters((prev) => ({
      ...prev,
      ...patch,
      ...(resetPage ? { page: 1 } : {}),
    }));
  };

  const query = useCompaniesList({
    search: filters.search || undefined,
    sector_type_id: filters.sectorTypeId || undefined,
    lifecycle_stage_id: filters.lifecycleStageId || undefined,
    createdAtFrom: filters.createdAtFrom || undefined,
    createdAtTo: filters.createdAtTo || undefined,
    page: filters.page,
    limit: LIMIT,
  });

  const deleteMutation = useDeleteCompany();

  const handleDateRangeChange = (range: DateRange | null) => {
    set({ createdAtFrom: range?.from ?? "", createdAtTo: range?.to ?? "" });
  };

  const openCreate = () => {
    setEditing(null);
    setSidebarOpen(true);
  };

  const openEdit = (c: Company) => {
    if (!isAdminOrManager) return;
    setEditing(c);
    setSidebarOpen(true);
  };

  const handleDeleteRequest = (c: Company) => {
    if (!isAdminOrManager) return;
    setCompanyToDelete(c);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
      await deleteMutation.mutateAsync(companyToDelete.id);
      setCompanyToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gestión de Empresas
          </h2>
          <p className="text-sm text-slate-400">
            Organiza y gestiona las empresas y organizaciones de tu cartera.
          </p>
          <div className="text-xs font-semibold text-slate-500">
            <span className="text-slate-300">{query.data?.total ?? 0}</span> empresa{(query.data?.total ?? 0) !== 1 ? "s" : ""} registrada{(query.data?.total ?? 0) !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdminOrManager && (
            <button
              onClick={() => setIsImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-700 hover:-translate-y-px active:scale-95"
            >
              <FileSpreadsheet size={18} /> Importar
            </button>
          )}
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px hover:shadow-xl active:scale-95"
          >
            <Plus size={18} /> Nueva empresa
          </button>
        </div>
      </div>

      {/* Filters */}
      <CompanyFilters
        search={filters.search}
        sectorTypeId={filters.sectorTypeId}
        lifecycleStageId={filters.lifecycleStageId}
        createdAtFrom={filters.createdAtFrom}
        createdAtTo={filters.createdAtTo}
        onSearchChange={(v) => set({ search: v })}
        onSectorTypeChange={(v) => set({ sectorTypeId: v })}
        onLifecycleStageChange={(v) => set({ lifecycleStageId: v })}
        onDateRangeChange={handleDateRangeChange}
        onExportCsv={() => setIsExportOpen(true)}
        onCustomizeColumns={() => setIsCustomizerOpen(true)}
        onReset={() => setFilters(defaultFilters())}
      />

      {/* Loading */}
      {query.isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium animate-pulse">
            Cargando empresas...
          </p>
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-300 shadow-lg">
          <AlertCircle size={24} className="text-rose-500" />
          <div className="flex-1">
            <p className="font-bold">Error de sincronización</p>
            <p className="opacity-70">{(query.error as Error)?.message}</p>
          </div>
          <button
            onClick={() => query.refetch()}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-bold hover:bg-rose-500/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Table */}
      {query.data && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <CompanyTable
            companies={query.data.items}
            columns={currentColumnConfig}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onSelect={openEdit}
            onCustomFields={(c) => setCustomFieldsCompany(c)}
            onAction={openCreate}
            canEdit={isAdminOrManager}
          />
          <div className="mt-6">
            <Pagination
              page={query.data.page}
              totalPages={query.data.totalPages}
              total={query.data.total}
              onChange={(p) => set({ page: p })}
            />
          </div>
        </div>
      )}

      {/* Custom Fields Sidebar */}
      <CompanyCustomFieldsSidebar
        open={customFieldsCompany !== null}
        company={customFieldsCompany}
        onClose={() => setCustomFieldsCompany(null)}
      />

      {/* Form Sidebar */}
      <CompanyFormSidebar
        open={sidebarOpen}
        company={editing}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Export Modal */}
      <CompanyExportModal
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        total={query.data?.total ?? 0}
        queryParams={{
          search: filters.search || undefined,
          sector_type_id: filters.sectorTypeId || undefined,
          lifecycle_stage_id: filters.lifecycleStageId || undefined,
          createdAtFrom: filters.createdAtFrom || undefined,
          createdAtTo: filters.createdAtTo || undefined,
        }}
      />

      {/* Import Modal */}
      <CompanyImportModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Empresa"
        description={`¿Estás seguro de eliminar "${companyToDelete?.name}"? La empresa se marcará como eliminada y ya no aparecerá en las listas, pero los datos históricos se conservarán.`}
        confirmText="Eliminar Empresa"
        variant="danger"
      />

      <ColumnCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        customFields={customFields}
        currentConfig={currentColumnConfig}
        defaultColumns={DEFAULT_COMPANY_COLUMNS}
        onSave={(newConfig) => {
          updatePreferenceMutation.mutate({
            key: "companies_table_columns",
            value: newConfig,
          });
        }}
      />
    </div>
  );
};
