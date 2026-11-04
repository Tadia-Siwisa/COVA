import React, { useState, useEffect, useRef } from 'react';
import {
  SpreadsheetTable,
  SpreadsheetRow,
  CorrectionAuditItem,
} from '../types';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';
import {
  X,
  FileSpreadsheet,
  Edit3,
  Check,
  RotateCcw,
  History,
  Filter,
  CheckCircle2,
  Info,
  Search,
  Plus,
  Trash2,
  Download,
  Calculator,
  ChevronDown,
} from 'lucide-react';

interface SourceSpreadsheetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheets: SpreadsheetTable[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  highlightRowIds?: string[];
  inspectingMetricName?: string;
  onSaveFile: (
    sheetId: string,
    updatedRows: SpreadsheetRow[],
    audits: CorrectionAuditItem[],
    updatedTotalRow?: Record<string, string | number>
  ) => void;
  onCorrectValue?: (audit: CorrectionAuditItem) => void;
  auditHistory: CorrectionAuditItem[];
}

export const SourceSpreadsheetViewerModal: React.FC<SourceSpreadsheetViewerModalProps> = ({
  isOpen,
  onClose,
  sheets,
  activeSheetId,
  onSelectSheet,
  highlightRowIds = [],
  inspectingMetricName,
  onSaveFile,
  onCorrectValue,
  auditHistory,
}) => {
  // Current active sheet
  const currentSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

  // Whole-file edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftRows, setDraftRows] = useState<SpreadsheetRow[]>([]);
  const [draftTotalRow, setDraftTotalRow] = useState<Record<string, string | number> | undefined>(undefined);
  const [activeCell, setActiveCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [derivedExplanation, setDerivedExplanation] = useState<{ label: string; formula: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Synchronize draft rows whenever currentSheet changes or edit mode toggles
  useEffect(() => {
    if (currentSheet) {
      // Deep clone rows to draft
      setDraftRows(
        currentSheet.rows.map((r) => ({
          ...r,
          cells: { ...r.cells },
          originalCells: r.originalCells ? { ...r.originalCells } : { ...r.cells },
        }))
      );
      setDraftTotalRow(currentSheet.totalRow ? { ...currentSheet.totalRow } : undefined);
      setIsEditMode(false);
      setActiveCell(null);
      setDerivedExplanation(null);
    }
  }, [currentSheet?.id]);

  // Close export dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  if (!isOpen || !currentSheet) return null;

  // Check which cells in draft differ from original
  const getModifiedCount = () => {
    let count = 0;
    draftRows.forEach((draftRow) => {
      const originalRow = currentSheet.rows.find((r) => r.id === draftRow.id);
      if (!originalRow) {
        // Newly added row
        count += Object.keys(draftRow.cells).length;
      } else {
        Object.keys(draftRow.cells).forEach((colKey) => {
          const originalVal = originalRow.cells[colKey];
          const draftVal = draftRow.cells[colKey];
          if (String(originalVal ?? '').trim() !== String(draftVal ?? '').trim()) {
            count++;
          }
        });
      }
    });
    return count;
  };

  const handleStartEditFile = () => {
    setIsEditMode(true);
    setDerivedExplanation(null);
  };

  const handleCancelEdit = () => {
    // Revert draft to currentSheet
    setDraftRows(
      currentSheet.rows.map((r) => ({
        ...r,
        cells: { ...r.cells },
        originalCells: r.originalCells ? { ...r.originalCells } : { ...r.cells },
      }))
    );
    setDraftTotalRow(currentSheet.totalRow ? { ...currentSheet.totalRow } : undefined);
    setIsEditMode(false);
    setActiveCell(null);
    setDerivedExplanation(null);
  };

  const handleCellChange = (rowId: string, colKey: string, value: string) => {
    setDraftRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          cells: {
            ...row.cells,
            [colKey]: value,
          },
        };
      })
    );
  };

  const handleAddRow = () => {
    const newRowNumber = draftRows.length + 2;
    const newRowId = `new-row-${Date.now()}`;
    const initialCells: Record<string, string | number> = {};

    currentSheet.columns.forEach((col) => {
      if (col.key === 'invoiceNo') initialCells[col.key] = `INV-2026-${String(newRowNumber + 80).padStart(3, '0')}`;
      else if (col.key === 'accountCode') initialCells[col.key] = '4900';
      else if (col.key === 'status') initialCells[col.key] = 'Active';
      else if (col.key === 'date') initialCells[col.key] = new Date().toISOString().split('T')[0];
      else initialCells[col.key] = '';
    });

    const newRow: SpreadsheetRow = {
      id: newRowId,
      rowNumber: newRowNumber,
      cells: initialCells,
      isModified: true,
      originalCells: { ...initialCells },
    };

    setDraftRows((prev) => [...prev, newRow]);
    setActiveCell({ rowId: newRowId, colKey: currentSheet.columns[0]?.key || 'name' });
  };

  const handleDeleteRow = (rowId: string) => {
    setDraftRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleSaveChanges = () => {
    const generatedAudits: CorrectionAuditItem[] = [];
    const updatedRows: SpreadsheetRow[] = [];

    draftRows.forEach((draftRow) => {
      const originalRow = currentSheet.rows.find((r) => r.id === draftRow.id);
      let isRowModified = false;
      const preservedOriginals: Record<string, string | number> = originalRow
        ? { ...originalRow.cells }
        : { ...draftRow.cells };

      if (!originalRow) {
        // New record added
        isRowModified = true;
        generatedAudits.push({
          id: `audit-add-${Date.now()}-${draftRow.id}`,
          sheetId: currentSheet.id,
          sheetName: currentSheet.filename,
          rowId: draftRow.id,
          fieldKey: 'entire_row',
          fieldLabel: `New Record (Row ${draftRow.rowNumber})`,
          originalValue: '[New Row Inserted]',
          correctedValue: String(draftRow.cells.client || draftRow.cells.name || draftRow.cells.accountName || 'Record'),
          updatedBy: 'User (Owner)',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          impactDescription: `Inserted new row into ${currentSheet.filename}`,
        });
      } else {
        // Compare each column
        currentSheet.columns.forEach((col) => {
          const originalVal = originalRow.cells[col.key];
          const draftVal = draftRow.cells[col.key];

          if (String(originalVal ?? '').trim() !== String(draftVal ?? '').trim()) {
            isRowModified = true;
            generatedAudits.push({
              id: `audit-cell-${Date.now()}-${draftRow.id}-${col.key}`,
              sheetId: currentSheet.id,
              sheetName: currentSheet.filename,
              rowId: draftRow.id,
              fieldKey: col.key,
              fieldLabel: `${col.label} (Row ${draftRow.rowNumber})`,
              originalValue: originalVal ?? '',
              correctedValue: draftVal ?? '',
              updatedBy: 'User (Owner)',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              impactDescription: `Updated ${col.label} from "${originalVal ?? ''}" to "${draftVal ?? ''}"`,
            });
          }
        });
      }

      updatedRows.push({
        ...draftRow,
        isModified: isRowModified || Boolean(draftRow.isModified),
        originalCells: preservedOriginals,
      });
    });

    // Check for deleted rows
    currentSheet.rows.forEach((origRow) => {
      if (!draftRows.some((r) => r.id === origRow.id)) {
        generatedAudits.push({
          id: `audit-del-${Date.now()}-${origRow.id}`,
          sheetId: currentSheet.id,
          sheetName: currentSheet.filename,
          rowId: origRow.id,
          fieldKey: 'row_deleted',
          fieldLabel: `Deleted Row (Row ${origRow.rowNumber})`,
          originalValue: String(origRow.cells.client || origRow.cells.accountName || origRow.cells.name || 'Row'),
          correctedValue: '[Deleted]',
          updatedBy: 'User (Owner)',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          impactDescription: `Deleted row ${origRow.rowNumber} from ${currentSheet.filename}`,
        });
      }
    });

    // Call save handler
    onSaveFile(currentSheet.id, updatedRows, generatedAudits, draftTotalRow);

    // Confirmation message specified by user: "Changes saved. Business views updated."
    setToastMessage('Changes saved. Business views updated.');
    setIsEditMode(false);
    setActiveCell(null);
    setDerivedExplanation(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleExportSheet = (format: 'excel' | 'csv') => {
    const exportColumns = currentSheet.columns.map((c) => ({
      key: c.key,
      label: c.label,
    }));
    const dataRows = (isEditMode ? draftRows : currentSheet.rows).map((r) => r.cells);
    const filename = currentSheet.filename.replace('.xlsx', '').replace('.csv', '');

    if (format === 'csv') {
      exportToCSV(`${filename}_working_data`, exportColumns, dataRows);
    } else {
      exportToExcel(`${filename}_working_data`, exportColumns, dataRows);
    }
    setIsExportMenuOpen(false);
  };

  // Filter rows based on search and highlight filters
  const rowsToDisplay = isEditMode ? draftRows : currentSheet.rows;
  const filteredRows = rowsToDisplay.filter((row) => {
    if (showOnlyHighlighted && highlightRowIds.length > 0) {
      if (!highlightRowIds.includes(row.id) && !row.isHighlighted) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row.cells).some((val) => String(val).toLowerCase().includes(q));
  });

  const modifiedCellCount = isEditMode ? getModifiedCount() : 0;

  return (
    <div
      id="spreadsheet-viewer-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="spreadsheet-viewer-panel"
        className="w-full max-w-6xl h-[92vh] max-h-[880px] bg-[#fcfcfb] dark:bg-[#14171a] text-stone-900 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200/90 dark:border-[#262c34] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar: Clean spreadsheet toolbar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-200/80 dark:border-[#22272e] bg-white dark:bg-[#181c20]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 font-mono truncate">
                  {currentSheet.filename}
                </h2>
                <span className="text-sm px-2 py-0.5 rounded-md font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  {currentSheet.freshness}
                </span>
                {isEditMode && (
                  <span className="text-sm px-2 py-0.5 rounded-md font-semibold text-blue-800 dark:text-blue-300 bg-blue-500/15 border border-blue-500/30 animate-pulse">
                    Edit File Active
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                {currentSheet.title} · Editable system of record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Action: Edit File / Save Changes / Cancel */}
            {!isEditMode ? (
              <button
                type="button"
                id="edit-file-btn"
                onClick={handleStartEditFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 dark:bg-emerald-400 dark:hover:bg-emerald-300 transition cursor-pointer shadow-xs"
                title="Activate multi-cell spreadsheet editing across the entire file"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit File</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#202630] p-1 rounded-xl border border-stone-200 dark:border-[#2e3744]">
                <button
                  type="button"
                  id="save-changes-btn"
                  onClick={handleSaveChanges}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer shadow-xs"
                  title="Save all changes and recalculate dependent business metrics"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes {modifiedCellCount > 0 ? `(${modifiedCellCount})` : ''}</span>
                </button>
                <button
                  type="button"
                  id="cancel-edit-btn"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
                  title="Discard pending cell edits"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-[#2a3442] transition cursor-pointer"
                  title="Add a new row to this spreadsheet"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-500" />
                  <span>Add Row</span>
                </button>
              </div>
            )}

            {/* Export File dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                type="button"
                id="source-export-btn"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/90 dark:bg-[#1f242c] hover:bg-stone-200/70 dark:hover:bg-[#28303a] border border-stone-200/80 dark:border-[#2b333d] transition cursor-pointer"
                title="Export current working version of this spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                <span className="hidden sm:inline">Export File</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-[#1c2229] border border-stone-200 dark:border-[#2e3744] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-sm uppercase font-semibold text-stone-500 dark:text-stone-400 tracking-wider">
                    Working File Export
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExportSheet('excel')}
                    className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#262f3b] cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Excel (.xls)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportSheet('csv')}
                    className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#262f3b] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Audit History Drawer Button */}
            <button
              id="toggle-audit-panel-btn"
              onClick={() => setShowAuditPanel(!showAuditPanel)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium border transition cursor-pointer ${
                showAuditPanel || auditHistory.length > 0
                  ? 'bg-blue-50 dark:bg-[#131d2a] text-blue-800 dark:text-blue-300 border-blue-300 dark:border-[#1d3049]'
                  : 'bg-white dark:bg-[#1c222a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#2a333f] hover:bg-stone-50'
              }`}
              title="Inspect cell modification audit trail"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Audit Trail</span>
              {auditHistory.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {auditHistory.length}
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              id="close-spreadsheet-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sheet Tabs & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2 border-b border-stone-200/80 dark:border-[#22272e] bg-stone-50/80 dark:bg-[#15181c]">
          {/* File Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {sheets.map((sheet) => {
              const isActive = sheet.id === currentSheet.id;
              return (
                <button
                  key={sheet.id}
                  onClick={() => onSelectSheet(sheet.id)}
                  className={`px-3 py-1.5 text-sm font-mono font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-[#20262f] text-stone-900 dark:text-stone-100 shadow-2xs border border-stone-200/90 dark:border-[#2e3744]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-[#1a2027]'
                  }`}
                >
                  <FileSpreadsheet className="w-3 h-3 text-stone-400" />
                  <span>{sheet.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {highlightRowIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowOnlyHighlighted(!showOnlyHighlighted)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium border transition cursor-pointer ${
                  showOnlyHighlighted
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-semibold'
                    : 'bg-white dark:bg-[#1c222a] text-stone-600 dark:text-stone-400 border-stone-200 dark:border-[#2a333f]'
                }`}
              >
                <Filter className="w-3 h-3" />
                <span>
                  Used in {inspectingMetricName || 'Metric'} ({highlightRowIds.length})
                </span>
              </button>
            )}

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cells..."
                className="w-full bg-white dark:bg-[#1a2027] text-stone-800 dark:text-stone-200 placeholder-stone-400 pl-7 pr-2.5 py-1 rounded-md border border-stone-200 dark:border-[#2a333f] text-sm focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>
        </div>

        {/* Source Traceability gentle highlight notice */}
        {highlightRowIds.length > 0 && (
          <div className="px-4 sm:px-6 py-2 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-sm text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                Gentle highlights indicate rows contributing to{' '}
                <strong className="font-semibold text-blue-950 dark:text-blue-100">
                  {inspectingMetricName || 'the inspected calculation'}
                </strong>
                . You can inspect or edit any record across the entire file.
              </span>
            </div>
            {showOnlyHighlighted && (
              <button
                onClick={() => setShowOnlyHighlighted(false)}
                className="text-sm underline font-medium hover:text-blue-950 dark:hover:text-blue-100 cursor-pointer ml-2 shrink-0"
              >
                Show All Rows
              </button>
            )}
          </div>
        )}

        {/* Derived Formula Bar (appears when a derived/calculated cell or total is clicked) */}
        {derivedExplanation && (
          <div className="px-4 sm:px-6 py-2 bg-blue-50/80 dark:bg-[#17202b] border-b border-blue-200/70 dark:border-[#273444] text-sm text-blue-900 dark:text-blue-200 flex items-center justify-between animate-in fade-in duration-100">
            <div className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="font-mono text-sm">
                <strong className="font-semibold text-blue-950 dark:text-blue-100 mr-1.5">
                  {derivedExplanation.label}:
                </strong>
                <span className="font-mono text-blue-800 dark:text-blue-300 bg-blue-100/60 dark:bg-[#1e2a3a] px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-[#2a3a4d]">
                  {derivedExplanation.formula}
                </span>
                <span className="ml-2 text-sm text-blue-700 dark:text-blue-400 font-sans italic">
                  (Derived / Calculated — Edit source component values to recalculate this figure)
                </span>
              </div>
            </div>
            <button
              onClick={() => setDerivedExplanation(null)}
              className="text-blue-500 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer ml-2 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Confirmation Banner: Exact requested confirmation "Changes saved. Business views updated." */}
        {toastMessage && (
          <div className="mx-4 sm:mx-6 my-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Workspace: Full Spreadsheet Grid & Optional Audit Drawer */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto bg-white dark:bg-[#121518]">
            <table className="w-full text-left border-collapse font-sans text-sm">
              {/* Spreadsheet Column Headers */}
              <thead className="sticky top-0 z-20 bg-stone-100 dark:bg-[#1c222a] border-b border-stone-200 dark:border-[#2a333f] shadow-2xs">
                <tr>
                  {/* Row Index Column */}
                  <th className="w-10 py-2.5 px-2 text-center font-mono text-sm text-stone-400 border-r border-stone-200 dark:border-[#2a333f] select-none bg-stone-100 dark:bg-[#1c222a]">
                    #
                  </th>

                  {currentSheet.columns.map((col) => {
                    const isDerivedCol = col.isDerived;
                    return (
                      <th
                        key={col.key}
                        className={`py-2 px-3 text-sm font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider border-r border-stone-200/70 dark:border-[#28313c] ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span>{col.label}</span>
                          {isDerivedCol ? (
                            <button
                              type="button"
                              onClick={() =>
                                setDerivedExplanation({
                                  label: col.label,
                                  formula: col.formulaExplanation || 'Calculated formula from other accounts',
                                })
                              }
                              className="text-sm font-mono lowercase tracking-normal text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1 py-0.2 rounded border border-blue-200/60 dark:border-blue-800/40 cursor-pointer"
                              title="Click to view derivation formula"
                            >
                              fx derived
                            </button>
                          ) : isEditMode ? (
                            <span className="text-sm font-normal lowercase tracking-normal text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                              editable
                            </span>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}

                  {/* Actions Column in Edit Mode */}
                  {isEditMode && (
                    <th className="w-14 py-2 px-2 text-center text-sm font-semibold text-stone-400 uppercase tracking-wider">
                      Row
                    </th>
                  )}
                </tr>
              </thead>

              {/* Data Rows */}
              <tbody className="divide-y divide-stone-100 dark:divide-[#1f252d]">
                {filteredRows.map((row) => {
                  const isRowHighlighted =
                    highlightRowIds.includes(row.id) || (row.isHighlighted && highlightRowIds.length === 0);

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors group ${
                        isRowHighlighted
                          ? 'bg-blue-50/60 dark:bg-blue-950/25 hover:bg-blue-100/60 dark:hover:bg-blue-950/40'
                          : row.isModified
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/15 hover:bg-emerald-50/60'
                          : 'hover:bg-stone-50/80 dark:hover:bg-[#181d24]'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-2 px-2 text-center font-mono text-sm text-stone-400 dark:text-stone-600 border-r border-stone-200/60 dark:border-[#242b35] select-none bg-stone-50/40 dark:bg-[#15191e]">
                        {row.rowNumber}
                      </td>

                      {/* Cells */}
                      {currentSheet.columns.map((col) => {
                        const cellVal = String(row.cells[col.key] ?? '');
                        const originalVal = row.originalCells?.[col.key];
                        const wasModified = originalVal !== undefined && String(originalVal) !== cellVal;
                        const isDerived = col.isDerived || row.isDerived || row.isTotal;
                        const isActive = activeCell?.rowId === row.id && activeCell?.colKey === col.key;

                        return (
                          <td
                            key={col.key}
                            onClick={() => {
                              setActiveCell({ rowId: row.id, colKey: col.key });
                              if (isDerived) {
                                setDerivedExplanation({
                                  label: `${row.cells.item || row.cells.accountName || row.cells.name || 'Row'} - ${col.label}`,
                                  formula:
                                    row.formulaExplanation ||
                                    col.formulaExplanation ||
                                    'Derived calculation based on component line items.',
                                });
                              }
                            }}
                            className={`py-1.5 px-2.5 border-r border-stone-200/40 dark:border-[#202731] relative transition-all ${
                              col.align === 'right' ? 'text-right font-mono-numbers' : ''
                            } ${
                              isActive
                                ? 'ring-2 ring-emerald-500/90 dark:ring-emerald-400 bg-emerald-50/20 z-10'
                                : ''
                            } ${isDerived ? 'bg-stone-50/40 dark:bg-[#161a20]/40' : ''}`}
                          >
                            {isEditMode && !isDerived ? (
                              <input
                                type="text"
                                value={cellVal}
                                onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                                className={`w-full bg-transparent text-sm text-stone-900 dark:text-stone-100 focus:outline-none ${
                                  col.align === 'right' ? 'text-right font-mono-numbers' : ''
                                } ${wasModified ? 'font-semibold text-emerald-800 dark:text-emerald-300' : ''}`}
                              />
                            ) : (
                              <div className="flex items-center gap-1.5 justify-between">
                                <span
                                  className={`${
                                    isRowHighlighted && col.align === 'right'
                                      ? 'font-bold text-stone-900 dark:text-stone-100'
                                      : 'text-stone-800 dark:text-stone-200'
                                  }`}
                                >
                                  {cellVal}
                                </span>

                                {wasModified && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                                    title={`Modified from "${originalVal}"`}
                                  />
                                )}

                                {isDerived && (
                                  <span
                                    className="text-sm font-mono text-blue-500 opacity-60 hover:opacity-100 shrink-0 cursor-help"
                                    title="Click to view calculation breakdown"
                                  >
                                    fx
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Modified Cell Marker */}
                            {wasModified && (
                              <div
                                className="absolute top-0 right-0 w-0 h-0 border-t-4 border-r-4 border-t-emerald-500 border-r-emerald-500"
                                title={`Original value: ${originalVal}`}
                              />
                            )}
                          </td>
                        );
                      })}

                      {/* Row Delete in Edit Mode */}
                      {isEditMode && (
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-[#252c36] transition cursor-pointer"
                            title="Delete this row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Totals Row (Derived accounting total) */}
                {draftTotalRow && (
                  <tr
                    onClick={() =>
                      setDerivedExplanation({
                        label: 'Total Row',
                        formula: 'Calculated Sum of all column records: Σ(Rows 1 to N)',
                      })
                    }
                    className="bg-stone-100/90 dark:bg-[#1c222b] font-semibold border-t-2 border-stone-300 dark:border-[#2e3745] text-stone-900 dark:text-stone-100 cursor-pointer hover:bg-stone-200/50"
                  >
                    <td className="py-2.5 px-2 text-center font-mono text-sm text-stone-400 border-r border-stone-200 dark:border-[#2a333f]">
                      Σ
                    </td>
                    {currentSheet.columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-2.5 px-2.5 border-r border-stone-200/50 dark:border-[#28313c] ${
                          col.align === 'right' ? 'text-right font-mono-numbers' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1 justify-between">
                          <span>{String(draftTotalRow[col.key] ?? '')}</span>
                          <span className="text-sm font-mono text-blue-500 opacity-60">fx</span>
                        </div>
                      </td>
                    ))}
                    {isEditMode && <td />}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Audit Trail Drawer Sidebar */}
          {showAuditPanel && (
            <div className="w-80 border-l border-stone-200/80 dark:border-[#22272e] bg-stone-50/90 dark:bg-[#161a1f] flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right-4 duration-150">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-[#262d38]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                    Source Audit Log
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuditPanel(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {auditHistory.length === 0 ? (
                <div className="text-center py-8 text-sm text-stone-500 dark:text-stone-400">
                  <p>No user corrections logged yet.</p>
                  <p className="text-sm mt-1 text-stone-400">
                    Click &quot;Edit File&quot; above to correct records, insert new items, or fix billing figures.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#1d232c] border border-stone-200/80 dark:border-[#2b3442] text-sm shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
                        <span className="font-mono font-medium">{item.sheetName}</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {item.fieldLabel}
                      </div>
                      <div className="space-y-0.5 text-sm font-mono-numbers">
                        <div className="text-stone-400 line-through">
                          Original: {String(item.originalValue)}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          New Value: {String(item.correctedValue)}
                        </div>
                      </div>
                      <div className="pt-1 text-sm text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-[#262e3a] flex items-center justify-between">
                        <span>Updated by {item.updatedBy}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Recalculated</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Status Footer */}
        <div className="px-4 sm:px-6 py-2 border-t border-stone-200/80 dark:border-[#22272e] bg-stone-50 dark:bg-[#16191d] flex flex-wrap items-center justify-between text-sm text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-4">
            <span>
              Showing {filteredRows.length} of {rowsToDisplay.length} rows
            </span>
            <span>File: {currentSheet.filename}</span>
            {isEditMode && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                • {modifiedCellCount} cell(s) modified in current session
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="italic">
              Perspective at the top, control at the source
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
