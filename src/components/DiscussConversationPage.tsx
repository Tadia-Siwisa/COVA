import React, { useState, useRef, useEffect } from 'react';
import { DiscussTopicContext } from '../types';
import {
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  MessageSquare,
  X,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
} from 'lucide-react';
import { generateIntelligenceResponse } from '../utils/nalaIntelligenceEngine';

interface MessageSource {
  filename: string;
  sheetId: string;
  freshness: string;
  areas: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: MessageSource[];
  assumptions?: string[];
}

interface DiscussConversationPageProps {
  context?: DiscussTopicContext | null;
  onBack: () => void;
  onOpenSpreadsheet?: (sheetId: string) => void;
}

export const DiscussConversationPage: React.FC<DiscussConversationPageProps> = ({
  context: initialContext,
  onBack,
  onOpenSpreadsheet,
}) => {
  const [activeContext, setActiveContext] = useState<DiscussTopicContext | null>(
    initialContext || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedSourceMsgId, setExpandedSourceMsgId] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState<'Thinking...' | 'Analysing...'>('Thinking...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync context when prop changes
  useEffect(() => {
    setActiveContext(initialContext || null);
  }, [initialContext]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new message or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const isCalculationOrScenario = (q: string): boolean => {
    const lower = q.toLowerCase();
    return (
      lower.includes('what if') ||
      lower.includes('calculate') ||
      lower.includes('forecast') ||
      lower.includes('next month') ||
      lower.includes('scenario') ||
      lower.includes('tariff') ||
      lower.includes('price') ||
      lower.includes('pays late') ||
      lower.includes('afford') ||
      lower.includes('model') ||
      lower.includes('projection')
    );
  };

  const deriveSourcesForQuery = (
    query: string
  ): { sources: MessageSource[]; assumptions: string[] } => {
    const q = query.toLowerCase();
    if (
      q.includes('customer') ||
      q.includes('protea') ||
      q.includes('invoice') ||
      q.includes('contract')
    ) {
      return {
        sources: [
          {
            filename: 'Customer_Invoices.xlsx',
            sheetId: 'sheet-invoices',
            freshness: 'Current · Updated yesterday',
            areas: 'Customer billings & payment aging',
          },
          {
            filename: 'General_Ledger.xlsx',
            sheetId: 'sheet-gl',
            freshness: 'Current · Updated today',
            areas: 'Commercial PPA revenue & direct costs',
          },
        ],
        assumptions: [
          'Assumption: Assumes Protea Logistics tariff escalation clause 4.2 takes effect 1 Oct 2026.',
        ],
      };
    }
    if (
      q.includes('energy') ||
      q.includes('solar') ||
      q.includes('battery') ||
      q.includes('grid') ||
      q.includes('diesel')
    ) {
      return {
        sources: [
          {
            filename: 'Hourly_Energy_Operations.xlsx',
            sheetId: 'sheet-energy',
            freshness: 'Current · Updated 1 hour ago',
            areas: 'Generation yield, battery dispatch, diesel runtime',
          },
          {
            filename: 'General_Ledger.xlsx',
            sheetId: 'sheet-gl',
            freshness: 'Current · Updated today',
            areas: 'Utility charges and bulk diesel purchases',
          },
        ],
        assumptions: [
          'Assumption: Avoided grid cost modeled against Eskom Megaflex winter peak tariff schedule.',
        ],
      };
    }
    if (
      q.includes('cash') ||
      q.includes('runway') ||
      q.includes('debt') ||
      q.includes('paarl')
    ) {
      return {
        sources: [
          {
            filename: 'Bank_Transactions.xlsx',
            sheetId: 'sheet-bank',
            freshness: 'Current · Updated today',
            areas: 'Cash balances, debt service payments',
          },
          {
            filename: 'General_Ledger.xlsx',
            sheetId: 'sheet-gl',
            freshness: 'Current · Updated today',
            areas: 'Current assets, working capital, trade creditors',
          },
        ],
        assumptions: [
          'Assumption: Assumes Paarl sign-off inspection occurs within 14 days, releasing R1.15M retentions.',
        ],
      };
    }
    // Default general business records
    return {
      sources: [
        {
          filename: 'General_Ledger.xlsx',
          sheetId: 'sheet-gl',
          freshness: 'Current · Updated today',
          areas: 'Financial Statement, Revenue, Operating Profit',
        },
        {
          filename: 'Customer_Invoices.xlsx',
          sheetId: 'sheet-invoices',
          freshness: 'Current · Updated yesterday',
          areas: 'Receivables, client billing',
        },
        {
          filename: 'Hourly_Energy_Operations.xlsx',
          sheetId: 'sheet-energy',
          freshness: 'Current · Updated 1 hour ago',
          areas: 'Solar PV, battery telemetry',
        },
      ],
      assumptions: [],
    };
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const query = userText.trim();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setThinkingLabel('Preparing example...');
    setIsThinking(true);

    const lineage = deriveSourcesForQuery(query);

    // Portfolio demo: deterministic examples; no model API requests.
    setTimeout(() => {
      const reply = generateIntelligenceResponse(query, activeContext);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: lineage.sources,
          assumptions: lineage.assumptions,
        },
      ]);
      setIsThinking(false);
    }, 400);
  };

  const handleReset = () => {
    setMessages([]);
    setInputQuery('');
    setIsThinking(false);
    inputRef.current?.focus();
  };

  const handleClearContext = () => {
    setActiveContext(null);
    inputRef.current?.focus();
  };

  // Format context label (e.g. "Total Revenue · R4.28M")
  const contextLabel = activeContext
    ? `${activeContext.title}${activeContext.value ? ` · ${activeContext.value}` : ''}`
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[520px] max-w-3xl mx-auto w-full">
      <p className="text-sm text-stone-500 px-4 py-2">Demo conversation: scripted examples based on fictional Nala Energy data. No live AI model; examples do not reflect edits to the dashboard.</p>
      {/* Top Header: Visually quiet navigation and context indicator */}
      <div className="flex items-center justify-between py-2.5 px-4 border-b border-stone-200/80 dark:border-[#22272e] bg-white/70 dark:bg-[#14171b]/70 backdrop-blur-md rounded-t-xl gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            id="back-to-perspective-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#1f242b] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Small context indicator if opened from a metric or attention item */}
          {contextLabel && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm bg-stone-100 dark:bg-[#1c2127] text-stone-700 dark:text-stone-300 border border-stone-200/70 dark:border-[#28303a] truncate max-w-[280px] sm:max-w-md">
              <span className="truncate font-medium">{contextLabel}</span>
              <button
                onClick={handleClearContext}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 ml-0.5 cursor-pointer"
                title="Clear topic context"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition cursor-pointer rounded-md hover:bg-stone-100 dark:hover:bg-[#1e2329]"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white/40 dark:bg-[#121518]/40">
        {/* Empty state: Quiet and simple */}
        {messages.length === 0 && !isThinking && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
            <div className="w-10 h-10 rounded-full bg-[#0c1e38] dark:bg-[#132746] flex items-center justify-center text-blue-300 dark:text-blue-200 mb-3 border border-blue-900/40 dark:border-blue-700/40">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
              Cova Intelligence
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm">
              {contextLabel
                ? `Ask about ${contextLabel}, its underlying drivers, or business impact.`
                : 'Ask about your business performance, cash runway, customer margins, or scenario trade-offs.'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-[#0c1e38] dark:bg-[#132746] text-blue-300 dark:text-blue-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-blue-900/30">
                <MessageSquare className="w-3 h-3" />
              </div>
            )}

            <div
              className={`text-sm leading-relaxed max-w-xl ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-2xl rounded-tr-xs px-4 py-2.5 font-medium'
                  : 'bg-white dark:bg-[#181c22] text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-[#262c35] rounded-2xl rounded-tl-xs px-4 py-3.5 shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed space-y-2.5">
                {msg.text}
              </div>

              {/* Expandable Sources Control for Assistant Answers (Prompt Section 8) */}
              {msg.sender === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-[#242b34] text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSourceMsgId(expandedSourceMsgId === msg.id ? null : msg.id)
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-mono font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Sources ({msg.sources.length})</span>
                    {expandedSourceMsgId === msg.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {expandedSourceMsgId === msg.id && (
                    <div className="mt-2 p-2.5 rounded-xl bg-stone-50 dark:bg-[#14171a] border border-stone-200/80 dark:border-[#242a32] space-y-2 animate-in fade-in duration-100">
                      <div className="space-y-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 px-2 rounded-lg bg-white dark:bg-[#1b2028] border border-stone-200/60 dark:border-[#28313e]"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="font-mono text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                                  {src.filename}
                                </span>
                                <span className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                  {src.freshness.split('·')[0].trim()}
                                </span>
                              </div>
                              <span className="text-sm text-stone-500 dark:text-stone-400 block truncate">
                                Feeds: {src.areas}
                              </span>
                            </div>

                            {onOpenSpreadsheet && (
                              <button
                                type="button"
                                onClick={() => onOpenSpreadsheet(src.sheetId)}
                                className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 shrink-0 cursor-pointer self-end sm:self-auto"
                              >
                                <span>Inspect sheet</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Clearly Separated Assumptions & Estimates */}
                      {msg.assumptions && msg.assumptions.length > 0 && (
                        <div className="pt-2 border-t border-stone-200/60 dark:border-[#222831] space-y-1">
                          <span className="text-sm font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-400 block">
                            Assumptions & Estimates:
                          </span>
                          {msg.assumptions.map((asm, aIdx) => (
                            <p
                              key={aIdx}
                              className="text-sm text-stone-600 dark:text-stone-400 italic leading-snug"
                            >
                              {asm}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Simplified Loading State */}
        {isThinking && (
          <div className="flex gap-3 items-center text-sm text-stone-500 dark:text-stone-400">
            <div className="w-6 h-6 rounded-md bg-[#0c1e38] dark:bg-[#132746] text-blue-300 dark:text-blue-200 flex items-center justify-center shrink-0 border border-blue-900/30">
              <MessageSquare className="w-3 h-3" />
            </div>
            <div className="px-3.5 py-2.5 bg-white dark:bg-[#181c22] rounded-xl border border-stone-200/80 dark:border-[#262c35] flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                {thinkingLabel}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: Visually quiet, simple placeholder */}
      <div className="p-3 sm:p-4 bg-white dark:bg-[#161a1f] border-t border-stone-200/80 dark:border-[#22272e] rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about your business..."
            className="flex-1 bg-stone-50 dark:bg-[#101316] text-stone-900 dark:text-stone-100 placeholder-stone-400 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-[#262d36] focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 text-sm sm:text-sm transition"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="w-9 h-9 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shrink-0 disabled:opacity-30 hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
            title="Send"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
