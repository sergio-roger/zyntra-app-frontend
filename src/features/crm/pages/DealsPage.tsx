import { Select } from '@core/ui/Select';
import { DealDetailSidebar } from '@crm/components/DealDetailSidebar';
import { DealFormSidebar } from '@crm/components/DealFormSidebar';
import { DealsKanban } from '@crm/components/DealsKanban';
import { PipelineFormModal } from '@crm/components/PipelineFormModal';
import { PipelineSettingsDrawer } from '@crm/components/PipelineSettingsDrawer';
import { StageEditSidebar } from '@crm/components/StageEditSidebar';
import {
  useDealsKanban,
  usePipelineForecast,
  usePipelines,
} from '@crm/hooks/useDeals';
import { Deal } from '@crm/types/deal';
import { DealPipeline } from '@crm/types/deal-pipeline';
import { DealPipelineStage } from '@crm/types/deal-pipeline-stage';
import { useAuthStore } from '@features/auth/store/authStore';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  DollarSign,
  FolderOpen,
  FolderPlus,
  Loader2,
  Search,
  Settings2,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const fmt = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const DealsPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [settingsPipeline, setSettingsPipeline] = useState<DealPipeline | null>(
    null,
  );
  const [editingStage, setEditingStage] = useState<DealPipelineStage | null>(
    null,
  );
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [stageOverrideId, setStageOverrideId] = useState<string | undefined>(
    undefined,
  );

  const { data: pipelines = [], isLoading: loadingPipelines } = usePipelines();
  const {
    data: kanbanData,
    isLoading: loadingKanban,
    isError,
    error,
  } = useDealsKanban(activePipelineId);
  const { data: forecast } = usePipelineForecast(
    showForecast ? activePipelineId : null,
  );

  useEffect(() => {
    if (pipelines.length > 0 && !activePipelineId) {
      const defaultPipeline =
        pipelines.find((p) => p.isDefault) ?? pipelines[0];
      setActivePipelineId(defaultPipeline.id);
    }
  }, [pipelines, activePipelineId]);

  const handleCreatePipeline = () => {
    setIsPipelineModalOpen(true);
  };

  const handleDealClick = (deal: Deal) => {
    if (deal.id === 'new') {
      setSelectedDeal(null);
      setStageOverrideId(deal.stageId);
      setIsSidebarOpen(true);
    } else {
      setSelectedDeal(deal);
      setStageOverrideId(undefined);
      setIsSidebarOpen(true);
    }
  };

  const isLoading =
    loadingPipelines || (activePipelineId !== null && loadingKanban);
  const totalDeals =
    kanbanData?.columns.reduce((s, c) => s + c.deals.length, 0) ?? 0;
  const totalValue =
    kanbanData?.columns.reduce((s, c) => s + c.total_value, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <PageHeader
        title="Negocios y Oportunidades"
        subtitle="Gestiona y cierra tratos con tu equipo de ventas."
        badge={
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
            Live Pipeline
          </div>
        }
        actions={
          <>
            <div className="relative hidden lg:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar por título o contacto..."
                className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-64 transition-all"
              />
            </div>
            {isAdmin && (
              <button
                onClick={handleCreatePipeline}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                <FolderPlus size={18} />
                <span>Nuevo Pipeline</span>
              </button>
            )}
          </>
        }
      />

      {/* Pipeline Selector / Selector de Pipelines */}
      {pipelines.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/30 border border-white/5 p-3 rounded-2xl">
          <div className="shrink-0">
            <Select
              icon={BarChart3}
              options={pipelines.map((p) => ({
                value: p.id,
                label: `Pipeline: ${p.name}`,
              }))}
              value={activePipelineId}
              onChange={(v) => v && setActivePipelineId(v)}
              placeholder="Seleccionar pipeline..."
            />
          </div>

          {/* Pipeline Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
            {pipelines.map((p: DealPipeline) => (
              <div key={p.id} className="shrink-0 flex items-center gap-0.5">
                <button
                  onClick={() => setActivePipelineId(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all border ${
                    isAdmin ? 'rounded-l-lg border-r-0' : 'rounded-lg'
                  } ${
                    activePipelineId === p.id
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  {p.name}
                  {p.team && (
                    <span
                      className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: p.team.color + '28',
                        color: p.team.color,
                      }}
                    >
                      <Users size={8} />
                      {p.team.name}
                    </span>
                  )}
                  {p.isDefault && isAdmin && (
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-50 bg-indigo-500/20 px-1 rounded">
                      principal
                    </span>
                  )}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setSettingsPipeline(p)}
                    title="Configurar etapas"
                    className={`flex items-center justify-center px-2 py-1.5 rounded-r-lg text-xs transition-all border ${
                      activePipelineId === p.id
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/30'
                        : 'bg-slate-950 border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/10'
                    }`}
                  >
                    <Settings2 size={11} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowForecast((v) => !v)}
              className={`shrink-0 ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                showForecast
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 size={14} />
              Pronóstico
            </button>
          </div>
        </div>
      )}

      {/* Forecast Widget */}
      {showForecast && forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Valor total
              </p>
              <h3 className="text-lg font-black text-white">
                {fmt(forecast.totals.total_value)}
              </h3>
              <p className="text-[10px] text-slate-500">
                {forecast.totals.deal_count} negocios abiertos
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Target size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Valor ponderado
              </p>
              <h3 className="text-lg font-black text-white">
                {fmt(forecast.totals.weighted_value)}
              </h3>
              <p className="text-[10px] text-slate-500">
                {forecast.totals.total_value > 0
                  ? `${Math.round((forecast.totals.weighted_value / forecast.totals.total_value) * 100)}% probabilidad media`
                  : '—'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
              <BarChart3 size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Cierres por mes
              </p>
              {forecast.by_month.slice(0, 3).map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between text-[11px] mb-1"
                >
                  <span className="text-slate-400">{m.month}</span>
                  <span className="font-bold text-violet-300">
                    {fmt(m.weighted_value)}
                  </span>
                </div>
              ))}
              {forecast.by_month.length === 0 && (
                <p className="text-[10px] text-slate-600">
                  Sin cierres proyectados
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats (shown when forecast is hidden) */}
      {!isLoading && kanbanData && !showForecast && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Valor del Pipeline
              </p>
              <h3 className="text-xl font-black text-white">
                {fmt(totalValue)}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Negocios abiertos
              </p>
              <h3 className="text-xl font-black text-white">{totalDeals}</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <ChevronDown size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Etapas activas
              </p>
              <h3 className="text-xl font-black text-white">
                {kanbanData.columns.length}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
            <Loader2
              className="animate-spin text-indigo-400 relative"
              size={48}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-slate-200 text-sm font-bold tracking-wide">
              Cargando oportunidades
            </p>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
              Sincronizando con el servidor...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-md mx-auto text-center">
          <div className="rounded-3xl bg-rose-500/10 p-8 text-rose-400 border border-rose-500/20 shadow-2xl shadow-rose-500/5">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-black">Error de conexión</h3>
            <p className="text-sm opacity-70 mt-2 font-medium">
              No pudimos recuperar la información del pipeline.
            </p>
            <p className="text-[10px] text-rose-500/50 mt-4 font-mono">
              {(error as Error)?.message}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-2xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all shadow-xl active:scale-95"
          >
            Reintentar ahora
          </button>
        </div>
      )}

      {/* Empty — sin pipelines visibles */}
      {!isLoading &&
        !isError &&
        pipelines.length === 0 &&
        (isAdmin ? (
          <EmptyState
            icon={FolderOpen}
            title="No hay pipelines configurados"
            description="Crea tu primer pipeline para comenzar a gestionar oportunidades de venta."
            actionLabel="Nuevo Pipeline"
            onAction={handleCreatePipeline}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Sin pipeline asignado"
            description="Tu equipo aún no tiene un pipeline asignado. Contacta a tu administrador para que configure el acceso."
          />
        ))}

      {/* Kanban Board */}
      {!isLoading && kanbanData && (
        <div className="mt-2 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <DealsKanban
            kanbanData={kanbanData}
            onDealClick={handleDealClick}
            onEditStage={
              isAdmin ? (stage) => setEditingStage(stage) : undefined
            }
          />
        </div>
      )}

      {/* New deal form (create mode) */}
      <DealFormSidebar
        open={isSidebarOpen && selectedDeal === null}
        deal={null}
        defaultPipelineId={activePipelineId ?? undefined}
        stageOverrideId={stageOverrideId}
        onClose={() => {
          setIsSidebarOpen(false);
          setStageOverrideId(undefined);
        }}
      />

      {/* Existing deal detail + edit + history */}
      <DealDetailSidebar
        open={isSidebarOpen && selectedDeal !== null}
        deal={selectedDeal}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedDeal(null);
        }}
      />

      <StageEditSidebar
        open={editingStage !== null}
        stage={editingStage}
        onClose={() => setEditingStage(null)}
      />

      <PipelineFormModal
        open={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
      />

      <PipelineSettingsDrawer
        open={settingsPipeline !== null}
        pipeline={
          pipelines.find((p) => p.id === settingsPipeline?.id) ??
          settingsPipeline
        }
        onClose={() => setSettingsPipeline(null)}
      />
    </div>
  );
};
