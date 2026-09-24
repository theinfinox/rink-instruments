'use client';

import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ExternalLink, FileDown } from 'lucide-react';
import { SubsidizedClaimPolicy } from '@/types/instrument';

interface MouBadgeProps {
  hasVerifiedMou?: boolean;
  className?: string;
  variant?: 'compact' | 'pill' | 'detailed';
  details?: string;
  policy?: SubsidizedClaimPolicy | null;
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
  details,
  policy
}: MouBadgeProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 150);
  };

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTooltipOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If the new focus target is inside the tooltip (like a link), don't close it
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsTooltipOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!hasVerifiedMou) return null;

  return (
    <span 
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 pb-2 w-72 animate-fade-in cursor-default"
          role="tooltip"
        >
          <div className="p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl text-left leading-normal relative">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300 mb-1 border-b border-slate-800 pb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KSUM Subsidized Rates Partner</span>
            </div>
            <div className="text-[11px] text-slate-300 font-normal space-y-1">
              <p>
                This institution has an active partnership MoU with <strong>Kerala Startup Mission (KSUM)</strong>.
              </p>
              <div className="text-emerald-400 font-medium py-1">
                ✓ {policy?.eligibility || 'Eligible startups (with KSUM UID)'} receive {policy?.discountOrRate || policy?.benefitType || 'subsidized user fee rates'} {policy?.facilityOrCentre ? `at ${policy.facilityOrCentre}` : ''}.
              </div>
              
              {/* Action Links */}
              {(policy?.sourceUrl || policy?.applicationFormUrl) && (
                <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-800">
                  {policy.sourceUrl && policy.sourceUrl !== '#' && (
                    <a href={policy.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 hover:underline transition-colors">
                      <ExternalLink className="w-3 h-3" /> Official Website / Fee Schedule
                    </a>
                  )}
                  {policy.applicationFormUrl && policy.applicationFormUrl !== '#' && (
                    <a href={policy.applicationFormUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 hover:underline transition-colors">
                      <FileDown className="w-3 h-3" /> Application Form
                    </a>
                  )}
                </div>
              )}
              
              {details && (
                <p className="text-slate-400 text-[10px] pt-1 mt-1 border-t border-slate-800">
                  {details}
                </p>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </div>
        </div>
      )}
    </span>
  );
}
