import React, { useState } from 'react';
import { Loader2, AlertCircle, Plus, ChevronDown, Search, Filter, TrendingUp } from 'lucide-react';
import { useDealsKanban } from '@crm/hooks/useDeals';
import { DealsKanban } from '@crm/components/DealsKanban';
import { DealFormSidebar } from '@crm/components/DealFormSidebar';
import type { Deal } from '@crm/types';

export const DealsPage: React.FC = () => {
  const { data, isLoading, isError, error } = useDealsKanban();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreate = () => {
    setSelectedDeal(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsSidebarOpen(true);
  };

  // Calculate total pipeline value
  const totalPipelineValue = data ? Object.values(data).flat().reduce((sum, d) => sum + Number(d.value), 0) : 0;
  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(totalPipelineValue);

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight">Negocios y Oportunidades</h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
              Live Pipeline
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Gestiona y cierra tratos con tu equipo de ventas.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por título o contacto..." 
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-64 transition-all"
            />
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <Plus size={18} />
            <span>Nuevo Negocio</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Summary */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valor del Pipeline</p>
              <h3 className="text-xl font-black text-white">{formattedTotal}</h3>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Negocios Abiertos</p>
              <h3 className="text-xl font-black text-white">{Object.values(data).flat().length}</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center justify-center gap-2 group cursor-pointer hover:bg-slate-900/60 transition-all">
             <Filter size={14} className="text-slate-400" />
             <span className="text-xs font-bold text-slate-400 group-hover:text-white">Filtros Avanzados</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
            <Loader2 className="animate-spin text-indigo-400 relative" size={48} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-slate-200 text-sm font-bold tracking-wide">Cargando Oportunidades</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Sincronizando con el servidor...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-md mx-auto text-center">
          <div className="rounded-3xl bg-rose-500/10 p-8 text-rose-400 border border-rose-500/20 shadow-2xl shadow-rose-500/5">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-black">Error de Conexión</h3>
            <p className="text-sm opacity-70 mt-2 font-medium">No pudimos recuperar la información del pipeline. Revisa tu conexión a internet.</p>
            <p className="text-[10px] text-rose-500/50 mt-4 font-mono">{(error as Error)?.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-2xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all shadow-xl active:scale-95"
          >
            Reintentar ahora
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {!isLoading && data && (
        <div className="mt-2 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <DealsKanban kanbanData={data} onDealClick={handleEdit} />
        </div>
      )}

      <DealFormSidebar 
        open={isSidebarOpen}
        deal={selectedDeal}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};
