import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Loader2,
  ArrowRight,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

export type FileProcessingState =
  | 'Uploading'
  | 'Processing'
  | 'Processed'
  | 'Needs Review'
  | 'Failed';

export interface ProcessedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  state: FileProcessingState;
  updatedAreas: string[];
}

interface UploadFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesProcessed: (files: ProcessedFileItem[]) => void;
}

const defaultPackage: { name: string; size: string; type: string; updatedAreas: string[] }[] = [
  {
    name: 'General_Ledger.xlsx',
    size: '2.4 MB',
    type: 'XLSX',
    updatedAreas: ['Revenue', 'Operating Profit', 'Operating Expenses', 'Financial View'],
  },
  {
    name: 'Customer_Invoices.xlsx',
    size: '3.1 MB',
    type: 'XLSX',
    updatedAreas: ['Revenue', 'Customer Billings', 'Debtor Days', 'Customers View'],
  },
  {
    name: 'Bank_Transactions.xlsx',
    size: '1.9 MB',
    type: 'XLSX',
    updatedAreas: ['Liquid Cash', 'Cash Runway', 'Debt Servicing', 'Cash & Debt View'],
  },
  {
    name: 'Hourly_Energy_Operations.xlsx',
    size: '4.8 MB',
    type: 'XLSX',
    updatedAreas: ['Solar Yield', 'Battery Dispatch', 'Diesel Generator Fuel', 'Energy View'],
  },
];

export const UploadFilesModal: React.FC<UploadFilesModalProps> = ({
  isOpen,
  onClose,
  onFilesProcessed,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [filesQueue, setFilesQueue] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allFinished, setAllFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const startProcessingQueue = (
    items: { name: string; size: string; type: string; updatedAreas?: string[] }[]
  ) => {
    setIsProcessing(true);
    setAllFinished(false);

    const initial: ProcessedFileItem[] = items.map((f, i) => ({
      id: `proc-${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type,
      state: 'Uploading',
      updatedAreas:
        f.updatedAreas || [
          'Revenue',
          'Operating Profit',
          'Executive Overview',
          'Financial View',
        ],
    }));

    setFilesQueue(initial);

    // Step 1: Uploading -> Processing
    setTimeout(() => {
      setFilesQueue((prev) =>
        prev.map((item) => ({ ...item, state: 'Processing' }))
      );

      // Step 2: Processing -> Processed
      setTimeout(() => {
        setFilesQueue((prev) =>
          prev.map((item) => ({
            ...item,
            state: 'Processed',
          }))
        );
        setIsProcessing(false);
        setAllFinished(true);
      }, 900);
    }, 600);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        updatedAreas: ['Financial View', 'Operating Profit', 'Revenue'],
      }));
      startProcessingQueue(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files).map((f: File) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        updatedAreas: ['Financial View', 'Operating Profit', 'Revenue'],
      }));
      startProcessingQueue(dropped);
    } else {
      startProcessingQueue(defaultPackage);
    }
  };

  const handleApplyToSystem = () => {
    onFilesProcessed(filesQueue);
    onClose();
    setFilesQueue([]);
    setAllFinished(false);
  };

  const handleResetModal = () => {
    setFilesQueue([]);
    setIsProcessing(false);
    setAllFinished(false);
  };

  return (
    <div
      id="upload-files-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="upload-files-modal-panel"
        className="w-full max-w-xl bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] p-6 sm:p-7 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-upload-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 block mb-1">
            Data Provenance & Ingestion
          </span>
          <h2 className="font-editorial text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Upload Business Documents — Demo
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Demo only: selected file names illustrate the upload workflow. File contents are not read or uploaded, and completing this flow loads fictional sample data.
          </p>
        </div>

        {/* Drag & drop upload area */}
        {filesQueue.length === 0 && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20'
                  : 'border-stone-200 dark:border-[#2a323c] hover:border-stone-400 dark:hover:border-stone-500 bg-stone-50/60 dark:bg-[#14171a]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                accept=".xlsx,.xls,.csv,.pdf"
                className="hidden"
              />

              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-[#20262f] text-stone-700 dark:text-stone-300 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>

              <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                Drag and drop company spreadsheets here, or{' '}
                <span className="text-blue-700 dark:text-blue-400 underline font-semibold">
                  browse files
                </span>
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                Supports Excel (.xlsx, .xls) and CSV (.csv) trial balances, registers & telemetry
              </p>
            </div>

            {/* Quick action: Load September 2026 Company Package */}
            <div className="p-4 rounded-xl border border-stone-200/90 dark:border-[#2b333e] bg-stone-50/60 dark:bg-[#161a1f] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Ready Package: September 2026 Demo Company
                </span>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  4 files · 12.2 MB
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Includes General_Ledger.xlsx, Customer_Invoices.xlsx, Bank_Transactions.xlsx, and Hourly_Energy_Operations.xlsx.
              </p>
              <button
                type="button"
                onClick={() => startProcessingQueue(defaultPackage)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer mt-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
                <span>Process September 2026 Datasets</span>
              </button>
            </div>
          </div>
        )}

        {/* Processing State & Detailed Business Area Updates */}
        {filesQueue.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 pb-1 border-b border-stone-100 dark:border-[#22272e]">
              <span>
                {isProcessing ? 'Ingesting & Validating Files...' : 'Processing Complete'}
              </span>
              <span className="font-mono-numbers">
                {filesQueue.filter((f) => f.state === 'Processed').length} / {filesQueue.length}
              </span>
            </div>

            {filesQueue.map((file) => (
              <div
                key={file.id}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#14171a] border border-stone-200/80 dark:border-[#262d36] text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-mono font-medium text-stone-900 dark:text-stone-100 truncate">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono-numbers">
                      {file.size}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {file.state === 'Uploading' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading
                      </span>
                    )}
                    {file.state === 'Processing' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing
                      </span>
                    )}
                    {file.state === 'Processed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Simulation complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Updated Business Areas Breakdown */}
                {file.state === 'Processed' && (
                  <div className="pt-2 border-t border-stone-200/50 dark:border-[#202630] space-y-1">
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                      Updated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {file.updatedAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[11px] font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-[#1f252f] px-2 py-0.5 rounded-md border border-stone-200/80 dark:border-[#2e3744]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {allFinished && (
              <div className="pt-3 space-y-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-800 dark:text-emerald-300 text-center">
                  All 4 business records parsed without structural errors. Financial and operational models ready to update.
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetModal}
                    className="flex-1 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#222831] cursor-pointer"
                  >
                    Upload Other Files
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyToSystem}
                    className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Build & Open Business View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
