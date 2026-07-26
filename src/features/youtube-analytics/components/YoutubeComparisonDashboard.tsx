import { OwnVsCompetitorsChart } from '@features/youtube-analytics/components/OwnVsCompetitorsChart';
import { TimeSeriesAreaChart } from '@features/youtube-analytics/components/TimeSeriesAreaChart';
import { YoutubeComparisonKpiGrid } from '@features/youtube-analytics/components/YoutubeComparisonKpiGrid';
import { useCompetitorsDashboard } from '@features/youtube-analytics/hooks/useCompetitors';
import { useOwnChannelDashboard } from '@features/youtube-analytics/hooks/useOwnChannel';
import { buildOwnVsCompetitorsSeries } from '@features/youtube-analytics/utils/build-own-vs-competitors-series.util';
import { EmptyState } from '@shared/components/EmptyState';
import { Loader2, Radar, Video } from 'lucide-react';
import React from 'react';

export const YoutubeComparisonDashboard: React.FC = () => {
  const ownDashboard = useOwnChannelDashboard();
  const competitorsDashboard = useCompetitorsDashboard();

  if (ownDashboard.isLoading || competitorsDashboard.isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (
    ownDashboard.isError ||
    competitorsDashboard.isError ||
    !ownDashboard.data ||
    !competitorsDashboard.data
  ) {
    return (
      <div className="alert alert-error">
        <span>No se pudo cargar la comparación. Intenta de nuevo.</span>
      </div>
    );
  }

  const { channelDailyStats, videoDailyStats } = ownDashboard.data;
  const { competitors, competitorVideoStats } = competitorsDashboard.data;

  if (channelDailyStats.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="Todavía no hay datos de tu canal"
        description="En cuanto corra el primer job diario vas a ver la comparación acá."
      />
    );
  }

  const ownViewsSeries = [...channelDailyStats].reverse().map((stat) => ({
    date: stat.date,
    value: stat.viewsTotal,
  }));

  return (
    <div className="space-y-4">
      <YoutubeComparisonKpiGrid
        channelDailyStats={channelDailyStats}
        ownVideoDailyStats={videoDailyStats}
        competitors={competitors}
        competitorVideoStats={competitorVideoStats}
      />

      {competitors.length === 0 ? (
        <>
          <TimeSeriesAreaChart
            title="Vistas totales"
            data={ownViewsSeries}
            color="#7c3aed"
          />
          <EmptyState
            icon={Radar}
            title="Todavía no monitoreás competencia"
            description="Agregá un canal de competencia desde la pestaña Competencia para ver la comparación."
          />
        </>
      ) : (
        <OwnVsCompetitorsChart
          series={buildOwnVsCompetitorsSeries(
            channelDailyStats,
            competitors,
            competitorVideoStats,
          )}
        />
      )}
    </div>
  );
};
