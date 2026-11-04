import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  MessageSquare,
  ChevronDown,
  FileCode,
  Printer,
} from 'lucide-react';

interface PageHeaderActionsProps {
  pageTitle: string;
  pageContext: string;
  onOpenSource?: () => void;
  onOpenIntelligence?: (pageContext: string) => void;
  onExport?: (format: 'excel' | 'csv' | 'pdf') => void;
  sourceLabel?: string;
  sourceFileHint?: string;
}

export const PageHeaderActions: React.FC<PageHeaderActionsProps> = ({
  pageTitle,
  pageContext,
  onOpenSource,
  onOpenIntelligence,
  onExport,
  sourceLabel = 'Source',
  sourceFileHint,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    }
    if (isExportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportOpen]);

  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap">
      {/* 1. Source Traceability Access */}
      {onOpenSource && (
        <button
          type="button"
          onClick={onOpenSource}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/90 dark:bg-[#1f242c] hover:bg-stone-200/70 dark:hover:bg-[#28303a] border border-stone-200/80 dark:border-[#2b333d] transition cursor-pointer"
          title={sourceFileHint ? `Inspect and edit source data file: ${sourceFileHint}` : 'Inspect and edit source data file'}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{sourceLabel}</span>
        </button>
      )}

      {/* 2. Export Dropdown (Excel, CSV, PDF) */}
      {onExport && (
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/80 dark:bg-[#1f242c] hover:bg-stone-200/70 dark:hover:bg-[#28303a] border border-stone-200/80 dark:border-[#2b333d] transition cursor-pointer"
            title="Export page or table data"
          >
            <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-[#1c2229] border border-stone-200 dark:border-[#2e3744] shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-stone-600 dark:text-stone-400 tracking-wider">
                Export Format
              </div>
              <button
                type="button"
                onClick={() => {
                  onExport('excel');
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#262f3b] cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Excel Spreadsheet (.xls)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('csv');
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#262f3b] cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>CSV File (.csv)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onExport('pdf');
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#262f3b] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Printable View / PDF</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Cova Intelligence Chat Access with Inherited Context */}
      {onOpenIntelligence && (
        <button
          type="button"
          onClick={() => onOpenIntelligence(pageContext)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition cursor-pointer shadow-xs whitespace-nowrap"
          title={`Ask Cova with Context: ${pageContext}`}
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white text-white" />
          <span>Ask Cova</span>
        </button>
      )}
    </div>
  );
};
