import React from 'react';
import { AttentionFinding } from '../types';
import { X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttentionDrilldownModalProps {
  finding: AttentionFinding | null;
  onClose: () => void;
  onDiscussIssue: (finding: AttentionFinding) => void;
  onOpenActionPanel?: () => void;
}

export const AttentionDrilldownModal: React.FC<AttentionDrilldownModalProps> = ({
  finding,
  onClose,
  onDiscussIssue,
  onOpenActionPanel,
}) => {
  if (!finding) return null;

  // Map to linked Open Action if applicable
  const getLinkedAction = () => {
    if (finding.id === 'finding-1') {
      return { title: 'Finalise municipal sign-off', due: '18 Sep', area: 'Operations' };
    }
    if (finding.id === 'finding-2') {
      return { title: 'Review customer contract', due: '21 Sep', area: 'Customers' };
    }
    if (finding.id === 'finding-3') {
      return { title: 'Automate chiller load-shifting', due: '16 Sep', area: 'Energy' };
    }
    return null;
  };

  const linkedAction = getLinkedAction();

  return (
    <div
      id="attention-drilldown-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        id="attention-drilldown-panel"
        className="w-full max-w-lg bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-attention-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Section Tag */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
            Attention Item
          </span>
          {/* Issue */}
          <h2 className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
            {finding.title}
          </h2>
        </div>

        {/* Impact, Cause, Why it matters */}
        <div className="space-y-4 my-5 text-xs sm:text-sm">
          {/* Impact */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
              Impact
            </span>
            <p className="font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
              {finding.financialImpact} — {finding.metricImpact}
            </p>
          </div>

          {/* Cause */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
              Cause
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {finding.rootCause}
            </p>
          </div>

          {/* Why it matters */}
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
              Why It Matters
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {finding.context}
            </p>
          </div>
        </div>

        {/* Linked Open Action notice */}
        {linkedAction && (
          <div className="mb-5 p-3 rounded-xl bg-stone-100/70 dark:bg-[#1a2027] border border-stone-200/70 dark:border-[#2a333f] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-stone-600 dark:text-stone-400">
                Tracked in Open Actions:
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                {linkedAction.title}
              </span>
            </div>

            {onOpenActionPanel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenActionPanel();
                }}
                className="text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline shrink-0 cursor-pointer ml-1"
              >
                View Action →
              </button>
            )}
          </div>
        )}

        {/* Discuss this issue button */}
        <div className="pt-2">
          <button
            id="discuss-issue-btn"
            onClick={() => {
              onClose();
              onDiscussIssue(finding);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs sm:text-sm hover:bg-stone-800 dark:hover:bg-white shadow-xs transition cursor-pointer"
          >
            <span>Discuss this issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
