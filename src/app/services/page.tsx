import { fetchDataset } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import ServiceCard from '@/components/ui/ServiceCard';
import DistrictCard, { District } from '@/components/ui/DistrictCard';
import FeaturedCarousel from '@/components/ui/FeaturedCarousel';
import HeroSearch, { SearchConfig } from '@/components/ui/HeroSearch';
import HeroMetrics from '@/components/ui/HeroMetrics';
import BrowseByInstitution from '@/components/ui/BrowseByInstitution';
import ResearchParticles from '@/components/ui/ResearchParticles';
import Link from 'next/link';

export const metadata = {
  title: 'RINK Services Portal — Kerala Startup Mission',
  description:
    "Explore services available at Kerala's leading startups under the Research Innovation Network Kerala (RINK).",
};

export default async function ServicesHomePage() {
  const services: Service[] = await fetchDataset('services');
  
  const featuredServices = services
    .filter((svc) => svc.thumbnail)
    .slice(0, 20);

  const startupMap = new Map<string, { slug: string, name: string, tech_count: number }>();
  
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

  services.forEach((svc) => {
    if (svc.startupName) {
      const name = svc.startupName;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!startupMap.has(slug)) {
        startupMap.set(slug, { slug, name, tech_count: 0 });
      }
      startupMap.get(slug)!.tech_count++;
    }

    if (svc.category) {
      sectorMap.set(svc.category.trim(), true);
    }

    if (svc.district) {
      const slug = svc.district.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (districtMap.has(slug)) {
        districtMap.get(slug)!.tech_count++;
      }
    }
  });

  const startups = Array.from(startupMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  const districts = Array.from(districtMap.values()).filter(d => d.tech_count > 0);

  const totalServices = services.length;
  const totalCategories = sectorMap.size; 
  const totalStartups = startups.length;
  
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

  const lgSpans = getSpans(districts.length, 4);
  const mdSpans = getSpans(districts.length, 3);
  const smSpans = getSpans(districts.length, 2);

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

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <section className="relative z-50">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
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
            RESEARCH INNOVATION NETWORK KERALA . SERVICES PORTAL
          </div>

          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight max-w-5xl mb-10"
            style={{ color: '#FFFFFF', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            Discover Startup Services from Kerala&apos;s Innovation Ecosystem
          </h1>

          <div className="flex items-center justify-center gap-6 mb-8 mt-4">
            <Link href="/" className="flex items-center gap-2 text-white font-medium hover:opacity-100 transition-opacity" style={{ opacity: 0.6 }}>
              <div className="w-3 h-3 rounded-full border border-white/60" />
              Instruments
            </Link>
            <Link href="/services" className="flex items-center gap-2 text-white font-semibold hover:opacity-100 transition-opacity" style={{ opacity: 1 }}>
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_12px_#3b82f6]" />
              Services
            </Link>
          </div>

          <div className="w-full hero-search-breathe">
            <HeroSearch config={SERVICE_SEARCH_CONFIG} />
          </div>
        </div>
      </section>

      <HeroMetrics 
        totalInstruments={totalServices} 
        totalCategories={totalCategories} 
        totalInstitutions={totalStartups} 
        context="services"
      />

      <FeaturedCarousel 
        title="Featured Startup Services"
        ctaText="Browse All Services"
        ctaLink="/services/list"
        items={featuredServices} 
        itemType="service"
      />

      <BrowseByInstitution institutions={startups} context="services" />

      <section id="districts" className="relative py-20 bg-[#F6F8FC] overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Explore by District</div>
            <h2 className="text-3xl font-heading font-bold text-[#0F172A] mb-3">Browse Services by Region</h2>
            <p className="text-[#475569] text-base font-sans">Find startup services across all 14 districts of Kerala.</p>
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
                  <DistrictCard district={district} linkPrefix="/services/list?district=" itemName="Service" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
