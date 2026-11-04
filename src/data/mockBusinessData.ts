import {
  AttentionFinding,
  HighLevelMetric,
  ExecutiveNarrative,
  CustomerAccount,
  OperationalSite,
  PipelineOpportunity,
  AssistantResponse,
  PerspectiveType,
} from '../types';

export const mockExecutiveNarrative: ExecutiveNarrative = {
  headline: 'Commercial demand is strong, but capital velocity is constrained by grid sign-offs.',
  happeningNow:
    'Nala Energy generated R4.28M in billed revenue this month across 8 active commercial microgrid sites, outperforming revenue targets by 6.2%. Client power generation hit 684 MWh with 74% solar-plus-storage autonomy. However, gross profit margin contracted to 31.4% (against our 34% operating target) due to emergency diesel generation dispatches for Protea Logistics during intense grid instability.',
  mattersMost:
    'Your single most critical executive lever right now is releasing R1.15M in working capital currently trapped in delivered battery hardware at Paarl Cold Storage. Expediting the municipal dual-feed approval will immediately restore your liquid cash buffer from 42 days to 68 days without requiring additional debt drawdown.',
  generatedTimestamp: 'Today at 07:15 SAST',
  dataSource: 'Interpreting September 2026 Trial Balance, SolarEdge Telemetry & Victron Cloud Logs (3,420 entries)',
};

export const mockHighLevelMetrics: HighLevelMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: 'R4.28M',
    change: '+6.2%',
    trend: 'positive',
    secondaryContext: 'vs last month',
    perspective: 'financial',
    drilldownDetails: {
      title: 'Revenue Composition & Billing Streams',
      narrative:
        'PPA generation tariffs contributed R2.64M (61.7%), turnkey commercial EPC installations brought R1.10M (25.7%), and recurring O&M performance retainers accounted for R540k (12.6%).',
      components: [
        { name: 'PPA Energy Tariffs', amount: 'R2,640,000', percentage: '61.7%', notes: 'Stable take-or-pay kilowatt-hour sales across 6 long-term sites' },
        { name: 'Commercial EPC Milestones', amount: 'R1,100,000', percentage: '25.7%', notes: 'Phase 1 completion invoice recognized for Karoo Wool Mill expansion' },
        { name: 'O&M Maintenance Retainers', amount: 'R540,000', percentage: '12.6%', notes: 'Contracted preventative maintenance and 24/7 remote SCADA monitoring' },
      ],
    },
  },
  {
    id: 'margin',
    label: 'Operating Profit',
    value: 'R1.34M',
    change: '-2.6%',
    trend: 'negative',
    secondaryContext: 'vs target',
    perspective: 'financial',
    drilldownDetails: {
      title: 'Cost of Generation & Operating Result',
      narrative:
        'Core solar generation yields an 82% direct margin. However, unmitigated diesel backup dispatch during Stage 4 load shedding at Protea Logistics incurred R84,000 in unbudgeted fuel bills, pulling portfolio margin down 2.6%.',
      components: [
        { name: 'Solar PV Direct Margin', amount: '82.4%', percentage: 'Core Yield', notes: 'Zero marginal fuel cost during daytime irradiance' },
        { name: 'Battery Cycling Cost', amount: '12.8%', percentage: 'Depreciation', notes: 'Scheduled warranty amortization on CATL lithium iron phosphate cells' },
        { name: 'Diesel Generator Backup Drag', amount: '-R84,000', percentage: '-2.6% Drag', notes: 'Spot fuel purchased at R23.80/L to maintain 99.8% customer SLA uptime' },
      ],
    },
  },
  {
    id: 'cash',
    label: 'Liquid Cash',
    value: 'R1.85M',
    change: '-14.7%',
    trend: 'negative',
    secondaryContext: 'vs last month',
    perspective: 'cash_debt',
    drilldownDetails: {
      title: 'Operating Cash Flow & Runway',
      narrative:
        'Current unrestricted cash sits at R1,850,000 in First National Bank corporate sweep accounts. At current net burn of R44,000/day, runway is 42 days. Resolving overdue receivables and municipal sign-off unlocks another R1.87M within 14 days.',
      components: [
        { name: 'FNB Operational Sweep Account', amount: 'R1,420,000', percentage: '76.8%', notes: 'Primary payroll and supplier clearing balance' },
        { name: 'DBSA Debt Service Reserve (Restricted)', amount: 'R430,000', percentage: '23.2%', notes: 'Escrow requirement matching 2.3 months of loan repayments' },
        { name: 'Accounts Receivable Awaiting Collection', amount: 'R2,120,000', percentage: 'Pending', notes: 'R1.4M current (0-30d), R580k (31-60d), R140k overdue (>60d)' },
      ],
    },
  },
  {
    id: 'debt',
    label: 'Debt Obligations',
    value: 'R3.40M',
    change: '-3.2%',
    trend: 'positive',
    secondaryContext: 'vs last month',
    perspective: 'cash_debt',
    drilldownDetails: {
      title: 'Clean Infrastructure Loan Amortization',
      narrative:
        'Development Bank of Southern Africa (DBSA) concessional clean energy facility. Interest rate fixed at prime minus 1.5% (10.25%). DSCR of 1.78x remains well above the 1.30x covenant floor.',
      components: [
        { name: 'Senior Term Facility Balance', amount: 'R3,400,000', percentage: 'Principal', notes: '64 months remaining on original 84-month asset finance tenure' },
        { name: 'Monthly Amortization (P&I)', amount: 'R185,000/mo', percentage: 'Fixed', notes: 'Due on the 28th of each calendar month via debit order' },
        { name: 'Covenant Headroom', amount: '+0.48x', percentage: 'Safe', notes: 'Free cash flow comfortably services debt; no covenant breach risk' },
      ],
    },
  },
];

export interface WorthKnowingItem {
  id: string;
  headline: string;
  explanation: string;
  actionText: string;
  findingId?: string;
  perspective: PerspectiveType;
}

export const mockWorthKnowing: WorthKnowingItem[] = [
  {
    id: 'wk-1',
    headline: 'Revenue increased, but profit declined.',
    explanation: 'Core solar generation beat target by 6.2%, but emergency diesel runs at Protea Logistics during Stage 4 load shedding erased R84,000 in operating profit.',
    actionText: 'See why',
    findingId: 'finding-2',
    perspective: 'customers',
  },
  {
    id: 'wk-2',
    headline: 'One customer accounts for most peak-period cost exposure.',
    explanation: 'Stellenbosch Wine Cellars pulled R38,000 in peak winter grid power during cloudy days; deploying automated chiller load-shifting recaptures R42,000 in value.',
    actionText: 'See why',
    findingId: 'finding-3',
    perspective: 'energy',
  },
  {
    id: 'wk-3',
    headline: 'Cash pressure is expected next month because of debt repayments and delayed sign-off.',
    explanation: 'R1.15M in delivered battery modules sits unbilled at Paarl Cold Storage awaiting municipal sign-off; clearing this inspection extends runway from 42 to 68 days.',
    actionText: 'See why',
    findingId: 'finding-1',
    perspective: 'operations',
  },
];

export interface FinancialStatementRow {
  category: string;
  item: string;
  actualZAR: string;
  budgetZAR: string;
  varianceZAR: string;
  pctOfRevenue: string;
  isTotal?: boolean;
  isSubtotal?: boolean;
}

export const mockFinancialStatement: FinancialStatementRow[] = [
  { category: 'Revenue', item: 'PPA Generation Tariffs (Take-or-pay)', actualZAR: 'R2,640,000', budgetZAR: 'R2,550,000', varianceZAR: '+R90,000', pctOfRevenue: '61.7%' },
  { category: 'Revenue', item: 'EPC Turnkey Installation Milestones', actualZAR: 'R1,100,000', budgetZAR: 'R980,000', varianceZAR: '+R120,000', pctOfRevenue: '25.7%' },
  { category: 'Revenue', item: 'O&M Retainers & SCADA Monitoring', actualZAR: 'R540,000', budgetZAR: 'R500,000', varianceZAR: '+R40,000', pctOfRevenue: '12.6%' },
  { category: 'Revenue', item: 'Total Revenue', actualZAR: 'R4,280,000', budgetZAR: 'R4,030,000', varianceZAR: '+R250,000', pctOfRevenue: '100.0%', isTotal: true },

  { category: 'Direct Energy Costs', item: 'Solar PV Operating & Inverter Maintenance', actualZAR: '-R280,000', budgetZAR: '-R270,000', varianceZAR: '-R10,000', pctOfRevenue: '6.5%' },
  { category: 'Direct Energy Costs', item: 'Battery Storage Warranty & Cell Amortization', actualZAR: '-R340,000', budgetZAR: '-R340,000', varianceZAR: 'R0', pctOfRevenue: '7.9%' },
  { category: 'Direct Energy Costs', item: 'Emergency Diesel Backup Fuel Runs (Stage 4)', actualZAR: '-R720,000', budgetZAR: '-R636,000', varianceZAR: '-R84,000', pctOfRevenue: '16.8%' },
  { category: 'Direct Energy Costs', item: 'Total Direct Energy Costs', actualZAR: '-R1,340,000', budgetZAR: '-R1,246,000', varianceZAR: '-R94,000', pctOfRevenue: '31.3%', isTotal: true },

  { category: 'Gross Profit', item: 'Gross Profit', actualZAR: 'R2,940,000', budgetZAR: 'R2,784,000', varianceZAR: '+R156,000', pctOfRevenue: '68.7%', isTotal: true },

  { category: 'Operating Expenses', item: 'Field Engineers & Technical Operations', actualZAR: '-R880,000', budgetZAR: '-R860,000', varianceZAR: '-R20,000', pctOfRevenue: '20.6%' },
  { category: 'Operating Expenses', item: 'Fleet Vehicles, Site Logistics & Travel', actualZAR: '-R260,000', budgetZAR: '-R250,000', varianceZAR: '-R10,000', pctOfRevenue: '6.1%' },
  { category: 'Operating Expenses', item: 'Remote SCADA, Cloud Telemetry & Software', actualZAR: '-R180,000', budgetZAR: '-R180,000', varianceZAR: 'R0', pctOfRevenue: '4.2%' },
  { category: 'Operating Expenses', item: 'General Administration, Legal & Insurance', actualZAR: '-R280,000', budgetZAR: '-R275,000', varianceZAR: '-R5,000', pctOfRevenue: '6.5%' },
  { category: 'Operating Expenses', item: 'Total Operating Expenses', actualZAR: '-R1,600,000', budgetZAR: '-R1,565,000', varianceZAR: '-R35,000', pctOfRevenue: '37.4%', isTotal: true },

  { category: 'Finance Costs', item: 'DBSA Concessional Facility Interest (Prime - 1.5%)', actualZAR: '-R140,000', budgetZAR: '-R145,000', varianceZAR: '+R5,000', pctOfRevenue: '3.3%' },
  { category: 'Finance Costs', item: 'Supplier Credit & Milestone Inventory Carry', actualZAR: '-R45,000', budgetZAR: '-R25,000', varianceZAR: '-R20,000', pctOfRevenue: '1.1%' },
  { category: 'Finance Costs', item: 'Total Finance Costs', actualZAR: '-R185,000', budgetZAR: '-R170,000', varianceZAR: '-R15,000', pctOfRevenue: '4.3%', isTotal: true },

  { category: 'Net Result', item: 'Net Operating Result (EBIT)', actualZAR: 'R1,155,000', budgetZAR: 'R1,049,000', varianceZAR: '+R106,000', pctOfRevenue: '27.0%', isTotal: true },
];


export const mockAttentionFindings: AttentionFinding[] = [
  {
    id: 'finding-1',
    title: 'Working Capital Locked in Paarl Battery Rollout',
    severity: 'critical',
    severityLabel: 'Capital Bottleneck',
    summary:
      'R1.15M in CATL battery modules delivered to site remains unbilled pending Drakenstein municipal dual-feed sign-off, tying up 62% of free operating cash.',
    perspectiveLink: 'operations',
    metricImpact: 'Traps R1.15M Liquid Cash',
    rootCause:
      'The local municipal electrical engineering department introduced revised SSEG (Small-Scale Embedded Generation) relay interlock guidelines after delivery, requiring an amended line diagram certification.',
    context:
      'Physical installation of the 2.4 MWh BESS at Paarl Cold Storage was completed on August 18. Because billing milestones trigger only upon grid connection sign-off, the final 35% contract tranche (R1.15M) cannot be invoiced, forcing Nala to carry supplier credit terms on its own balance sheet.',
    financialImpact:
      'Extends our cash conversion cycle by 46 days and incurs R16,500/month in idle supplier credit financing fees.',
    actionRecommendation:
      'Fast-track the certified municipal electrical sign-off with our pre-approved PR Eng consultant (S. van der Merwe) scheduled for Thursday, enabling immediate issuance of the R1.15M milestone invoice on Friday.',
    timeline: [
      { step: 'Hardware arrived on site & racked', status: 'completed', date: '18 August' },
      { step: 'Inverter busbar wiring & relay check', status: 'completed', date: '29 August' },
      { step: 'Municipal amended single-line diagram submission', status: 'in_progress', date: '04 September' },
      { step: 'Final municipal engineer physical inspection', status: 'pending', date: '16 September' },
      { step: 'Commercial Operation Date (COD) & final billing', status: 'pending', date: '18 September' },
    ],
  },
  {
    id: 'finding-2',
    title: 'Protea Logistics PPA Margin Erosion from Diesel Dispatch',
    severity: 'watch',
    severityLabel: 'Margin Drag',
    summary:
      'Diesel spot prices during Stage 4 load shedding forced R84,000 in unrecoverable generator runs, depressing this account’s gross margin from 32% down to 11.2%.',
    perspectiveLink: 'customers',
    metricImpact: '-2.6% Total Gross Margin',
    rootCause:
      'The current contract SLA guarantees 99.8% uptime without an automatic diesel fuel price pass-through surcharge, while the existing battery storage capacity (300 kWh) only covers 2.2 hours of nighttime outage.',
    context:
      'When Eskom instituted consecutive Stage 4 outages in late August, the site battery depleted during evening cross-docking operations. To avoid contractual non-performance penalties, our automated hybrid controller triggered the backup diesel genset for 114 running hours at R23.80/L.',
    financialImpact:
      'Net profit on the Protea account was reduced to R14,200 for the month, rendering it our lowest-performing contract despite high gross revenue.',
    actionRecommendation:
      'Propose a contract addendum with two options: either implement a fuel pass-through index for Stage 4+ events, or install a secondary 400 kWh battery container financed through a modest R0.22/kWh PPA tariff escalation.',
    timeline: [
      { step: 'Stage 4 event triggered 114 genset run-hours', status: 'completed', date: '22-28 August' },
      { step: 'Diesel invoice reconciled: R84,200', status: 'completed', date: '01 September' },
      { step: 'Account executive briefing with Protea CFO', status: 'in_progress', date: 'Tomorrow' },
      { step: 'Storage capacity expansion proposal submission', status: 'pending', date: '21 September' },
    ],
  },
  {
    id: 'finding-3',
    title: 'Winter Solar Output Shortfall at Stellenbosch Wine Cellars',
    severity: 'opportunity',
    severityLabel: 'Tariff Optimization',
    summary:
      'Winter irradiance in Western Cape reduced solar generation by 28%, causing client to pull peak municipal power; temporary load-shifting can recapture R42,000 in value.',
    perspectiveLink: 'energy',
    metricImpact: 'R42,000 Potential Recapture',
    rootCause:
      'Persistent cloud cover in the Boland basin reduced direct PV yield to 3.2 peak sun hours (vs 4.5 baseline). Cellar refrigeration pumps were operating during Eskom high-demand peak time-of-use windows (06:00-09:00 & 17:00-19:00).',
    context:
      'While solar yield is seasonally expected to dip in winter, the client’s automated glycol chiller cycles were running unscheduled during the most expensive Eskom peak tariff windows (R4.12/kWh) rather than shifting to midday solar hours (R1.45/kWh).',
    financialImpact:
      'Client received an unexpected R38,000 winter municipal surcharge, putting client relationship under strain ahead of their Phase 2 expansion renewal.',
    actionRecommendation:
      'Activate Nala’s automated IoT chiller load-shifting protocol. Pre-cooling glycol tanks from 11:00 to 14:30 during solar production will eliminate 88% of peak grid draw without affecting fermentation quality.',
    timeline: [
      { step: 'SCADA telemetry flagged winter yield drop', status: 'completed', date: '30 August' },
      { step: 'Chiller energy audit and tariff correlation', status: 'completed', date: '03 September' },
      { step: 'Deploy automated PLC relay setpoint update', status: 'in_progress', date: 'Today' },
      { step: 'Verification of avoided peak charges', status: 'pending', date: '30 September' },
    ],
  },
];

export const mockCustomers: CustomerAccount[] = [
  {
    id: 'cust-1',
    name: 'Paarl Cold Storage (Agri-packers)',
    industry: 'Cold Chain & Agriculture',
    location: 'Paarl, Western Cape',
    systemCapacity: '1.2 MWp PV + 2.4 MWh BESS',
    contractModel: 'PPA',
    monthlyBilledZAR: 'R1,120,000',
    grossMarginPct: 36.8,
    marginHealth: 'strong',
    debtorDays: 24,
    eskomOffsetPct: 84,
    operationalNotes: 'PPA generation performing flawlessly; R1.15M Phase 2 battery expansion pending municipal dual-feed sign-off.',
  },
  {
    id: 'cust-2',
    name: 'Protea Logistics Hub',
    industry: 'Freight & Cross-docking',
    location: 'Jet Park, Gauteng',
    systemCapacity: '650 kWp PV + 300 kWh BESS + Genset',
    contractModel: 'PPA',
    monthlyBilledZAR: 'R640,000',
    grossMarginPct: 11.2,
    marginHealth: 'critical',
    debtorDays: 38,
    eskomOffsetPct: 62,
    operationalNotes: 'Margin severely eroded by 114 hrs of unbudgeted diesel runs during Stage 4 load shedding. Needs storage expansion or fuel indexation.',
  },
  {
    id: 'cust-3',
    name: 'Karoo Wool Processing Mill',
    industry: 'Textile & Primary Processing',
    location: 'Graaff-Reinet, Eastern Cape',
    systemCapacity: '450 kWp PV + 1.2 MWh BESS (Islanded)',
    contractModel: 'Lease-to-Own',
    monthlyBilledZAR: 'R490,000',
    grossMarginPct: 41.5,
    marginHealth: 'strong',
    debtorDays: 14,
    eskomOffsetPct: 98,
    operationalNotes: 'Highest margin profile. Operates virtually 100% off-grid with exceptional solar irradiance and reliable monthly debit order payment.',
  },
  {
    id: 'cust-4',
    name: 'Durban Cold Chain Marine',
    industry: 'Marine Logistics & Cold Store',
    location: 'Prospecton, KwaZulu-Natal',
    systemCapacity: '900 kWp Rooftop Solar',
    contractModel: 'PPA',
    monthlyBilledZAR: 'R820,000',
    grossMarginPct: 33.2,
    marginHealth: 'strong',
    debtorDays: 31,
    eskomOffsetPct: 71,
    operationalNotes: 'High baseline demand during port operating hours. Solid payer; exploring 1.8 MWh battery addition to capture night tariff arbitrage.',
  },
  {
    id: 'cust-5',
    name: 'Stellenbosch Wine Cellars',
    industry: 'Viticulture & Bottling',
    location: 'Stellenbosch, Western Cape',
    systemCapacity: '320 kWp Rooftop Solar',
    contractModel: 'O&M Retainer',
    monthlyBilledZAR: 'R210,000',
    grossMarginPct: 27.4,
    marginHealth: 'moderate',
    debtorDays: 45,
    eskomOffsetPct: 54,
    operationalNotes: 'Winter irradiance dip highlighted lack of storage. Currently implementing smart chiller load-shifting to protect client from Eskom peak tariffs.',
  },
];

export const mockOperationalSites: OperationalSite[] = [
  {
    id: 'site-1',
    name: 'Paarl Agri Microgrid Alpha',
    region: 'Western Cape',
    solarCapacityKwp: 1200,
    batteryCapacityKwh: 2400,
    status: 'commissioning',
    availabilityPct: 99.4,
    openTickets: 1,
    latestTelemetry: 'Solar: 420 kW | Battery: 78% SoC | Grid export: 0 kW (curtailed)',
  },
  {
    id: 'site-2',
    name: 'Jet Park Logistics Microgrid',
    region: 'Gauteng',
    solarCapacityKwp: 650,
    batteryCapacityKwh: 300,
    status: 'attention_required',
    availabilityPct: 97.2,
    openTickets: 2,
    latestTelemetry: 'Solar: 310 kW | Battery: 44% SoC | Genset standby: READY',
  },
  {
    id: 'site-3',
    name: 'Karoo High Sun Array',
    region: 'Eastern Cape',
    solarCapacityKwp: 450,
    batteryCapacityKwh: 1200,
    status: 'optimal',
    availabilityPct: 99.9,
    openTickets: 0,
    latestTelemetry: 'Solar: 415 kW | Battery: 94% SoC | Off-grid frequency: 50.02 Hz',
  },
  {
    id: 'site-4',
    name: 'Prospecton Industrial Solar',
    region: 'KwaZulu-Natal',
    solarCapacityKwp: 900,
    batteryCapacityKwh: 0,
    status: 'optimal',
    availabilityPct: 98.8,
    openTickets: 0,
    latestTelemetry: 'Solar: 680 kW | Grid draw: 220 kW | Inverter efficiency: 98.4%',
  },
];

export const mockPipeline: PipelineOpportunity[] = [
  {
    id: 'opp-1',
    name: 'Saldanha Seafood Microgrid',
    client: 'Saldanha Seafood Processing',
    systemSpec: '1.8 MWp PV + 3.2 MWh BESS',
    dealSizeZAR: 'R12,500,000',
    estimatedValueZAR: 'R12.5M',
    capexRequiredZAR: 'R4.20M',
    stage: 'Contract Finalization',
    estimatedMarginPct: 34.5,
    projectedIrrPct: 24.2,
    fundingFeasibility: 'Feasible with Debt Draw',
    commissioningTarget: 'Q4 2026',
  },
  {
    id: 'opp-2',
    name: 'Midrand Plastics Solar + Storage',
    client: 'Midrand Moulding Works',
    systemSpec: '800 kWp PV + 1.0 MWh BESS',
    dealSizeZAR: 'R6,800,000',
    estimatedValueZAR: 'R6.8M',
    capexRequiredZAR: 'R2.40M',
    stage: 'Tariff Feasibility',
    estimatedMarginPct: 32.0,
    projectedIrrPct: 21.5,
    fundingFeasibility: 'Feasible with Debt Draw',
    commissioningTarget: 'Q1 2027',
  },
  {
    id: 'opp-3',
    name: 'Ceres Fruit Storage Phase 2',
    client: 'Ceres Fruit Growers Co-op',
    systemSpec: '600 kWp PV Expansion',
    dealSizeZAR: 'R4,900,000',
    estimatedValueZAR: 'R4.9M',
    capexRequiredZAR: 'R1.10M',
    stage: 'Executive Review',
    estimatedMarginPct: 38.0,
    projectedIrrPct: 26.8,
    fundingFeasibility: 'Fully Funded',
    commissioningTarget: 'Q1 2027',
  },
  {
    id: 'opp-4',
    name: 'Boland Agri PPA Extension',
    client: 'Boland Fruit Exporters',
    systemSpec: '400 kWp PV + 500 kWh BESS',
    dealSizeZAR: 'R3,600,000',
    estimatedValueZAR: 'R3.6M',
    capexRequiredZAR: 'R950k',
    stage: 'Term Sheet Review',
    estimatedMarginPct: 31.0,
    projectedIrrPct: 19.4,
    fundingFeasibility: 'Fully Funded',
    commissioningTarget: 'Q2 2027',
  },
];

export const mockAssistantResponses: Record<string, AssistantResponse> = {
  cash: {
    answer:
      'Cash is currently tight because working capital is temporarily trapped in project milestones rather than operational insolvency.',
    keyDrivers: [
      'R1.15M in completed CATL battery modules sits unbilled at Paarl Cold Storage awaiting Drakenstein municipal dual-feed sign-off.',
      'Receivables aged beyond 30 days have grown to R720,000, primarily driven by Protea Logistics (R240k) and Stellenbosch Cellars (R110k).',
      'We absorbed R84,000 in unbudgeted diesel fuel charges to uphold uptime SLAs during August Stage 4 load shedding.',
    ],
    figuresToNote: [
      { label: 'Current Liquid Cash', value: 'R1.85M (42 days runway)' },
      { label: 'Pending Trapped Milestones', value: 'R1.15M' },
      { label: 'Receivables >30 Days', value: 'R720k' },
    ],
    recommendedAction:
      'Push for the Drakenstein electrical sign-off scheduled for this week. Securing this signature unlocks the R1.15M invoice, which immediately expands your liquid cash buffer back to 68 days (R3.0M).',
    deepLinkPerspective: 'cash_debt',
  },
  customer: {
    answer:
      'Protea Logistics Hub is currently your least profitable customer, delivering only an 11.2% gross margin against your 34% company benchmark.',
    keyDrivers: [
      'Contract specifies a fixed PPA tariff of R1.78/kWh with a 99.8% uptime SLA, but lacks an automatic diesel fuel price escalation clause.',
      'Their current battery storage (300 kWh) only buffers 2.2 hours. Stage 4/5 outages forced 114 hours of diesel generator backup at R23.80/L, costing R84,200 in unrecovered fuel.',
      'By comparison, Karoo Wool Mill yields 41.5% margin and Paarl Cold Storage yields 36.8%.',
    ],
    figuresToNote: [
      { label: 'Protea Gross Margin', value: '11.2% (down from 32%)' },
      { label: 'Monthly Billed', value: 'R640,000' },
      { label: 'Net Profit Realized', value: 'Only R14,200 this month' },
    ],
    recommendedAction:
      'Present Protea with a Capex-free storage expansion proposal: install an additional 400 kWh battery container funded via a modest R0.22/kWh tariff adjustment, or invoke the emergency fuel indexation addendum.',
    deepLinkPerspective: 'customers',
  },
  month_change: {
    answer:
      'Three primary shifts occurred between August and September: revenue grew +6.2%, but gross margin compressed by 2.6%, and the cash conversion cycle lengthened by 14 days.',
    keyDrivers: [
      'Commercial revenue expanded from R4.03M to R4.28M (+6.2%) due to Karoo Wool Mill milestone billing and higher winter commercial power usage.',
      'Diesel generator runs during Stage 4 grid load shedding introduced R84,000 in fuel expense, which pulled gross margin down from 34.0% to 31.4%.',
      'Operating cash reduced by R320,000 as battery inventory was delivered to Paarl but remained unbilled pending municipal sign-off.',
      'Eskom published draft MYPD7 tariffs proposing a 36.15% municipal rate increase for 2026/27, accelerating inbound C&I proposal requests by 40%.',
    ],
    figuresToNote: [
      { label: 'Revenue Delta', value: '+R250k (+6.2%)' },
      { label: 'Gross Margin Delta', value: '-2.6% (Fuel drag)' },
      { label: 'New Commercial Inquiries', value: '+40% M-o-M' },
    ],
    recommendedAction:
      'Leverage the upcoming Eskom 36% tariff hike to close the R12.5M Saldanha Seafood contract currently in final legal review.',
    deepLinkPerspective: 'financial',
  },
  battery: {
    answer:
      'You cannot safely afford another speculative battery on cash reserves alone right now, but you CAN execute it using your existing DBSA facility or a customer-backed lease.',
    keyDrivers: [
      'A 1.0 MWh C&I battery system costs approximately R3.6M to R4.2M landed in South Africa.',
      'With R1.85M in liquid cash, committing cash reserves would drain your operating buffer below the mandatory 30-day risk floor (R1.3M).',
      'However, Nala has R4.8M in undrawn concessional headroom under the DBSA Green Energy facility at prime minus 1.5%.',
      'Alternatively, if backed by a signed 10-year PPA (such as the pending Saldanha Seafood or Durban Marine contracts), debt servicing is 100% self-funding with a projected 24-28 month equity payback.',
    ],
    figuresToNote: [
      { label: 'Unrestricted Cash', value: 'R1.85M (Keep as buffer)' },
      { label: 'DBSA Undrawn Facility', value: 'R4.80M available' },
      { label: 'Estimated Battery Payback', value: '26 months at current Eskom tariffs' },
    ],
    recommendedAction:
      'Do not buy battery inventory on unbacked balance sheet cash. First collect the R1.15M Paarl milestone and sign the Saldanha PPA, then drawdown R3.8M from the DBSA facility with back-to-back revenue matching.',
    deepLinkPerspective: 'growth',
  },
};

export const mockOpenActions: {
  id: string;
  title: string;
  area: 'Operations' | 'Customers' | 'Growth' | 'Cash & Debt' | 'Financial' | 'Energy';
  due: string;
  businessImpact: string;
  completed?: boolean;
}[] = [
  {
    id: 'act-1',
    title: 'Finalise municipal sign-off',
    area: 'Operations',
    due: '18 Sep',
    businessImpact: 'Releases R1.15M',
    completed: false,
  },
  {
    id: 'act-2',
    title: 'Review customer contract',
    area: 'Customers',
    due: '21 Sep',
    businessImpact: 'Margin risk',
    completed: false,
  },
  {
    id: 'act-3',
    title: 'Submit financing documents',
    area: 'Growth',
    due: '28 Sep',
    businessImpact: 'Expansion dependency',
    completed: false,
  },
  {
    id: 'act-4',
    title: 'Automate chiller load-shifting',
    area: 'Energy',
    due: '16 Sep',
    businessImpact: 'Saves R38,000 peak power',
    completed: false,
  },
  {
    id: 'act-5',
    title: 'Finalize Karoo Wool Mill Phase 2 terms',
    area: 'Financial',
    due: '30 Sep',
    businessImpact: 'Secures R1.4M pipeline',
    completed: false,
  },
];

export const mockDataSources = [
  {
    view: 'Financial',
    sources: [
      { name: 'General Ledger.xlsx', status: 'Current', lastUpdated: 'Today at 06:30' },
      { name: 'Bank Transactions.xlsx', status: 'Current', lastUpdated: 'Today at 07:00' },
      { name: 'Payroll.xlsx', status: 'Update Soon', lastUpdated: '14 days ago' },
    ],
  },
  {
    view: 'Customers',
    sources: [
      { name: 'Contracts.xlsx', status: 'Update Soon', lastUpdated: '21 days ago' },
      { name: 'Invoices.xlsx', status: 'Current', lastUpdated: 'Yesterday' },
    ],
  },
  {
    view: 'Energy',
    sources: [
      { name: 'Hourly Operations.csv', status: 'Current', lastUpdated: '1 hour ago' },
      { name: 'Meter Data.csv', status: 'Current', lastUpdated: '1 hour ago' },
    ],
  },
];

