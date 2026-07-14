'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ── Complete array of 23 Partner Institutions ──────────────────
const ALL_23_INSTITUTIONS = [
  { name: 'ICAR-CIFT', slug: 'cift', logo: '/images/institutions/cift.jpg', acronym: 'CIFT' },
  { name: 'CSIR-NIIST', slug: 'csir-niist', logo: '/images/institutions/csir-niist.jpg', acronym: 'NIIST' },
  { name: 'ICAR-CPCRI', slug: 'icar-cpcri', logo: '/images/institutions/cpcri.jpg', acronym: 'CPCRI' },
  { name: 'ICAR-CTCRI', slug: 'icar-ctcri', logo: '/images/institutions/ctcri.jpg', acronym: 'CTCRI' },
  { name: 'KSCSTE-CWRDM', slug: 'cwrdm', logo: '/images/institutions/cwrdm.jpg', acronym: 'CWRDM' },
  { name: 'IAV', slug: 'institute-of-advanced-virology', logo: '/images/institutions/iav.jpg', acronym: 'IAV' },
  { name: 'IISER Thiruvananthapuram', slug: 'iiser-thiruvananthapuram', logo: '/images/institutions/iiser-thiruvananthapuram.jpg', acronym: 'IISER' },
  { name: 'IIT Palakkad', slug: 'iit-palakkad', logo: '/images/institutions/iit-palakkad.jpg', acronym: 'IIT' },
  { name: 'ICAR-IISR', slug: 'iisr', logo: '/images/institutions/iisr.jpg', acronym: 'IISR' },
  { name: 'KSCSTE-JNTBGRI', slug: 'kscste-jntbgri', logo: '/images/institutions/kscste-jntbgri.jpg', acronym: 'JNTBGRI' },
  { name: 'KFRI', slug: 'kfri', logo: '/images/institutions/kfri.jpg', acronym: 'KFRI' },
  { name: 'KSCSTE', slug: 'kscste', logo: '/images/institutions/kscste.jpg', acronym: 'KSCSTE' },
  { name: 'NIELIT', slug: 'nielit', logo: '/images/institutions/nielit.jpg', acronym: 'NIELIT' },
  { name: 'RGCB', slug: 'rgcb', logo: '/images/institutions/rgcb.jpg', acronym: 'RGCB' },
  { name: 'STIC', slug: 'stic', logo: '/images/institutions/stic.jpg', acronym: 'STIC' },
  { name: 'TIMed / SCTIMST', slug: 'sctimst', logo: '/images/institutions/sctimst.jpg', acronym: 'TIMed' },
  { name: 'TrEST Research Park', slug: 'trest', logo: '/images/institutions/trest.jpg', acronym: 'TrEST' },
  { name: 'BioNEST', slug: 'bionest', logo: '/images/institutions/bionest.jpg', acronym: 'BioNEST' },
  { name: 'Dr. Moopen\'s iNEST', slug: 'inest', logo: '/images/institutions/inest.jpg', acronym: 'iNEST' },
  { name: 'KUFOS', slug: 'kerala-university-of-fisheries-and-ocean-studies-kufos', logo: '/images/institutions/kufos-kochi.jpg', acronym: 'KUFOS' },
  { name: 'KSCSTE-NATPAC', slug: 'natpac', logo: '/images/institutions/natpac.jpg', acronym: 'NATPAC' },
  { name: 'MBGIPS', slug: 'mbgips', logo: '/images/institutions/mbgips.jpg', acronym: 'MBGIPS' },
  { name: 'ICCS', slug: 'iccs', logo: '/images/institutions/iccs.jpg', acronym: 'ICCS' },
];

function LogoTile({ inst }: { inst: typeof ALL_23_INSTITUTIONS[0] }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link
      href={`/institutions/${inst.slug}`}
      className="group flex flex-col items-center justify-center bg-white border border-gray-100 rounded-md p-[20px] h-[140px] hover:border-blue-400 hover:shadow-md hover:scale-[1.03] transition-all duration-200"
      title={inst.name}
      aria-label={`View ${inst.name} technologies`}
    >
      {!imgErr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={inst.logo}
          alt={inst.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
          <span className="text-xl font-black text-[#0A2164] leading-none">{inst.acronym}</span>
          <span className="text-[10px] text-gray-400 text-center line-clamp-2 leading-tight px-2">{inst.name}</span>
        </div>
      )}
    </Link>
  );
}

// ── Main Component ───────────────────────────────────────────
interface Props {
  institutions?: any[];
  showMarquee?: boolean;
}

export default function PartnerLogoWall({ institutions, showMarquee }: Props) {
  return (
    <section className="relative py-12 bg-[#F8FAFF] overflow-hidden border-b border-gray-100">
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="logo-wall-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="#0A2164" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#logo-wall-dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">
            Partner Institutions
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
                23 Partner Institutions
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl leading-relaxed font-sans">
                Kerala&apos;s leading universities, research organisations, centres of excellence and
                technology institutions contributing to the RINK ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {ALL_23_INSTITUTIONS.map(inst => (
            <LogoTile key={inst.slug} inst={inst} />
          ))}
        </div>
      </div>
    </section>
  );
}
