import React from 'react';
import { OpenActionItem } from '../types';
import { X, Check, Clock, AlertTriangle } from 'lucide-react';

interface OpenActionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  actions: OpenActionItem[];
  onToggleComplete: (id: string) => void;
}

export const OpenActionsPanel: React.FC<OpenActionsPanelProps> = ({
  isOpen,
  onClose,
  actions,
  onToggleComplete,
}) => {
  if (!isOpen) return null;

  const unresolvedActions = actions.filter((a) => !a.completed);
  const completedActions = actions.filter((a) => a.completed);

  const getAreaColor = (area: OpenActionItem['area']) => {
    switch (area) {
      case 'Operations':
        return 'text-sky-800 dark:text-sky-300 bg-sky-500/10 border-sky-500/20';
      case 'Customers':
        return 'text-rose-800 dark:text-rose-300 bg-rose-500/10 border-rose-500/20';
      case 'Growth':
        return 'text-purple-800 dark:text-purple-300 bg-purple-500/10 border-purple-500/20';
      case 'Cash & Debt':
        return 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/20';
      case 'Financial':
        return 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
      case 'Energy':
        return 'text-teal-800 dark:text-teal-300 bg-teal-500/10 border-teal-500/20';
      default:
        return 'text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#20262e] border-stone-200 dark:border-[#2e3742]';
    }
  };

  return (
    <div
      id="open-actions-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="open-actions-panel"
        className="w-full max-w-md bg-white dark:bg-[#181c20] text-stone-900 dark:text-stone-100 h-full shadow-2xl overflow-y-auto p-5 sm:p-6 flex flex-col justify-between border-l border-stone-200/90 dark:border-[#262c34] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-[#242a32]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-semibold text-stone-900 dark:text-stone-100">
                  Open Actions
                </h2>
                <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#222831] text-stone-700 dark:text-stone-300 font-semibold">
                  {unresolvedActions.length} unresolved
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Key business matters affecting cash, contracts, and operations.
              </p>
            </div>

            <button
              id="close-open-actions-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#222831] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Cards List */}
          <div className="mt-5 space-y-3">
            {unresolvedActions.map((action) => (
              <div
                key={action.id}
                id={`open-action-${action.id}`}
                className="p-3.5 rounded-xl border border-stone-200/90 dark:border-[#262c34] bg-stone-50/60 dark:bg-[#15191d] hover:border-stone-300 dark:hover:border-stone-600 transition"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    {/* Action Title */}
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug mb-2">
                      {action.title}
                    </h3>

                    {/* Meta Row: Area, Due, Business Impact */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Business Area */}
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getAreaColor(
                          action.area
                        )}`}
                      >
                        {action.area}
                      </span>

                      {/* Due Date */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-mono-numbers">
                        <Clock className="w-3 h-3 text-stone-400" />
                        Due {action.due}
                      </span>

                      {/* Business Impact */}
                      <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                        · {action.businessImpact}
                      </span>
                    </div>
                  </div>

                  {/* Mark complete toggle */}
                  <button
                    onClick={() => onToggleComplete(action.id)}
                    className="w-6 h-6 rounded-md border border-stone-300 dark:border-stone-600 hover:border-stone-900 dark:hover:border-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-transparent hover:text-stone-800 dark:hover:text-stone-100 transition shrink-0 cursor-pointer"
                    title="Mark action resolved"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {unresolvedActions.length === 0 && (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400">
                <p className="text-xs">No pending high-priority actions.</p>
              </div>
            )}
          </div>

          {/* Resolved Actions (restrained, non-distracting) */}
          {completedActions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-[#242a32]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2">
                Resolved ({completedActions.length})
              </span>
              <div className="space-y-2">
                {completedActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-2.5 rounded-lg bg-stone-50/40 dark:bg-[#131619] border border-stone-200/50 dark:border-[#20252b] flex items-center justify-between opacity-60 text-xs"
                  >
                    <div className="line-through text-stone-500 dark:text-stone-400 truncate">
                      {action.title}
                    </div>
                    <button
                      onClick={() => onToggleComplete(action.id)}
                      className="text-[10px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline shrink-0 cursor-pointer ml-2"
                    >
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-stone-100 dark:border-[#242a32] text-[11px] text-stone-400 dark:text-stone-500 flex items-center justify-between">
          <span>Updates automatically as ledger milestones are achieved</span>
        </div>
      </div>
    </div>
  );
};
