import { TimeSeriesAreaChart } from '@features/youtube-analytics/components/TimeSeriesAreaChart';
import { YoutubeChannelDailyStats } from '@features/youtube-analytics/types/own-channel.type';
import React from 'react';

interface ChannelGrowthChartsProps {
  channelDailyStats: YoutubeChannelDailyStats[];
}

export const ChannelGrowthCharts: React.FC<ChannelGrowthChartsProps> = ({
  channelDailyStats,
}) => {
  // El endpoint devuelve DESC (más reciente primero); el chart necesita ASC.
  const ascending = [...channelDailyStats].reverse();

  const subscribersSeries = ascending.map((s) => ({
    date: s.date,
    value: s.subscribers,
  }));
  const viewsSeries = ascending.map((s) => ({
    date: s.date,
    value: s.viewsTotal,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TimeSeriesAreaChart
        title="Suscriptores"
        data={subscribersSeries}
        color="#7c3aed"
      />
      <TimeSeriesAreaChart
        title="Vistas totales"
        data={viewsSeries}
        color="#0ea5e9"
      />
    </div>
  );
};
