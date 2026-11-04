import { DiscussTopicContext } from '../types';

export function generateIntelligenceResponse(
  userQuery: string,
  context?: DiscussTopicContext | null
): string {
  const q = userQuery.toLowerCase().trim();

  // 1. RECOMMENDATIONS / OPTIONS REQUEST ("what should I do", "what are my options", "recommend", "options")
  if (
    q.includes('what should i do') ||
    q.includes('what are my options') ||
    q.includes('what are our options') ||
    q.includes('recommendation') ||
    q.includes('options') ||
    q.includes('what do you recommend') ||
    q.includes('explore possible responses')
  ) {
    if (q.includes('grid') || q.includes('tariff') || q.includes('eskom')) {
      return `Here are two realistic approaches to handle rising grid tariffs:

Option 1: Deploy dedicated battery storage arbitrage for evening off-takers
• Expected benefit: Shifts evening refrigeration load from peak grid rates (approx. R4.12–R4.53/kWh) to stored solar, recovering roughly R64k/month in margin.
• Cost: Approx. R1.6M capex (can be funded via the undrawn DBSA facility).
• Risk & constraints: 8- to 12-week equipment delivery lead time.
• Uncertainty: Grid outage frequency may alter battery discharge schedules.

Option 2: Activate PPA tariff escalation / fuel surcharge provisions
• Expected benefit: Passes 60% to 75% of grid tariff hikes directly to customers on variable contracts.
• Cost: Minimal financial outlay; administrative contract review.
• Risk & constraints: Commercial sensitivity with key clients like Protea Cold Storage.
• Uncertainty: Depends on individual contract anniversary dates.

Which of these avenues aligns better with your customer retention and capital priorities?`;
    }

    if (q.includes('afford') || q.includes('karoo') || q.includes('capex')) {
      return `Here are two viable financing structures for the R3.2M Karoo Phase 2 capex:

Option 1: 100% Concessional DBSA Facility Drawdown
• Expected benefit: Preserves your entire R1.85M liquid cash reserve, keeping safety buffers fully intact during winter.
• Cost: Approx. R44,000/month in interest (Prime - 1.5%, ~10.25%).
• Risk & constraints: Absorbs R3.2M of your R4.8M available facility headroom; DSCR temporarily drops from 1.78x to approx. 1.58x during construction before rising to 1.94x upon operation.
• Uncertainty: Minor exposure to Prime interest rate movements.

Option 2: 80/20 Debt-Equity Split (R2.56M Debt / R640k Cash)
• Expected benefit: Leaves R2.24M in undrawn debt headroom for other emergency needs.
• Cost: R640k upfront cash outflow plus approx. R35,000/month in interest.
• Risk & constraints: Drops liquid cash to R1.21M, slightly below your R1.30M internal safety buffer until Paarl funds clear.
• Uncertainty: Requires Paarl's R1.15M release to replenish the cash buffer quickly.

Would you prefer to preserve cash buffer completely, or keep more debt headroom open?`;
    }

    // Default options for operating profit / Protea
    return `Here are two realistic options to address the margin variance:

Option 1: Add a 400 kWh battery storage add-on at Protea Cold Storage
• Expected benefit: Eliminates emergency diesel generation and raises Protea's gross margin from 19.2% to roughly 33%.
• Cost: Approx. R1.6M capex (can be financed through DBSA headroom).
• Risk & constraints: Requires capex approval and roughly 10 weeks for delivery and commissioning.
• Uncertainty: Requires Protea agreeing to a small evening capacity reliability tariff.

Option 2: Implement a load shedding diesel pass-through clause in the PPA
• Expected benefit: Transfers unbudgeted fuel risk directly to the customer during Stage 4+ load shedding.
• Cost: Minimal capital cost; commercial negotiation effort.
• Risk & constraints: Customer may request concessions or caps on fuel surcharges.
• Uncertainty: Timing depends on contract review cycles.

Which direction would you like to explore first?`;
  }

  // 2. OPERATING PROFIT / MARGIN VARIANCE
  if (
    q.includes('profit') ||
    q.includes('margin') ||
    q.includes('operating profit') ||
    q.includes('below target') ||
    q.includes('why did profit') ||
    q.includes('variance')
  ) {
    return `Operating profit fell mainly because of unplanned energy costs, not weaker revenue.

Protea's diesel backup added R84k in costs and the Cape Dairy inverter issue added approximately R38k in additional grid purchases. Together these appear to explain most of the month's margin variance.

What this means: the main issue this month is cost exposure rather than declining sales.

Would you like to explore possible responses, or investigate the cause further?`;
  }

  // 3. SCENARIO: CUSTOMER PAYS LATE
  if (
    q.includes('pays late') ||
    q.includes('late payment') ||
    q.includes('delay payment') ||
    q.includes('delayed payment') ||
    q.includes('what if protea pays late')
  ) {
    return `If Protea Cold Storage (R840k/month) delays payment by 30 days, liquid cash would drop to approximately R1.01M, falling below your R1.30M internal safety buffer for about two weeks.

Operating cash runway would temporarily compress from 42 days to roughly 23 days because rigid commitments—such as debt service (R185k) and direct energy purchases (R1.42M)—must be paid regardless of billing delays. However, you retain R4.8M in undrawn facility headroom with DBSA as an emergency cushion.

What this means: the business faces a temporary working capital dip rather than an insolvency risk.

Would you like to explore options to manage this working capital gap, or model this scenario with different payment dates?`;
  }

  // 4. SCENARIO: ESKOM GRID PRICES / TARIFF INCREASE
  if (
    q.includes('grid price') ||
    q.includes('grid prices') ||
    q.includes('tariff') ||
    q.includes('eskom') ||
    q.includes('electricity price')
  ) {
    return `A 10% increase in Eskom grid tariffs would raise monthly direct energy costs by approximately R142,000, reducing operating margin from 31.4% to roughly 28.1%.

This cost impact concentrates on customers with heavy evening refrigeration cycles—specifically Protea Cold Storage and Cape Dairy—where cooling demand peaks after sunset. Under current contracts, this escalation is not immediately passed through.

What this means: rising tariffs will continue to squeeze margins on evening-heavy accounts unless peak storage is added or tariff adjustment clauses are triggered.

Would you like to explore possible responses, or investigate the impact across individual customer contracts?`;
  }

  // 5. AFFORDABILITY / CAPEX / KAROO PHASE 2
  if (
    q.includes('afford') ||
    q.includes('karoo') ||
    q.includes('phase 2') ||
    q.includes('capex') ||
    q.includes('investment')
  ) {
    return `You cannot afford to self-fund the R3.2M Karoo Wool Mill Phase 2 from liquid cash alone, but you can comfortably fund it using your undrawn DBSA facility.

Self-funding would deplete your current R1.85M cash balance and breach your R1.30M safety buffer. In contrast, drawing R3.2M from the DBSA facility (at Prime - 1.5%, approximately 10.25%) adds about R44k in monthly interest, which is more than covered by Phase 2's projected R116k monthly EBITDA.

What this means: the expansion is affordable and viable through debt facilities without jeopardizing operational cash reserves.

Would you like to review the financing structure options, or examine the projected commissioning milestones?`;
  }

  // 6. LOW-MARGIN CUSTOMERS / PROTEA / CUSTOMER PROFITABILITY
  if (
    q.includes('low-margin') ||
    q.includes('low margin') ||
    q.includes('customer') ||
    q.includes('protea') ||
    q.includes('consumption pattern')
  ) {
    return `Protea Cold Storage is your highest-revenue customer (R840k/month) but delivers your lowest gross margin at approximately 19.2%.

Their peak cooling demand runs from 18:00 to 21:00 outside solar generation hours, requiring expensive peak grid draw and emergency diesel backup during load shedding. By comparison, daytime customers like Karoo Wool Mill yield a 38.5% margin.

What this means: your largest customer is also your most exposed to grid and fuel cost volatility.

Would you like to explore ways to improve this account's margin, or investigate other customer profiles?`;
  }

  // 7. FORWARD LOOK / NEXT MONTH
  if (
    q.includes('next month') ||
    q.includes('likely to happen') ||
    q.includes('outlook') ||
    q.includes('forecast') ||
    q.includes('august')
  ) {
    return `Next month, revenue is expected to remain steady between R4.10M and R4.30M, while liquid cash could rise to approximately R2.95M if the Paarl regulatory sign-off is completed.

Releasing Paarl's trapped R1.15M milestone payment would extend your cash runway from 42 days to roughly 68 days. Operating margin is forecast near 31.8%, provided diesel usage at Protea remains at normal levels.

What this means: the company's financial cushion will improve substantially once the pending municipal inspection is concluded.

Would you like to review the Paarl timeline, or simulate cash flow under different grid outage scenarios?`;
  }

  // 8. CASH / LIQUIDITY / RUNWAY
  if (
    q.includes('cash') ||
    q.includes('liquid') ||
    q.includes('runway') ||
    q.includes('burn')
  ) {
    return `Liquid cash currently stands at R1.85M (42 days of runway), with R1.15M in working capital trapped pending a municipal inspection at Paarl Cold Storage.

The physical microgrid installation is fully complete, but the final 30% invoice cannot legally be submitted until the Drakenstein SSEG anti-islanding relay test is signed off.

What this means: cash conversion is delayed by administrative sign-off rather than project failure. Releasing this amount will expand cash to approx. R3.0M.

Would you like to review the inspection steps, or examine upcoming cash commitments?`;
  }

  // 9. CONTEXT-SPECIFIC FALLBACK
  if (context?.type === 'metric') {
    return `${context.title} is currently recorded at ${context.value || 'current levels'}${
      context.change ? ` (${context.change})` : ''
    }.

Performance across our 8 active microgrids remains stable with 98.2% solar uptime, though margins are sensitive to evening grid tariffs and emergency fuel burn.

What this means: this metric is performing within operational tolerance, but warrants monitoring against monthly cost drivers.

Would you like to explore the drivers behind this metric, or compare it against target?`;
  }

  if (context?.type === 'issue') {
    return `Regarding "${context.title}": the primary focus is concluding the on-site technical sign-off to unfreeze milestone billing.

Clearing this item will release trapped working capital into cash and keep debt service coverage comfortably above lender covenant minimums.

What this means: resolving this issue provides immediate liquidity without incurring additional debt.

Would you like to examine the next resolution steps, or evaluate the impact on runway?`;
  }

  // 10. GENERAL DEFAULT OVERVIEW
  return `Nala Energy's overall financial position is sound: September revenue reached R4.28M (+6.2% MoM) with an operating profit of R1.34M and a 1.78x debt service coverage ratio.

The two main dynamics this month are:
1. Unplanned energy costs at Protea and Cape Dairy compressed operating margins from the 34% target down to 31.4%.
2. R1.15M in working capital remains locked pending the Paarl municipal inspection.

What this means: customer demand is healthy; near-term focus is best placed on cost exposure and unlocking the trapped cash.

Which of these areas would you like to look into?`;
}
