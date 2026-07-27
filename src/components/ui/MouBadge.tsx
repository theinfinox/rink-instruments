'use client';

import { useState } from 'react';

interface MouBadgeProps {
  hasVerifiedMou?: boolean;
  className?: string;
}

/**
 * Minimal MoU Badge for verified KSUM MoU institutions.
 * Renders ONLY when hasVerifiedMou is true.
 * Includes accessible tooltip on hover and keyboard focus.
 */
export default function MouBadge({ hasVerifiedMou, className = '' }: MouBadgeProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!hasVerifiedMou) return null;

  return (
    <span 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsTooltipOpen(true)}
      onMouseLeave={() => setIsTooltipOpen(false)}
      onFocus={() => setIsTooltipOpen(true)}
      onBlur={() => setIsTooltipOpen(false)}
      tabIndex={0}
      role="note"
      aria-label="MoU with KSUM: This institution has a verified Memorandum of Understanding (MoU) with Kerala Startup Mission (KSUM), enabling eligible startups to access supported facilities and services under the applicable terms and conditions."
    >
      <span 
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 leading-none cursor-help transition-all ${className}`}
      >
        MoU
      </span>

      {/* ── Accessible Hover / Focus Tooltip ── */}
      {isTooltipOpen && (
        <div 
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none text-left leading-normal animate-fade-in"
        >
          <div className="font-semibold text-slate-100 mb-1 border-b border-slate-700 pb-1">
            MoU with KSUM
          </div>
          <div className="text-[11px] text-slate-300 font-normal">
            This institution has a verified Memorandum of Understanding (MoU) with Kerala Startup Mission (KSUM), enabling eligible startups to access supported facilities and services under the applicable terms and conditions.
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
}
