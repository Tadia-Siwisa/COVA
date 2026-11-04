import React from 'react';
import { UploadCloud } from 'lucide-react';

interface BusinessSummaryProps {
  hasUploadedFiles?: boolean;
  onOpenUpload?: () => void;
}

export const BusinessSummary: React.FC<BusinessSummaryProps> = ({
  hasUploadedFiles = true,
  onOpenUpload,
}) => {
  if (!hasUploadedFiles) {
    return (
      <section
        id="business-summary-section"
        className="my-6 p-5 rounded-xl border border-dashed border-stone-300 dark:border-[#2b333e] bg-stone-50/50 dark:bg-[#14171a] shadow-xs text-center flex flex-col items-center justify-center py-8"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
          Business Summary
        </span>
        <h3 className="font-editorial text-lg font-semibold text-stone-700 dark:text-stone-300 mb-1">
          No data yet
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mb-3">
          Upload financial, operational, and customer records to generate the executive synthesis.
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload files to build this view</span>
        </button>
      </section>
    );
  }

  return (
    <section
      id="business-summary-section"
      className="my-6 p-4 sm:p-5 rounded-xl border bg-white dark:bg-[#181c20] border-stone-200/90 dark:border-[#262c34] shadow-xs transition-colors"
    >
      {/* Header */}
      <div className="mb-4 pb-2 border-b border-stone-100 dark:border-[#242a32]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Business Summary
        </h2>
      </div>

      {/* 3 Core Questions & Direct Concise Answers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Question 1 */}
        <div className="p-3 sm:p-4 rounded-lg bg-stone-50/70 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            How did the business perform?
          </h3>
          <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">
            Core solar generation and long-term PPA off-take tariffs remained robust across all operational microgrids, beating monthly top-line revenue targets. Operating profit remained positive despite seasonal winter irradiance dips.
          </p>
        </div>

        {/* Question 2 */}
        <div className="p-3 sm:p-4 rounded-lg bg-stone-50/70 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            What materially changed?
          </h3>
          <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">
            Severe grid load-shedding required unbudgeted emergency diesel runs at Protea Logistics, narrowing operating margins. Concurrently, capital remains tied up in delivered battery hardware at Paarl pending municipal relay sign-off.
          </p>
        </div>

        {/* Question 3 */}
        <div className="p-3 sm:p-4 rounded-lg bg-stone-50/70 dark:bg-[#15191d] border border-stone-200/70 dark:border-[#262c34]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            What is the most important implication?
          </h3>
          <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">
            Securing the Paarl municipal sign-off immediately unlocks R1.15M in working capital to restore cash runway to 68 days. Updating the Protea load-shifting protocol will curb fuel burn and return margins to the 34% target.
          </p>
        </div>
      </div>
    </section>
  );
};
