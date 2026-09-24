'use client';

import React from 'react';
import { SubsidizedClaimPolicy } from '@/types/instrument';
import { 
  ShieldCheck, 
  ExternalLink, 
  FileDown, 
  CheckCircle2, 
  Info, 
  Clock, 
  Building,
  Sparkles,
  Layers
} from 'lucide-react';
import { getSafeUrl } from '@/lib/utils';

interface SubsidizedClaimSectionProps {
  policy: SubsidizedClaimPolicy;
  institutionName: string;
}

export default function SubsidizedClaimSection({ 
  policy, 
  institutionName 
}: SubsidizedClaimSectionProps) {
  if (!policy || !policy.hasSubsidizedRates) return null;

  const feeRateUrl = policy.feeRateUrl ? getSafeUrl(policy.feeRateUrl) : null;
  const sourcePortalUrl = policy.sourceUrl ? getSafeUrl(policy.sourceUrl) : null;
  const activeLink = feeRateUrl || sourcePortalUrl;

  const rateHighlight = policy.discountOrRate || policy.benefitType || 'Subsidized User Fee Rates';
  const eligibility = policy.eligibility || 'Kerala Startup Mission (KSUM) Registered Startups with valid UID';
  const facility = policy.facilityOrCentre || policy.facilityNameReference;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-blue-50/30 p-4 sm:p-7 shadow-sm">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-emerald-200/60">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                KSUM MoU Partner
              </span>
              {policy.verificationStatus && (
                <span className="text-[11px] font-medium text-emerald-700">
                  • {policy.verificationStatus}
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Subsidized Rates &amp; Startup Concessions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-0.5">
              Offered under formal partnership with Kerala Startup Mission (KSUM) for eligible startups.
            </p>
          </div>
        </div>

        {/* Rate Tier Badge */}
        <div className="inline-flex flex-col items-start md:items-end mt-2 md:mt-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Concession Tier
          </span>
          {activeLink && activeLink !== '#' ? (
            <a
              href={activeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm tracking-wide transition-colors group max-w-[280px] sm:max-w-sm text-left leading-snug"
              title={feeRateUrl ? "View Official Fee Schedule" : "View Official Website"}
            >
              <span>{rateHighlight}</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200 group-hover:text-white transition-colors mt-0.5 flex-shrink-0" />
            </a>
          ) : (
            <span className="inline-flex items-start px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 text-white shadow-sm tracking-wide max-w-[280px] sm:max-w-sm text-left leading-snug">
              {rateHighlight}
            </span>
          )}
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="relative z-10 bg-white/90 sm:bg-transparent rounded-xl border border-emerald-100/90 sm:border-0 shadow-xs sm:shadow-none my-4 sm:my-5 divide-y divide-emerald-50 sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3.5">
        
        {/* Card 1: Eligibility */}
        <div className="p-3.5 sm:bg-white/90 sm:backdrop-blur-sm sm:rounded-xl sm:border sm:border-emerald-100/90 sm:shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Eligible Startups</span>
          </div>
          <p className="text-slate-800 text-xs sm:text-[13px] font-medium leading-snug">
            {eligibility}
          </p>
        </div>

        {/* Card 2: Facility / Centre */}
        {facility && (
          <div className="p-3.5 sm:bg-white/90 sm:backdrop-blur-sm sm:rounded-xl sm:border sm:border-emerald-100/90 sm:shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Facility / Centre</span>
            </div>
            <div className="text-slate-800 text-xs sm:text-[13px] font-medium leading-snug">
              {(() => {
                const normalize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const isNameIncluded = normalize(facility).includes(normalize(institutionName));
                return !isNameIncluded && (
                  <span className="block text-[11px] text-slate-500 mb-0.5 leading-tight">{institutionName}</span>
                );
              })()}
              {facility}
            </div>
          </div>
        )}

        {/* Card 3: Validity Window (if specified) */}
        {policy.validity && (
          <div className="p-3.5 sm:bg-white/90 sm:backdrop-blur-sm sm:rounded-xl sm:border sm:border-emerald-100/90 sm:shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Concession Validity</span>
            </div>
            <p className="text-slate-800 text-xs sm:text-[13px] font-medium leading-snug">
              {policy.validity}
            </p>
          </div>
        )}
      </div>

      {/* How to Claim Steps */}
      {(policy.applicationMethod || policy.accessConditions || policy.description || policy.notes || policy.additionalPolicyDetails) && (
        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl p-3.5 sm:p-5 border border-emerald-200/70 mb-4 sm:mb-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
            How to Claim Subsidized Rates
          </h3>

          <div className="space-y-3 font-sans text-xs sm:text-[13px]">
            {/* Step: Application method */}
            {policy.applicationMethod && (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <strong className="text-slate-900 block sm:inline">Application &amp; Requisition:</strong>{' '}
                  <span className="text-slate-700">
                    {policy.applicationMethod}
                  </span>
                </div>
              </div>
            )}

            {/* Step: Access Conditions / Quotas */}
            {(policy.description || policy.accessConditions) && (
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <strong className="text-slate-900 block mb-1 sm:mb-0 sm:inline">Access Conditions &amp; Limits:</strong>{' '}
                  <span className="text-slate-600 leading-relaxed">
                    {policy.description || policy.accessConditions}
                  </span>
                </div>
              </div>
            )}

            {/* Step: Notes or Details */}
            {(policy.notes || policy.additionalPolicyDetails) && (
              <div className="flex items-start gap-2.5 pt-2 mt-2 border-t border-slate-100">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-slate-600 text-xs leading-relaxed">
                  <strong>Policy Note:</strong> {policy.notes || policy.additionalPolicyDetails}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback note if no external links are specified */}
      {!activeLink && (
        <div className="relative z-10 mt-3 text-xs text-slate-600 italic bg-white/60 px-3 py-2 rounded-lg border border-emerald-200/50">
          For access under this concession, please present your KSUM UID certificate directly to {institutionName}&apos;s facility coordinator or administration.
        </div>
      )}

    </div>
  );
}
