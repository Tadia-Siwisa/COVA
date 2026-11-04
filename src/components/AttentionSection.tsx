import React from 'react';
import { AttentionFinding } from '../types';
import { ArrowRight, UploadCloud, AlertCircle } from 'lucide-react';

interface AttentionSectionProps {
  findings: AttentionFinding[];
  hasUploadedFiles: boolean;
  onInvestigate: (finding: AttentionFinding) => void;
  onOpenUpload?: () => void;
}

export const AttentionSection: React.FC<AttentionSectionProps> = ({
  findings,
  hasUploadedFiles,
  onInvestigate,
  onOpenUpload,
}) => {
  if (!hasUploadedFiles) {
    return (
      <section id="what-needs-attention-section" className="my-5">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            What Needs Your Attention
          </h2>
        </div>

        <div
          onClick={onOpenUpload}
          className="p-5 rounded-xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] flex items-center justify-between gap-3 text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-[#20262f]">
              Pending
            </span>
            <span className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400">
              No data yet — Upload operational and financial files to surface prioritized attention items.
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 opacity-80 group-hover:opacity-100">
            <span>Upload files</span>
            <UploadCloud className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>
    );
  }

  const alerts = [
    {
      area: 'Cash & Debt',
      areaColor: 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/20',
      headline: 'R1.15M working capital tied up pending sign-off',
      finding: findings[0] || null,
    },
    {
      area: 'Customers',
      areaColor: 'text-rose-800 dark:text-rose-300 bg-rose-500/10 border-rose-500/20',
      headline: 'One account is driving most peak-period cost exposure',
      finding: findings[1] || null,
    },
    {
      area: 'Operations',
      areaColor: 'text-sky-800 dark:text-sky-300 bg-sky-500/10 border-sky-500/20',
      headline: 'Solar underperformance increased grid purchases',
      finding: findings[2] || null,
    },
  ];

  return (
    <section id="what-needs-attention-section" className="my-5">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          What Needs Your Attention
        </h2>
      </div>

      <div className="rounded-xl border bg-white dark:bg-[#181c20] border-stone-200/90 dark:border-[#262c34] divide-y divide-stone-100 dark:divide-[#242a32] shadow-xs">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            id={`attention-alert-row-${idx}`}
            className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/70 dark:hover:bg-[#1e2329] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 border ${alert.areaColor}`}
              >
                {alert.area}
              </span>

              <span className="text-xs sm:text-[13px] font-medium text-stone-800 dark:text-stone-200 truncate">
                {alert.headline}
              </span>
            </div>

            {alert.finding && (
              <button
                onClick={() => onInvestigate(alert.finding!)}
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 shrink-0 transition cursor-pointer px-2 py-1 rounded-md hover:bg-stone-100 dark:hover:bg-[#262c35]"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
