'use client';

import { useState } from 'react';
import { Institution } from '@/types';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  institution: Institution;
}

const INST_SPECIALIZATIONS: Record<string, string> = {
  'icar-cpcri': 'Coconut Innovation',
  'cpcri': 'Coconut Innovation',
  'icar-ctcri': 'Tuber Crops & Biotechnology',
  'ctcri': 'Tuber Crops & Biotechnology',
  'kufos': 'Ocean Technology & Fisheries',
  'kau': 'Agriculture / Smart Farming',
  'csir-niist': 'Advanced Materials & Chemical Innovation',
  'niist': 'Advanced Materials & Chemical Innovation',
  'c-dac': 'AI, Computing & Digital Innovation',
  'cdac': 'AI, Computing & Digital Innovation'
};

function getAcronym(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes('CPCRI')) return 'CPCRI';
  if (upper.includes('CTCRI')) return 'CTCRI';
  if (upper.includes('NIIST')) return 'NIIST';
  if (upper.includes('KAU'))   return 'KAU';
  if (upper.includes('CWRDM')) return 'CWRDM';
  if (upper.includes('KSCSTE')) return 'KSCSTE';
  if (upper.includes('KFRI')) return 'KFRI';
  if (upper.includes('JNTBGRI')) return 'JNTBGRI';
  if (upper.includes('NCRMI')) return 'NCRMI';
  if (upper.includes('KUFOS')) return 'KUFOS';
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 1) return matches.join('').slice(0, 5);
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 5);
}

function InstitutionBackground({ slug }: { slug: string }) {
  const s = slug.toLowerCase();

  if (s.includes('cpcri')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <path d="M50 90 L50 20 C 50 10, 55 10, 60 5" strokeWidth="1.5" />
          <path d="M50 20 C 40 10, 30 15, 20 20" />
          <path d="M50 20 C 35 5, 25 5, 15 10" />
          <path d="M50 20 C 60 10, 70 15, 80 20" />
          <path d="M50 20 C 65 5, 75 5, 85 10" />
          <circle cx="46" cy="24" r="3.5" fill="currentColor" fillOpacity="0.3" />
          <circle cx="54" cy="25" r="4" fill="currentColor" fillOpacity="0.3" />
        </svg>
      </div>
    );
  }

  if (s.includes('ctcri')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <path d="M50 40 C 25 35, 10 50, 30 75 C 40 85, 60 85, 70 75 C 90 50, 75 35, 50 40 Z" strokeWidth="1.2" />
          <path d="M50 40 V15 M50 15 L35 5 M50 15 L65 5" />
          <path d="M30 60 H70 M35 70 H65" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  if (s.includes('kufos')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <path d="M15 45 C 30 30, 60 30, 85 45 C 90 48, 90 52, 85 55 C 60 70, 30 70, 15 55 Z" strokeWidth="1.2" />
          <path d="M85 45 L95 35 V65 L85 55 Z" fill="currentColor" fillOpacity="0.15" />
          <circle cx="30" cy="48" r="1.5" fill="currentColor" />
          <path d="M10 75 C 30 65, 50 85, 70 75 C 90 65, 100 75, 100 75" />
        </svg>
      </div>
    );
  }

  if (s.includes('c-dac') || s.includes('cdac')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <rect x="25" y="25" width="50" height="50" rx="4" strokeWidth="1.2" />
          <rect x="37" y="37" width="26" height="26" rx="2" fill="currentColor" fillOpacity="0.15" />
          <path d="M35 15 v10 M45 15 v10 M55 15 v10 M65 15 v10" />
          <path d="M35 75 v10 M45 75 v10 M55 75 v10 M65 75 v10" />
          <path d="M15 35 h10 M15 45 h10 M15 55 h10 M15 65 h10" />
          <path d="M75 35 h10 M75 45 h10 M75 55 h10 M75 65 h10" />
        </svg>
      </div>
    );
  }

  if (s.includes('kau')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <path d="M50 90 V20" strokeWidth="1.5" />
          <path d="M50 35 C 35 30, 30 20, 30 20 C 30 20, 40 25, 50 35" />
          <path d="M50 35 C 65 30, 70 20, 70 20 C 70 20, 60 25, 50 35" />
          <path d="M50 55 C 35 50, 30 40, 30 40 C 30 40, 40 45, 50 55" />
          <path d="M50 55 C 65 50, 70 40, 70 40 C 70 40, 60 45, 50 55" />
          <path d="M50 75 C 35 70, 30 60, 30 60 C 30 60, 40 65, 50 75" />
          <path d="M50 75 C 65 70, 70 60, 70 60 C 70 60, 60 65, 50 75" />
        </svg>
      </div>
    );
  }

  if (s.includes('niist')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" strokeWidth="1.2" />
          <circle cx="50" cy="20" r="3.5" fill="currentColor" />
          <circle cx="75" cy="35" r="3.5" fill="currentColor" />
          <circle cx="75" cy="65" r="3.5" fill="currentColor" />
          <circle cx="50" cy="80" r="3.5" fill="currentColor" />
          <circle cx="25" cy="65" r="3.5" fill="currentColor" />
          <circle cx="25" cy="35" r="3.5" fill="currentColor" />
          <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  if (s.includes('cwrdm')) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] text-[#0A2164] flex items-center justify-end pr-4 select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
          <path d="M50 15 C 50 15, 80 48, 80 65 C 80 81.5, 66.5 90, 50 90 C 33.5 90, 20 81.5, 20 65 C 20 48, 50 15, 50 15 Z" strokeWidth="1.2" />
          <path d="M30 65 C 40 70, 60 60, 70 65" />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] text-[#0A2164] flex items-center justify-end pr-4 select-none">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20">
        <path d="M10 20 H90 M10 50 H90 M10 80 H90" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="15" />
      </svg>
    </div>
  );
}

export default function InstitutionCard({ institution }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const prefersReduced = useReducedMotion();

  const slug = institution.slug;
  const acronym = getAcronym(institution.name);
  const specFallback = INST_SPECIALIZATIONS[slug.toLowerCase()] || 'Research Partner';
  const specs = institution.specializations || [specFallback];

  const hasImage = !!institution.institution_image && !imageFailed;
  const displayImage = institution.institution_image_embed_url || institution.institution_image;

  return (
    <Link href={`/institutions/${slug}`} id={`inst-card-${slug}`} className="block group h-full">
      <motion.div
        className="relative overflow-hidden rounded-md border border-gray-100 bg-white h-full flex flex-col shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-250"
        whileHover={prefersReduced ? {} : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      >
        {/* Subtle radial highlight on hover */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,33,100,0.03)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-0" />

        {/* ── TOP BANNER AREA ── */}
        <div className="relative h-16 w-full border-b border-gray-100 overflow-hidden flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #E0EAFF 100%)'
        }}>
          {/* Institution-specific SVG backdrop */}
          <InstitutionBackground slug={slug} />

          {/* Logo badge — overlaps banner bottom and body top */}
          {hasImage ? (
            <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-md overflow-hidden bg-white border-2 border-gray-100 shadow-sm z-20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={institution.name}
                onError={() => setImageFailed(true)}
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>

        {/* ── CARD BODY ── */}
        <div className={`flex flex-col flex-1 p-5 z-10 ${hasImage ? 'pt-8' : 'pt-5'}`}>

          {/* Acronym badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-blue-50 text-[#0A2164] border border-blue-200">
              {acronym}
            </span>
          </div>

          {/* Institution Name */}
          <h3 className="font-heading font-bold text-gray-900 text-[16px] leading-snug mb-3 group-hover:text-[#0A2164] transition-colors line-clamp-2">
            {institution.name}
          </h3>

          {/* Technology Count & Date */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                Technologies:
              </span>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {institution.tech_count} {institution.tech_count === 1 ? 'Opportunity' : 'Opportunities'}
              </span>
            </div>
            {institution.last_updated && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                Latest Upload: {institution.last_updated}
              </div>
            )}
          </div>

          {/* Sector Coverage */}
          <div className="mb-4">
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Sector Coverage
            </div>
            <div className="flex flex-wrap gap-1.5">
              {specs.slice(0, 3).map((s, idx) => (
                <span key={idx} className="text-[9px] font-semibold tracking-wide text-[#0A2164] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-end">
            <motion.span
              className="flex items-center gap-1 text-[11px] font-bold text-[#0A2164]"
              whileHover={prefersReduced ? {} : { x: 3 }}
              transition={{ duration: 0.15 }}
            >
              Discover <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
