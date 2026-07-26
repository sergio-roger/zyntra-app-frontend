import {
  CompetitorSeriesMeta,
  OwnVsCompetitorsSeries,
} from '@features/youtube-analytics/utils/build-own-vs-competitors-series.util';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React from 'react';

interface OwnVsCompetitorsChartProps {
  series: OwnVsCompetitorsSeries;
}

const OWN_COLOR = '#7c3aed';
const COMPETITOR_COLORS = ['#eb6834', '#1baf7a', '#2a78d6', '#e34948'];
const OTHERS_COLOR = '#898781';
const OTHERS_KEY = '__others__';
const MAX_COLORED_COMPETITORS = 4;

const formatDateLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('es', { day: '2-digit', month: 'short' });

function sumTotalViews(series: OwnVsCompetitorsSeries, competitorId: string): number {
  return series.points.reduce(
    (sum, point) => sum + (point.competitorViews[competitorId] ?? 0),
    0,
  );
}

function pickTopCompetitors(
  series: OwnVsCompetitorsSeries,
): { shown: CompetitorSeriesMeta[]; rest: CompetitorSeriesMeta[] } {
  const sorted = [...series.competitors].sort(
    (a, b) => sumTotalViews(series, b.id) - sumTotalViews(series, a.id),
  );
  return {
    shown: sorted.slice(0, MAX_COLORED_COMPETITORS),
    rest: sorted.slice(MAX_COLORED_COMPETITORS),
  };
}

function sumOthersAtPoint(
  point: OwnVsCompetitorsSeries['points'][number],
  restIds: string[],
): number | null {
  const values = restIds
    .map((id) => point.competitorViews[id])
    .filter((v): v is number => v !== null);
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) : null;
}

function buildChartData(
  series: OwnVsCompetitorsSeries,
  shownIds: string[],
  restIds: string[],
): Record<string, number | string | null>[] {
  return series.points.map((point) => {
    const row: Record<string, number | string | null> = {
      date: point.date,
      own: point.ownViews,
    };
    for (const id of shownIds) row[id] = point.competitorViews[id] ?? null;
    if (restIds.length > 0) row[OTHERS_KEY] = sumOthersAtPoint(point, restIds);
    return row;
  });
}

export const OwnVsCompetitorsChart: React.FC<OwnVsCompetitorsChartProps> = ({
  series,
}) => {
  const { shown, rest } = pickTopCompetitors(series);
  const shownIds = shown.map((c) => c.id);
  const restIds = rest.map((c) => c.id);
  const colorById = new Map(
    shown.map((c, i) => [c.id, COMPETITOR_COLORS[i % COMPETITOR_COLORS.length]]),
  );
  const chartData = buildChartData(series, shownIds, restIds);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-5">
        <h3 className="text-sm font-semibold text-base-content/70">
          Vistas: canal propio vs. competencia
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-base-300"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-base-content/40"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-base-content/40"
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => v.toLocaleString('es')}
              />
              <Tooltip
                labelFormatter={(label) => formatDateLabel(String(label))}
                formatter={(value: number) => value.toLocaleString('es')}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgb(203 213 225 / 0.4)',
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="own"
                name="Tu canal"
                stroke={OWN_COLOR}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
              {shown.map((competitor) => (
                <Line
                  key={competitor.id}
                  type="monotone"
                  dataKey={competitor.id}
                  name={competitor.label}
                  stroke={colorById.get(competitor.id)}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
              {restIds.length > 0 && (
                <Line
                  type="monotone"
                  dataKey={OTHERS_KEY}
                  name="Otros competidores"
                  stroke={OTHERS_COLOR}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
