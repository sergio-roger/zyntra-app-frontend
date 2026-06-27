import { DateRange } from '@core/ui/DateRangePicker';
import { Tabs } from '@core/ui/Tabs';
import { crmApi } from '@crm/api/crm.api';
import { ContactCustomFieldsSidebar } from '@crm/components/ContactCustomFieldsSidebar';
import { ContactFilters } from '@crm/components/ContactFilters';
import { CustomFieldFilterSidebar } from '@crm/components/CustomFieldFilterSidebar';
import { ContactFormSidebar } from '@crm/components/ContactFormSidebar';
import { ContactImportModal } from '@crm/components/ContactImportModal';
import { ContactTable } from '@crm/components/ContactTable';
import { Pagination } from '@crm/components/Pagination';
import { useContactsList, useDeleteContact } from '@crm/hooks/useContacts';
import { Contact } from '@crm/types/contact';
import { TabKey } from '@crm/types/crm';
import { SegmentCondition } from '@crm/types/segment-condition';
import { TabFilters } from '@crm/types/tab-filters';
import { useAuthStore } from '@features/auth/store/authStore';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { AlertCircle, FileSpreadsheet, Loader2, Plus, UserCheck, UserMinus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const defaultFilters = (): TabFilters => ({
  search: '',
  source: '',
  ownerId: '',
  lifecycleStageId: '',
  createdAtFrom: '',
  createdAtTo: '',
  lastActivityAtFrom: '',
  lastActivityAtTo: '',
  customFieldConditions: [],
  page: 1,
});

const serializeConditions = (conditions: SegmentCondition[]): string | undefined =>
  conditions.length > 0 ? JSON.stringify(conditions) : undefined;

export const ContactListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [filters, setFilters] = useState<Record<TabKey, TabFilters>>({
    all: defaultFilters(),
    mine: defaultFilters(),
    unassigned: defaultFilters(),
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [customFieldsContact, setCustomFieldsContact] = useState<Contact | null>(null);
  const [customFieldFilterOpen, setCustomFieldFilterOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const currentUser = useAuthStore(s => s.user);
  const myOwnerId = currentUser?.crm_user_id;
  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const canEdit = isAdminOrManager || activeTab === 'mine';

  useEffect(() => {
    if (!myOwnerId && activeTab === 'mine') setActiveTab('all');
  }, [myOwnerId, activeTab]);

  const limit = 20;

  const allQuery = useContactsList({
    search: filters.all.search || undefined,
    source: filters.all.source || undefined,
    ownerId: filters.all.ownerId || undefined,
    lifecycleStageId: filters.all.lifecycleStageId || undefined,
    createdAtFrom: filters.all.createdAtFrom || undefined,
    createdAtTo: filters.all.createdAtTo || undefined,
    lastActivityAtFrom: filters.all.lastActivityAtFrom || undefined,
    lastActivityAtTo: filters.all.lastActivityAtTo || undefined,
    customFieldFilters: serializeConditions(filters.all.customFieldConditions),
    page: filters.all.page,
    limit,
  });

  const mineQuery = useContactsList(
    {
      search: filters.mine.search || undefined,
      source: filters.mine.source || undefined,
      lifecycleStageId: filters.mine.lifecycleStageId || undefined,
      ownerId: myOwnerId || 'none',
      createdAtFrom: filters.mine.createdAtFrom || undefined,
      createdAtTo: filters.mine.createdAtTo || undefined,
      lastActivityAtFrom: filters.mine.lastActivityAtFrom || undefined,
      lastActivityAtTo: filters.mine.lastActivityAtTo || undefined,
      customFieldFilters: serializeConditions(filters.mine.customFieldConditions),
      page: filters.mine.page,
      limit,
    },
    { enabled: !!myOwnerId },
  );

  const unassignedQuery = useContactsList({
    search: filters.unassigned.search || undefined,
    source: filters.unassigned.source || undefined,
    lifecycleStageId: filters.unassigned.lifecycleStageId || undefined,
    ownerId: 'unassigned',
    createdAtFrom: filters.unassigned.createdAtFrom || undefined,
    createdAtTo: filters.unassigned.createdAtTo || undefined,
    lastActivityAtFrom: filters.unassigned.lastActivityAtFrom || undefined,
    lastActivityAtTo: filters.unassigned.lastActivityAtTo || undefined,
    customFieldFilters: serializeConditions(filters.unassigned.customFieldConditions),
    page: filters.unassigned.page,
    limit,
  });

  const deleteMutation = useDeleteContact();

  const contactLimit = currentUser?.plan?.contact_limit ?? (currentUser as any)?.plan_object?.contact_limit ?? 999999;
  const isLimitReached = allQuery.data ? allQuery.data.total >= contactLimit && contactLimit !== 999999 : false;

  const setTabFilter = (tab: TabKey, partial: Partial<TabFilters>) => {
    const resetPage = !('page' in partial);
    setFilters(prev => ({
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

  const handleLastActivityDateChange = (range: DateRange | null) => {
    setTabFilter(activeTab, {
      lastActivityAtFrom: range?.from ?? '',
      lastActivityAtTo: range?.to ?? '',
    });
  };

  const handleCustomFieldConditionsChange = (conditions: SegmentCondition[]) => {
    setTabFilter(activeTab, { customFieldConditions: conditions });
  };

  const handleOpenCustomFields = (c: Contact) => {
    setCustomFieldsContact(c);
  };

  const handleExportCsv = async () => {
    const f = filters[activeTab];
    const ownerIdParam =
      activeTab === 'mine' ? myOwnerId :
      activeTab === 'unassigned' ? 'unassigned' :
      f.ownerId || undefined;

    const { data } = await crmApi.list({
      search: f.search || undefined,
      source: f.source || undefined,
      ownerId: ownerIdParam || undefined,
      lifecycleStageId: f.lifecycleStageId || undefined,
      createdAtFrom: f.createdAtFrom || undefined,
      createdAtTo: f.createdAtTo || undefined,
      limit: 9999,
      page: 1,
    });

    const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Fuente', 'Etapa', 'Propietario', 'Creado'];
    const rows = data.items.map((c) => [
      c.name,
      c.email ?? '',
      c.phone ?? '',
      c.companyName ?? '',
      c.source ?? '',
      c.lifecycleStage?.name ?? '',
      c.owner?.name ?? '',
      new Date(c.createdAt).toLocaleDateString('es-EC'),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contactos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeQuery = activeTab === 'all' ? allQuery : activeTab === 'mine' ? mineQuery : unassignedQuery;
  const activeFilters = filters[activeTab];

  const openCreate = () => { setEditing(null); setSidebarOpen(true); };
  const openEdit = (c: Contact) => {
    if (!canEdit) return;
    setEditing(c);
    setSidebarOpen(true);
  };
  const handleDeleteRequest = (c: Contact) => {
    if (!canEdit) return;
    setContactToDelete(c);
    setIsConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      await deleteMutation.mutateAsync(contactToDelete.id);
      setContactToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Gestión de Contactos</h2>
          <p className="text-sm text-slate-400">Gestiona tu base de clientes, leads y prospectos comerciales.</p>
          <div className="text-xs font-semibold text-slate-500">
            <span className={isLimitReached ? 'text-rose-400 font-bold' : 'text-slate-300'}>{allQuery.data?.total || 0}</span>
            {' / '}
            {contactLimit === 999999 ? '∞' : contactLimit} registrados
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportOpen(true)}
            disabled={isLimitReached}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${
              isLimitReached
                ? 'bg-slate-800 border-white/5 text-slate-500 cursor-not-allowed shadow-none'
                : 'border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:-translate-y-px active:scale-95'
            }`}
          >
            <FileSpreadsheet size={18} /> Importar
          </button>
          <button
            onClick={openCreate}
            disabled={isLimitReached}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all ${
              isLimitReached
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-primary text-white shadow-primary/20 hover:-translate-y-px hover:shadow-xl active:scale-95'
            }`}
          >
            <Plus size={18} /> Nuevo contacto
          </button>
        </div>
      </div>

      {isLimitReached && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-content">
          <AlertCircle size={20} className="text-warning" />
          <p>Has alcanzado el límite de {contactLimit} contactos permitidos en tu plan. Actualiza tu suscripción para añadir más.</p>
        </div>
      )}

      <Tabs
        compact
        active={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        tabs={[
          { key: 'all', label: 'Todos', icon: Users, badge: allQuery.data?.total ?? '—' },
          ...(myOwnerId ? [{ key: 'mine', label: 'Mis contactos', icon: UserCheck, badge: mineQuery.data?.total ?? '—' }] : []),
          { key: 'unassigned', label: 'No asignados', icon: UserMinus, badge: unassignedQuery.data?.total ?? '—' },
        ]}
      />

      <ContactFilters
        search={activeFilters.search}
        source={activeFilters.source}
        ownerId={activeFilters.ownerId}
        lifecycleStageId={activeFilters.lifecycleStageId}
        createdAtFrom={activeFilters.createdAtFrom}
        createdAtTo={activeFilters.createdAtTo}
        lastActivityAtFrom={activeFilters.lastActivityAtFrom}
        lastActivityAtTo={activeFilters.lastActivityAtTo}
        customFieldConditions={activeFilters.customFieldConditions}
        showOwnerFilter={isAdminOrManager && activeTab === 'all'}
        onSearchChange={(v) => setTabFilter(activeTab, { search: v })}
        onSourceChange={(v) => setTabFilter(activeTab, { source: v })}
        onOwnerChange={(v) => setTabFilter(activeTab, { ownerId: v })}
        onLifecycleStageChange={(v) => setTabFilter(activeTab, { lifecycleStageId: v })}
        onDateRangeChange={handleDateRangeChange}
        onLastActivityDateChange={handleLastActivityDateChange}
        onOpenCustomFieldFilters={() => setCustomFieldFilterOpen(true)}
        onExportCsv={handleExportCsv}
        onReset={() => setFilters(prev => ({ ...prev, [activeTab]: defaultFilters() }))}
      />

      {activeQuery.isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Cargando base de datos...</p>
        </div>
      )}

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

      {activeQuery.data && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <ContactTable
            contacts={activeQuery.data.items}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onSelect={openEdit}
            onCustomFields={handleOpenCustomFields}
            onAction={openCreate}
            canEdit={canEdit}
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

      <ContactFormSidebar
        open={sidebarOpen}
        contact={editing}
        onClose={() => setSidebarOpen(false)}
      />

      <ContactCustomFieldsSidebar
        open={customFieldsContact !== null}
        contact={customFieldsContact}
        onClose={() => setCustomFieldsContact(null)}
      />

      <CustomFieldFilterSidebar
        open={customFieldFilterOpen}
        conditions={activeFilters.customFieldConditions}
        onChange={handleCustomFieldConditionsChange}
        onClose={() => setCustomFieldFilterOpen(false)}
      />

      <ContactImportModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Contacto"
        description={`¿Estás seguro de eliminar a ${contactToDelete?.name}? El contacto se marcará como eliminado y ya no aparecerá en tus listas, pero sus datos históricos se conservarán por seguridad.`}
        confirmText="Eliminar Contacto"
        variant="danger"
      />
    </div>
  );
};
