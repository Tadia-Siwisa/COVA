import React, { useState } from 'react';
import { SourceMetricInspection } from '../types';
import {
  X,
  FileSpreadsheet,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  Calendar,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface MetricSourceModalProps {
  inspection: SourceMetricInspection | null;
  onClose: () => void;
  onOpenSpreadsheet: (sheetId: string, highlightRowIds?: string[]) => void;
}

export const MetricSourceModal: React.FC<MetricSourceModalProps> = ({
  inspection,
  onClose,
  onOpenSpreadsheet,
}) => {
  const [showLineage, setShowLineage] = useState(false);

  if (!inspection) return null;

  return (
    <div
      id="metric-source-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="metric-source-modal-panel"
        className="w-full max-w-lg bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-source-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Source & Calculation Trace</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-editorial text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {inspection.metricName}
            </h2>
            <span className="font-mono-numbers text-xl font-bold text-stone-900 dark:text-stone-100">
              {inspection.metricValue}
            </span>
          </div>
        </div>

        {/* Source Files Used */}
        <div className="mb-4 p-3.5 rounded-xl bg-stone-50 dark:bg-[#14171a] border border-stone-200/70 dark:border-[#242a32] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            <span>Calculated From</span>
            <span className="flex items-center gap-1 text-stone-400 lowercase font-normal">
              <Calendar className="w-3 h-3" />
              {inspection.period}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {inspection.filesUsed.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white dark:bg-[#1c222a] border border-stone-200/60 dark:border-[#2a333f]"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-mono text-stone-800 dark:text-stone-200 font-medium">
                    {file}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                  Verified
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400">
            <strong className="text-stone-700 dark:text-stone-300">Fields used:</strong>{' '}
            {inspection.fieldsUsed.join(', ')}
          </div>
        </div>

        {/* Calculation Breakdown */}
        <div className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            How It Was Calculated
          </div>

          <div className="rounded-xl border border-stone-200/80 dark:border-[#262c34] divide-y divide-stone-100 dark:divide-[#242a32] overflow-hidden text-xs bg-white dark:bg-[#181c20]">
            {inspection.formulaItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 ${
                  item.isResult
                    ? 'bg-stone-50 dark:bg-[#1e232b] font-semibold text-stone-900 dark:text-stone-100'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.sign && (
                    <span className="w-4 text-center font-mono font-bold text-stone-400 dark:text-stone-500">
                      {item.sign}
                    </span>
                  )}
                  <span>{item.label}</span>
                </div>
                <span className="font-mono-numbers font-medium">{item.amount}</span>
              </div>
            ))}
          </div>

          {inspection.formulaNote && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed italic">
              {inspection.formulaNote}
            </p>
          )}
        </div>

        {/* Optional Data Lineage Toggle */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowLineage(!showLineage)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-medium cursor-pointer"
          >
            <GitCommit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{showLineage ? 'Hide Data Lineage Chain' : 'View Full Data Lineage Chain'}</span>
          </button>

          {showLineage && (
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-[#14171a] border border-stone-200/70 dark:border-[#262c34] text-xs space-y-2 animate-in fade-in duration-100">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-[#222831] flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-400 shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">Source Files:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">
                    {inspection.filesUsed.join(' and ')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-[#222831] flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-400 shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">Source Rows:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">
                    {inspection.highlightExplanation}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-[#222831] flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-400 shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">Calculated Metric:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400 font-mono-numbers">
                    {inspection.metricName} = {inspection.metricValue}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-[#222831] flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-400 shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">LLM Interpretation:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">
                    Supplied directly to Cova Intelligence decision-support context.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: Inspect in Spreadsheet */}
        <div className="pt-2 flex items-center gap-2">
          <button
            id="inspect-source-spreadsheet-btn"
            onClick={() => {
              onClose();
              onOpenSpreadsheet(inspection.targetSheetId, inspection.highlightRowIds);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs sm:text-sm hover:bg-stone-800 dark:hover:bg-white shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Inspect Underlying Source Data</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
