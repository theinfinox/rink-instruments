import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import { fetchDataset } from '@/lib/dataFetcher';
import TechnologyCard from '@/components/ui/TechnologyCard';
import DistrictCard, { District } from '@/components/ui/DistrictCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroSearch from '@/components/ui/HeroSearch';
import HeroMetrics from '@/components/ui/HeroMetrics';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import ResearchParticles from '@/components/ui/ResearchParticles';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'RINK Instrumentation Portal — Kerala Startup Mission',
  description:
    "Explore research instruments and testing facilities available at Kerala's leading research institutions under the Research Innovation Network Kerala (RINK).",
};

export default async function HomePage() {
  // Fetch Instrumentation Data
  const instruments: Instrument[] = await fetchDataset('instruments');
  
  // Take top 20 instruments for the featured carousel, ensuring they have an image
  const featuredTechs = instruments
    .filter((inst) => inst.image_link && inst.image_link !== 'None' && inst.image_link.trim() !== '')
    .slice(0, 20);

  // Extract Institutions dynamically from Instrumentation data
  const institutionMap = new Map<string, { slug: string, name: string, tech_count: number }>();
  
  // Base 14 districts of Kerala with curated Wikipedia Commons imagery
  const baseDistricts: District[] = [
    { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', tech_count: 0, image: '/images/districts/thiruvananthapuram.jpg' },
    { slug: 'kollam', name: 'Kollam', tech_count: 0, image: '/images/districts/kollam.png' },
    { slug: 'pathanamthitta', name: 'Pathanamthitta', tech_count: 0, image: '/images/districts/pathanamthitta.jpg' },
    { slug: 'alappuzha', name: 'Alappuzha', tech_count: 0, image: '/images/districts/alappuzha.jpg' },
    { slug: 'kottayam', name: 'Kottayam', tech_count: 0, image: '/images/districts/kottayam.jpg' },
    { slug: 'idukki', name: 'Idukki', tech_count: 0, image: '/images/districts/idukki.jpg' },
    { slug: 'ernakulam', name: 'Ernakulam', tech_count: 0, image: '/images/districts/ernakulam.jpg' },
    { slug: 'thrissur', name: 'Thrissur', tech_count: 0, image: '/images/districts/thrissur.jpg' },
    { slug: 'palakkad', name: 'Palakkad', tech_count: 0, image: '/images/districts/palakkad.jpg' },
    { slug: 'malappuram', name: 'Malappuram', tech_count: 0, image: '/images/districts/malappuram.jpg' },
    { slug: 'kozhikode', name: 'Kozhikode', tech_count: 0, image: '/images/districts/kozhikode.jpg' },
    { slug: 'wayanad', name: 'Wayanad', tech_count: 0, image: '/images/districts/wayanad.jpg' },
    { slug: 'kannur', name: 'Kannur', tech_count: 0, image: '/images/districts/kannur.jpg' },
    { slug: 'kasaragod', name: 'Kasaragod', tech_count: 0, image: '/images/districts/kasaragod.jpg' },
  ];

  const districtMap = new Map<string, District>(baseDistricts.map(d => [d.slug, { ...d }]));

  const sectorMap = new Map<string, boolean>();

  instruments.forEach((inst) => {
    // Collect unique institutions
    if (inst.institution_name) {
      const name = inst.institution_name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!institutionMap.has(slug)) {
        institutionMap.set(slug, { slug, name, tech_count: 0 });
      }
      institutionMap.get(slug)!.tech_count++;
    }

    // Count categories
    const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    rawTags.forEach((t) => {
      const name = t.trim();
      if (name) sectorMap.set(name, true);
    });

    // Count instruments by district
    if (inst.standardized_district && inst.standardized_district !== 'None') {
      const slug = inst.standardized_district.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (districtMap.has(slug)) {
        districtMap.get(slug)!.tech_count++;
      }
    }
  });

  const institutions = Array.from(institutionMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  
  // Maintain RTO (South to North) order (KL-01 to KL-14) as defined in baseDistricts,
  // just filter out districts that have 0 instruments.
  const districts = Array.from(districtMap.values())
    .filter(d => d.tech_count > 0);

  const totalInstruments = instruments.length;
  const totalCategories = sectorMap.size; 
  const totalInstitutions = institutions.length;
  
  // Pre-calculate CSS Grid spans to create a perfectly filled grid (no empty spaces).
  // It calculates the exact number of rows needed, and if there are fewer items than grid cells,
  // it distributes `col-span-2` to the minimum number of items needed to make the grid a perfect rectangle.
  const getSpans = (total: number, cols: number) => {
    if (total === 0) return [];
    const rows = Math.ceil(total / cols);
    const extraSpans = (rows * cols) - total;
    
    // Distribute the extra spans (which represent items that will span 2 cols instead of 1)
    // starting from the bottom rows upwards to keep the top rows as standard as possible.
    const extraSpansPerRow = new Array(rows).fill(0);
    for (let i = 0; i < extraSpans; i++) {
      const r = (rows - 1) - (i % rows);
      extraSpansPerRow[r]++;
    }

    const finalSpans: number[] = [];
    for (let r = 0; r < rows; r++) {
      const extra = extraSpansPerRow[r];
      const itemsInThisRow = cols - extra;
      
      const rowSpans = [];
      for (let i = 0; i < itemsInThisRow; i++) {
        rowSpans.push(i < extra ? 2 : 1);
      }
      
      // Shift the array to randomize the position of the expanded cards within the row
      const shift = itemsInThisRow > 0 ? r % itemsInThisRow : 0;
      const shiftedRowSpans = [...rowSpans.slice(shift), ...rowSpans.slice(0, shift)];
      finalSpans.push(...shiftedRowSpans);
    }
    
    return finalSpans.slice(0, total);
  };

  const lgSpans = getSpans(districts.length, 4);
  const mdSpans = getSpans(districts.length, 3);
  const smSpans = getSpans(districts.length, 2);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">

      {/* ══════════════════════════════════════════════════════════
          HERO — Search-first experience
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-50">
        {/* Background cover image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          aria-hidden
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 hero-breathe"
          style={{ background: 'linear-gradient(rgba(7,20,40,0.80), rgba(7,20,40,0.75))' }}
          aria-hidden
        />
        {/* Research particles */}
        <ResearchParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
          {/* Portal identity heading */}
          <div
            className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] mb-8"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            RESEARCH INNOVATION NETWORK KERALA . INSTRUMENTATION PORTAL
          </div>

          {/* Heading */}
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight max-w-5xl mb-10"
            style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            Discover Research Instruments from Kerala&apos;s Leading Institutions
          </h1>

          {/* Dataset Selector */}
          <div className="flex items-center justify-center gap-6 mb-8 mt-4">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_12px_#3b82f6]" />
              Instruments
            </Link>
            <Link href="/services" className="flex items-center gap-2 text-white font-medium hover:opacity-100 transition-opacity" style={{ opacity: 0.6 }}>
              <div className="w-3 h-3 rounded-full border border-white/60" />
              Services
            </Link>
          </div>

          {/* Search — the centerpiece */}
          <div className="w-full hero-search-breathe">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          METRICS
      ══════════════════════════════════════════════════════════ */}
      <HeroMetrics 
        totalInstruments={totalInstruments} 
        totalCategories={totalCategories} 
        totalInstitutions={totalInstitutions} 
      />

      {/* ══════════════════════════════════════════════════════════
          FEATURED TECHNOLOGIES
          (section background, curves, and CTA live inside FeaturedCarousel)
      ══════════════════════════════════════════════════════════ */}
      <FeaturedCarousel 
        items={featuredTechs} 
        itemType="instrument"
      />

      {/* ══════════════════════════════════════════════════════════
          BROWSE BY INSTITUTION
      ══════════════════════════════════════════════════════════ */}
      <BrowseByInstitution institutions={institutions} />

      {/* ══════════════════════════════════════════════════════════
          BROWSE BY DISTRICT
      ══════════════════════════════════════════════════════════ */}
      <section id="districts" className="relative py-20 bg-[#F6F8FC] overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Explore by District</div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-3">Browse Instruments by Region</h2>
            <p className="text-[#475569] text-base font-sans">Find testing facilities and research equipment across all 14 districts of Kerala.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {districts.map((district, i) => {
              const smClass = smSpans[i] === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
              const mdClass = mdSpans[i] === 2 ? 'md:col-span-2' : 'md:col-span-1';
              const lgClass = lgSpans[i] === 2 ? 'lg:col-span-2' : 'lg:col-span-1';
              
              return (
                <div 
                  key={district.slug} 
                  className={`col-span-1 ${smClass} ${mdClass} ${lgClass}`}
                >
                  <DistrictCard district={district} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
