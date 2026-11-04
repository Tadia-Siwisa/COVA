import React from 'react';
import {
  PerspectiveType,
  CustomerAccount,
  OperationalSite,
  PipelineOpportunity,
  AttentionFinding,
} from '../types';
import { FinancialStatementRow } from '../data/mockBusinessData';
import { FinancialView } from './FinancialView';
import { CustomersView } from './CustomersView';
import { OperationsView } from './OperationsView';
import { CashDebtView } from './CashDebtView';
import { GrowthView } from './GrowthView';
import { UploadCloud } from 'lucide-react';

interface PerspectivesViewProps {
  perspective: PerspectiveType;
  hasUploadedFiles?: boolean;
  onOpenUpload?: () => void;
  onOpenSpreadsheet?: (sheetId: string) => void;
  onOpenSource?: (sheetId?: string) => void;
  onOpenAssistantQuery: (query: string, contextName?: string) => void;
  financialRows: FinancialStatementRow[];
  onUpdateFinancialRows: (newRows: FinancialStatementRow[], auditNotes: string[]) => void;
  customers: CustomerAccount[];
  onUpdateCustomers: (newCustomers: CustomerAccount[], auditNotes: string[]) => void;
  sites: OperationalSite[];
  onUpdateSites: (newSites: OperationalSite[], auditNotes: string[]) => void;
  opportunities: PipelineOpportunity[];
  onUpdateOpportunities: (newOpps: PipelineOpportunity[], auditNotes: string[]) => void;
  theme?: 'light' | 'dark';
}

export const PerspectivesView: React.FC<PerspectivesViewProps> = ({
  perspective,
  hasUploadedFiles = true,
  onOpenUpload,
  onOpenSpreadsheet,
  onOpenSource,
  onOpenAssistantQuery,
  financialRows,
  onUpdateFinancialRows,
  customers,
  onUpdateCustomers,
  sites,
  onUpdateSites,
  opportunities,
  onUpdateOpportunities,
  theme = 'light',
}) => {
  if (perspective === 'current_state') return null;

  if (!hasUploadedFiles) {
    const pageTitles: Record<PerspectiveType, string> = {
      current_state: 'Overview',
      financial: 'Monthly Financial Performance',
      customers: 'Customer Performance',
      energy: 'Operations',
      operations: 'Operations',
      cash_debt: 'Cash Flow & Debt',
      growth: 'Growth Pipeline',
    };

    return (
      <div className="my-6 p-8 rounded-2xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] text-center flex flex-col items-center justify-center py-16 animate-in fade-in duration-150">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
          {pageTitles[perspective] || 'Business Data'}
        </span>
        <h2 className="font-editorial text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-2">
          Missing data
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mb-6 leading-relaxed">
          Upload your organization's financial trial balances, customer registers, or operational telemetry spreadsheets to build this page.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-semibold hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer shadow-xs"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload files to build this view</span>
        </button>
      </div>
    );
  }

  // Render the respective refined page
  switch (perspective) {
    case 'financial':
      return (
        <FinancialView
          financialRows={financialRows}
          onUpdateFinancialRows={onUpdateFinancialRows}
          onOpenSource={() => (onOpenSource ? onOpenSource('sheet-gl') : onOpenSpreadsheet?.('sheet-gl'))}
          onOpenIntelligence={(ctx) => onOpenAssistantQuery('', ctx)}
          theme={theme}
        />
      );

    case 'customers':
      return (
        <CustomersView
          customers={customers}
          onUpdateCustomers={onUpdateCustomers}
          onOpenSource={() => (onOpenSource ? onOpenSource('sheet-invoices') : onOpenSpreadsheet?.('sheet-invoices'))}
          onOpenIntelligence={(ctx) => onOpenAssistantQuery('', ctx)}
        />
      );

    case 'energy':
    case 'operations':
      return (
        <OperationsView
          sites={sites}
          onUpdateSites={onUpdateSites}
          onOpenSource={() => (onOpenSource ? onOpenSource('sheet-energy') : onOpenSpreadsheet?.('sheet-energy'))}
          onOpenIntelligence={(ctx) => onOpenAssistantQuery('', ctx)}
        />
      );

    case 'cash_debt':
      return (
        <CashDebtView
          onOpenSource={() => (onOpenSource ? onOpenSource('sheet-bank') : onOpenSpreadsheet?.('sheet-bank'))}
          onOpenIntelligence={(ctx) => onOpenAssistantQuery('', ctx)}
          theme={theme}
        />
      );

    case 'growth':
      return (
        <GrowthView
          opportunities={opportunities}
          onUpdateOpportunities={onUpdateOpportunities}
          onOpenSource={() => (onOpenSource ? onOpenSource('sheet-pipeline') : onOpenSpreadsheet?.('sheet-pipeline'))}
          onOpenIntelligence={(ctx, q) => onOpenAssistantQuery(q || '', ctx)}
        />
      );

    default:
      return null;
  }
};
