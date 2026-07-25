import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React from 'react';

interface TimeSeriesPoint {
  date: string;
  value: number;
}

interface TimeSeriesAreaChartProps {
  title: string;
  data: TimeSeriesPoint[];
  color: string;
  formatValue?: (value: number) => string;
}

const formatDateLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('es', { day: '2-digit', month: 'short' });

export const TimeSeriesAreaChart: React.FC<TimeSeriesAreaChartProps> = ({
  title,
  data,
  color,
  formatValue = (v) => v.toLocaleString('es'),
}) => {
  const gradientId = `yt-area-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-5">
        <h3 className="text-sm font-semibold text-base-content/70">{title}</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
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
                tickFormatter={(v: number) => formatValue(v)}
              />
              <Tooltip
                formatter={(value) => formatValue(Number(value))}
                labelFormatter={(label) => formatDateLabel(String(label))}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgb(203 213 225 / 0.4)',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
