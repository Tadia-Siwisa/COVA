import React from 'react';
import { AttentionFinding } from '../types';
import { ArrowRight, UploadCloud } from 'lucide-react';

interface AttentionSectionProps {
  findings: AttentionFinding[];
  hasUploadedFiles: boolean;
  onInvestigate: (finding: AttentionFinding) => void;
  onOpenUpload?: () => void;
}

// Short labels for the seeded case studies; detail always opens the original record.
const summaries: Record<string, { title: string; action: string }> = {
  'finding-1': { title: 'R1.15M awaiting sign-off', action: 'Paarl · Confirm municipal approval to release billing.' },
  'finding-2': { title: 'Protea margin fell to 11.2%', action: 'Review fuel pricing or additional battery storage.' },
  'finding-3': { title: 'R42,000 potential savings', action: 'Stellenbosch · Review shifting cooling to solar hours.' },
};

export const AttentionSection: React.FC<AttentionSectionProps> = ({ findings, hasUploadedFiles, onInvestigate, onOpenUpload }) => (
  <section id="what-needs-attention-section" className="my-6">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h2 className="text-base font-semibold text-stone-800 dark:text-stone-100">What needs your attention</h2>
      {hasUploadedFiles && <span className="text-sm text-stone-600 dark:text-stone-400">{findings.length} items · sample schedule</span>}
    </div>
    {!hasUploadedFiles ? (
      <button onClick={onOpenUpload} className="w-full p-5 rounded-xl border border-dashed border-stone-300 dark:border-stone-600 text-left text-base text-stone-600 dark:text-stone-300 flex items-center gap-3">
        <UploadCloud className="w-5 h-5 shrink-0" /> Load sample files to see attention items.
      </button>
    ) : (
      <div className="rounded-xl border border-stone-300 dark:border-[#38424e] bg-white dark:bg-[#1b222a] divide-y divide-stone-200 dark:divide-[#38424e] overflow-hidden">
        {findings.map((finding, idx) => {
          const summary = summaries[finding.id];
          const next = finding.timeline.find(item => item.status === 'pending');
          const styles = finding.severity === 'critical'
            ? 'text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-400/15'
            : finding.severity === 'watch'
              ? 'text-rose-800 bg-rose-100 dark:text-rose-200 dark:bg-rose-400/15'
              : 'text-sky-800 bg-sky-100 dark:text-sky-200 dark:bg-sky-400/15';
          return (
            <button key={finding.id} id={`attention-alert-row-${idx}`} onClick={() => onInvestigate(finding)} className="w-full p-4 sm:p-5 text-left flex items-center gap-4 hover:bg-stone-50 dark:hover:bg-[#252e39] transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <span className={`px-2 py-1 rounded-md text-sm font-semibold ${styles}`}>{finding.severity === 'critical' ? 'Priority' : finding.severity === 'watch' ? 'Watch' : 'Opportunity'}</span>
                  {next && <span className="text-sm text-stone-600 dark:text-stone-300">Scheduled: {next.date} 2026</span>}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">{summary?.title || finding.title}</h3>
                <p className="text-sm sm:text-base mt-1 leading-relaxed text-stone-600 dark:text-stone-300">{summary?.action || finding.metricImpact}</p>
              </div>
              <span className="shrink-0 text-blue-700 dark:text-blue-300 flex items-center gap-2"><span className="hidden sm:inline text-sm">View details</span><ArrowRight aria-hidden="true" className="w-5 h-5" /></span>
            </button>
          );
        })}
      </div>
    )}
  </section>
);
