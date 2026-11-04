import React from 'react';
import { DataSourceFile, FreshnessState } from '../types';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  UploadCloud,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface DataSourcesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dataSources: DataSourceFile[];
  hasUploadedFiles: boolean;
  onOpenSpreadsheet: (filename: string) => void;
  onOpenUpload: () => void;
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({
  isOpen,
  onClose,
  dataSources,
  hasUploadedFiles,
  onOpenSpreadsheet,
  onOpenUpload,
}) => {
  if (!isOpen) return null;

  const categories: ('Financial' | 'Customers' | 'Energy')[] = [
    'Financial',
    'Customers',
    'Energy',
  ];

  const getFreshnessBadge = (status: FreshnessState) => {
    switch (status) {
      case 'Current':
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Current
          </span>
        );
      case 'Update Soon':
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Update Soon
          </span>
        );
      case 'Out of Date':
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            Out of Date
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-[#252b33] px-2 py-0.5 rounded-md">
            <HelpCircle className="w-3 h-3" />
            Missing
          </span>
        );
    }
  };

  const getSheetIdFromFilename = (filename: string): string => {
    if (filename.includes('Invoices')) return 'sheet-invoices';
    if (filename.includes('General_Ledger')) return 'sheet-gl';
    if (filename.includes('Bank')) return 'sheet-bank';
    if (filename.includes('Energy')) return 'sheet-energy';
    return 'sheet-gl';
  };

  return (
    <div
      id="data-sources-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="data-sources-modal-panel"
        className="w-full max-w-2xl bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] p-6 sm:p-7 relative max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-data-sources-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4 pb-3 border-b border-stone-100 dark:border-[#22272e]">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="font-editorial text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Uploaded Data Sources
            </h2>
          </div>
          <p className="text-sm sm:text-sm text-stone-500 dark:text-stone-400">
            Visible and traceable files feeding the Cova operational & financial engine.
          </p>
        </div>

        {/* Content */}
        {!hasUploadedFiles ? (
          <div className="py-12 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#222832] flex items-center justify-center text-stone-400 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
              No files uploaded yet
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-4">
              The system currently has no ingested business files. Upload company records to calculate revenue, profit, cash, and energy telemetry.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Business Files</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            {categories.map((cat) => {
              const files = dataSources.filter((f) => f.category === cat);
              return (
                <div key={cat} className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-1">
                    <span>{cat} Records</span>
                    <span className="text-sm font-normal lowercase">
                      {files.filter((f) => f.status === 'Current').length} / {files.length} current
                    </span>
                  </div>

                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-xl border border-stone-200/80 dark:border-[#262c34] bg-stone-50/50 dark:bg-[#14171a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-[#1a2026] transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-sm font-mono font-semibold text-stone-900 dark:text-stone-100">
                              {file.name}
                            </span>
                            {getFreshnessBadge(file.status)}
                          </div>

                          <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-1">
                            {file.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-400 dark:text-stone-400 pt-0.5">
                            <span>Last updated: {file.lastUpdated}</span>
                            <span>·</span>
                            <span>Feeds: {file.feedsAreas.join(', ')}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/40 dark:border-[#22272e]">
                          {file.isMissing ? (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenUpload();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition cursor-pointer"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload file</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenSpreadsheet(getSheetIdFromFilename(file.name));
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1c222a] border border-stone-200 dark:border-[#2c3542] hover:bg-stone-100 dark:hover:bg-[#252c36] transition cursor-pointer"
                            >
                              <span>Inspect</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info & Upload button */}
        {hasUploadedFiles && (
          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-[#22272e] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-500 dark:text-stone-400">
            <span>Simple by default. Verifiable on demand.</span>
            <button
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload additional files</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
