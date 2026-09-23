'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  MapPin 
} from 'lucide-react';
import { isLocationEnabled, LOCATION_CONFIG } from '@/config/locationConfig';
import { resolveInstitutionLogo, getMonogram, LOCAL_INSTITUTION_LOGOS } from '@/lib/institutionLogos';

export interface MouPartner {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  benefitBadge: string;
  facility: string;
  concessionRate: string;
  summary: string;
  localLogo?: string;
  cdnLogo?: string;
  originalLogoLink?: string;
  eligibility: string;
  district?: string;
  gmaps_link?: string;
}

// Resilient curated fallback list in case network or API is offline
const FALLBACK_MOU_PARTNERS: MouPartner[] = [
  {
    id: 'INSTITUTE-100005',
    name: 'Indian Institute of Technology Palakkad (IIT Palakkad)',
    shortName: 'IIT Palakkad',
    slug: 'indian-institute-of-technology-palakkad-iit-palakkad',
    benefitBadge: 'Subsidized User Rates',
    facility: 'Central Instrumentation Facility (CIF) & CMFF',
    concessionRate: 'Subsidized internal user fee rates',
    summary: 'Startups with a valid KSUM UID can avail subsidized access to advanced CIF and Central Micro-Fabrication facilities.',
    localLogo: '/images/institutions/iit-palakkad.jpg',
    originalLogoLink: 'https://drive.google.com/file/d/1QNIqun57FJOGC342k9T-psulkGEgraSs/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1QNIqun57FJOGC342k9T-psulkGEgraSs.webp',
    eligibility: 'Valid KSUM UID',
  },
  {
    id: 'INSTITUTE-100020',
    name: 'Indian Institute of Science Education & Research (IISER TVM)',
    shortName: 'IISER TVM',
    slug: 'indian-institute-of-science-education-and-research-thiruvananthapuram-iiser-tvm',
    benefitBadge: 'Government R&D Rates',
    facility: 'Central Instrumentation Facility (CIF)',
    concessionRate: 'Category II Government R&D Rates',
    summary: 'Direct online booking on the official CIF portal with concessional government R&D institution user fees.',
    localLogo: '/images/institutions/iiser-thiruvananthapuram.jpg',
    originalLogoLink: 'https://drive.google.com/file/d/1RWENagWNAddbUhn2UQmbKtrrg7yIJNlr/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1RWENagWNAddbUhn2UQmbKtrrg7yIJNlr.webp',
    eligibility: 'KSUM UID CIF Login',
  },
  {
    id: 'INSTITUTE-100001',
    name: 'Cochin University of Science & Technology (CUSAT)',
    shortName: 'CUSAT',
    slug: 'cochin-university-of-science-and-technology-cusat',
    benefitBadge: 'Govt R&D (Category II) Rates',
    facility: 'Sophisticated Test & Instrumentation Centre (STIC)',
    concessionRate: 'Category II User Fee Rates (inclusive of taxes)',
    summary: 'Access to university testing, analytical laboratories, and STIC at standardized Government R&D fee tiers.',
    localLogo: '/images/institutions/cusat.webp',
    originalLogoLink: 'https://drive.google.com/file/d/1mkaLLR_Wfdv3NLoKKhGZMf-_SM-DDV9A/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1mkaLLR_Wfdv3NLoKKhGZMf-_SM-DDV9A.webp',
    eligibility: 'KSUM UID Requisition',
  },
  {
    id: 'INSTITUTE-100018',
    name: 'University of Calicut (CSIF)',
    shortName: 'Calicut University',
    slug: 'university-of-calicut',
    benefitBadge: 'R&D Lab Rates · 5-Yr MoU',
    facility: 'Central Sophisticated Instrumentation Facility (CSIF)',
    concessionRate: 'Internal R&D Laboratory User Rates',
    summary: 'Five-year formal MoU granting startups access to CSIF analytical instrumentation at internal R&D rates.',
    originalLogoLink: 'https://drive.google.com/file/d/187F1EHhdBudZq_M2JB3Ql54Ud70VHqy-/view?usp=drive_link',
    cdnLogo: '/assets/instrument/187F1EHhdBudZq_M2JB3Ql54Ud70VHqy-.webp',
    eligibility: 'KSUM UID Certificate',
  },
  {
    id: 'INSTITUTE-100009',
    name: 'Kerala Forest Research Institute (KSCSTE - KFRI)',
    shortName: 'KSCSTE - KFRI',
    slug: 'kerala-forest-research-institute-kscste-kfri',
    benefitBadge: 'Up to 40% Discount',
    facility: 'KFRI Analytical & Testing Laboratories',
    concessionRate: 'Up to 40% subsidized fee concession',
    summary: 'Covered under KSCSTE startup support for material characterization, forestry, and biological sample testing.',
    localLogo: '/images/institutions/kscste.jpg',
    originalLogoLink: 'https://drive.google.com/file/d/1MsHIIRz4BitgfPYrnrlElmME5-PTXkCh/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1MsHIIRz4BitgfPYrnrlElmME5-PTXkCh.webp',
    eligibility: 'KSUM Registered Startup',
  },
  {
    id: 'INSTITUTE-100007',
    name: 'Tropical Botanic Garden & Research Institute (JNTBGRI)',
    shortName: 'KSCSTE - JNTBGRI',
    slug: 'jawaharlal-nehru-tropical-botanic-garden-research-institute-jntbgri',
    benefitBadge: 'Up to 40% Discount',
    facility: 'Phytochemical & Botanical Analytical Services',
    concessionRate: 'Up to 40% testing concession (10 samples/mo)',
    summary: 'Discounted access for herbal, botanical, and phytochemical characterization under KSCSTE support.',
    localLogo: '/images/institutions/kscste-jntbgri.jpg',
    originalLogoLink: 'https://drive.google.com/file/d/1K8kO4n5YYtwInqIiq72eyUuhYQFDvn3p/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1K8kO4n5YYtwInqIiq72eyUuhYQFDvn3p.webp',
    eligibility: 'KSUM UID / KSCSTE Policy',
  },
  {
    id: 'INSTITUTE-100012',
    name: 'Centre for Water Resources Development & Management',
    shortName: 'KSCSTE - CWRDM',
    slug: 'centre-for-water-resources-development-and-management-cwrdm',
    benefitBadge: 'Incubation Facility Access',
    facility: 'Water, Soil & Environmental Testing Labs',
    concessionRate: 'Concession as per KSCSTE Policy',
    summary: 'Direct access to advanced hydrological instrumentation and incubation centre testing support.',
    localLogo: '/images/institutions/cwrdm.jpg',
    originalLogoLink: 'https://drive.google.com/file/d/1193EUyBU2mx7SXuhOLCLfNmEXA05jQqD/view?usp=drive_link',
    cdnLogo: '/assets/instrument/1193EUyBU2mx7SXuhOLCLfNmEXA05jQqD.webp',
    eligibility: 'Incubatees & KSUM Startups',
  },
];

function extractShortName(name: string): string {
  const match = name.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return name.length > 28 ? name.slice(0, 26) + '...' : name;
}

function PartnerCard({ 
  partner, 
  hiddenOnMobile 
}: { 
  partner: MouPartner; 
  hiddenOnMobile?: boolean; 
}) {
  const [imageError, setImageError] = useState(false);
  const logoSrc = resolveInstitutionLogo(partner);
  const monogram = getMonogram(partner.name);

  return (
    <Link 
      href={`/institutions/${partner.slug}?from=partnerships`}
      className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 flex-col justify-between group ${
        hiddenOnMobile ? 'hidden sm:flex' : 'flex'
      }`}
    >
      <div>
        {/* Top Bar: Logo/Avatar + Verified Badge */}
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
            {logoSrc && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={partner.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center select-none bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/40 text-[#1B4D9B] rounded-md sm:rounded-lg">
                <span
                  className={`font-heading font-black uppercase text-center leading-none tracking-wider ${
                    monogram.length <= 2
                      ? 'text-xs sm:text-sm font-black'
                      : monogram.length <= 4
                      ? 'text-[10px] sm:text-xs font-black tracking-tight'
                      : 'text-[9px] sm:text-[10px] font-bold tracking-tighter'
                  }`}
                >
                  {monogram}
                </span>
              </div>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 leading-none">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Subsidized Rates</span>
          </span>
        </div>

        {/* Institution Name */}
        <div className="mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#0A2164] uppercase tracking-wider block mb-0.5 sm:mb-1">
            {partner.shortName}
          </span>
          <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#0A2164] transition-colors line-clamp-2">
            {partner.name}
          </h3>
        </div>

        {/* Benefit Badge */}
        <div className="mb-3 sm:mb-4">
          <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold bg-blue-50 text-[#0A2164] border border-blue-100">
            {partner.benefitBadge}
          </span>
        </div>

        {/* Minimal Explanation & Key Details */}
        <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
          {partner.summary}
        </p>

        <div className="space-y-1.5 sm:space-y-2 pt-2.5 sm:pt-3 border-t border-slate-100 text-xs font-sans text-slate-500">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1 sm:line-clamp-none"><strong className="text-slate-700">Facility:</strong> {partner.facility}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1 sm:line-clamp-none"><strong className="text-slate-700">Concession:</strong> {partner.concessionRate}</span>
          </div>
          {isLocationEnabled('placement4_exclusiveMoUPartnerships') && (partner.district || LOCATION_CONFIG.fallbacks.defaultDistrict) && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 sm:line-clamp-none"><strong className="text-slate-700">Location:</strong> {partner.district || LOCATION_CONFIG.fallbacks.defaultDistrict}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Link */}
      <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-slate-100">
        <span
          className="inline-flex items-center justify-between w-full text-xs font-semibold text-[#0A2164] group-hover:text-blue-700 transition-colors py-1"
        >
          <span>Explore Equipment &amp; Facilities</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

interface ExclusivePartnershipsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouList?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  institutionList?: any[];
}

const ITEMS_PER_PAGE = 8;

export default function ExclusivePartnershipsSection({ 
  mouList = [], 
  institutionList = [] 
}: ExclusivePartnershipsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamically build and resolve partner list from live data
  const partners = useMemo<MouPartner[]>(() => {
    if (!Array.isArray(mouList) || mouList.length === 0) {
      return FALLBACK_MOU_PARTNERS;
    }

    // 1. Build lookup index for institution metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instMap = new Map<string, any>();
    if (Array.isArray(institutionList)) {
      institutionList.forEach(inst => {
        if (inst.institution_id) {
          instMap.set(inst.institution_id, inst);
        }
      });
    }

    // 2. Filter for verified MoU partnerships
    const verified = mouList.filter(
      item => item.ksum_mou === 'Yes' || item.verification_status === 'Verified'
    );

    if (verified.length === 0) {
      return FALLBACK_MOU_PARTNERS;
    }

    // 3. Transform to unified MouPartner models
    return verified.map(item => {
      const inst = instMap.get(item.institution_id) || {};
      const name = (inst.institution_name || item.institution_name || '').trim();
      const slug = (
        inst.slug || 
        name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      );

      const plusCode = inst.plus_code || '';
      let district = inst.district;
      if (!district || district === 'None') {
        const lower = `${plusCode} ${name}`.toLowerCase();
        if (lower.includes('palakkad') || lower.includes('kanjikode')) district = 'Palakkad';
        else if (lower.includes('kochi') || lower.includes('cusat') || lower.includes('ernakulam')) district = 'Ernakulam';
        else if (lower.includes('thiruvananthapuram') || lower.includes('tvm') || lower.includes('palode') || lower.includes('vithura')) district = 'Trivandrum';
        else if (lower.includes('kozhikode') || lower.includes('calicut')) district = 'Kozhikode';
        else if (lower.includes('thrissur') || lower.includes('peechi')) district = 'Thrissur';
        else if (lower.includes('alappuzha') || lower.includes('kalavoor')) district = 'Alappuzha';
        else if (lower.includes('kottayam')) district = 'Kottayam';
        else if (lower.includes('kollam')) district = 'Kollam';
        else district = LOCATION_CONFIG.fallbacks.defaultDistrict;
      }

      return {
        id: item.institution_id,
        name: name,
        shortName: extractShortName(name),
        slug: slug,
        benefitBadge: item.ksum_benefit_type || 'Subsidized User Rates',
        facility: item.ksum_facility || 'Central Testing & Instrumentation Facilities',
        concessionRate: item.ksum_discount_or_rate || 'Subsidized rates for registered startups',
        summary: item.ksum_mou_details || item.ksum_conditions || 'Subsidized access for eligible startups.',
        localLogo: LOCAL_INSTITUTION_LOGOS[slug] || inst.localLogo,
        cdnLogo: inst.logo_link,
        originalLogoLink: inst.original_logo_link || item.original_logo_link,
        eligibility: item.ksum_eligible_for || 'Valid KSUM UID',
        district: district,
        gmaps_link: inst.gmaps_link || inst.link,
      };
    });
  }, [mouList, institutionList]);

  // Mobile progressive disclosure (initially shows 3 on mobile)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const MOBILE_MOU_THRESHOLD = 3;

  // Pagination calculation
  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPartners = partners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsMobileExpanded(false);
    // Smoothly scroll back to section header on page change
    const el = document.getElementById('exclusive-partnerships');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative py-10 sm:py-16 lg:py-20 bg-[#F8FAFF] border-b border-slate-200/80 overflow-hidden"
    >
      {/* Ambient background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mou-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0A2164" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mou-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Proper Scroll Anchor for Exclusive Partnerships */}
        <div id="exclusive-partnerships" className="scroll-mt-[78px] sm:scroll-mt-[104px]" />
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>KSUM Institutional Alliance · Exclusive MoU Partnerships</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#0F172A] tracking-tight mb-3">
            Subsidized Instrumentation &amp; Testing Access for Kerala Startups
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
            Kerala Startup Mission has partnered with leading research and academic institutions to provide KSUM UID startups access to advanced instrumentation and R&amp;D testing services at subsidized rates. These partnerships help startups leverage institutional research infrastructure and technical expertise to support product development, testing and validation.
          </p>
        </div>

        {/* Responsive Grid of Cards (Max 8 per page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {currentPartners.map((partner, index) => (
            <PartnerCard 
              key={partner.id} 
              partner={partner} 
              hiddenOnMobile={!isMobileExpanded && index >= MOBILE_MOU_THRESHOLD}
            />
          ))}
        </div>

        {/* Mobile Progressive Disclosure: View All / Show Less */}
        {currentPartners.length > MOBILE_MOU_THRESHOLD && (
          <div className="sm:hidden flex justify-center -mt-4 mb-8">
            <button
              type="button"
              onClick={() => {
                if (isMobileExpanded) {
                  setIsMobileExpanded(false);
                  const el = document.getElementById('exclusive-partnerships');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } else {
                  setIsMobileExpanded(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-xl font-semibold text-xs text-emerald-900 bg-white hover:bg-emerald-50/50 border border-emerald-200/90 shadow-2xs active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {isMobileExpanded 
                  ? 'Show Fewer Partner Institutions' 
                  : `View All ${currentPartners.length} Partner Institutions (${currentPartners.length - MOBILE_MOU_THRESHOLD} More)`}
              </span>
              {isMobileExpanded ? (
                <ChevronUp className="w-4 h-4 text-emerald-600/70" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-600/70" />
              )}
            </button>
          </div>
        )}

        {/* Pagination Controls (renders only if total partner count exceeds 8) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 font-sans">
            <p className="text-xs text-slate-500">
              Showing <strong className="text-slate-800">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, partners.length)}</strong> of <strong className="text-slate-800">{partners.length}</strong> partner institutions
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#0A2164] text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
