import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UploadCloud } from 'lucide-react';

interface MonthlyDataPoint {
  month: string;
  revenue: number; // In millions ZAR
  profit: number; // In millions ZAR
  marginPct: number;
}

const monthlyPerformanceData: MonthlyDataPoint[] = [
  { month: 'Oct 25', revenue: 3.55, profit: 1.21, marginPct: 34.1 },
  { month: 'Nov 25', revenue: 3.68, profit: 1.25, marginPct: 33.9 },
  { month: 'Dec 25', revenue: 3.75, profit: 1.28, marginPct: 34.1 },
  { month: 'Jan 26', revenue: 3.65, profit: 1.22, marginPct: 33.4 },
  { month: 'Feb 26', revenue: 3.82, profit: 1.30, marginPct: 34.0 },
  { month: 'Mar 26', revenue: 3.90, profit: 1.33, marginPct: 34.1 },
  { month: 'Apr 26', revenue: 3.98, profit: 1.35, marginPct: 33.9 },
  { month: 'May 26', revenue: 4.10, profit: 1.41, marginPct: 34.4 },
  { month: 'Jun 26', revenue: 4.15, profit: 1.39, marginPct: 33.5 },
  { month: 'Jul 26', revenue: 4.18, profit: 1.36, marginPct: 32.5 },
  { month: 'Aug 26', revenue: 4.03, profit: 1.37, marginPct: 34.0 },
  { month: 'Sep 26', revenue: 4.28, profit: 1.34, marginPct: 31.4 },
];

interface SimpleTrendChartProps {
  theme?: 'light' | 'dark';
  hasUploadedFiles?: boolean;
  onOpenUpload?: () => void;
}

export const SimpleTrendChart: React.FC<SimpleTrendChartProps> = ({
  theme = 'dark',
  hasUploadedFiles = true,
  onOpenUpload,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profit'>('revenue');

  if (!hasUploadedFiles) {
    return (
      <section
        id="performance-trend-chart-section"
        className="my-5 p-5 rounded-xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] shadow-xs text-center flex flex-col items-center justify-center py-12"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
          12-Month Performance Trend
        </span>
        <h3 className="font-editorial text-xl font-semibold text-stone-700 dark:text-stone-300 mb-1">
          No data yet
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mb-4">
          Historical trend chart will generate once general ledger and monthly trial balances are ingested.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload files to build this view</span>
        </button>
      </section>
    );
  }

  const isRevenue = selectedMetric === 'revenue';
  const lineColor = isRevenue ? '#f59e0b' : '#10b981'; // Amber or Emerald

  return (
    <section
      id="revenue-profit-trend-section"
      className="my-6 p-4 sm:p-5 rounded-xl border bg-white dark:bg-[#181c20] border-stone-200/90 dark:border-[#262c34] shadow-xs transition-colors"
    >
      {/* Header: Title and Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Revenue & Profit Performance: Oct 2025 – Sep 2026
          </h2>
        </div>

        {/* Clean Toggle: Revenue vs Operating Profit */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-[#1f242a] border border-stone-200/80 dark:border-[#2b333e] self-start sm:self-auto">
          <button
            id="toggle-trend-revenue-btn"
            onClick={() => setSelectedMetric('revenue')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              isRevenue
                ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Revenue
          </button>
          <button
            id="toggle-trend-profit-btn"
            onClick={() => setSelectedMetric('profit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              !isRevenue
                ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Operating Profit
          </button>
        </div>
      </div>

      {/* Clean Line Chart */}
      <div className="h-44 sm:h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyPerformanceData}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === 'dark' ? '#262c34' : '#f0f0ee'}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: theme === 'dark' ? '#262c34' : '#e5e5e0' }}
              tick={{
                fill: theme === 'dark' ? '#8e98a5' : '#78716c',
                fontSize: 11,
              }}
              dy={6}
            />

            <YAxis
              domain={isRevenue ? [3.0, 4.6] : [1.0, 1.6]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === 'dark' ? '#8e98a5' : '#78716c',
                fontSize: 11,
              }}
              tickFormatter={(val) => `R${val.toFixed(1)}M`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as MonthlyDataPoint;
                  return (
                    <div className="p-2.5 rounded-lg bg-stone-900 text-stone-100 dark:bg-[#121518] dark:text-stone-100 border border-stone-700 dark:border-[#2e3743] shadow-lg text-xs font-mono-numbers">
                      <div className="text-[11px] text-stone-400 font-sans mb-1 font-medium">
                        {data.month}
                      </div>
                      <div className="font-semibold text-stone-100 text-sm">
                        {isRevenue
                          ? `Total Revenue: R${data.revenue.toFixed(2)}M`
                          : `Operating Profit: R${data.profit.toFixed(2)}M`}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Operating Margin: {data.marginPct}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey={isRevenue ? 'revenue' : 'profit'}
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ fill: lineColor, r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
