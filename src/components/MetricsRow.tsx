import React from 'react';
import { HighLevelMetric } from '../types';
import {
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileSpreadsheet,
  UploadCloud,
} from 'lucide-react';

interface MetricsRowProps {
  metrics: HighLevelMetric[];
  hasUploadedFiles: boolean;
  onSelectMetric: (metric: HighLevelMetric) => void;
  selectedMetricId?: string;
  onOpenSource?: (metricId: string) => void;
  onInspectMetricSource?: (metricId: string) => void;
  onOpenUpload?: () => void;
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  metrics,
  hasUploadedFiles,
  onSelectMetric,
  selectedMetricId,
  onOpenSource,
  onInspectMetricSource,
  onOpenUpload,
}) => {
  const coreMetrics = metrics.slice(0, 4);

  const handleSourceClick = (metricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof onOpenSource === 'function') {
      onOpenSource(metricId);
    } else if (typeof onInspectMetricSource === 'function') {
      onInspectMetricSource(metricId);
    }
  };

  // Fallback metric labels for empty state
  const defaultLabels = [
    { id: 'revenue', label: 'Total Revenue' },
    { id: 'margin', label: 'Operating Profit' },
    { id: 'cash', label: 'Liquid Cash' },
    { id: 'debt', label: 'Debt Obligations' },
  ];

  return (
    <section id="key-financial-metrics-section" className="my-5">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Key Financial Metrics
        </h2>
        {hasUploadedFiles && (
          <span className="text-[11px] text-stone-400 dark:text-stone-500">
            Click Source on any metric to trace provenance
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {!hasUploadedFiles
          ? defaultLabels.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenUpload?.()}
                className="text-left p-4 sm:p-5 rounded-xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] flex flex-col justify-between hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-[#181d24] transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold tracking-tight uppercase text-stone-400 dark:text-stone-500 block mb-2">
                    {item.label}
                  </span>
                  <div className="font-editorial text-xl sm:text-2xl font-semibold text-stone-400 dark:text-stone-600 my-1">
                    No data yet
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-[#22272e] flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  <span className="text-[11px]">Upload files to build this view</span>
                  <UploadCloud className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                </div>
              </div>
            ))
          : coreMetrics.map((metric) => {
              const isSelected = selectedMetricId === metric.id;
              const isPositive = metric.trend === 'positive';
              const isNegative = metric.trend === 'negative';

              return (
                <div
                  key={metric.id}
                  id={`metric-card-${metric.id}`}
                  onClick={() => onSelectMetric(metric)}
                  className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-white shadow-xs ring-1 ring-stone-900/10'
                      : 'bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 border-stone-200/90 dark:border-[#262c34] hover:border-stone-400/80 dark:hover:border-stone-500 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Metric Label & Subtle Source Action */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-xs font-semibold tracking-tight uppercase truncate ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-700'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {metric.label}
                      </span>

                      {/* Subtle, Unobtrusive Source Button */}
                      <button
                        type="button"
                        id={`source-btn-${metric.id}`}
                        onClick={(e) => handleSourceClick(metric.id, e)}
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded transition cursor-pointer ${
                          isSelected
                            ? 'text-stone-200 bg-stone-800 hover:bg-stone-700 dark:text-stone-800 dark:bg-stone-200 dark:hover:bg-stone-300'
                            : 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-[#20262f] hover:bg-stone-200 dark:hover:bg-[#2a3340] border border-stone-200/70 dark:border-[#2c3542]'
                        }`}
                        title={`View underlying source files and calculation for ${metric.label}`}
                      >
                        <FileSpreadsheet className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Source</span>
                      </button>
                    </div>

                    {/* Primary Figure */}
                    <div className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight my-1 leading-none text-stone-900 dark:text-stone-100 font-mono-numbers">
                      {metric.value}
                    </div>
                  </div>

                  {/* Percentage Change & Comparison */}
                  <div
                    className={`mt-4 pt-3 border-t flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-800 dark:border-stone-200'
                        : 'border-stone-100 dark:border-[#242a32]'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {isPositive && (
                        <span
                          className={`inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-emerald-900/40 text-emerald-300 dark:bg-emerald-100 dark:text-emerald-800'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                          {metric.change}
                        </span>
                      )}
                      {isNegative && (
                        <span
                          className={`inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-rose-900/40 text-rose-300 dark:bg-rose-100 dark:text-rose-800'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                          {metric.change}
                        </span>
                      )}
                      {!isPositive && !isNegative && (
                        <span
                          className={`inline-flex items-center text-xs sm:text-[13px] font-mono-numbers font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-blue-900/40 text-blue-200 dark:bg-blue-100 dark:text-blue-900'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          <Minus className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                          {metric.change}
                        </span>
                      )}

                      <span
                        className={`text-xs ${
                          isSelected
                            ? 'text-stone-300 dark:text-stone-600'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {metric.secondaryContext}
                      </span>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0 ${
                        isSelected
                          ? 'text-stone-400 dark:text-stone-600'
                          : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
};
