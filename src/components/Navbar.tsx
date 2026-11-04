import React from 'react';
import { PerspectiveType } from '../types';
import {
  Zap,
  Upload,
  CheckSquare,
  MessageSquare,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  currentPerspective: PerspectiveType;
  onSelectPerspective: (perspective: PerspectiveType) => void;
  onOpenUpload: () => void;
  onOpenDataSources: () => void;
  onOpenActions: () => void;
  onOpenIntelligence?: () => void;
  isIntelligenceActive?: boolean;
  hasUploadedFiles: boolean;
  openActionsCount: number;
  lastUpdated: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const perspectives: { id: PerspectiveType; label: string }[] = [
  { id: 'current_state', label: 'Overview' },
  { id: 'financial', label: 'Financial' },
  { id: 'customers', label: 'Customers' },
  { id: 'operations', label: 'Operations' },
  { id: 'cash_debt', label: 'Cash & Debt' },
  { id: 'growth', label: 'Growth' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPerspective,
  onSelectPerspective,
  onOpenUpload,
  onOpenDataSources,
  onOpenActions,
  onOpenIntelligence,
  isIntelligenceActive = false,
  hasUploadedFiles,
  openActionsCount,
  lastUpdated,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fbfbfa]/95 dark:bg-[#121518]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[#262c34] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top utility bar */}
        <div className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-[#1e2329]">
          <div className="flex items-center gap-3">
            {/* Cova minimal circular intelligence mark */}
            <div
              className="w-8 h-8 rounded-lg bg-[#0c1e38] dark:bg-[#132746] flex items-center justify-center text-[#93c5fd] dark:text-[#bfdbfe] shadow-xs border border-blue-900/40 dark:border-blue-700/40 shrink-0"
              title="Cova Intelligence"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Converging intelligence arcs forming the 'O' */}
                <path
                  d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  d="M17.5 10a7.5 7.5 0 0 1-7.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeDasharray="3 2"
                />
                <path
                  d="M10 17.5a7.5 7.5 0 0 1-7.5-7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                <path
                  d="M2.5 10a7.5 7.5 0 0 1 7.5-7.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeDasharray="3 2"
                />
                <circle cx="10" cy="10" r="2.2" fill="currentColor" />
              </svg>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-editorial text-lg tracking-tight font-semibold text-stone-900 dark:text-stone-100">
                Cova
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-[#1a1f26] border border-stone-200/80 dark:border-[#28303a]">
                Demo company • Simulated data
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile-only demo label */}
            <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-[#1a1f26] border border-stone-200/80 dark:border-[#28303a]">
              Demo
            </span>

            {/* Data interpretation subtle indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mr-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasUploadedFiles ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'
                }`}
              />
              <span>
                {hasUploadedFiles ? `September 2026 Ledger (${lastUpdated})` : 'Awaiting business files'}
              </span>
            </div>

            {/* 1. Data Sources button */}
            <button
              id="data-sources-btn"
              onClick={onOpenDataSources}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1b2026] border border-stone-200/80 dark:border-[#2b333d] hover:bg-stone-50 dark:hover:bg-[#232932] transition cursor-pointer whitespace-nowrap"
              title="Inspect uploaded business documents & freshness status"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Data Sources</span>
              {hasUploadedFiles && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>

            {/* 2. Upload Files button */}
            <button
              id="upload-files-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1b2026] border border-stone-200/80 dark:border-[#2b333d] hover:bg-stone-50 dark:hover:bg-[#232932] transition cursor-pointer whitespace-nowrap"
              title="Upload operational or financial documents"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Upload Files</span>
            </button>

            {/* 3. Open Actions button */}
            <button
              id="open-actions-btn"
              onClick={onOpenActions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1b2026] border border-stone-200/80 dark:border-[#2b333d] hover:bg-stone-50 dark:hover:bg-[#232932] transition cursor-pointer whitespace-nowrap"
              title="View unresolved high-priority actions"
            >
              <CheckSquare className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Open Actions</span>
              {hasUploadedFiles && openActionsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono-numbers font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  {openActionsCount}
                </span>
              )}
            </button>

            {/* 4. Theme Toggle button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex items-center justify-center p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-[#1b2026] border border-stone-200/80 dark:border-[#2b333d] hover:bg-stone-50 dark:hover:bg-[#232932] transition cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>
          </div>
        </div>

        {/* Primary Perspective Navigation with Cova Intelligence on far right */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          <nav className="flex items-center gap-1 sm:gap-2">
            {perspectives.map((p) => {
              const isActive = !isIntelligenceActive && currentPerspective === p.id;
              return (
                <button
                  key={p.id}
                  id={`nav-perspective-${p.id}`}
                  onClick={() => onSelectPerspective(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-[#1e242b]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </nav>

          {/* Cova Intelligence on far right of perspective bar */}
          {onOpenIntelligence && (
            <button
              id="nav-cova-intelligence-btn"
              onClick={onOpenIntelligence}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ml-4 ${
                isIntelligenceActive
                  ? 'bg-blue-900 text-white dark:bg-blue-600 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-[#1e242b]'
              }`}
              title="Cova Intelligence"
            >
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Cova Intelligence</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


