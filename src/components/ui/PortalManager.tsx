'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import DistrictCard, { District } from '@/components/ui/DistrictCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroSearch, { SearchConfig } from '@/components/ui/HeroSearch';
import HeroMetrics from '@/components/ui/HeroMetrics';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import ResearchParticles from '@/components/ui/ResearchParticles';
import DatasetToggle, { PortalView } from '@/components/ui/DatasetToggle';
import { Institution } from '@/types';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';

interface PortalManagerProps {
  instruments: Instrument[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  institutionList?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouList?: any[];
  services: Service[];
  initialView: PortalView;
}

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

const INSTRUMENT_SEARCH_CONFIG: SearchConfig = {
  placeholders: [
    'Search Instruments, Institutions, Categories...',
    'Try "Electron Microscope" or "Spectrometer"...',
    'Search by Equipment Category...',
  ],
  searchRoute: '/instruments',
  detailRoute: '/instruments',
  indexUrl: '/api/search-index?dataset=instruments',
  ariaLabel: 'Search instruments',
};

const SERVICE_SEARCH_CONFIG: SearchConfig = {
  placeholders: [
    'Search Services, Startups, Categories...',
    'Try "Software Development" or "Consulting"...',
    'Search by Service Category...',
  ],
  searchRoute: '/services/list',
  detailRoute: '/services',
  indexUrl: '/api/search-index?dataset=services',
  ariaLabel: 'Search services',
};

export default function PortalManager({ instruments, institutionList = [], mouList = [], services, initialView }: PortalManagerProps) {
  const [view, setView] = useState<PortalView>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load canonical InstitutionRepository instances with official instituitiion_list dataset
  const repo = useMemo(() => InstitutionRepository.fromInstrumentData(instruments, institutionList), [instruments, institutionList]);

  // Keep view synchronized with initialView on props update / Back-Forward navigation
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Reset loading transition after App Router navigation completes
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, isTransitioning]);

  const handleViewChange = (newView: PortalView) => {
    if (newView === view || isTransitioning) return;
    
    // 1. Update view state immediately for dynamic toggle feedback
    setView(newView); 
    // 2. Start loading overlay fade-in
    setIsTransitioning(true);

    // 3. Wait for overlay fade-in animation, then trigger App Router navigation
    setTimeout(() => {
      const targetRoute = newView === 'instruments' ? '/' : '/services';
      router.push(targetRoute);
    }, 300);
  };

  const data = useMemo(() => {
    if (view === 'instruments') {
      const featured = instruments.filter(inst => inst.image_link && inst.image_link !== 'None' && inst.image_link.trim() !== '').slice(0, 20);
      const districtMap = new Map<string, District>(baseDistricts.map(d => [d.slug, { ...d }]));
      const sectorMap = new Map<string, boolean>();

      // Count instruments per canonical institution_id
      const instCountMap = new Map<string, number>();

      instruments.forEach((inst) => {
        const id = inst.institution_id || (inst.institution_name ? repo.getByName(inst.institution_name)?.institution_id : null);
        if (id) {
          instCountMap.set(id, (instCountMap.get(id) || 0) + 1);
        }

        const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
        rawTags.forEach((t) => { if (t.trim()) sectorMap.set(t.trim(), true); });

        if (inst.standardized_district && inst.standardized_district !== 'None') {
          const slug = inst.standardized_district.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (districtMap.has(slug)) districtMap.get(slug)!.tech_count++;
        }
      });

      // Build MoU lookup map ONCE for the page lifecycle: O(1) lookups using institution_id
      const mouMap = new Map<string, boolean>();
      if (Array.isArray(mouList)) {
        mouList.forEach((item) => {
          if (item?.institution_id && item?.verification_status === 'Verified') {
            mouMap.set(item.institution_id, true);
          }
        });
      }

      // Use Institution base objects strictly from InstitutionRepository
      const institutions: Institution[] = repo.getAll()
        .map(inst => ({
          ...inst,
          tech_count: instCountMap.get(inst.institution_id || '') || 0,
          has_verified_mou: inst.institution_id ? (mouMap.get(inst.institution_id) === true) : false,
        }))
        .filter(inst => inst.tech_count > 0)
        .sort((a, b) => b.tech_count - a.tech_count);

      const districts = Array.from(districtMap.values()).filter(d => d.tech_count > 0);

      return {
        featured,
        institutions,
        districts,
        totalItems: instruments.length,
        totalCategories: sectorMap.size,
        totalInstitutions: institutions.length,
        title: "Discover Research Instruments from Kerala's Leading Institutions",
        subtitle: "RESEARCH INNOVATION NETWORK KERALA . INSTRUMENTATION PORTAL",
        context: 'instruments' as const,
        featuredTitle: "Available Instrumentation Facilities",
        featuredCtaText: "Browse All",
        featuredCtaLink: "/instruments",
        featuredCtaMessage: "Browse through available instrumentation facilities across Kerala",
        districtLinkPrefix: "/instruments?district=",
        itemName: "Instrument",
      };
    } else {
      const featured = services.filter(svc => svc.thumbnail).slice(0, 20);
      const startupMap = new Map<string, Institution>();
      const districtMap = new Map<string, District>(baseDistricts.map(d => [d.slug, { ...d }]));
      const sectorMap = new Map<string, boolean>();

      services.forEach((svc) => {
        if (svc.startupName) {
          const name = svc.startupName;
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (!startupMap.has(slug)) startupMap.set(slug, { slug, name, tech_count: 0 });
          startupMap.get(slug)!.tech_count++;
        }
        if (svc.category) sectorMap.set(svc.category.trim(), true);
        if (svc.district) {
          const slug = svc.district.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (districtMap.has(slug)) districtMap.get(slug)!.tech_count++;
        }
      });

      const institutions = Array.from(startupMap.values()).sort((a, b) => b.tech_count - a.tech_count);
      const districts = Array.from(districtMap.values()).filter(d => d.tech_count > 0);

      return {
        featured,
        institutions,
        districts,
        totalItems: services.length,
        totalCategories: sectorMap.size,
        totalInstitutions: institutions.length,
        title: "Discover Startup Services from Kerala's Innovation Ecosystem",
        subtitle: "RESEARCH INNOVATION NETWORK KERALA . SERVICES PORTAL",
        context: 'services' as const,
        featuredTitle: "Featured Startup Services",
        featuredCtaText: "Browse All Services",
        featuredCtaLink: "/services/list",
        featuredCtaMessage: "Ready to Scale Your Startup with Premium Ecosystem Services?",
        districtLinkPrefix: "/services/list?district=",
        itemName: "Service",
      };
    }
  }, [view, instruments, services, repo]);

  const getSpans = (total: number, cols: number) => {
    if (total === 0) return [];
    const rows = Math.ceil(total / cols);
    const extraSpans = (rows * cols) - total;
    
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
      
      const shift = itemsInThisRow > 0 ? r % itemsInThisRow : 0;
      const shiftedRowSpans = [...rowSpans.slice(shift), ...rowSpans.slice(0, shift)];
      finalSpans.push(...shiftedRowSpans);
    }
    return finalSpans.slice(0, total);
  };

  const lgSpans = getSpans(data.districts.length, 4);
  const mdSpans = getSpans(data.districts.length, 3);
  const smSpans = getSpans(data.districts.length, 2);

  return (
    <div className="min-h-screen bg-[#F6F8FC] relative">
      {/* ── LOADING OVERLAY ── */}
      <div 
        className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-12 h-12 border-4 border-[#1b60bb]/20 border-t-[#1b60bb] rounded-full animate-spin mb-6 shadow-lg" />
        <p className="text-[#1b60bb] font-semibold text-lg tracking-wide animate-pulse">
          {view === 'instruments' ? 'Loading Instruments Portal...' : 'Loading Services Portal...'}
        </p>
      </div>

      <section className="relative z-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.webp')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hero-breathe"
          style={{ background: 'linear-gradient(rgba(7,20,40,0.80), rgba(7,20,40,0.75))' }}
          aria-hidden
        />
        <ResearchParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
          <div
            className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] mb-8"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {data.subtitle}
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight max-w-5xl mb-10"
            style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            {data.title}
          </h1>

          <DatasetToggle view={view} onChange={handleViewChange} />

          <div className="w-full hero-search-breathe">
            <HeroSearch 
              key={`${view}-search`} 
              config={view === 'services' ? SERVICE_SEARCH_CONFIG : INSTRUMENT_SEARCH_CONFIG} 
            />
          </div>
        </div>
      </section>

      <HeroMetrics 
        totalInstruments={data.totalItems} 
        totalCategories={data.totalCategories} 
        totalInstitutions={data.totalInstitutions} 
        totalDistricts={data.districts.length}
        context={data.context}
      />

      <FeaturedCarousel 
        title={data.featuredTitle}
        ctaText={data.featuredCtaText}
        ctaLink={data.featuredCtaLink}
        ctaMessage={data.featuredCtaMessage}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items={data.featured as any[]} 
        itemType={data.context === 'instruments' ? 'instrument' : 'service'}
      />

      <BrowseByInstitution institutions={data.institutions} context={data.context} />

      <section id="districts" className="relative py-20 bg-[#F6F8FC] overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Explore by District</div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-3">
              Browse {view === 'services' ? 'Services' : 'Instruments'} by Region
            </h2>
            <p className="text-[#475569] text-base font-sans">
              Find {view === 'services' ? 'startup services' : 'testing facilities and research equipment'} across all 14 districts of Kerala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {data.districts.map((district, i) => {
              const smClass = smSpans[i] === 2 ? 'sm:col-span-2' : 'sm:col-span-1';
              const mdClass = mdSpans[i] === 2 ? 'md:col-span-2' : 'md:col-span-1';
              const lgClass = lgSpans[i] === 2 ? 'lg:col-span-2' : 'lg:col-span-1';
              
              return (
                <div 
                  key={district.slug} 
                  className={`col-span-1 ${smClass} ${mdClass} ${lgClass}`}
                >
                  <DistrictCard 
                    district={district} 
                    linkPrefix={data.districtLinkPrefix}
                    itemName={data.itemName} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
