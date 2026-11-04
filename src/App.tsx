import React, { useState, useEffect } from 'react';
import {
  PerspectiveType,
  AttentionFinding,
  HighLevelMetric,
  OpenActionItem,
  DiscussTopicContext,
  SourceMetricInspection,
  SpreadsheetTable,
  SpreadsheetRow,
  CorrectionAuditItem,
  DataSourceFile,
  CustomerAccount,
  OperationalSite,
  PipelineOpportunity,
} from './types';
import {
  mockHighLevelMetrics,
  mockAttentionFindings,
  mockOpenActions,
  mockFinancialStatement,
  mockCustomers,
  mockOperationalSites,
  mockPipeline,
  FinancialStatementRow,
} from './data/mockBusinessData';
import {
  initialDataSources,
  initialSpreadsheets,
  metricInspectionData,
} from './data/sourceDataStore';
import { Navbar } from './components/Navbar';
import { MetricsRow } from './components/MetricsRow';
import { AttentionSection } from './components/AttentionSection';
import { RevenueCostStructure } from './components/RevenueCostStructure';
import { SimpleTrendChart } from './components/SimpleTrendChart';
import { BusinessSummary } from './components/BusinessSummary';
import { PerspectivesView } from './components/PerspectivesView';
import { MetricDrilldownModal } from './components/MetricDrilldownModal';
import { AttentionDrilldownModal } from './components/AttentionDrilldownModal';
import { OpenActionsPanel } from './components/OpenActionsPanel';
import { UploadFilesModal, ProcessedFileItem } from './components/UploadFilesModal';
import { DiscussConversationPage } from './components/DiscussConversationPage';
import { MetricSourceModal } from './components/MetricSourceModal';
import { SourceSpreadsheetViewerModal } from './components/SourceSpreadsheetViewerModal';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { PageHeaderActions } from './components/PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from './utils/exportUtils';
import { CheckCircle2, RotateCcw, UploadCloud, Check } from 'lucide-react';

const emptyMetrics: HighLevelMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: 'No data yet',
    change: '--',
    trend: 'neutral',
    secondaryContext: 'Upload files to build this view',
    perspective: 'financial',
    drilldownDetails: {
      title: 'Total Revenue Drilldown',
      narrative: 'Awaiting business files to calculate September 2026 revenue components.',
      components: [],
    },
  },
  {
    id: 'margin',
    label: 'Operating Profit',
    value: 'No data yet',
    change: '--',
    trend: 'neutral',
    secondaryContext: 'Upload files to build this view',
    perspective: 'financial',
    drilldownDetails: {
      title: 'Operating Profit Drilldown',
      narrative: 'Awaiting General Ledger and energy operational reports.',
      components: [],
    },
  },
  {
    id: 'cash',
    label: 'Liquid Cash',
    value: 'No data yet',
    change: '--',
    trend: 'neutral',
    secondaryContext: 'Upload files to build this view',
    perspective: 'cash_debt',
    drilldownDetails: {
      title: 'Liquid Cash Reserves Drilldown',
      narrative: 'Awaiting bank reconciliation registers.',
      components: [],
    },
  },
  {
    id: 'debt',
    label: 'Debt Obligations',
    value: 'No data yet',
    change: '--',
    trend: 'neutral',
    secondaryContext: 'Upload files to build this view',
    perspective: 'cash_debt',
    drilldownDetails: {
      title: 'Debt Obligations Drilldown',
      narrative: 'Awaiting senior debt amortization schedules.',
      components: [],
    },
  },
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('cova_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  // State: True empty state by default (Prompt Section 1)
  const [hasUploadedFiles, setHasUploadedFiles] = useState<boolean>(true);

  const [currentPerspective, setCurrentPerspective] = useState<PerspectiveType>('current_state');
  const [selectedFinding, setSelectedFinding] = useState<AttentionFinding | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<HighLevelMetric | null>(null);
  
  // Modals & Panels
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isOpenActionsOpen, setIsOpenActionsOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [inspectingMetricSource, setInspectingMetricSource] = useState<SourceMetricInspection | null>(null);
  const [isSpreadsheetOpen, setIsSpreadsheetOpen] = useState(false);
  const [activeSpreadsheetId, setActiveSpreadsheetId] = useState<string>('sheet-invoices');
  const [spreadsheetHighlightRowIds, setSpreadsheetHighlightRowIds] = useState<string[]>([]);
  
  // Intelligence conversation page
  const [isDiscussOpen, setIsDiscussOpen] = useState(false);
  const [discussContext, setDiscussContext] = useState<DiscussTopicContext | null>(null);

  // Business and spreadsheet data
  const [openActions, setOpenActions] = useState<OpenActionItem[]>(mockOpenActions);
  const [metricsData, setMetricsData] = useState<HighLevelMetric[]>(mockHighLevelMetrics);
  const [findingsData, setFindingsData] = useState<AttentionFinding[]>(mockAttentionFindings);
  const [dataSourcesList, setDataSourcesList] = useState<DataSourceFile[]>(initialDataSources);
  const [sheets, setSheets] = useState<SpreadsheetTable[]>(initialSpreadsheets);
  const [auditHistory, setAuditHistory] = useState<CorrectionAuditItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Perspective states for editability, calculations and traceability
  const [financialRows, setFinancialRows] = useState<FinancialStatementRow[]>(mockFinancialStatement);
  const [customersData, setCustomersData] = useState<CustomerAccount[]>(mockCustomers);
  const [operationalSitesData, setOperationalSitesData] = useState<OperationalSite[]>(mockOperationalSites);
  const [pipelineData, setPipelineData] = useState<PipelineOpportunity[]>(mockPipeline);
  const [viewUpdatedBanner, setViewUpdatedBanner] = useState<string | null>(null);

  // Synchronize document theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('cova_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toggle completion of an action
  const handleToggleActionComplete = (id: string) => {
    setOpenActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  // Modal open handlers
  const handleSelectMetric = (metric: HighLevelMetric) => {
    setSelectedFinding(null);
    setSelectedMetric(metric);
  };

  const handleOpenInvestigateFinding = (finding: AttentionFinding) => {
    setSelectedMetric(null);
    setSelectedFinding(finding);
  };

  // Source Traceability inspection (Section 4 & 5)
  const handleInspectMetricSource = (metricId: string) => {
    const inspection = metricInspectionData[metricId];
    if (inspection) {
      setInspectingMetricSource(inspection);
    }
  };

  // Open spreadsheet modal for a given file/sheet
  const handleOpenSpreadsheet = (sheetIdOrFilename: string, highlightRowIds?: string[]) => {
    // Resolve sheet id from filename if needed
    let resolvedId = sheetIdOrFilename;
    const matchedSheet = sheets.find(
      (s) => s.id === sheetIdOrFilename || s.filename.toLowerCase() === sheetIdOrFilename.toLowerCase()
    );
    if (matchedSheet) {
      resolvedId = matchedSheet.id;
    }
    setActiveSpreadsheetId(resolvedId);
    setSpreadsheetHighlightRowIds(highlightRowIds || []);
    setIsSpreadsheetOpen(true);
  };

  // Spreadsheet correction handler (Section 6 & 7)
  const handleCorrectSpreadsheetValue = (audit: CorrectionAuditItem) => {
    setAuditHistory((prev) => [audit, ...prev]);

    // Update the cell value in state
    setSheets((prevSheets) =>
      prevSheets.map((sheet) => {
        if (sheet.id !== audit.sheetId && sheet.filename !== audit.sheetName) return sheet;
        return {
          ...sheet,
          rows: sheet.rows.map((row) => {
            if (row.id !== audit.rowId) return row;
            return {
              ...row,
              cells: {
                ...row.cells,
                [audit.fieldKey]: audit.correctedValue,
              },
            };
          }),
        };
      })
    );

    // If Revenue was corrected, adjust metrics dynamically
    if (audit.fieldKey === 'amount' && (audit.sheetName.includes('Invoices') || audit.sheetId === 'sheet-invoices')) {
      const prevNum = typeof audit.originalValue === 'number'
        ? audit.originalValue
        : parseFloat(String(audit.originalValue).replace(/[^0-9.-]/g, '')) || 0;
      const newNum = typeof audit.correctedValue === 'number'
        ? audit.correctedValue
        : parseFloat(String(audit.correctedValue).replace(/[^0-9.-]/g, '')) || 0;
      const diff = newNum - prevNum;

      setMetricsData((prev) =>
        prev.map((m) => {
          if (m.id === 'revenue') {
            const currentRev = 4.28;
            const updatedRev = Math.max(0, currentRev + diff / 1000000).toFixed(2);
            return {
              ...m,
              value: `R${updatedRev}M`,
              change: diff >= 0 ? '+7.8%' : '-2.1%',
            };
          }
          return m;
        })
      );
    }

    // Show temporary notification
    setNotification(`Corrected ${audit.fieldLabel} in ${audit.sheetName}. Business calculations updated.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Centralized Source File Edit & Recalculation Handler (Business View → Source → Inspect File → Edit File → Save → Recalculate)
  const handleSaveFileFromModal = (
    sheetId: string,
    updatedRows: SpreadsheetRow[],
    audits: CorrectionAuditItem[],
    updatedTotalRow?: Record<string, string | number>
  ) => {
    // 1. Update the sheet in state
    setSheets((prevSheets) =>
      prevSheets.map((s) => {
        if (s.id !== sheetId) return s;
        return {
          ...s,
          rows: updatedRows,
          totalRow: updatedTotalRow || s.totalRow,
        };
      })
    );

    // 2. Add audits to auditHistory
    if (audits.length > 0) {
      setAuditHistory((prev) => [...audits, ...prev]);
    }

    // 3. Recalculate relevant business views
    if (sheetId === 'sheet-gl') {
      // General Ledger update: recalculate financialRows and overview metrics
      const newFinRows = [...financialRows];
      const mappedRows = newFinRows.map((fr) => {
        const itemLower = fr.item.toLowerCase();
        const matchedRow = updatedRows.find((r) =>
          String(r.cells.description || '').toLowerCase().includes(itemLower) ||
          itemLower.includes(String(r.cells.account || '').toLowerCase())
        );
        if (matchedRow && matchedRow.cells.actual_mtd !== undefined) {
          const val = matchedRow.cells.actual_mtd;
          const formatted = typeof val === 'number' ? `R${(val / 1000).toFixed(0)}k` : String(val);
          return { ...fr, actualZAR: formatted };
        }
        return fr;
      });
      setFinancialRows(mappedRows);

      // Recalculate Overview metrics
      setMetricsData((prev) =>
        prev.map((m) => {
          if (m.id === 'revenue') {
            const revRow = mappedRows.find((r) => r.item === 'Total Revenue');
            return revRow ? { ...m, value: revRow.actualZAR } : m;
          }
          if (m.id === 'margin') {
            const ebitRow = mappedRows.find((r) => r.item === 'Net Operating Result (EBIT)');
            return ebitRow ? { ...m, value: ebitRow.actualZAR } : m;
          }
          return m;
        })
      );
    } else if (sheetId === 'sheet-invoices') {
      // Customer Invoices update: recalculate customersData
      setCustomersData((prev) =>
        prev.map((cust) => {
          const matched = updatedRows.find((r) =>
            String(r.cells.customer || '').toLowerCase().includes(cust.name.toLowerCase()) ||
            cust.name.toLowerCase().includes(String(r.cells.customer || '').toLowerCase())
          );
          if (matched) {
            const amt = matched.cells.amount;
            const formatted = typeof amt === 'number' ? `R${amt.toLocaleString()}` : String(amt);
            return {
              ...cust,
              monthlyBilledZAR: formatted,
            };
          }
          return cust;
        })
      );
    } else if (sheetId === 'sheet-pipeline') {
      // Pipeline update: recalculate pipelineData
      setPipelineData((prev) =>
        prev.map((opp) => {
          const matched = updatedRows.find((r) =>
            String(r.cells.opportunity || '').toLowerCase().includes(opp.name.toLowerCase()) ||
            opp.name.toLowerCase().includes(String(r.cells.opportunity || '').toLowerCase())
          );
          if (matched) {
            return {
              ...opp,
              stage: String(matched.cells.stage || opp.stage),
              estimatedValueZAR: String(matched.cells.value || opp.estimatedValueZAR),
              capexRequiredZAR: String(matched.cells.capex || opp.capexRequiredZAR),
              projectedIrrPct: Number(matched.cells.irr) || opp.projectedIrrPct,
            };
          }
          return opp;
        })
      );
    } else if (sheetId === 'sheet-energy') {
      // Hourly Energy Operations update: recalculate site data
      setOperationalSitesData((prev) =>
        prev.map((site) => {
          const matched = updatedRows.find((r) =>
            String(r.cells.site || '').toLowerCase().includes(site.name.toLowerCase())
          );
          if (matched && matched.cells.solar_kwh !== undefined) {
            return {
              ...site,
              solarCapacityKwp: Number(matched.cells.solar_kwh) || site.solarCapacityKwp,
            };
          }
          return site;
        })
      );
    }

    const currentSheet = sheets.find((s) => s.id === sheetId);
    const fileName = currentSheet ? currentSheet.filename : 'source file';
    setViewUpdatedBanner(`Business views recalculated — changes to ${fileName} successfully saved.`);
    setTimeout(() => setViewUpdatedBanner(null), 6000);
    setNotification(`Saved and recalculated business views from ${fileName}.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Direct Perspective editing handlers with audit preservation and live recalculations
  const handleUpdateFinancialRows = (newRows: FinancialStatementRow[], auditNotes: string[]) => {
    setFinancialRows(newRows);
    const newAudits: CorrectionAuditItem[] = auditNotes.map((note, i) => ({
      id: `audit-fin-${Date.now()}-${i}`,
      sheetId: 'sheet-gl',
      sheetName: 'General_Ledger.xlsx',
      rowId: `row-${i}`,
      fieldKey: 'actual',
      fieldLabel: 'Financial Statement Line',
      originalValue: 'Previous Value',
      correctedValue: note,
      updatedBy: 'Current User (Owner)',
      date: new Date().toISOString().split('T')[0],
      impactDescription: 'Direct financial statement line edit',
    }));
    setAuditHistory((prev) => [...newAudits, ...prev]);

    // Recalculate affected metrics: Revenue and Operating Profit
    const revRow = newRows.find((r) => r.item === 'Total Revenue');
    const ebitRow = newRows.find((r) => r.item === 'Net Operating Result (EBIT)');
    if (revRow || ebitRow) {
      setMetricsData((prev) =>
        prev.map((m) => {
          if (m.id === 'revenue' && revRow) {
            return { ...m, value: revRow.actualZAR };
          }
          if (m.id === 'margin' && ebitRow) {
            return { ...m, value: ebitRow.actualZAR };
          }
          return m;
        })
      );
    }

    setViewUpdatedBanner('View updated — Affected metrics and calculations refreshed.');
    setTimeout(() => setViewUpdatedBanner(null), 6000);
  };

  const handleUpdateCustomers = (newCusts: CustomerAccount[], auditNotes: string[]) => {
    setCustomersData(newCusts);
    const newAudits: CorrectionAuditItem[] = auditNotes.map((note, i) => ({
      id: `audit-cust-${Date.now()}-${i}`,
      sheetId: 'sheet-invoices',
      sheetName: 'Customer_Invoices.xlsx',
      rowId: `row-${i}`,
      fieldKey: 'customer_record',
      fieldLabel: 'Customer Performance Record',
      originalValue: 'Previous Value',
      correctedValue: note,
      updatedBy: 'Current User (Owner)',
      date: new Date().toISOString().split('T')[0],
      impactDescription: 'Customer register manual adjustment',
    }));
    setAuditHistory((prev) => [...newAudits, ...prev]);

    setViewUpdatedBanner('View updated — Customer register and margin metrics refreshed.');
    setTimeout(() => setViewUpdatedBanner(null), 6000);
  };

  const handleUpdateSites = (newSites: OperationalSite[], auditNotes: string[]) => {
    setOperationalSitesData(newSites);
    const newAudits: CorrectionAuditItem[] = auditNotes.map((note, i) => ({
      id: `audit-site-${Date.now()}-${i}`,
      sheetId: 'sheet-energy',
      sheetName: 'Hourly_Energy_Operations.xlsx',
      rowId: `row-${i}`,
      fieldKey: 'site_record',
      fieldLabel: 'Asset Performance & Status',
      originalValue: 'Previous Value',
      correctedValue: note,
      updatedBy: 'Current User (Owner)',
      date: new Date().toISOString().split('T')[0],
      impactDescription: 'Operational asset parameter update',
    }));
    setAuditHistory((prev) => [...newAudits, ...prev]);

    setViewUpdatedBanner('View updated — Asset performance and availability refreshed.');
    setTimeout(() => setViewUpdatedBanner(null), 6000);
  };

  const handleUpdateOpportunities = (newOpps: PipelineOpportunity[], auditNotes: string[]) => {
    setPipelineData(newOpps);
    const newAudits: CorrectionAuditItem[] = auditNotes.map((note, i) => ({
      id: `audit-opp-${Date.now()}-${i}`,
      sheetId: 'sheet-pipeline',
      sheetName: 'Commercial_Pipeline.xlsx',
      rowId: `row-${i}`,
      fieldKey: 'pipeline_record',
      fieldLabel: 'Growth Pipeline Deal',
      originalValue: 'Previous Value',
      correctedValue: note,
      updatedBy: 'Current User (Owner)',
      date: new Date().toISOString().split('T')[0],
      impactDescription: 'Growth pipeline commercial revision',
    }));
    setAuditHistory((prev) => [...newAudits, ...prev]);

    setViewUpdatedBanner('View updated — Growth pipeline deals and capital requirements refreshed.');
    setTimeout(() => setViewUpdatedBanner(null), 6000);
  };

  // Discuss trigger from Metric modal
  const handleDiscussMetric = (metric: HighLevelMetric) => {
    setSelectedMetric(null);
    setDiscussContext({
      type: 'metric',
      id: metric.id,
      title: metric.label,
      value: metric.value,
      change: `${metric.change} ${metric.secondaryContext}`,
      rawItem: metric,
    });
    setIsDiscussOpen(true);
  };

  // Discuss trigger from Attention modal
  const handleDiscussIssue = (finding: AttentionFinding) => {
    setSelectedFinding(null);
    setDiscussContext({
      type: 'issue',
      id: finding.id,
      title: finding.title,
      summary: `${finding.financialImpact} · ${finding.metricImpact}`,
      rawItem: finding,
    });
    setIsDiscussOpen(true);
  };

  // Handle uploaded files: transitions system from true empty state to real data (Prompt Section 1 & 3)
  const handleFilesProcessed = (filesOrText?: ProcessedFileItem[] | string) => {
    setHasUploadedFiles(true);
    setMetricsData(mockHighLevelMetrics);
    setFindingsData(mockAttentionFindings);
    
    // Mark data sources as current and fresh
    setDataSourcesList((prev) =>
      prev.map((ds) => (ds.isMissing ? ds : { ...ds, status: 'Current', lastUpdated: 'Just now' }))
    );

    let message = 'Demo complete. Fictional sample data loaded; selected file contents were not read.';
    if (typeof filesOrText === 'string') {
      message = filesOrText;
    } else if (Array.isArray(filesOrText) && filesOrText.length > 0) {
      const fileNames = filesOrText.map((f) => f.name).join(', ');
      message = `Simulated ${filesOrText.length} file selections (${fileNames}). Sample data loaded; file contents were not read.`;
    }

    setNotification(message);
    setTimeout(() => setNotification(null), 6000);
  };

  // Reset to empty state for testing (Prompt Section 1)
  const handleResetToEmpty = () => {
    setHasUploadedFiles(false);
    setMetricsData(emptyMetrics);
    setFindingsData([]);
    setNotification('System reset to initial empty state.');
    setTimeout(() => setNotification(null), 4000);
  };

  const unresolvedActionsCount = openActions.filter((a) => !a.completed).length;

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#121518] text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-blue-100 dark:selection:bg-blue-900/40 selection:text-stone-900 dark:selection:text-stone-100 transition-colors">
      {/* Top Notification Toast */}
      {typeof notification === 'string' && notification.length > 0 && (
        <div className="fixed top-4 right-4 z-50 max-w-md p-3.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xl border border-stone-700/50 flex items-start gap-2.5 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{notification}</div>
        </div>
      )}

      <div className="px-4 py-2 text-center text-xs bg-stone-100 dark:bg-[#20262f] text-stone-600 dark:text-stone-300">Portfolio demo · Fictional company and figures. Uploads and chat are simulated.</div>
      {/* Top Navigation & Workspace Controls */}
      <Navbar
        currentPerspective={currentPerspective}
        onSelectPerspective={(p) => {
          setIsDiscussOpen(false);
          setCurrentPerspective(p);
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
        onOpenActions={() => setIsOpenActionsOpen(true)}
        onOpenIntelligence={() => {
          setDiscussContext(null);
          setIsDiscussOpen(true);
        }}
        isIntelligenceActive={isDiscussOpen}
        hasUploadedFiles={hasUploadedFiles}
        openActionsCount={unresolvedActionsCount}
        lastUpdated="September 2026"
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Dedicated Cova Intelligence Page */}
        {isDiscussOpen ? (
          <DiscussConversationPage
            context={discussContext}
            onBack={() => setIsDiscussOpen(false)}
            onOpenSpreadsheet={handleOpenSpreadsheet}
          />
        ) : (
          <>
            {/* Quick state switcher bar for reviewer convenience */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 text-sm border-b border-stone-200/50 dark:border-[#22272e]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasUploadedFiles ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span className="text-stone-500 dark:text-stone-400">
                  As of:{' '}
                  <strong className="text-stone-800 dark:text-stone-200">
                    {hasUploadedFiles ? 'September 2026 · Demo' : 'No data · Awaiting files'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!hasUploadedFiles ? (
                  <button
                    type="button"
                    onClick={() => handleFilesProcessed('Fictional Nala Energy sample loaded.')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
                    <span>Load Sample Data</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetToEmpty}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-[#1c222b] hover:bg-stone-200 dark:hover:bg-[#252c38] transition cursor-pointer"
                    title="Reset to true empty state"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Try empty view</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live recalculation banner */}
            {viewUpdatedBanner && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium">{viewUpdatedBanner}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewUpdatedBanner(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {currentPerspective === 'current_state' && (
              <div className="space-y-5">
                {/* Clean Overview Page Header with standard actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200/60 dark:border-[#242a32]">
                  <div>
                    <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
                      Overview
                    </h1>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      The business at a glance.
                    </p>
                  </div>
                  <PageHeaderActions
                    pageTitle="Overview"
                    pageContext="Overview"
                    onOpenSource={() => handleOpenSpreadsheet('sheet-gl')}
                    onOpenIntelligence={(ctx) => {
                      setDiscussContext({
                        type: 'general',
                        title: `Context: ${ctx}`,
                      });
                      setIsDiscussOpen(true);
                    }}
                    onExport={(fmt) => {
                      const cols = [
                        { key: 'label', label: 'Metric' },
                        { key: 'value', label: 'Current Value' },
                        { key: 'change', label: 'Period Change' },
                        { key: 'secondaryContext', label: 'Context' },
                      ];
                      if (fmt === 'csv') exportToCSV('Cova_Executive_Overview', cols, metricsData);
                      else if (fmt === 'excel') exportToExcel('Cova_Executive_Overview', cols, metricsData);
                      else printOrExportPDF('Cova — Executive Overview', cols, metricsData);
                    }}
                    sourceLabel="Source: General Ledger"
                    sourceFileHint="General_Ledger.xlsx"
                  />
                </div>

                {hasUploadedFiles && (
                  <div className="snapshot-note rounded-xl border border-blue-200 dark:border-blue-400/30 bg-blue-50 dark:bg-[#192735] p-4 sm:p-5">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">At a glance</p>
                    <p className="text-base sm:text-lg leading-relaxed text-stone-900 dark:text-stone-100">
                      Revenue {metricsData.find(m => m.id === 'revenue')?.value}; liquid cash {metricsData.find(m => m.id === 'cash')?.value}. Review the cash bottleneck below.
                    </p>
                  </div>
                )}

                {/* 1. Key Financial Metrics with Source buttons */}
                <MetricsRow
                  metrics={metricsData}
                  hasUploadedFiles={hasUploadedFiles}
                  onSelectMetric={handleSelectMetric}
                  onOpenSource={handleInspectMetricSource}
                  onInspectMetricSource={handleInspectMetricSource}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  selectedMetricId={selectedMetric?.id}
                />

                {/* 2. What Needs Your Attention */}
                <AttentionSection
                  findings={findingsData}
                  hasUploadedFiles={hasUploadedFiles}
                  onInvestigate={handleOpenInvestigateFinding}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />

                {/* 3. Revenue & Cost Structure */}
                <RevenueCostStructure
                  hasUploadedFiles={hasUploadedFiles}
                  onOpenUpload={() => setIsUploadOpen(true)}
                  onOpenSpreadsheet={handleOpenSpreadsheet}
                />

                {/* 4. Revenue & Profit Trend */}
                <SimpleTrendChart
                  theme={theme}
                  hasUploadedFiles={hasUploadedFiles}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />

                {/* 5. Business Summary */}
                <BusinessSummary
                  hasUploadedFiles={hasUploadedFiles}
                  onOpenUpload={() => setIsUploadOpen(true)}
                />
              </div>
            )}

            {/* PERSPECTIVES (Financial, Customers, Energy, Operations, Cash & Debt, Growth) */}
            {currentPerspective !== 'current_state' && (
              <PerspectivesView
                perspective={currentPerspective}
                hasUploadedFiles={hasUploadedFiles}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenSpreadsheet={handleOpenSpreadsheet}
                onOpenSource={(sheetId) => handleOpenSpreadsheet(sheetId || 'sheet-gl')}
                onOpenAssistantQuery={(q, ctx) => {
                  setDiscussContext({
                    type: 'general',
                    title: ctx ? `Context: ${ctx}` : 'Context: Overview',
                  });
                  setIsDiscussOpen(true);
                }}
                financialRows={financialRows}
                onUpdateFinancialRows={handleUpdateFinancialRows}
                customers={customersData}
                onUpdateCustomers={handleUpdateCustomers}
                sites={operationalSitesData}
                onUpdateSites={handleUpdateSites}
                opportunities={pipelineData}
                onUpdateOpportunities={handleUpdateOpportunities}
                theme={theme}
              />
            )}
          </>
        )}
      </main>

      {/* Centered Modal: Key Metric Drill-down */}
      <MetricDrilldownModal
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
        onDiscussMetric={handleDiscussMetric}
      />

      {/* Centered Modal: What Needs Your Attention Drill-down */}
      <AttentionDrilldownModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onDiscussIssue={handleDiscussIssue}
        onOpenActionPanel={() => setIsOpenActionsOpen(true)}
      />

      {/* Slide-out Panel: Open Actions */}
      <OpenActionsPanel
        isOpen={isOpenActionsOpen}
        onClose={() => setIsOpenActionsOpen(false)}
        actions={openActions}
        onToggleComplete={handleToggleActionComplete}
      />

      {/* Centered Modal: Upload Files (Prompt Section 3) */}
      <UploadFilesModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onFilesProcessed={handleFilesProcessed}
      />

      {/* Centered Modal: Metric Source Traceability & Lineage (Prompt Section 4 & 5) */}
      <MetricSourceModal
        inspection={inspectingMetricSource}
        onClose={() => setInspectingMetricSource(null)}
        onOpenSpreadsheet={handleOpenSpreadsheet}
      />

      {/* Centered Modal: Spreadsheet Viewer & Direct Cell Correction (Prompt Section 5, 6, 7) */}
      <SourceSpreadsheetViewerModal
        isOpen={isSpreadsheetOpen}
        onClose={() => setIsSpreadsheetOpen(false)}
        sheets={sheets}
        activeSheetId={activeSpreadsheetId}
        onSelectSheet={(sheetId) => setActiveSpreadsheetId(sheetId)}
        highlightRowIds={spreadsheetHighlightRowIds}
        onSaveFile={handleSaveFileFromModal}
        onCorrectValue={handleCorrectSpreadsheetValue}
        auditHistory={auditHistory}
      />

      {/* Slide-out Panel: Data Sources & File Registry (Prompt Section 2) */}
      <DataSourcesPanel
        isOpen={isDataSourcesOpen}
        onClose={() => setIsDataSourcesOpen(false)}
        dataSources={dataSourcesList}
        hasUploadedFiles={hasUploadedFiles}
        onOpenSpreadsheet={handleOpenSpreadsheet}
        onOpenUpload={() => {
          setIsDataSourcesOpen(false);
          setIsUploadOpen(true);
        }}
      />
    </div>
  );
}

