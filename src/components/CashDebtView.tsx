import React, { useState } from 'react';
import { PageHeaderActions } from './PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from '../utils/exportUtils';
import { Info, AlertTriangle, ShieldCheck, TrendingDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CashDebtViewProps {
  onOpenSource: () => void;
  onOpenIntelligence: (context: string) => void;
  theme?: 'light' | 'dark';
}

const cashTrendData = [
  { month: 'Apr 26', balance: 1.98, isHistorical: true },
  { month: 'May 26', balance: 1.92, isHistorical: true },
  { month: 'Jun 26', balance: 2.17, isHistorical: true },
  { month: 'Jul 26', balance: 2.10, isHistorical: true },
  { month: 'Aug 26', balance: 1.95, isHistorical: true },
  { month: 'Sep 26', balance: 1.85, isHistorical: true },
  { month: 'Oct 26 (P)', balance: 2.45, isHistorical: false },
  { month: 'Nov 26 (P)', balance: 2.78, isHistorical: false },
];

export const CashDebtView: React.FC<CashDebtViewProps> = ({
  onOpenSource,
  onOpenIntelligence,
  theme = 'light',
}) => {
  // Standard Cash-Flow Structure
  const [cashFlowLines, setCashFlowLines] = useState([
    { lineItem: 'Starting Cash (1 Sep 2026)', amountZAR: 'R1,490,000', type: 'balance' },
    { lineItem: 'Customer Receipts (Collections)', amountZAR: '+R3,186,800', type: 'inflow' },
    { lineItem: 'Operating Payments (O&M & Payroll)', amountZAR: '-R1,641,800', type: 'outflow' },
    { lineItem: 'Paarl Hardware Delivery Capex', amountZAR: '-R1,000,000', type: 'capex' },
    { lineItem: 'Debt Payments (DBSA Senior Service)', amountZAR: '-R185,000', type: 'debt' },
    { lineItem: 'Closing Cash (30 Sep 2026)', amountZAR: 'R1,850,000', type: 'total' },
  ]);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const columns = [
      { key: 'lineItem', label: 'Cash Flow Line Item' },
      { key: 'amountZAR', label: 'Amount (ZAR)' },
    ];
    if (format === 'csv') {
      exportToCSV('Cash_Flow_September_2026', columns, cashFlowLines);
    } else if (format === 'excel') {
      exportToExcel('Cash_Flow_September_2026', columns, cashFlowLines);
    } else {
      printOrExportPDF('Cash Flow & Debt — September 2026', columns, cashFlowLines);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#181c20] rounded-xl border border-stone-200/90 dark:border-[#262c34] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#262c34]">
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Cash Flow & Debt
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Monthly cash movements, liquidity runway, and senior debt covenant compliance.
            </p>
          </div>

          <PageHeaderActions
            pageTitle="Cash Flow & Debt"
            pageContext="Cash & Debt"
            onOpenSource={onOpenSource}
            onOpenIntelligence={onOpenIntelligence}
            onExport={handleExport}
            sourceLabel="Source: Bank Feeds"
            sourceFileHint="Bank_Transactions.xlsx & General_Ledger.xlsx"
          />
        </div>

        {/* Runway Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-5">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Liquid Cash</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                R1.85M
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              R1.42M Operating + R430k Covenant DSRA
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Current Runway</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">
                42 Days
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              Based on net monthly burn of R44,000/day
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">Projected Runway</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-editorial text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                68 Days
              </span>
            </div>
            <span className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 block">
              Following Paarl milestone release (R1.15M)
            </span>
          </div>
        </div>

        {/* Key Risk (Renamed from Material Risk Callout, concise) */}
        <div className="my-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-900 dark:text-amber-300">
              Key Risk:
            </strong>{' '}
            If municipal sign-off at Paarl is delayed past September 30, liquid cash remains at 42 days (R1.85M), leaving narrow headroom for equipment contingencies.
          </div>
        </div>

        {/* Familiar Cash-Flow Structure Table */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-[#262c34]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
            Monthly Cash-Flow Statement (September 2026)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm">
                  <th className="py-2.5 px-3">Flow Item</th>
                  <th className="py-2.5 px-3 text-right">Amount (ZAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-[#232932] font-mono-numbers text-stone-800 dark:text-stone-200">
                {cashFlowLines.map((row, idx) => {
                  const isClosing = row.type === 'total';
                  const isStarting = row.type === 'balance';

                  return (
                    <tr
                      key={idx}
                      className={`${
                        isClosing || isStarting
                          ? 'bg-stone-50/80 dark:bg-[#1c2229] font-bold text-stone-900 dark:text-stone-100'
                          : 'hover:bg-stone-50/50 dark:hover:bg-[#1b2027]'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-sans">{row.lineItem}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={
                            row.amountZAR.startsWith('+')
                              ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                              : row.amountZAR.startsWith('-')
                              ? 'text-stone-900 dark:text-stone-100'
                              : 'font-bold'
                          }
                        >
                          {row.amountZAR}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Debt Facilities & Covenants */}
        <div className="mt-8 pt-5 border-t border-stone-100 dark:border-[#262c34]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3">
            Debt Facilities & Covenants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3.5 rounded-lg bg-stone-50/80 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">DBSA Senior Concessional Debt</span>
              <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                R3,420,000
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">Prime - 1.25%, amortizing monthly</span>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50/80 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Debt Service Coverage Ratio (DSCR)</span>
              <span className="font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                1.78x
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">Compliant (1.30x covenant minimum)</span>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50/80 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Undrawn Facility Headroom</span>
              <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                R4,800,000
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">Available for capex draws</span>
            </div>
          </div>
        </div>

        {/* Cash Balance Trend Chart */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Cash Balance Trend (Historical & Projected)
              </h2>
              <span className="text-sm text-stone-600 dark:text-stone-400">Liquid reserves in Millions ZAR</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
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
                  formatter={(value: any) => [`R${value}M`, 'Cash Balance']}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#181c20' : '#ffffff',
                    borderColor: theme === 'dark' ? '#2b333e' : '#e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cashGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
