import React, { useState } from 'react';
import { PipelineOpportunity } from '../types';
import { PageHeaderActions } from './PageHeaderActions';
import { exportToCSV, exportToExcel, printOrExportPDF } from '../utils/exportUtils';
import {
  Info,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Building,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface GrowthViewProps {
  opportunities: PipelineOpportunity[];
  onUpdateOpportunities: (newOpps: PipelineOpportunity[], auditNotes: string[]) => void;
  onOpenSource: () => void;
  onOpenIntelligence: (context: string, initialQuestion?: string) => void;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
  opportunities,
  onOpenSource,
  onOpenIntelligence,
}) => {
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const columns = [
      { key: 'name', label: 'Opportunity' },
      { key: 'client', label: 'Client / Off-taker' },
      { key: 'stage', label: 'Stage' },
      { key: 'estimatedValueZAR', label: 'Contract Value' },
      { key: 'capexRequiredZAR', label: 'Capital Required' },
      { key: 'projectedIrrPct', label: 'Expected Margin / IRR' },
      { key: 'fundingFeasibility', label: 'Financing Status' },
    ];
    if (format === 'csv') {
      exportToCSV('Growth_Pipeline_September_2026', columns, opportunities);
    } else if (format === 'excel') {
      exportToExcel('Growth_Pipeline_September_2026', columns, opportunities);
    } else {
      printOrExportPDF('Growth Pipeline — September 2026', columns, opportunities);
    }
  };

  const quickQuestions = [
    'Which opportunity should we prioritize?',
    'Can we finance this project?',
    'Which project has the best risk-adjusted return?',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#181c20] rounded-xl border border-stone-200/90 dark:border-[#262c34] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-[#262c34]">
          <div>
            <h1 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Growth Pipeline
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Active commercial development opportunities, capex requirements, and contract values.
            </p>
          </div>

          <PageHeaderActions
            pageTitle="Growth Pipeline"
            pageContext="Growth"
            onOpenSource={onOpenSource}
            onOpenIntelligence={(ctx) => onOpenIntelligence(ctx)}
            onExport={handleExport}
            sourceLabel="Source: Commercial Pipeline"
            sourceFileHint="Commercial_Pipeline.xlsx"
          />
        </div>

        {/* Pipeline Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">Total Pipeline Value</span>
            <div className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              R15.6M
            </div>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 block">Across 4 active deals</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">Capital Required</span>
            <div className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              R6.90M
            </div>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 block">Hardware capex required</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">Weighted Target IRR</span>
            <div className="font-editorial text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              21.8%
            </div>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 block">Long-term unlevered IRR</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f252d] border border-stone-200/70 dark:border-[#2b333e]">
            <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">DBSA Undrawn Headroom</span>
            <div className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              R4.80M
            </div>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 block">Approved debt capacity</span>
          </div>
        </div>

        {/* Opportunity Table (Pipeline Facts First!) */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse min-w-[660px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-[#2b333e] text-stone-600 dark:text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Opportunity</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3 text-right">Contract Value</th>
                <th className="py-2.5 px-3 text-right">Capital Required</th>
                <th className="py-2.5 px-3 text-right">Expected Margin</th>
                <th className="py-2.5 px-3 text-center">Risk / Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#232932] text-stone-800 dark:text-stone-200 font-mono-numbers">
              {opportunities.map((opp) => {
                return (
                  <tr
                    key={opp.id}
                    className="transition-colors hover:bg-stone-50/70 dark:hover:bg-[#1b2027]"
                  >
                    {/* Opportunity */}
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{opp.name}</div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">{opp.client}</div>
                    </td>

                    {/* Stage */}
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-[#1f252d] text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-[#2b333e] text-[11px]">
                        {opp.stage}
                      </span>
                    </td>

                    {/* Contract Value */}
                    <td className="py-3 px-3 text-right font-medium text-stone-900 dark:text-stone-100">
                      {opp.estimatedValueZAR}
                    </td>

                    {/* Capital Required */}
                    <td className="py-3 px-3 text-right text-stone-700 dark:text-stone-300">
                      {opp.capexRequiredZAR}
                    </td>

                    {/* Expected Margin / IRR */}
                    <td className="py-3 px-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                      {opp.projectedIrrPct}% IRR
                    </td>

                    {/* Risk / Readiness */}
                    <td className="py-3 px-3 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          opp.fundingFeasibility === 'Fully Funded'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                            : opp.fundingFeasibility === 'Feasible with Debt Draw'
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                        }`}
                      >
                        {opp.fundingFeasibility}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Intelligence Prompt Buttons */}
        <div className="mt-8 pt-5 border-t border-stone-100 dark:border-[#262c34]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Analyze Pipeline in Cova Intelligence
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenIntelligence('Growth', question)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-50 hover:bg-stone-100 dark:bg-[#1f252d] dark:hover:bg-[#29323d] border border-stone-200 dark:border-[#2b333e] transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
