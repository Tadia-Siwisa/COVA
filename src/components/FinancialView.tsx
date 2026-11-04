import React, { useState } from 'react';
import { FinancialStatementRow } from '../data/mockBusinessData';
import { PageHeaderActions } from './PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from '../utils/exportUtils';
import { Info, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface FinancialViewProps {
  financialRows: FinancialStatementRow[];
  onUpdateFinancialRows: (newRows: FinancialStatementRow[], auditNotes: string[]) => void;
  onOpenSource: () => void;
  onOpenIntelligence: (context: string) => void;
  theme?: 'light' | 'dark';
}

const trendData = [
  { month: 'Oct 25', revenue: 3.90, operatingProfit: 1.25 },
  { month: 'Nov 25', revenue: 3.98, operatingProfit: 1.29 },
  { month: 'Dec 25', revenue: 4.10, operatingProfit: 1.35 },
  { month: 'Jan 26', revenue: 4.02, operatingProfit: 1.28 },
  { month: 'Feb 26', revenue: 4.08, operatingProfit: 1.31 },
  { month: 'Mar 26', revenue: 4.14, operatingProfit: 1.33 },
  { month: 'Apr 26', revenue: 4.19, operatingProfit: 1.36 },
  { month: 'May 26', revenue: 4.22, operatingProfit: 1.38 },
  { month: 'Jun 26', revenue: 4.25, operatingProfit: 1.40 },
  { month: 'Jul 26', revenue: 4.20, operatingProfit: 1.37 },
  { month: 'Aug 26', revenue: 4.03, operatingProfit: 1.38 },
  { month: 'Sep 26', revenue: 4.28, operatingProfit: 1.34 },
];

export const FinancialView: React.FC<FinancialViewProps> = ({
  financialRows,
  onOpenSource,
  onOpenIntelligence,
  theme = 'light',
}) => {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'ytd' | 'prev'>('month');

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const columns = [
      { key: 'category', label: 'Category' },
      { key: 'item', label: 'Line Item' },
      { key: 'actualZAR', label: 'Actual (September 2026)' },
      { key: 'budgetZAR', label: 'Budget' },
      { key: 'varianceZAR', label: 'Variance' },
      { key: 'pctOfRevenue', label: '% of Revenue' },
    ];
    if (format === 'csv') {
      exportToCSV('Management_Income_Statement_September_2026', columns, financialRows);
    } else if (format === 'excel') {
      exportToExcel('Management_Income_Statement_September_2026', columns, financialRows);
    } else {
      printOrExportPDF('Monthly Financial Performance — September 2026', columns, financialRows);
    }
  };

  // Largest Material Variances (3 to 5 items)
  const materialVariances = [
    {
      item: 'Emergency Diesel Backup Fuel Runs (Stage 4)',
      actual: '-R720k',
      budget: '-R636k',
      variance: '-R84,000',
      type: 'unfavorable',
      reason: '114 unbudgeted generator run hours at Protea Logistics during grid load shedding.',
    },
    {
      item: 'EPC Turnkey Installation Milestones',
      actual: 'R1,100k',
      budget: 'R980k',
      variance: '+R120,000',
      type: 'favorable',
      reason: 'Accelerated Phase 1 commissioning milestone recognized for Karoo Wool Mill.',
    },
    {
      item: 'Commercial PPA Generation Billings',
      actual: 'R2,640k',
      budget: 'R2,550k',
      variance: '+R90,000',
      type: 'favorable',
      reason: 'Winter commercial baseline tariff billings exceeded weather forecast.',
    },
    {
      item: 'Supplier Credit & Milestone Inventory Carry',
      actual: '-R45k',
      budget: '-R25k',
      variance: '-R20,000',
      type: 'unfavorable',
      reason: 'Financing carry costs on delivered Paarl battery hardware pending municipal sign-off.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with Period Selector and Action Buttons */}
      <div className="bg-white dark:bg-[#181c20] rounded-xl border border-stone-200/90 dark:border-[#262c34] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#262c34]">
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Monthly Financial Performance — September 2026
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              General Ledger trial balance reconciliation and management operating accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Compact Period Selector */}
            <div className="inline-flex flex-wrap rounded-lg bg-stone-100 dark:bg-[#1f242c] p-0.5 text-sm font-medium border border-stone-200/70 dark:border-[#2b333d]">
              <button
                type="button"
                onClick={() => setPeriod('month')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  period === 'month'
                    ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setPeriod('quarter')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  period === 'quarter'
                    ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Quarter
              </button>
              <button
                type="button"
                onClick={() => setPeriod('ytd')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  period === 'ytd'
                    ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Year to Date
              </button>
              <button
                type="button"
                onClick={() => setPeriod('prev')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  period === 'prev'
                    ? 'bg-white dark:bg-[#2a323d] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Previous Period
              </button>
            </div>

            {/* Standard Page Actions */}
            <PageHeaderActions
              pageTitle="Monthly Financial Performance"
              pageContext="Financial"
              onOpenSource={onOpenSource}
              onOpenIntelligence={onOpenIntelligence}
              onExport={handleExport}
              sourceLabel="Source: General Ledger"
              sourceFileHint="General_Ledger.xlsx (Trial Balance)"
            />
          </div>
        </div>

        {/* Top 4 Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* Revenue */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#1f242c] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Revenue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                R4.28M
              </span>
              <span className="text-sm font-mono-numbers font-semibold text-emerald-700 dark:text-emerald-400 flex items-center">
                +6.2%
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              +R250k vs budget
            </span>
          </div>

          {/* Gross Profit */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#1f242c] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Gross Profit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                R2.94M
              </span>
              <span className="text-sm font-mono-numbers font-semibold text-emerald-700 dark:text-emerald-400">
                +5.6%
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              68.7% margin (vs 69.1% budget)
            </span>
          </div>

          {/* Operating Profit */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#1f242c] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Operating Profit</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                R1.34M
              </span>
              <span className="text-sm font-mono-numbers font-semibold text-rose-600 dark:text-rose-400">
                -2.6%
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              vs budget target (R1.40M)
            </span>
          </div>

          {/* Cash */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#1f242c] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Cash</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                R1.85M
              </span>
              <span className="text-sm font-mono-numbers font-semibold text-stone-700 dark:text-stone-300">
                42 Days
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              -14.7% vs last month
            </span>
          </div>
        </div>

        {/* Concise Intelligence Finding */}
        <div className="mt-4 p-3.5 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e] text-sm sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-stone-900 dark:text-stone-100">
              Operating insight:
            </strong>{' '}
            Profit remained positive, but emergency energy costs reduced margin by R84k versus budget.
          </div>
        </div>

        {/* Familiar Management Statement Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left text-sm border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm">
                <th className="py-2.5 px-3">Line Item</th>
                <th className="py-2.5 px-3 text-right">Actual (September)</th>
                <th className="py-2.5 px-3 text-right">Budget</th>
                <th className="py-2.5 px-3 text-right">Variance</th>
                <th className="py-2.5 px-3 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#232932] font-mono-numbers text-stone-800 dark:text-stone-200">
              {financialRows.map((row, idx) => {
                const isTotal = row.isTotal;
                const isPositiveVar = row.varianceZAR.startsWith('+');

                return (
                  <tr
                    key={idx}
                    className={`${
                      isTotal
                        ? 'bg-stone-50/80 dark:bg-[#1c2229] font-bold text-stone-900 dark:text-stone-100'
                        : 'hover:bg-stone-50/50 dark:hover:bg-[#1b2027]'
                    }`}
                  >
                    <td className={`py-2 px-3 font-sans ${isTotal ? 'font-bold' : 'pl-6 text-stone-600 dark:text-stone-400'}`}>
                      {row.item}
                    </td>

                    {/* Actual Cell */}
                    <td className="py-2 px-3 text-right font-medium">
                      <span className={isTotal ? 'font-bold' : ''}>{row.actualZAR}</span>
                    </td>

                    {/* Budget Cell */}
                    <td className="py-2 px-3 text-right text-stone-600 dark:text-stone-400">
                      {row.budgetZAR}
                    </td>

                    {/* Variance Cell */}
                    <td
                      className={`py-2 px-3 text-right ${
                        isPositiveVar
                          ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                          : row.varianceZAR === 'R0'
                          ? 'text-stone-600 dark:text-stone-400'
                          : 'text-rose-600 dark:text-rose-400 font-medium'
                      }`}
                    >
                      {row.varianceZAR}
                    </td>

                    {/* % of Revenue Cell */}
                    <td className="py-2 px-3 text-right text-stone-600 dark:text-stone-400">
                      {row.pctOfRevenue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-3 bg-stone-50/60 dark:bg-[#181c22] border-t border-stone-100 dark:border-[#222831] text-sm text-stone-500 dark:text-stone-400 flex flex-wrap gap-3 items-center justify-between">
            <span>
              All values verified against General Ledger trial balance.
            </span>
            <button
              type="button"
              onClick={onOpenSource}
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white underline cursor-pointer font-medium"
            >
              Inspect or edit in General_Ledger.xlsx →
            </button>
          </div>
        </div>

        {/* Largest Variances Section (3 to 5 material items) */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-[#262c34]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
            Largest Material Variances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materialVariances.map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-stone-50/90 dark:bg-[#1e242c] border border-stone-200/70 dark:border-[#2b333d] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                      {v.item}
                    </span>
                    <span
                      className={`text-sm font-mono-numbers font-bold shrink-0 ${
                        v.type === 'favorable'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {v.variance}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {v.reason}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm font-mono-numbers text-stone-600 dark:text-stone-400 mt-2 pt-1.5 border-t border-stone-200/50 dark:border-[#29323d]">
                  <span>Actual: <strong className="text-stone-900 dark:text-stone-100">{v.actual}</strong></span>
                  <span>Budget: <strong className="text-stone-700 dark:text-stone-300">{v.budget}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue & Operating Profit Trend Chart (6 to 12 months) */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Revenue & Operating Profit Trend (12 Months)
              </h2>
              <span className="text-sm text-stone-600 dark:text-stone-400">Amounts in Millions ZAR</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-400 dark:bg-amber-500" />
                <span className="text-stone-600 dark:text-stone-300">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-400" />
                <span className="text-stone-600 dark:text-stone-300">Operating Profit</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === 'dark' ? '#262d37' : '#e5e7eb'}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: theme === 'dark' ? '#374151' : '#d1d5db' }}
                  tickFormatter={(val) => `R${val}M`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `R${value}M`,
                    name === 'revenue' ? 'Revenue' : 'Operating Profit',
                  ]}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#181c20' : '#ffffff',
                    borderColor: theme === 'dark' ? '#2b333e' : '#e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827',
                  }}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="operatingProfit" fill="#10b981" radius={[4, 4, 0, 0]} name="Operating Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
