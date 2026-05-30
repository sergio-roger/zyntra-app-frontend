import React, { useState, useEffect } from 'react';
import { Plus, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import {
  useContactsList,
  useDeleteContact,
} from '@crm/hooks/useContacts';
import { ContactFilters } from '@crm/components/ContactFilters';
import { ContactTable } from '@crm/components/ContactTable';
import { ContactFormSidebar } from '@crm/components/ContactFormSidebar';
import { ContactImportModal } from '@crm/components/ContactImportModal';
import { Pagination } from '@crm/components/Pagination';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import type { Contact, ContactSource } from '@crm/types';
import api from '@shared/api/axios';

interface LifecycleStage {
  id: string;
  name: string;
  icon: string;
  type: 'active' | 'lost';
}

export const ContactListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<string>('');
  const [source, setSource] = useState<ContactSource | ''>('');
  const [page, setPage] = useState(1);
  const [stages, setStages] = useState<LifecycleStage[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const fetchStages = React.useCallback(async () => {
    try {
      const response = await api.get('/lifecycle/stages');
      setStages(response.data);
    } catch (error) {
      console.error('Error fetching lifecycle stages:', error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStages();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStages]);

  const limit = 20;
  const { data, isLoading, isError, error, refetch } = useContactsList({
    search: search || undefined,
    stage: stage || undefined,
    source: source || undefined,
    page,
    limit,
  });
  const deleteMutation = useDeleteContact();

  const openCreate = () => {
    setEditing(null);
    setSidebarOpen(true);
  };
  const openEdit = (c: Contact) => {
    setEditing(c);
    setSidebarOpen(true);
  };
  const handleDeleteRequest = (c: Contact) => {
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
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gestión de Contactos</h2>
          <p className="text-sm text-slate-400">
            {data ? `${data.total} contactos registrados` : 'Cargando directorio…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-700 hover:-translate-y-px active:scale-95"
          >
            <FileSpreadsheet size={18} /> Importar
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px hover:shadow-xl active:scale-95"
          >
            <Plus size={18} /> Nuevo contacto
          </button>
        </div>
      </div>

      <ContactFilters
        search={search}
        stage={stage}
        source={source}
        stages={stages}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onStageChange={(v) => {
          setStage(v);
          setPage(1);
        }}
        onSourceChange={(v) => {
          setSource(v);
          setPage(1);
        }}
        onReset={() => {
          setSearch('');
          setStage('');
          setSource('');
          setPage(1);
        }}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Cargando base de datos...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-300 shadow-lg animate-in shake duration-500">
          <AlertCircle size={24} className="text-rose-500" />
          <div className="flex-1">
            <p className="font-bold">Error de sincronización</p>
            <p className="opacity-70">{(error as Error)?.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 font-bold hover:bg-rose-500/20 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <ContactTable
            contacts={data.items}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onSelect={openEdit}
            onAction={openCreate}
          />
          <div className="mt-6">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              onChange={setPage}
            />
          </div>
        </div>
      )}

      <ContactFormSidebar
        open={sidebarOpen}
        contact={editing}
        stages={stages}
        onClose={() => setSidebarOpen(false)}
      />

      <ContactImportModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Confirmation Modal */}
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
