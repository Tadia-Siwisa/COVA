import React, { useState } from 'react';
import { OperationalSite } from '../types';
import { PageHeaderActions } from './PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from '../utils/exportUtils';
import {
  Info,
  X,
  FileSpreadsheet,
  MessageSquare,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  BatteryCharging,
} from 'lucide-react';

interface OperationsViewProps {
  sites: OperationalSite[];
  onUpdateSites: (newSites: OperationalSite[], auditNotes: string[]) => void;
  onOpenSource: () => void;
  onOpenIntelligence: (context: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  sites,
  onOpenSource,
  onOpenIntelligence,
}) => {
  const [selectedSite, setSelectedSite] = useState<OperationalSite | null>(null);

  // Supply to Demand generation breakdown (reconciles to 924 MWh = 100%)
  const [supplyToDemand] = useState([
    {
      source: 'Solar Supplied Directly',
      volumeMwh: 578,
      sharePct: 62.6,
      effectiveCostZAR: 'R1.72 / kWh',
      financialCostZAR: 'R994,160',
      type: 'clean',
    },
    {
      source: 'Grid Supplied Directly',
      volumeMwh: 262,
      sharePct: 28.3,
      effectiveCostZAR: 'R2.88 / kWh',
      financialCostZAR: 'R754,560',
      type: 'grid',
    },
    {
      source: 'Backup Diesel Generation',
      volumeMwh: 84,
      sharePct: 9.1,
      effectiveCostZAR: 'R6.20 / kWh',
      financialCostZAR: 'R520,800',
      type: 'diesel',
    },
  ]);

  // Battery Storage Activity (Time-shifting asset)
  const [batteryMetrics] = useState({
    chargedMwh: 210,
    dischargedMwh: 192,
    roundTripEfficiencyPct: 91.4,
    peakShiftedMwh: 192,
    avoidedPeakCostZAR: 'R470,400',
  });

  const totalDemandMwh = supplyToDemand.reduce((sum, item) => sum + item.volumeMwh, 0);
  const totalFleetCapacityKwp = sites.reduce((sum, s) => sum + s.solarCapacityKwp, 0);
  const avgAvailabilityPct = (
    sites.reduce((sum, s) => sum + s.availabilityPct, 0) / (sites.length || 1)
  ).toFixed(1);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const columns = [
      { key: 'name', label: 'Asset / Site' },
      { key: 'region', label: 'Location' },
      { key: 'solarCapacityKwp', label: 'Capacity (kWp)' },
      { key: 'batteryCapacityKwh', label: 'Storage (kWh)' },
      { key: 'status', label: 'Status' },
      { key: 'availabilityPct', label: 'Availability (%)' },
    ];
    if (format === 'csv') {
      exportToCSV('Operations_Fleet_September_2026', columns, sites);
    } else if (format === 'excel') {
      exportToExcel('Operations_Fleet_September_2026', columns, sites);
    } else {
      printOrExportPDF('Operations Performance — September 2026', columns, sites);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#181c20] rounded-xl border border-stone-200/90 dark:border-[#262c34] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#262c34]">
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Operations
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Operational asset fleet, generation dispatch balance, battery storage, and site availability.
            </p>
          </div>

          <PageHeaderActions
            pageTitle="Operations"
            pageContext="Operations"
            onOpenSource={onOpenSource}
            onOpenIntelligence={onOpenIntelligence}
            onExport={handleExport}
            sourceLabel="Source: Telemetry & Asset Register"
            sourceFileHint="Hourly_Energy_Operations.xlsx & Asset_Register.xlsx"
          />
        </div>

        {/* Operational Synthesis Callout */}
        <div className="my-4 p-3.5 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e] text-sm sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-stone-900 dark:text-stone-100">
              Operational insight:
            </strong>{' '}
            Microgrid fleet uptime averaged {avgAvailabilityPct}% with solar directly supplying 62.6% of customer demand. Paarl Cold Storage installation is physically complete, awaiting municipal relay sign-off for full commissioning.
          </div>
        </div>

        {/* Core Operational KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">
              Operational Fleet
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                {sites.length} Sites
              </span>
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 block">
              {totalFleetCapacityKwp.toLocaleString()} kWp solar PV installed
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">
              Fleet Availability
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-editorial text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {avgAvailabilityPct}%
              </span>
            </div>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              7 optimal, 1 commissioning
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">
              Blended Energy Cost
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                R1.84 / kWh
              </span>
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 block">
              36% below Eskom standard tariff
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-sm text-stone-600 dark:text-stone-400 block font-medium">
              Avoided Peak Tariff Cost
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-editorial text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                +R470,400
              </span>
            </div>
            <span className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 block">
              192 MWh battery peak discharge
            </span>
          </div>
        </div>

        {/* Section 1: Fleet Assets & Operating Status */}
        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Site Installations & Asset Reliability
            </h2>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              Click a site row to view engineering specifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[660px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm">
                  <th className="py-2.5 px-3">Asset / Site</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3 text-right">Capacity</th>
                  <th className="py-2.5 px-3 text-right">Storage</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Availability</th>
                  <th className="py-2.5 px-3 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-[#232932] text-stone-800 dark:text-stone-200 font-mono-numbers">
                {sites.map((site) => {
                  return (
                    <tr
                      key={site.id}
                      onClick={() => setSelectedSite(site)}
                      className="cursor-pointer transition-colors hover:bg-stone-50/70 dark:hover:bg-[#1b2027]"
                    >
                      <td className="py-3 px-3 font-sans font-semibold text-stone-900 dark:text-stone-100">
                        {site.name}
                      </td>
                      <td className="py-3 px-3 font-sans text-stone-600 dark:text-stone-400">
                        {site.region}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-stone-900 dark:text-stone-100">
                        {site.solarCapacityKwp} kWp
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-stone-900 dark:text-stone-100">
                        {site.batteryCapacityKwh ? `${site.batteryCapacityKwh} kWh` : 'None'}
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-sm font-medium capitalize ${
                            site.status === 'optimal'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                              : site.status === 'commissioning'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40'
                          }`}
                        >
                          {site.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-stone-900 dark:text-stone-100">
                        {site.availabilityPct}%
                      </td>
                      <td className="py-3 px-3 text-right font-sans text-sm text-stone-600 dark:text-stone-400">
                        Today, 07:00
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Generation vs Customer Demand Reconciliation */}
        <div className="mt-8 pt-5 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Supply to Customer Demand (Reconciled Total: {totalDemandMwh} MWh)
            </h2>
            <span className="text-sm font-mono-numbers text-stone-600 dark:text-stone-400">
              Solar (62.6%) + Grid (28.3%) + Generator (9.1%) = 100%
            </span>
          </div>

          {/* Clean Proportional Supply Stacked Bar */}
          <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 dark:bg-[#20252b] border border-stone-200/60 dark:border-[#2e3642]">
            <div
              style={{ width: '62.6%' }}
              className="bg-blue-700 dark:bg-blue-600 h-full"
              title="Solar Supplied Directly (578 MWh, 62.6%)"
            />
            <div
              style={{ width: '28.3%' }}
              className="bg-stone-400 dark:bg-stone-500 h-full"
              title="Grid Supplied Directly (262 MWh, 28.3%)"
            />
            <div
              style={{ width: '9.1%' }}
              className="bg-rose-500 dark:bg-rose-600 h-full"
              title="Backup Diesel Generation (84 MWh, 9.1%)"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 text-sm text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-700 dark:bg-blue-600" />
              <span>Solar Supplied Directly (578 MWh · 62.6%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-stone-400 dark:bg-stone-500" />
              <span>Grid Supplied Directly (262 MWh · 28.3%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 dark:bg-rose-600" />
              <span>Backup Diesel Generation (84 MWh · 9.1%)</span>
            </div>
          </div>

          {/* Primary Supply Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-sm">
                  <th className="py-2.5 px-3">Primary Energy Stream</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">Share of Demand</th>
                  <th className="py-2.5 px-3 text-right">Effective Rate</th>
                  <th className="py-2.5 px-3 text-right">Financial Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-[#232932] font-mono-numbers text-stone-800 dark:text-stone-200">
                {supplyToDemand.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-[#1b2027]">
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-900 dark:text-stone-100">
                      {row.source}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      {row.volumeMwh} MWh
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium">
                      {row.sharePct}%
                    </td>
                    <td className="py-2.5 px-3 text-right text-stone-600 dark:text-stone-400">
                      {row.effectiveCostZAR}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-stone-900 dark:text-stone-100">
                      {row.financialCostZAR}
                    </td>
                  </tr>
                ))}
                <tr className="bg-stone-50/80 dark:bg-[#1c2229] font-bold text-stone-900 dark:text-stone-100">
                  <td className="py-2.5 px-3 font-sans">Total Customer Demand</td>
                  <td className="py-2.5 px-3 text-right">{totalDemandMwh} MWh</td>
                  <td className="py-2.5 px-3 text-right">100.0%</td>
                  <td className="py-2.5 px-3 text-right text-stone-600 dark:text-stone-400">R1.84 / kWh</td>
                  <td className="py-2.5 px-3 text-right">R2,269,520</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Battery Storage Activity (Time-Shifting Asset) */}
        <div className="mt-8 pt-5 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex items-center gap-2 mb-3">
            <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Battery Storage Activity (Time-Shifting Asset)
            </h2>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
            Battery storage captures excess daytime solar and discharges during peak evening tariff windows. It shifts energy in time rather than producing primary generation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Energy Charged</span>
              <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                {batteryMetrics.chargedMwh} MWh
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">From daytime solar</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Energy Discharged</span>
              <span className="font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {batteryMetrics.dischargedMwh} MWh
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">91.4% round-trip efficiency</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Peak Energy Shifted</span>
              <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                {batteryMetrics.peakShiftedMwh} MWh
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">Displaced 17:00–20:00 grid</span>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
              <span className="text-stone-500 dark:text-stone-400 block text-sm">Peak Cost Avoided</span>
              <span className="font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {batteryMetrics.avoidedPeakCostZAR}
              </span>
              <span className="text-sm text-stone-500 block mt-0.5">R2.45/kWh peak arbitrage</span>
            </div>
          </div>
        </div>

        {/* Data Limitation Notice */}
        <div className="mt-6 p-3.5 rounded-lg bg-stone-50 dark:bg-[#161a1f] border border-stone-200/80 dark:border-[#262c35] flex items-start gap-2.5 text-sm text-stone-600 dark:text-stone-400">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-800 dark:text-stone-200 font-semibold">
              Operational Telemetry Notice:
            </strong>{' '}
            Facility records are refreshed daily from SCADA controllers. Detailed 15-minute interval meter data can be inspected or updated directly via the underlying source files.
          </div>
        </div>
      </div>

      {/* Centered Asset Detail Modal */}
      {selectedSite && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedSite(null)}
        >
          <div
            className="bg-white dark:bg-[#181c20] border border-stone-200 dark:border-[#262c34] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-[#262c34]">
              <div>
                <span className="text-sm uppercase font-semibold text-stone-500 dark:text-stone-400 tracking-wider">
                  Asset & Site Specifications
                </span>
                <h2 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedSite.name}
                </h2>
                <span className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {selectedSite.region}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202730] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-sm">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">Solar PV Capacity</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedSite.solarCapacityKwp} kWp
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">Battery Storage</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedSite.batteryCapacityKwh ? `${selectedSite.batteryCapacityKwh} kWh` : 'None'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">System Availability</span>
                <span className="font-mono-numbers font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {selectedSite.availabilityPct}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">Active Open Tickets</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedSite.openTickets} {selectedSite.openTickets === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">Inverter Technology</span>
                <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                  SMA Sunny Tripower + Victron
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-sm">Warranty Status</span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> CATL 10-Yr Cell Warranty
                </span>
              </div>
            </div>

            {/* Operational Telemetry Details */}
            <div className="p-3.5 rounded-xl bg-stone-50/90 dark:bg-[#1f252d] border border-stone-200/80 dark:border-[#2b333e] text-sm leading-relaxed mb-5">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                Telemetry Log Summary:
              </span>
              <p className="font-mono text-stone-700 dark:text-stone-300">
                {selectedSite.latestTelemetry}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-[#262c34] flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSite(null);
                  onOpenSource();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-[#202730] border border-stone-200/80 dark:border-[#2b333d] transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source Log Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const siteName = selectedSite.name;
                  setSelectedSite(null);
                  onOpenIntelligence(`Operations — ${siteName}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Discuss {selectedSite.name} in Cova</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
