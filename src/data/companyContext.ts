// Complete connected company dataset for Nala Energy
// Used by the Cova Intelligence layer for system-wide reasoning

export interface CompanyTelemetry {
  reportingPeriod: string;
  currency: string;
  dataFreshness: {
    ledger: string;
    bank: string;
    scada: string;
    invoices: string;
    payroll: { status: 'Update Soon'; age: string };
    contracts: { status: 'Update Soon'; age: string };
  };
  financial: {
    totalRevenue: number;
    totalRevenueFormatted: string;
    revenueGrowthMoM: number;
    revenueBreakdown: {
      ppaRevenue: { amount: number; formatted: string; share: string };
      epcRevenue: { amount: number; formatted: string; share: string };
      omRevenue: { amount: number; formatted: string; share: string };
      otherRevenue: { amount: number; formatted: string; share: string };
    };
    operatingProfit: number;
    operatingProfitFormatted: string;
    operatingMargin: number;
    targetMargin: number;
    marginVariance: number;
    costsBreakdown: {
      directEnergy: { amount: number; formatted: string; share: string };
      operatingExpenses: { amount: number; formatted: string; share: string };
      financeCosts: { amount: number; formatted: string; share: string };
      otherOutflows: { amount: number; formatted: string; share: string };
    };
  };
  cashAndDebt: {
    liquidCash: number;
    liquidCashFormatted: string;
    cashRunwayDays: number;
    internalSafetyBufferDays: number;
    safetyBufferAmount: number;
    dailyNetBurn: number;
    workingCapitalTrapped: {
      account: string;
      amount: number;
      formatted: string;
      reason: string;
    };
    debtObligations: number;
    debtObligationsFormatted: string;
    lender: string;
    facilityType: string;
    monthlyAmortization: number;
    interestRate: string;
    dscrActual: number;
    dscrCovenantFloor: number;
    dscrHeadroom: number;
    undrawnFacilityHeadroom: number;
  };
  customers: Array<{
    name: string;
    sector: string;
    monthlyRevenue: number;
    monthlyRevenueFormatted: string;
    grossMargin: number;
    marginQuality: 'High' | 'Moderate' | 'Compressed';
    consumptionPattern: string;
    riskOrNote: string;
  }>;
  energyAndOperations: {
    totalOperatingSites: number;
    installedSolarCapacity: string;
    installedStorageCapacity: string;
    monthlyGenerationMWh: number;
    solarPerformanceRatio: number;
    gridCurtailmentEvents: number;
    peakEskomTariff: string;
    dieselPricePerLiter: string;
    keyOperationalIssues: Array<{
      site: string;
      issue: string;
      financialImpact: string;
      rootCause: string;
      resolutionPath: string;
    }>;
  };
  growthAndProjects: {
    activeExpansionProjects: Array<{
      project: string;
      stage: string;
      capex: string;
      expectedAnnualRevenue: string;
      dependencies: string;
    }>;
    pipelineOpportunities: Array<{
      client: string;
      dealValue: string;
      status: string;
      timeline: string;
    }>;
  };
}

export const nalaCompanyContext: CompanyTelemetry = {
  reportingPeriod: 'September 2026',
  currency: 'ZAR (R)',
  dataFreshness: {
    ledger: 'Updated today at 06:30 SAST (Current)',
    bank: 'Updated today at 07:00 SAST (Current)',
    scada: 'Live stream active (1 hour ago)',
    invoices: 'Updated yesterday (Current)',
    payroll: { status: 'Update Soon', age: '14 days old' },
    contracts: { status: 'Update Soon', age: '21 days old' },
  },
  financial: {
    totalRevenue: 4280000,
    totalRevenueFormatted: 'R4.28M',
    revenueGrowthMoM: 6.2,
    revenueBreakdown: {
      ppaRevenue: { amount: 2640000, formatted: 'R2.64M', share: '61.7%' },
      epcRevenue: { amount: 1100000, formatted: 'R1.10M', share: '25.7%' },
      omRevenue: { amount: 540000, formatted: 'R540k', share: '12.6%' },
      otherRevenue: { amount: 0, formatted: 'R0k', share: '0.0%' },
    },
    operatingProfit: 1340000,
    operatingProfitFormatted: 'R1.34M',
    operatingMargin: 31.4,
    targetMargin: 34.0,
    marginVariance: -2.6,
    costsBreakdown: {
      directEnergy: { amount: 1420000, formatted: 'R1.42M', share: '48.3%' },
      operatingExpenses: { amount: 980000, formatted: 'R980k', share: '33.3%' },
      financeCosts: { amount: 540000, formatted: 'R540k', share: '18.4%' },
      otherOutflows: { amount: 0, formatted: 'R0k', share: '0.0%' },
    },
  },
  cashAndDebt: {
    liquidCash: 1850000,
    liquidCashFormatted: 'R1.85M',
    cashRunwayDays: 42,
    internalSafetyBufferDays: 30,
    safetyBufferAmount: 1300000,
    dailyNetBurn: 44000,
    workingCapitalTrapped: {
      account: 'Paarl Cold Storage (Drakenstein)',
      amount: 1150000,
      formatted: 'R1.15M',
      reason: 'Delivered battery hardware awaiting municipal SSEG anti-islanding relay inspection',
    },
    debtObligations: 3400000,
    debtObligationsFormatted: 'R3.40M',
    lender: 'Development Bank of Southern Africa (DBSA)',
    facilityType: 'Senior Concessional Term Debt',
    monthlyAmortization: 185000,
    interestRate: 'Prime minus 1.5% (10.25%)',
    dscrActual: 1.78,
    dscrCovenantFloor: 1.30,
    dscrHeadroom: 0.48,
    undrawnFacilityHeadroom: 4800000,
  },
  customers: [
    {
      name: 'Protea Cold Storage',
      sector: 'Food Logistics & Cold Chain',
      monthlyRevenue: 840000,
      monthlyRevenueFormatted: 'R840k',
      grossMargin: 19.2,
      marginQuality: 'Compressed',
      consumptionPattern: 'Heavy 18:00–21:00 evening refrigeration draw requiring grid & diesel top-up',
      riskOrNote: 'Burns emergency diesel during Stage 4 load shedding (R84,000 unbudgeted fuel cost in September). Lowest margin account despite highest raw revenue.',
    },
    {
      name: 'Karoo Wool Mill',
      sector: 'Textiles & Agro-Processing',
      monthlyRevenue: 1480000,
      monthlyRevenueFormatted: 'R1.48M (R380k PPA + R1.10M EPC)',
      grossMargin: 38.5,
      marginQuality: 'High',
      consumptionPattern: 'Daytime mechanical spinning aligned 92% with solar peak curve',
      riskOrNote: 'Phase 1 EPC milestone billed this month; Phase 2 expansion terms currently in review.',
    },
    {
      name: 'Stellenbosch Agro-Pack',
      sector: 'Fruit Packing & Cold Storage',
      monthlyRevenue: 620000,
      monthlyRevenueFormatted: 'R620k',
      grossMargin: 36.4,
      marginQuality: 'High',
      consumptionPattern: 'Peak afternoon sorting, partially smoothed by 1.2 MWh on-site battery',
      riskOrNote: 'Stable PPA off-taker with 99.4% timely payment record.',
    },
    {
      name: 'Cape Dairy Processing',
      sector: 'Dairy Production',
      monthlyRevenue: 490000,
      monthlyRevenueFormatted: 'R490k',
      grossMargin: 24.1,
      marginQuality: 'Compressed',
      consumptionPattern: 'Early morning 04:00 pasteurization and evening refrigeration',
      riskOrNote: 'Inverter #3 trip caused 18 MWh generation loss; repairs complete.',
    },
    {
      name: 'Atlantis Plastics',
      sector: 'Industrial Extrusion',
      monthlyRevenue: 520000,
      monthlyRevenueFormatted: 'R520k',
      grossMargin: 34.8,
      marginQuality: 'Moderate',
      consumptionPattern: '24-hour continuous extrusion baseload',
      riskOrNote: 'High load factor, excellent PPA margin match.',
    },
  ],
  energyAndOperations: {
    totalOperatingSites: 8,
    installedSolarCapacity: '14.8 MWp',
    installedStorageCapacity: '28.4 MWh',
    monthlyGenerationMWh: 1840,
    solarPerformanceRatio: 78.4,
    gridCurtailmentEvents: 14,
    peakEskomTariff: 'R4.12/kWh (Megaflex peak window)',
    dieselPricePerLiter: 'R23.80/L',
    keyOperationalIssues: [
      {
        site: 'Paarl Cold Storage',
        issue: 'SSEG regulatory sign-off pending with Drakenstein municipality',
        financialImpact: 'R1.15M trapped working capital',
        rootCause: 'Engineering inspector requested anti-islanding relay test documentation',
        resolutionPath: 'Scheduled joint site inspection with municipal electrical engineer for 18 September',
      },
      {
        site: 'Protea Cold Storage',
        issue: 'Diesel genset dispatched for 42 hours during Stage 4 load shedding',
        financialImpact: 'R84,000 in unbudgeted diesel fuel expense',
        rootCause: 'Lack of dedicated evening battery storage forcing diesel backup to protect cold chain',
        resolutionPath: 'Propose 400 kWh storage expansion with R0.22/kWh tariff adjustment',
      },
      {
        site: 'Cape Dairy Processing',
        issue: 'Inverter #3 high-voltage communication fault',
        financialImpact: 'R38,000 in replacement grid purchases during solar hours',
        rootCause: 'Thermal trip during mid-day heat spike; firmware patch applied',
        resolutionPath: 'Firmware updated; site restored to full generation capacity on 08 September',
      },
    ],
  },
  growthAndProjects: {
    activeExpansionProjects: [
      {
        project: 'Karoo Wool Mill Phase 2',
        stage: 'Contract negotiation / Final terms',
        capex: 'R3.2M',
        expectedAnnualRevenue: 'R1.4M',
        dependencies: 'Sign-off on Phase 1 commissioning and CoC issuance',
      },
      {
        project: 'Saldanha Seafood Microgrid',
        stage: 'PPA Feasibility & Board Approval',
        capex: 'R12.5M over 10 years',
        expectedAnnualRevenue: 'R2.8M',
        dependencies: 'Concessional DBSA debt drawdown allocation (R4.8M available headroom)',
      },
    ],
    pipelineOpportunities: [
      {
        client: 'Overberg Grain Silos',
        dealValue: 'R4.6M EPC + 15-year O&M',
        status: 'RFP submitted',
        timeline: 'Decision expected October 2026',
      },
    ],
  },
};
