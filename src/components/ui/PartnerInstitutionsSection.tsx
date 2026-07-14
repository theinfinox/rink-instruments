'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Institution } from '@/types';
import KeralaInnovationMap from './KeralaInnovationMap';

// ── Local logo map: slug → local image path ───────────────────
// Add new paths here as logos are uploaded
const LOCAL_LOGOS: Record<string, string> = {
  // CPCRI — updated higher quality logo
  'icar-cpcri': '/images/institutions/cpcri.jpg',
  'cpcri': '/images/institutions/cpcri.jpg',
  // CTCRI — updated higher quality logo
  'icar-ctcri': '/images/institutions/ctcri.jpg',
  'ctcri': '/images/institutions/ctcri.jpg',
  // CSIR-NIIST
  'csir-niist': '/images/institutions/csir-niist.jpg',
  'niist': '/images/institutions/csir-niist.jpg',
  'national-institute-for-interdisciplinary-science-and-technology': '/images/institutions/csir-niist.jpg',
  // CIFT
  'cift': '/images/institutions/cift.jpg',
  'central-institute-of-fisheries-technology': '/images/institutions/cift.jpg',
  'icar-cift': '/images/institutions/cift.jpg',
  // KUFOS — both Thiruvananthapuram and Kochi versions
  'kerala-university-of-fisheries-and-ocean-studies-kufos': '/images/institutions/kufos-kochi.jpg',
  'kerala-university-of-fisheries-and-ocean-studies': '/images/institutions/kufos-kochi.jpg',
  'kufos': '/images/institutions/kufos-kochi.jpg',
  // Previously uploaded logos
  'kscste-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jawaharlal-nehru-tropical-botanic-garden-and-research-institute': '/images/institutions/kscste-jntbgri.jpg',
  'iiser-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iiser': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'indian-institute-of-science-education-and-research-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'indian-institute-of-technology-palakkad': '/images/institutions/iit-palakkad.jpg',
};

function getLogoUrl(inst: Institution): string | null {
  const s = inst.slug.toLowerCase();
  // 1. Check local map exact
  if (LOCAL_LOGOS[s]) return LOCAL_LOGOS[s];
  // 2. Check partial match
  for (const key of Object.keys(LOCAL_LOGOS)) {
    if (s.includes(key) || key.includes(s.split('-')[0])) return LOCAL_LOGOS[key];
  }
  // 3. Use remote institution image if available
  return inst.institution_image_embed_url || inst.institution_image || null;
}

// ── Acronym generator ─────────────────────────────────────────
function getAcronym(name: string): string {
  const upper = name.toUpperCase();
  const map: Record<string, string> = {
    CPCRI: 'CPCRI', CTCRI: 'CTCRI', NIIST: 'NIIST', KUFOS: 'KUFOS',
    CWRDM: 'CWRDM', JNTBGRI: 'JNTBGRI', KFRI: 'KFRI', KAU: 'KAU',
    CDAC: 'C-DAC', 'C-DAC': 'C-DAC', IISER: 'IISER', IIT: 'IIT',
    IISR: 'IISR', NIT: 'NIT', CSIR: 'CSIR', NCRMI: 'NCRMI',
  };
  for (const [k, v] of Object.entries(map)) {
    if (upper.includes(k)) return v;
  }
  const words = name.trim().split(/\s+/);
  return words.map(w => w[0]).join('').toUpperCase().slice(0, 5);
}

// ── Logo Pill — used in marquee ───────────────────────────────
function LogoPill({ inst }: { inst: Institution }) {
  const [imgError, setImgError] = useState(false);
  const logo = getLogoUrl(inst);
  const acronym = getAcronym(inst.name);

  return (
    <div className="flex-shrink-0 mx-3 flex items-center gap-3 px-5 py-3 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 min-w-[180px] max-w-[220px]">
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
        {logo && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={inst.name}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-[10px] font-black text-[#0A2164] leading-none text-center px-0.5">
            {acronym}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">{inst.name}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{inst.tech_count} technologies</div>
      </div>
    </div>
  );
}

// ── Featured Institution Card ────────────────────────────────
function FeaturedInstitutionCard({ inst }: { inst: Institution }) {
  const [imgError, setImgError] = useState(false);
  const logo = getLogoUrl(inst);
  const acronym = getAcronym(inst.name);

  return (
    <Link href={`/institutions/${inst.slug}`} className="block group">
      <div className="bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-sm hover:border-blue-200 transition-all duration-250 overflow-hidden h-full flex flex-col">
        {/* Top stripe */}
        <div className="h-1.5 bg-gradient-to-r from-[#0A2164] to-[#60A5FA]" />

        {/* Logo area */}
        <div className="flex items-center justify-center pt-8 pb-4 px-6">
          <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
            {logo && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={inst.name}
                className="w-full h-full object-contain p-2"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50">
                <span className="text-lg font-black text-[#0A2164] leading-none">{acronym}</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 flex flex-col flex-1">
          <h3 className="text-[14px] font-heading font-bold text-gray-900 text-center leading-snug mb-2 group-hover:text-[#0A2164] transition-colors line-clamp-2 min-h-[40px]">
            {inst.name}
          </h3>

          {/* Tech count badge */}
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0A2164] border border-blue-200">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 13h6M9 17h4" />
              </svg>
              {inst.tech_count} Technologies
            </span>
          </div>

          {/* CTA */}
          <div className="mt-auto">
            <div className="w-full h-9 flex items-center justify-center gap-1.5 rounded-md bg-blue-50 border border-blue-200 text-[#0A2164] text-xs font-bold group-hover:bg-[#0A2164] group-hover:text-white group-hover:border-transparent transition-all duration-200">
              Discover <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Infinite Marquee ──────────────────────────────────────────
function InstitutionMarquee({ institutions }: { institutions: Institution[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Triple the list to ensure seamless looping
  const items = [...institutions, ...institutions, ...institutions];

  return (
    <div
      className="relative overflow-hidden"
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-[#F8FAFF] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#F8FAFF] to-transparent" />

      <style>{`
        @keyframes inst-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .inst-marquee-track {
          animation: inst-marquee 50s linear infinite;
          will-change: transform;
        }
        .inst-marquee-track.paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .inst-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className={`inst-marquee-track flex items-center py-3 ${paused ? 'paused' : ''}`}>
        {items.map((inst, i) => (
          <LogoPill key={`${inst.slug}-${i}`} inst={inst} />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
interface Props {
  institutions: Institution[];
}

export default function PartnerInstitutionsSection({ institutions }: Props) {
  // Top 6 by tech count for featured cards
  const featured = [...institutions].sort((a, b) => b.tech_count - a.tech_count).slice(0, 6);

  return (
    <section className="relative py-20 bg-[#F8FAFF] overflow-hidden border-b border-gray-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="partner-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#0A2164" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#partner-dots)" />
        </svg>
      </div>

      {/* Interactive Kerala innovation geographic map (ambient) */}
      <KeralaInnovationMap />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">
              Partner Institutions
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
              23 Partner Institutions
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed font-sans">
              Kerala&apos;s leading universities, research organisations, centres of excellence and
              technology institutions contributing to the RINK ecosystem.
            </p>
          </div>
          <Link
            href="/institutions"
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#0A2164] hover:text-[#081A52] transition-colors font-sans"
            id="all-partner-institutes-link"
          >
            All Institutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* RINK network note */}
        <p className="text-xs text-gray-500 italic max-w-2xl mb-12 font-sans">
          These partner institutes support the overarching Research Innovation Network Kerala (RINK)
          and are not exclusive to this portal.
        </p>

        {/* A. Featured Institutions (top 6) */}
        <div className="mb-14">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-gray-200" />
            Featured Institutions
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featured.map(inst => (
              <FeaturedInstitutionCard key={inst.slug} inst={inst} />
            ))}
          </div>
        </div>

        {/* B. All Partner Institutes Marquee */}
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-gray-200" />
            All Partner Institutes
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <InstitutionMarquee institutions={institutions} />
          <p className="text-center text-[11px] text-gray-400 mt-4 font-sans">
            Hover to pause · Swipe to browse
          </p>
        </div>
      </div>
    </section>
  );
}
