import React from 'react';
import { HighLevelMetric } from '../types';
import { X, ArrowUpRight, ArrowDownRight, ArrowRight, Minus } from 'lucide-react';

interface MetricDrilldownModalProps {
  metric: HighLevelMetric | null;
  onClose: () => void;
  onDiscussMetric: (metric: HighLevelMetric) => void;
}

export const MetricDrilldownModal: React.FC<MetricDrilldownModalProps> = ({
  metric,
  onClose,
  onDiscussMetric,
}) => {
  if (!metric) return null;

  const isPositive = metric.trend === 'positive';
  const isNegative = metric.trend === 'negative';

  // Customized concise takeaways according to user specs
  const getTakeaway = () => {
    switch (metric.id) {
      case 'revenue':
        return 'Growth was mainly driven by EPC milestone revenue while recurring revenue remained stable.';
      case 'margin':
        return 'Operating margin contracted by 2.6% due to unbudgeted emergency diesel runs during Stage 4 load shedding.';
      case 'cash':
        return 'Operating runway tightened to 42 days because R1.15M in delivered battery inventory is awaiting municipal sign-off.';
      case 'debt':
        return 'Senior DBSA term facility is amortizing on schedule with healthy 0.48x covenant headroom over the 1.30x floor.';
      default:
        return 'Performance remains consistent with monthly financial targets.';
    }
  };

  const getBreakdownColumns = () => {
    if (metric.id === 'revenue') {
      return { col1: 'Revenue Source', col2: 'Amount', col3: 'Share' };
    }
    if (metric.id === 'margin') {
      return { col1: 'Generation & Cost Driver', col2: 'Amount', col3: 'Impact' };
    }
    if (metric.id === 'cash') {
      return { col1: 'Account / Milestone', col2: 'Amount', col3: 'Allocation' };
    }
    return { col1: 'Facility Component', col2: 'Amount', col3: 'Status' };
  };

  const cols = getBreakdownColumns();

  return (
    <div
      id="metric-drilldown-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        id="metric-drilldown-panel"
        className="w-full max-w-lg bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-metric-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
            Metric Breakdown
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {metric.label}
          </h2>
        </div>

        {/* Main Value & Change vs previous period */}
        <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-[#242a32]">
          <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-mono-numbers">
            {metric.value}
          </span>

          <div className="flex items-center gap-1.5">
            {isPositive && (
              <span className="inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {metric.change}
              </span>
            )}
            {isNegative && (
              <span className="inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {metric.change}
              </span>
            )}
            {!isPositive && !isNegative && (
              <span className="inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#20262f] px-2 py-0.5 rounded-md">
                <Minus className="w-3.5 h-3.5 mr-0.5" />
                {metric.change}
              </span>
            )}

            <span className="text-xs text-stone-500 dark:text-stone-400">
              {metric.secondaryContext}
            </span>
          </div>
        </div>

        {/* Key Breakdown Table */}
        <div className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Key Breakdown
          </div>

          <div className="border border-stone-200/80 dark:border-[#262c34] rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-[#242a32] text-xs">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-3 py-2 bg-stone-50 dark:bg-[#15191d] font-semibold text-stone-500 dark:text-stone-400 text-[11px] uppercase tracking-wider">
              <span className="col-span-6">{cols.col1}</span>
              <span className="col-span-3 text-right">{cols.col2}</span>
              <span className="col-span-3 text-right">{cols.col3}</span>
            </div>

            {/* Rows */}
            {metric.drilldownDetails.components.map((comp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 px-3 py-2.5 items-center hover:bg-stone-50/70 dark:hover:bg-[#1a2027] transition-colors"
              >
                <div className="col-span-6 font-medium text-stone-800 dark:text-stone-200 truncate pr-2">
                  {comp.name}
                </div>
                <div className="col-span-3 text-right font-mono-numbers font-semibold text-stone-900 dark:text-stone-100">
                  {comp.amount}
                </div>
                <div className="col-span-3 text-right font-mono-numbers text-stone-500 dark:text-stone-400">
                  {comp.percentage || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* One concise takeaway: What changed */}
        <div className="mb-6 p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
            What Changed
          </span>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {getTakeaway()}
          </p>
        </div>

        {/* Discuss this metric button */}
        <div className="pt-2">
          <button
            id="discuss-metric-btn"
            onClick={() => {
              onClose();
              onDiscussMetric(metric);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs sm:text-sm hover:bg-stone-800 dark:hover:bg-white shadow-xs transition cursor-pointer"
          >
            <span>Discuss this metric</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
