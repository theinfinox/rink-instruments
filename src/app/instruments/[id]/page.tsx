import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight, FileText, Microscope, Building2 } from 'lucide-react';
import TechImage from '@/components/ui/TechImage';
import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';
import { toDriveEmbedUrl } from '@/lib/mapper';
import MouBadge from '@/components/ui/MouBadge';
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfJlFIqrK5Dzd5R-Voh19OvhUKxj7OzEqeW8XIdjJMNKxc8Eg/viewform';

// ── Helpers ───────────────────────────────────────────────────




function clean(val: string | undefined | null): string {
  if (!val) return '';
  const v = val.trim();
  if (['na', 'n/a', 'nil', 'none', 'not specified', 'not available', 'information being updated']
    .includes(v.toLowerCase())) return '';
  return v;
}

// ── Meta ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const res = await fetch(`${CDN_HOST}/instrument.json`);
  const data = await res.json();
  const instruments: Instrument[] = data.main_data || [];
  return instruments.map(t => ({ id: t.provider_key || t.id || '' }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(bundle.main_data, bundle.instituitiion_list, bundle.mou_list);
  const rawTech = bundle.main_data.find(t => (t.provider_key || t.id) === id);
  if (!rawTech) return { title: 'Instrument Not Found — RINK' };
  
  const vm = toInstrumentViewModel(rawTech, repo);
  const shortDesc = vm.facility || vm.location.address || 'Discover this instrument on RINK.';
  const contactStr = vm.ui.hasContact 
    ? 'Contact the institution for details.' : 'View institution details for booking.';
    
  const metaDescription = `Discover ${vm.displayTitle} available at ${vm.institution} in ${vm.location.district || 'Kerala'}. ${shortDesc.slice(0, 80).trim()}... ${contactStr}`;

  return {
    title: `${vm.displayTitle} at ${vm.institution} | RINK Kerala`,
    description: metaDescription,
    openGraph: {
      title: `${vm.displayTitle} at ${vm.institution}`,
      description: metaDescription,
      type: 'article',
    },
  };
}

import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';

export default async function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const bundle = await fetchInstrumentBundle();
  const instruments = bundle.main_data;
  const repo = InstitutionRepository.fromInstrumentData(instruments, bundle.instituitiion_list, bundle.mou_list);
  
  const rawTech = instruments.find(t => (t.provider_key || t.id) === id);
  if (!rawTech) notFound();

  const instEntity = repo.getInstitution(rawTech);
  const hasVerifiedMou = instEntity.has_verified_mou === true;
  
  const vm = toInstrumentViewModel(rawTech, repo);
  
  // Create a sector slug based on the district for routing, same as the mapper
  const sectorSlug = vm.location.district ? vm.location.district.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general';

  const finalBookingLink = clean(rawTech.website_booking_link) || clean(rawTech.website_booking_link_fallback) || GOOGLE_FORM_URL;

  const displayImage = vm.media.thumbnail;

  // Related technologies: same district, different ID, max 4
  const related = instruments
    .filter(t => (t.standardized_district?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general') === sectorSlug && (t.provider_key || t.id) !== id)
    .slice(0, 4)
    .map(t => toInstrumentViewModel(t, repo));

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── MOBILE STICKY BOTTOM CTA ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
          <a
            href={finalBookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-md bg-[#0A2164] text-white font-semibold text-sm"
          >
            <FileText className="w-4 h-4" />
            Booking link
          </a>
        </div>
      </div>

      <div className="pb-28 md:pb-0">

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mb-8">
              <Link href="/" className="hover:text-[#0A2164] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link href="/instruments" className="hover:text-[#0A2164] transition-colors">Instruments</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Link href={`/sectors/${sectorSlug}`} className="hover:text-[#0A2164] transition-colors">{vm.location.district || 'General'}</Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-sm">{vm.displayTitle}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">

                {/* Category chips */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-slate-50 border border-slate-200 text-slate-700 rounded-sm text-xs px-3 py-1 font-sans font-semibold">
                    {vm.location.district || 'General'}
                  </span>
                  <MouBadge hasVerifiedMou={hasVerifiedMou} />
                  {vm.tags.map((t, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-sm text-xs px-3 py-1 font-sans">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2164] leading-tight">
                  {vm.displayTitle}
                </h1>

                {/* Institution + ID */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Link href={`/institutions/${vm.institution.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="font-bold text-[#0A2164] hover:underline">
                    {vm.institution}
                  </Link>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-slate-500">ID: {vm.id}</span>
                </div>
              </div>

              {/* RIGHT COLUMN — Technology Image */}
              <div>
                <div className="rounded-md overflow-hidden border border-slate-200 shadow-sm aspect-[16/9] w-full relative bg-white">
                  <TechImage src={displayImage} alt={vm.displayTitle} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT — TWO-COLUMN GRID
        ══════════════════════════════════════════════════════ */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── LEFT / MAIN COLUMN ── */}
              <div className="lg:col-span-2 space-y-8">

                {/* ── 💡 FACILITY CARD ── */}
                {vm.facility && (
                  <div className="relative rounded-xl overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-cyan-500/20 p-px">
                      <div className="h-full w-full rounded-xl bg-[#0A1D37]/5" />
                    </div>
                    {/* Soft glow */}
                    <div className="absolute -inset-1 bg-blue-500/10 blur-2xl rounded-2xl" />
                    {/* Card body */}
                    <div className="relative rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-200/50">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="font-serif text-lg font-bold text-blue-900 tracking-tight">
                          Facility
                        </h2>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans text-[15px]">
                        {vm.facility}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── ADDRESS & LOCATION ── */}
                {vm.location.address && (
                  <div className="space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0A2164]">Address &amp; Location</h2>
                    <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                      {vm.location.address}
                    </p>
                  </div>
                )}

                {/* ── CONTACT INFORMATION ── */}
                {vm.ui.hasContact && (
                  <div className="space-y-3">
                    <h2 className="font-serif text-xl font-bold text-[#0A2164]">Contact Information</h2>
                    <ul className="space-y-2">
                      {vm.contact.email && (
                        <li className="flex items-start gap-3 text-slate-700 font-sans text-[15px]">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A2164]" />
                          <strong>Email:</strong> {vm.contact.email}
                        </li>
                      )}
                      {vm.contact.phone && (
                        <li className="flex items-start gap-3 text-slate-700 font-sans text-[15px]">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A2164]" />
                          <strong>Phone:</strong> {vm.contact.phone}
                        </li>
                      )}
                      {vm.contact.website && (
                        <li className="flex items-start gap-3 text-slate-700 font-sans text-[15px]">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0A2164]" />
                          <strong>Website:</strong> <a href={vm.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{vm.contact.website}</a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

              </div>

              {/* ── RIGHT SIDEBAR ── */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">

                  {/* Sidebar Card */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">



                    {/* Partner Institution */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Partner Institution
                      </div>
                      <Link
                        href={`/institutions/${vm.institution.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="group flex items-center gap-2 text-sm font-semibold text-[#0A2164] hover:underline font-sans"
                      >
                        {(() => {
                          const inst = vm.institution_entity;
                          const logo = inst ? (
                            (inst.original_logo_link ? toDriveEmbedUrl(inst.original_logo_link) : null) ||
                            inst.logo_link ||
                            inst.institution_image_embed_url ||
                            inst.institution_image ||
                            inst.logo_embed_url ||
                            inst.logo_url ||
                            inst.image ||
                            null
                          ) : null;
                          
                          if (logo) {
                            return (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={logo} alt={vm.institution} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                            );
                          }
                          return <Building2 className="w-4 h-4 text-slate-400 group-hover:text-[#0A2164] transition-colors flex-shrink-0" />;
                        })()}
                        {vm.institution}
                      </Link>
                    </div>

                    {/* ── CTA ── */}
                    <div className="p-5 bg-gradient-to-br from-[#0A2164] to-[#0d3285]">
                      <h3 className="font-serif text-base font-bold mb-2" style={{ color: '#FFFFFF' }}>
                        Interested in this Instrument?
                      </h3>
                      <p className="text-xs leading-relaxed font-sans mb-4" style={{ color: 'rgba(191,219,254,0.9)' }}>
                        Submit an enquiry to book this instrument or request analysis services for your research, development, and testing needs.
                      </p>
                      <a
                        href={finalBookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#F5B400] hover:bg-yellow-400 text-slate-900 font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        Booking link
                      </a>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 9 — RELATED TECHNOLOGIES
        ══════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50/50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">More from {vm.location.district || 'General'}</h2>
                </div>
                <Link href={`/sectors/${sectorSlug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A2164] hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(rel => {
                  const relImg = rel.media.thumbnail;
                  return (
                    <Link key={rel.id} href={`/instruments/${rel.id}`}
                      className="group bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all">
                      <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                        {relImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={relImg} alt={rel.displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Microscope className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{rel.institution.split(' ').slice(0, 3).join(' ')}</div>
                        <h3 className="font-heading font-bold text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {rel.displayTitle}
                        </h3>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#0A2164] font-semibold">
                          Explore <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
