import { ConvertToDealSidebar } from '@crm/components/ConvertToDealSidebar';
import { LeadsTable } from '@crm/components/LeadsTable';
import { useArchiveLead, useLeadsList } from '@crm/hooks/useLeads';
import { Contact } from '@crm/types/contact';
import { AlertCircle, Inbox, Loader2, RefreshCw, Search } from 'lucide-react';
import React, { useState } from 'react';

export const InboxLeadsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Contact | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useLeadsList({
    search: search || undefined,
  });
  const archiveMutation = useArchiveLead();

  const leads = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleConvert = (lead: Contact) => {
    setSelectedLead(lead);
    setIsSidebarOpen(true);
  };

  const handleArchive = async (lead: Contact) => {
    if (
      !confirm(
        `¿Archivar el lead "${lead.name}"? No aparecerá más en el inbox.`,
      )
    )
      return;
    await archiveMutation.mutateAsync(lead.id);
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Inbox Leads
            </h2>
            {!isLoading && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                {total} leads
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Todos los leads entrantes. Archívalos o conviértelos en negocios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={15}
            />
            <input
              type="text"
              placeholder="Buscar lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 w-52 transition-all"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Actualizar"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {!isLoading && data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Inbox size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Total Leads
              </p>
              <h3 className="text-xl font-black text-white">{total}</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Search size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Esta página
              </p>
              <h3 className="text-xl font-black text-white">{leads.length}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            <Loader2 className="animate-spin text-primary relative" size={48} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-slate-200 text-sm font-bold">Cargando leads</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
              Sincronizando...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-md mx-auto text-center">
          <div className="rounded-3xl bg-rose-500/10 p-8 text-rose-400 border border-rose-500/20">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-black">Error de Conexión</h3>
            <p className="text-sm opacity-70 mt-2">
              {(error as Error)?.message}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 rounded-2xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <LeadsTable
            leads={leads}
            onArchive={handleArchive}
            onConvert={handleConvert}
          />
        </div>
      )}

      <ConvertToDealSidebar
        open={isSidebarOpen}
        lead={selectedLead}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};
