import React from 'react';
import { Loader2, AlertCircle, Plus, ChevronDown, Calendar, Search } from 'lucide-react';
import { useKanban } from '@crm/hooks/useContacts';
import { PipelineKanban } from '@crm/components/PipelineKanban';
import { PipelineStats } from '@crm/components/PipelineStats';

export const PipelinePage: React.FC = () => {
  const { data, isLoading, isError, error } = useKanban();

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">Pipeline de Ventas</h2>
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar oportunidades..." 
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva oportunidad</span>
          </button>
        </div>
      </div>

      {/* Stats summary */}
      {data && <PipelineStats kanbanData={data} />}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
            <Loader2 className="animate-spin text-indigo-400 relative" size={40} />
          </div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Cargando tu pipeline...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-md mx-auto text-center">
          <div className="rounded-2xl bg-rose-500/10 p-4 text-rose-400 border border-rose-500/20 shadow-xl shadow-rose-500/5">
            <AlertCircle size={40} className="mx-auto mb-2" />
            <h3 className="text-lg font-bold">Error al cargar el pipeline</h3>
            <p className="text-sm opacity-80 mt-1">{(error as Error)?.message}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-all"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {data && (
        <div className="mt-2 min-h-[600px]">
          <PipelineKanban kanbanData={data} />
        </div>
      )}
    </div>
  );
};
