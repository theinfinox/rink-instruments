'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface MouBadgeProps {
  hasVerifiedMou?: boolean;
  className?: string;
  variant?: 'compact' | 'pill' | 'detailed';
  details?: string;
}

/**
 * MoU Badge for verified KSUM / RINK partner institutions.
 * Renders ONLY when hasVerifiedMou is true.
 * Highlights subsidized charges for eligible startups with an accessible tooltip.
 */
export default function MouBadge({ 
  hasVerifiedMou, 
  className = '', 
  variant = 'pill',
  details 
}: MouBadgeProps) {
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
      aria-label="Subsidized Rates Partner: This institution has a signed MoU with Kerala Startup Mission (KSUM), offering subsidized user fee rates to registered startups."
    >
      {variant === 'compact' ? (
        <span 
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 leading-none cursor-help transition-all ${className}`}
        >
          Subsidized
        </span>
      ) : variant === 'detailed' ? (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm leading-none cursor-help transition-all hover:bg-emerald-100 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Subsidized Rates · KSUM MoU</span>
        </span>
      ) : (
        <span 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 leading-none cursor-help transition-all hover:border-emerald-300 ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Subsidized Rates</span>
        </span>
      )}

      {/* ── Accessible Hover / Focus Tooltip ── */}
      {isTooltipOpen && (
        <div 
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-50 pointer-events-none text-left leading-normal animate-fade-in"
        >
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300 mb-1 border-b border-slate-800 pb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KSUM Subsidized Rates Partner</span>
          </div>
          <div className="text-[11px] text-slate-300 font-normal space-y-1">
            <p>
              This institution has an active partnership MoU with <strong>Kerala Startup Mission (KSUM)</strong>.
            </p>
            <p className="text-emerald-400 font-medium">
              ✓ Eligible startups (with KSUM UID) receive Category II Government R&D subsidized user fee rates.
            </p>
            {details && (
              <p className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                {details}
              </p>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
}
