import React from 'react';
import Link from 'next/link';
import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { resolveInstitutionLogo } from '@/lib/institutionLogos';
import PartnerLogoTile from './PartnerLogoTile';
import { Institution } from '@/types';

// ── Main Component ───────────────────────────────────────────
export default async function PartnerLogoWall() {
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(
    bundle.main_data, 
    bundle.instituitiion_list, 
    bundle.mou_list, 
    bundle.subsidized_list
  );
  
  // Get institutions that are verified partners or MOUs
  const institutions = repo.getAllInstitutions().filter((inst: Institution) => inst.has_verified_mou);
  
  // Sort them randomly or alphabetically? We'll just map them.
  const mappedInstitutions = institutions.map((inst: Institution) => {
    const name = inst.name;
    const logo = resolveInstitutionLogo(inst);
    let acronym = 'INST';
    if (name) {
      // Create a basic acronym from capital letters or first letters of words
      const words = name.split(/[\s-]+/);
      if (words.length > 1) {
        acronym = words.map((w: string) => w[0]).join('').toUpperCase().substring(0, 5);
      } else {
        acronym = name.substring(0, 4).toUpperCase();
      }
    }

    return {
      name,
      slug: inst.slug,
      logo,
      acronym,
    };
  });

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
                {mappedInstitutions.length} Partner Institutions
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
          {mappedInstitutions.map((inst: { slug: string; name: string; logo: string | null; acronym: string }) => (
            <PartnerLogoTile key={inst.slug} inst={inst} />
          ))}
        </div>
      </div>
    </section>
  );
}
