import React, { useState } from 'react';
import { ArrowRight, Info, TrendingUp, UploadCloud } from 'lucide-react';

interface RevenueCostStructureProps {
  hasUploadedFiles?: boolean;
  onOpenUpload?: () => void;
}

interface RevenueSourceItem {

  id: string;
  name: string;
  amount: string;
  share: string;
  description: string;
}

interface CostOutflowItem {
  id: string;
  name: string;
  amount: string;
  share: string;
  description: string;
}

const revenueSources: RevenueSourceItem[] = [
  {
    id: 'ppa',
    name: 'PPA Revenue',
    amount: 'R2,540,000',
    share: '59.3%',
    description: 'Contracted long-term solar generation tariffs across commercial off-takers.',
  },
  {
    id: 'epc',
    name: 'EPC Revenue',
    amount: 'R1,100,000',
    share: '25.7%',
    description: 'Turnkey microgrid development and milestone billings (Karoo Wool Mill Phase 1).',
  },
  {
    id: 'om',
    name: 'O&M Revenue',
    amount: 'R540,000',
    share: '12.6%',
    description: 'Guaranteed performance maintenance retainers and remote SCADA monitoring.',
  },
  {
    id: 'other_rev',
    name: 'Other Revenue',
    amount: 'R100,000',
    share: '2.3%',
    description: 'Grid ancillary services and specialized engineering consultancy fees.',
  },
];

const costOutflows: CostOutflowItem[] = [
  {
    id: 'direct_energy',
    name: 'Direct Energy Costs',
    amount: '-R1,340,000',
    share: '31.3%',
    description: 'Solar maintenance, scheduled battery depreciation, and emergency diesel generator fuel.',
  },
  {
    id: 'opex',
    name: 'Operating Expenses',
    amount: '-R1,260,000',
    share: '29.4%',
    description: 'Technical engineering staff payroll, site fleet logistics, and software telemetry licenses.',
  },
  {
    id: 'finance',
    name: 'Finance Costs',
    amount: '-R185,000',
    share: '4.3%',
    description: 'Senior clean infrastructure term loan interest and amortized financing charges.',
  },
  {
    id: 'other_costs',
    name: 'Other Material Costs',
    amount: '-R155,000',
    share: '3.6%',
    description: 'Municipal compliance filings, insurance coverage, and site lease obligations.',
  },
];

export const RevenueCostStructure: React.FC<RevenueCostStructureProps> = ({
  hasUploadedFiles = true,
  onOpenUpload,
}) => {
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    amount: string;
    share: string;
    description: string;
    type: 'revenue' | 'cost';
  } | null>(null);

  if (!hasUploadedFiles) {
    return (
      <section
        id="revenue-cost-structure-section"
        className="my-6 p-6 rounded-xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] shadow-xs text-center flex flex-col items-center justify-center py-10"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-400 mb-2">
          Revenue & Cost Structure
        </span>
        <h3 className="font-editorial text-xl font-semibold text-stone-700 dark:text-stone-300 mb-1">
          No data yet
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mb-4">
          Upload General_Ledger.xlsx and Invoices.xlsx to calculate revenue sources, operating expenses, and retained profit margins.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload files to build this view</span>
        </button>
      </section>
    );
  }

  return (
    <section
      id="revenue-cost-structure-section"
      className="my-6 p-4 sm:p-5 rounded-xl border bg-white dark:bg-[#181c20] border-stone-200/90 dark:border-[#262c34] shadow-xs transition-colors"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-2.5 border-b border-stone-100 dark:border-[#242a32]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Revenue & Cost Structure
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            September 2026 breakdown of revenue sources, total revenue, and cost absorption
          </p>
        </div>
        <span className="text-sm font-mono-numbers text-stone-600 dark:text-stone-300">
          Retained Operating Profit: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">R1,340,000 (31.4%)</strong>
        </span>
      </div>

      {/* Visual Direction Banner (Flow direction visually obvious) */}
      <div className="hidden lg:flex items-center justify-between px-3 py-1.5 mb-3 rounded-lg bg-stone-50 dark:bg-[#14181c] border border-stone-200/60 dark:border-[#232931] text-sm font-semibold text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5">
          <span>Revenue Sources</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
        </span>
        <span className="text-stone-700 dark:text-stone-300">
          Flowing into Total Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          <span>Flowing to Costs & Outflows</span>
        </span>
      </div>

      {/* 3-Column Layout with Obvious Flow Direction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* LEFT COLUMN: Revenue Sources (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-stone-50/70 dark:bg-[#15191d] border border-stone-200/80 dark:border-[#262c34] relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                Revenue Sources
              </span>
              <span className="text-sm font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400">
                R4,280,000
              </span>
            </div>

            <div className="space-y-2">
              {revenueSources.map((item) => {
                const isSelected = selectedItem?.name === item.name;
                return (
                  <button
                    key={item.id}
                    id={`rev-source-${item.id}`}
                    onClick={() =>
                      setSelectedItem(
                        isSelected
                          ? null
                          : { ...item, type: 'revenue' }
                      )
                    }
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-white shadow-xs'
                        : 'bg-white dark:bg-[#1a2027] text-stone-900 dark:text-stone-100 border-stone-200/80 dark:border-[#2b333e] hover:border-stone-400 dark:hover:border-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? 'text-stone-100 dark:text-stone-900'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-sm font-mono-numbers font-bold shrink-0 ${
                          isSelected
                            ? 'text-emerald-300 dark:text-emerald-700'
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {item.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-sm">
                      <span
                        className={`truncate ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-600'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {item.share} of total
                      </span>
                      <span className="inline-flex items-center text-sm text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                        into total <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 text-sm text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-[#242a32] flex items-center justify-between">
            <span>4 Contracted Streams</span>
            <span className="font-mono-numbers">100.0%</span>
          </div>
        </div>

        {/* CENTER COLUMN: Total Revenue (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-stone-100/80 dark:bg-[#1b2026] border-2 border-stone-300 dark:border-[#333d4a] shadow-xs relative">
          {/* Subtle directional badges on desktop */}
          <div className="hidden lg:flex items-center justify-between text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <ArrowRight className="w-3 h-3" /> Inflow
            </span>
            <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
              Outflow <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="text-center my-auto py-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
              Total Revenue
            </span>
            <span className="text-sm text-stone-500 dark:text-stone-400 block mb-1">
              September 2026
            </span>
            <div className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 my-1 font-mono-numbers">
              R4,280,000
            </div>
            <div className="inline-flex items-center gap-1 text-sm font-semibold font-mono-numbers text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              +6.2% vs last month
            </div>

            {/* Reconciliation Box */}
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-[#28303a] grid grid-cols-2 gap-2 text-left">
              <div className="p-2 rounded bg-white/80 dark:bg-[#14181c] border border-stone-200/80 dark:border-[#262c34]">
                <span className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Costs & Outflows
                </span>
                <span className="font-mono-numbers text-sm font-bold text-rose-600 dark:text-rose-400">
                  -R2,940,000
                </span>
              </div>
              <div className="p-2 rounded bg-white/80 dark:bg-[#14181c] border border-stone-200/80 dark:border-[#262c34]">
                <span className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Operating Profit
                </span>
                <span className="font-mono-numbers text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  R1,340,000 (31.4%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
            Operating Conversion: <strong className="text-stone-800 dark:text-stone-200">31.4%</strong> of billed revenue retained
          </div>
        </div>

        {/* RIGHT COLUMN: Costs & Outflows (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-stone-50/70 dark:bg-[#15191d] border border-stone-200/80 dark:border-[#262c34] relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                Costs & Outflows
              </span>
              <span className="text-sm font-mono-numbers font-bold text-rose-600 dark:text-rose-400">
                -R2,940,000
              </span>
            </div>

            <div className="space-y-2">
              {costOutflows.map((item) => {
                const isSelected = selectedItem?.name === item.name;
                return (
                  <button
                    key={item.id}
                    id={`cost-outflow-${item.id}`}
                    onClick={() =>
                      setSelectedItem(
                        isSelected
                          ? null
                          : { ...item, type: 'cost' }
                      )
                    }
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-white shadow-xs'
                        : 'bg-white dark:bg-[#1a2027] text-stone-900 dark:text-stone-100 border-stone-200/80 dark:border-[#2b333e] hover:border-stone-400 dark:hover:border-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? 'text-stone-100 dark:text-stone-900'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-sm font-mono-numbers font-bold shrink-0 ${
                          isSelected
                            ? 'text-rose-300 dark:text-rose-700'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-sm">
                      <span
                        className={`truncate ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-600'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {item.share} of revenue
                      </span>
                      <span className="inline-flex items-center text-sm text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                        outflow <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2 text-sm text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-[#242a32] flex items-center justify-between">
            <span>Direct & Fixed Absorptions</span>
            <span className="font-mono-numbers">68.6%</span>
          </div>
        </div>
      </div>

      {/* Selected Item Detail Strip */}
      <div className="mt-3.5 pt-2.5 border-t border-stone-100 dark:border-[#242a32] flex items-start gap-2.5 text-sm text-stone-600 dark:text-stone-300">
        <Info className="w-4 h-4 text-stone-400 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {selectedItem ? (
            <span>
              <strong className="font-semibold text-stone-900 dark:text-stone-100 mr-1">
                {selectedItem.name} ({selectedItem.amount} · {selectedItem.share}):
              </strong>
              {selectedItem.description}
            </span>
          ) : (
            <span>
              <strong className="font-semibold text-stone-900 dark:text-stone-100 mr-1">
                Summary:
              </strong>
              Total revenue of R4,280,000 less total direct and operating costs of R2,940,000 yields{' '}
              <strong className="text-emerald-700 dark:text-emerald-400 font-mono-numbers">
                R1,340,000 in operating profit (31.4% margin)
              </strong>
              . Select any revenue source or cost category above to view item details.
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
