import { DateRange } from '@core/ui/DateRangePicker';
import { Tabs } from '@core/ui/Tabs';
import { CompanyCustomFieldsSidebar } from '@crm/components/CompanyCustomFieldsSidebar';
import { CompanyExportModal } from '@crm/components/CompanyExportModal';
import { CompanyFilters } from '@crm/components/CompanyFilters';
import { CompanyFormSidebar } from '@crm/components/CompanyFormSidebar';
import { CompanyImportModal } from '@crm/components/CompanyImportModal';
import { CompanyTable } from '@crm/components/CompanyTable';
import { CustomFieldFilterSidebar } from '@crm/components/CustomFieldFilterSidebar';
import { Pagination } from '@crm/components/Pagination';
import { DEFAULT_COMPANY_COLUMNS } from '@crm/constants/company-columns';
import { useCompaniesList, useDeleteCompany } from '@crm/hooks/useCompanies';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { useUpdateUserPreference, useUserPreference } from '@crm/hooks/useUserPreferences';
import { Company } from '@crm/types/company';
import { CompanyListFilters } from '@crm/types/company-filters';
import { TabKey } from '@crm/types/crm';
import { SegmentCondition } from '@crm/types/segment-condition';
import { useAuthStore } from '@features/auth/store/authStore';
import { ColumnCustomizerModal } from '@shared/components/ColumnCustomizerModal';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { AlertCircle, Building, Building2, FileSpreadsheet, Loader2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const defaultFilters = (): CompanyListFilters => ({
  search: '',
  industryId: '',
  ownerId: '',
  lifecycleStageId: '',
  createdAtFrom: '',
  createdAtTo: '',
  customFieldConditions: [],
  page: 1,
});

const serializeConditions = (conditions: SegmentCondition[]): string | undefined =>
  conditions.length > 0 ? JSON.stringify(conditions) : undefined;

const LIMIT = 20;

export const CompanyListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [filters, setFilters] = useState<Record<TabKey, CompanyListFilters>>({
    all: defaultFilters(),
    mine: defaultFilters(),
    unassigned: defaultFilters(),
  });

  const [isCustomFieldSidebarOpen, setIsCustomFieldSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [customFieldsCompany, setCustomFieldsCompany] = useState<Company | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const { data: customFields = [] } = useCustomFields('company');
  const { data: columnPreference } = useUserPreference('companies_table_columns');
  const updatePreferenceMutation = useUpdateUserPreference();
  const currentColumnConfig = columnPreference || DEFAULT_COMPANY_COLUMNS;

  const [, setSearchParams] = useSearchParams();
  const currentUser = useAuthStore((s) => s.user);
  const myOwnerId = currentUser?.crm_user_id;
  const isAdminOrManager =
    currentUser?.role === 'admin' || currentUser?.role === 'manager';

  useEffect(() => {
    if (!myOwnerId && activeTab === 'mine') setActiveTab('all');
  }, [myOwnerId, activeTab]);

  useEffect(() => {
    const f = filters[activeTab];
    const params: Record<string, string> = { tab: activeTab };
    if (f.search) params.search = f.search;
    if (f.industryId) params.industryId = f.industryId;
    if (f.ownerId) params.ownerId = f.ownerId;
    if (f.lifecycleStageId) params.lifecycleStageId = f.lifecycleStageId;
    if (f.createdAtFrom) params.createdAtFrom = f.createdAtFrom;
    if (f.createdAtTo) params.createdAtTo = f.createdAtTo;
    if (f.customFieldConditions.length > 0)
      params.cf = JSON.stringify(f.customFieldConditions);
    if (f.page > 1) params.page = String(f.page);
    setSearchParams(params, { replace: true });
  }, [filters, activeTab, setSearchParams]);

  const allQuery = useCompaniesList({
    search: filters.all.search || undefined,
    industryId: filters.all.industryId || undefined,
    ownerId: filters.all.ownerId || undefined,
    lifecycleStageId: filters.all.lifecycleStageId || undefined,
    createdAtFrom: filters.all.createdAtFrom || undefined,
    createdAtTo: filters.all.createdAtTo || undefined,
    customFieldFilters: serializeConditions(filters.all.customFieldConditions),
    page: filters.all.page,
    limit: LIMIT,
  });

  const mineQuery = useCompaniesList(
    {
      search: filters.mine.search || undefined,
      industryId: filters.mine.industryId || undefined,
      lifecycleStageId: filters.mine.lifecycleStageId || undefined,
      ownerId: myOwnerId || 'none',
      createdAtFrom: filters.mine.createdAtFrom || undefined,
      createdAtTo: filters.mine.createdAtTo || undefined,
      customFieldFilters: serializeConditions(filters.mine.customFieldConditions),
      page: filters.mine.page,
      limit: LIMIT,
    },
    { enabled: !!myOwnerId },
  );

  const unassignedQuery = useCompaniesList({
    search: filters.unassigned.search || undefined,
    industryId: filters.unassigned.industryId || undefined,
    lifecycleStageId: filters.unassigned.lifecycleStageId || undefined,
    ownerId: 'unassigned',
    createdAtFrom: filters.unassigned.createdAtFrom || undefined,
    createdAtTo: filters.unassigned.createdAtTo || undefined,
    customFieldFilters: serializeConditions(filters.unassigned.customFieldConditions),
    page: filters.unassigned.page,
    limit: LIMIT,
  });

  const deleteMutation = useDeleteCompany();

  const activeQuery =
    activeTab === 'all'
      ? allQuery
      : activeTab === 'mine'
        ? mineQuery
        : unassignedQuery;
  const activeFilters = filters[activeTab];

  const setTabFilter = (tab: TabKey, partial: Partial<CompanyListFilters>) => {
    const resetPage = !('page' in partial);
    setFilters((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], ...partial, ...(resetPage ? { page: 1 } : {}) },
    }));
  };

  const handleDateRangeChange = (range: DateRange | null) => {
    setTabFilter(activeTab, {
      createdAtFrom: range?.from ?? '',
      createdAtTo: range?.to ?? '',
    });
  };

  const handleCustomFieldConditionsChange = (conditions: SegmentCondition[]) => {
    setTabFilter(activeTab, { customFieldConditions: conditions });
  };

  const openCreate = () => {
    setEditing(null);
    setSidebarOpen(true);
  };

  const openEdit = (c: Company) => {
    if (!isAdminOrManager && activeTab !== 'mine') return;
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
            <span className="text-slate-300">{allQuery.data?.total ?? 0}</span> empresa{(allQuery.data?.total ?? 0) !== 1 ? 's' : ''} registrada{(allQuery.data?.total ?? 0) !== 1 ? 's' : ''}
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

      {/* Tabs */}
      <Tabs
        compact
        active={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        tabs={[
          {
            key: 'all',
            label: 'Todas',
            icon: Building2,
            badge: allQuery.data?.total ?? '—',
          },
          ...(myOwnerId
            ? [
                {
                  key: 'mine',
                  label: 'Mis empresas',
                  icon: Building,
                  badge: mineQuery.data?.total ?? '—',
                },
              ]
            : []),
          {
            key: 'unassigned',
            label: 'No asignadas',
            icon: Building2,
            badge: unassignedQuery.data?.total ?? '—',
          },
        ]}
      />

      {/* Filters */}
      <CompanyFilters
        search={activeFilters.search}
        industryId={activeFilters.industryId}
        ownerId={activeFilters.ownerId}
        lifecycleStageId={activeFilters.lifecycleStageId}
        createdAtFrom={activeFilters.createdAtFrom}
        createdAtTo={activeFilters.createdAtTo}
        customFieldConditions={activeFilters.customFieldConditions}
        showOwnerFilter={isAdminOrManager && activeTab === 'all'}
        onSearchChange={(v) => setTabFilter(activeTab, { search: v })}
        onIndustryChange={(v) => setTabFilter(activeTab, { industryId: v })}
        onOwnerChange={(v) => setTabFilter(activeTab, { ownerId: v })}
        onLifecycleStageChange={(v) =>
          setTabFilter(activeTab, { lifecycleStageId: v })
        }
        onDateRangeChange={handleDateRangeChange}
        onOpenCustomFieldFilters={() => setIsCustomFieldSidebarOpen(true)}
        onExportCsv={() => setIsExportOpen(true)}
        onCustomizeColumns={() => setIsCustomizerOpen(true)}
        onReset={() =>
          setFilters((prev) => ({ ...prev, [activeTab]: defaultFilters() }))
        }
      />

      {/* Loading */}
      {activeQuery.isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium animate-pulse">
            Cargando empresas...
          </p>
        </div>
      )}

      {/* Error */}
      {activeQuery.isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-300 shadow-lg">
          <AlertCircle size={24} className="text-rose-500" />
          <div className="flex-1">
            <p className="font-bold">Error de sincronización</p>
            <p className="opacity-70">{(activeQuery.error as Error)?.message}</p>
          </div>
          <button
            onClick={() => activeQuery.refetch()}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-bold hover:bg-rose-500/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Table */}
      {activeQuery.data && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <CompanyTable
            companies={activeQuery.data?.items ?? []}
            columns={currentColumnConfig}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onSelect={openEdit}
            onCustomFields={(c) => setCustomFieldsCompany(c)}
            onAction={openCreate}
            canEdit={isAdminOrManager || activeTab === 'mine'}
          />
          <div className="mt-6">
            <Pagination
              page={activeQuery.data.page}
              totalPages={activeQuery.data.totalPages}
              total={activeQuery.data.total}
              onChange={(p) => setTabFilter(activeTab, { page: p })}
            />
          </div>
        </div>
      )}

      {/* Custom Field Filter Sidebar */}
      <CustomFieldFilterSidebar
        open={isCustomFieldSidebarOpen}
        conditions={activeFilters.customFieldConditions}
        onChange={handleCustomFieldConditionsChange}
        onClose={() => setIsCustomFieldSidebarOpen(false)}
        entityType="company"
      />

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
        total={activeQuery.data?.total ?? 0}
        queryParams={{
          search: activeFilters.search || undefined,
          industryId: activeFilters.industryId || undefined,
          ownerId: activeFilters.ownerId || undefined,
          lifecycleStageId: activeFilters.lifecycleStageId || undefined,
          createdAtFrom: activeFilters.createdAtFrom || undefined,
          createdAtTo: activeFilters.createdAtTo || undefined,
          customFieldFilters: serializeConditions(activeFilters.customFieldConditions),
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
            key: 'companies_table_columns',
            value: newConfig,
          });
        }}
      />
    </div>
  );
};
