import React, { useState } from 'react';
import { CustomerAccount } from '../types';
import { PageHeaderActions } from './PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from '../utils/exportUtils';
import {
  Info,
  X,
  FileSpreadsheet,
  MessageSquare,
  AlertTriangle,
  Clock,
  Zap,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface CustomersViewProps {
  customers: CustomerAccount[];
  onUpdateCustomers: (newCustomers: CustomerAccount[], auditNotes: string[]) => void;
  onOpenSource: () => void;
  onOpenIntelligence: (context: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenSource,
  onOpenIntelligence,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const columns = [
      { key: 'name', label: 'Customer' },
      { key: 'industry', label: 'Industry' },
      { key: 'contractModel', label: 'Contract' },
      { key: 'monthlyBilledZAR', label: 'Revenue (MTD)' },
      { key: 'grossMarginPct', label: 'Gross Margin %' },
      { key: 'debtorDays', label: 'Debtor Days' },
      { key: 'eskomOffsetPct', label: 'Energy Exposure (Grid Offset %)' },
    ];
    if (format === 'csv') {
      exportToCSV('Customer_Performance_September_2026', columns, customers);
    } else if (format === 'excel') {
      exportToExcel('Customer_Performance_September_2026', columns, customers);
    } else {
      printOrExportPDF('Customer Performance — September 2026', columns, customers);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#181c20] rounded-xl border border-stone-200/90 dark:border-[#262c34] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#262c34]">
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Customer Performance
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Active commercial off-takers, revenue billing, contract terms, and margin health.
            </p>
          </div>

          <PageHeaderActions
            pageTitle="Customer Performance"
            pageContext="Customers"
            onOpenSource={onOpenSource}
            onOpenIntelligence={onOpenIntelligence}
            onExport={handleExport}
            sourceLabel="Source: Invoices & Contracts"
            sourceFileHint="Customer_Invoices.xlsx & Customer_Contracts.xlsx"
          />
        </div>

        {/* Concise Intelligence Finding (No auto-recommended solutions) */}
        <div className="my-4 p-3.5 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e] text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-stone-900 dark:text-stone-100">
              Account finding:
            </strong>{' '}
            Protea Logistics has the lowest customer margin at 11.2%, driven mainly by backup-energy costs.
          </div>
        </div>

        {/* Customer Accounts Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Contract</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Gross Margin</th>
                <th className="py-2.5 px-3 text-right">Payment Status</th>
                <th className="py-2.5 px-3 text-right">Energy Exposure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#232932] text-stone-800 dark:text-stone-200 font-mono-numbers">
              {customers.map((cust) => {
                const isCritical = cust.marginHealth === 'critical';

                return (
                  <tr
                    key={cust.id}
                    id={`customer-row-${cust.id}`}
                    onClick={() => setSelectedCustomer(cust)}
                    className="cursor-pointer transition-colors hover:bg-stone-50/70 dark:hover:bg-[#1b2027]"
                  >
                    {/* Customer */}
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">
                        {cust.name}
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        {cust.industry}
                      </div>
                    </td>

                    {/* Contract */}
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1f252d] text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-[#2b333e] text-[11px]">
                        {cust.contractModel}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-3 text-right font-medium text-stone-900 dark:text-stone-100">
                      {cust.monthlyBilledZAR}
                    </td>

                    {/* Gross Margin */}
                    <td
                      className={`py-3 px-3 text-right font-semibold ${
                        isCritical
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {cust.grossMarginPct}%
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-3 text-right font-sans">
                      <span
                        className={`font-mono-numbers ${
                          cust.debtorDays > 40
                            ? 'text-amber-700 dark:text-amber-400 font-semibold'
                            : 'text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {cust.debtorDays} days
                      </span>
                    </td>

                    {/* Energy Exposure */}
                    <td className="py-3 px-3 text-right font-medium text-stone-700 dark:text-stone-300">
                      {cust.eskomOffsetPct}% Solar Offset
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Detail Modal (Selecting a customer opens this modal) */}
      {selectedCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white dark:bg-[#181c20] border border-stone-200 dark:border-[#262c34] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-[#262c34]">
              <div>
                <span className="text-xs uppercase font-semibold text-stone-500 dark:text-stone-400 tracking-wider">
                  Customer Account Details
                </span>
                <h2 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedCustomer.name}
                </h2>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedCustomer.industry} · {selectedCustomer.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#202730] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Monthly Revenue</span>
                <span className="font-mono-numbers font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedCustomer.monthlyBilledZAR}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Gross Margin</span>
                <span
                  className={`font-mono-numbers font-bold text-sm ${
                    selectedCustomer.marginHealth === 'critical'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {selectedCustomer.grossMarginPct}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Payment History</span>
                <span className="font-mono-numbers font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  {selectedCustomer.debtorDays} Debtor Days
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Contract Model</span>
                <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                  {selectedCustomer.contractModel}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">System Capacity</span>
                <span className="font-medium text-stone-900 dark:text-stone-100 text-xs">
                  {selectedCustomer.systemCapacity}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Energy Exposure</span>
                <span className="font-medium text-stone-900 dark:text-stone-100 text-xs">
                  {100 - selectedCustomer.eskomOffsetPct}% Grid Exposed
                </span>
              </div>
            </div>

            {/* Relevant Issues & Operational Notes */}
            <div className="p-3.5 rounded-xl bg-stone-50/90 dark:bg-[#1f252d] border border-stone-200/80 dark:border-[#2b333e] text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-5">
              <strong className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                Account Issues & Operating Notes:
              </strong>
              {selectedCustomer.operationalNotes}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-[#262c34] flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  onOpenSource();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-[#202730] border border-stone-200/80 dark:border-[#2b333d] transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source Documents</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const custName = selectedCustomer.name;
                  setSelectedCustomer(null);
                  onOpenIntelligence(`Customers — ${custName}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Discuss {selectedCustomer.name} in Cova</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
