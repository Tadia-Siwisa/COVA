export type PerspectiveType =
  | 'current_state'
  | 'financial'
  | 'customers'
  | 'energy'
  | 'operations'
  | 'cash_debt'
  | 'growth';

export interface AttentionFinding {
  id: string;
  title: string;
  severity: 'critical' | 'watch' | 'opportunity';
  severityLabel: string;
  summary: string;
  perspectiveLink: PerspectiveType;
  metricImpact: string;
  rootCause: string;
  context: string;
  financialImpact: string;
  actionRecommendation: string;
  timeline: { step: string; status: 'completed' | 'in_progress' | 'pending'; date: string }[];
}

export interface HighLevelMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change: string;
  trend: 'positive' | 'negative' | 'neutral';
  secondaryContext: string;
  perspective: PerspectiveType;
  drilldownDetails: {
    title: string;
    narrative: string;
    components: { name: string; amount: string; percentage?: string; notes: string }[];
  };
}

export interface ExecutiveNarrative {
  headline: string;
  happeningNow: string;
  mattersMost: string;
  generatedTimestamp: string;
  dataSource: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  industry: string;
  location: string;
  systemCapacity: string;
  contractModel: 'PPA' | 'Lease-to-Own' | 'O&M Retainer';
  monthlyBilledZAR: string;
  grossMarginPct: number;
  marginHealth: 'strong' | 'moderate' | 'critical';
  debtorDays: number;
  eskomOffsetPct: number;
  operationalNotes: string;
}

export interface OperationalSite {
  id: string;
  name: string;
  region: string;
  solarCapacityKwp: number;
  batteryCapacityKwh: number;
  status: 'optimal' | 'attention_required' | 'commissioning';
  availabilityPct: number;
  openTickets: number;
  latestTelemetry: string;
}

export interface PipelineOpportunity {
  id: string;
  client: string;
  systemSpec: string;
  dealSizeZAR: string;
  stage: string;
  estimatedMarginPct: number;
  commissioningTarget: string;
  name?: string;
  capexRequiredZAR?: string;
  estimatedValueZAR?: string;
  projectedIrrPct?: number;
  fundingFeasibility?: string;
  riskRating?: string;
}

export interface AssistantResponse {
  answer: string;
  keyDrivers: string[];
  figuresToNote: { label: string; value: string }[];
  recommendedAction: string;
  deepLinkPerspective?: PerspectiveType;
}

export interface OpenActionItem {
  id: string;
  title: string;
  area: 'Operations' | 'Customers' | 'Growth' | 'Cash & Debt' | 'Financial' | 'Energy';
  due: string;
  businessImpact: string;
  completed?: boolean;
}

export interface DataSourceCategory {
  view: string;
  sources: {
    name: string;
    status: 'Current' | 'Update Soon' | 'Out of Date' | 'Missing';
    lastUpdated: string;
  }[];
}

export type FreshnessState = 'Current' | 'Update Soon' | 'Out of Date' | 'Missing';

export interface DataSourceFile {
  id: string;
  name: string;
  category: 'Financial' | 'Customers' | 'Energy';
  status: FreshnessState;
  lastUpdated: string;
  size: string;
  feedsAreas: string[];
  affectedMetrics: string[];
  description: string;
  isMissing?: boolean;
}

export interface SourceMetricInspection {
  metricId: string;
  metricName: string;
  metricValue: string;
  filesUsed: string[];
  fieldsUsed: string[];
  period: string;
  formulaItems: {
    label: string;
    amount: string;
    sign?: '+' | '-' | '=';
    isResult?: boolean;
  }[];
  formulaNote?: string;
  targetSheetId: string;
  highlightRowIds: string[];
  highlightExplanation: string;
}

export interface CorrectionAuditItem {
  id: string;
  sheetId: string;
  sheetName: string;
  rowId: string;
  fieldKey: string;
  fieldLabel: string;
  originalValue: string | number;
  correctedValue: string | number;
  updatedBy: string;
  date: string;
  impactDescription: string;
}

export interface SpreadsheetColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  isEditable?: boolean;
  isDerived?: boolean;
  formulaExplanation?: string;
}

export interface SpreadsheetRow {
  id: string;
  rowNumber: number;
  cells: Record<string, string | number>;
  isHighlighted?: boolean;
  highlightTag?: string;
  isTotal?: boolean;
  isDerived?: boolean;
  formulaExplanation?: string;
  isModified?: boolean;
  originalCells?: Record<string, string | number>;
  correctionAudit?: CorrectionAuditItem;
}

export interface SpreadsheetTable {
  id: string;
  filename: string;
  title: string;
  category: 'Financial' | 'Customers' | 'Energy';
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
  totalRow?: Record<string, string | number>;
  lastUpdated: string;
  freshness: FreshnessState;
}

export interface DiscussTopicContext {
  type: 'metric' | 'issue' | 'general';
  id?: string;
  title: string;
  value?: string;
  change?: string;
  summary?: string;
  businessArea?: string;
  rawItem?: HighLevelMetric | AttentionFinding | null;
}


