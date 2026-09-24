'use client';

import { useState, useMemo } from 'react';
import { InstrumentViewModel } from '@/domain/instrument/view-model';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ArrowRight } from 'lucide-react';
import { SectorIllustration, SECTOR_ACCENTS } from './SectorCard';
import { motion, useReducedMotion } from 'framer-motion';
import MouBadge from './MouBadge';

interface Props {
  instrument: InstrumentViewModel;
  compact?: boolean;
  disableAnimation?: boolean;
  priority?: boolean;
}
export default function TechnologyCard({ instrument, compact = false, disableAnimation = false, priority = false }: Props) {
  const [imageFailed, setImageFailed]   = useState(false);
  const [imageLoaded, setImageLoaded]   = useState(false);
  const prefersReduced = useReducedMotion();

  const vm = instrument;

  // Resolve image source
  const displayImage = vm.media.thumbnail;
  const hasImage = !!displayImage && !imageFailed;

  // Short description mapping: use facility, or fallback to primary tag/scope
  const shortDesc = vm.facility || (vm.tags && vm.tags.length > 0 ? vm.tags[0] : '');

  // Tag chips filter: only genuine, compact chips (<= 35 chars) that don't duplicate shortDesc
  const validTagChips = useMemo(() => {
    return (vm.tags || []).filter(t => {
      const clean = t?.trim();
      return clean && clean.length <= 35 && clean.toLowerCase() !== shortDesc.trim().toLowerCase();
    });
  }, [vm.tags, shortDesc]);

  // Sector name for compact / illustration fallback: pick first valid short tag or 'General'
  const sectorName = useMemo(() => {
    const shortTag = (vm.tags || []).find(t => t && t.trim().length <= 35);
    return shortTag ? shortTag.trim() : 'General';
  }, [vm.tags]);
  const sectorSlug = sectorName.toLowerCase().replace(/\s+/g, '-');

  const cardMotion = (prefersReduced || disableAnimation)
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.4, ease: 'easeOut' as const },
      };

  // ── COMPACT variant (used in search results / lists) ──────────────────────
  if (compact) {
    return (
      <Link href={`/instruments/${vm.id}`} className="block group" id={`tech-card-compact-${vm.id}`}>
        <motion.div
          className="bg-[#FCFDFF] rounded-xl border border-blue-900/10 shadow-sm p-4 hover:shadow-md hover:border-blue-300/30 transition-all duration-300"
          {...cardMotion}
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 relative">
              {hasImage ? (
                <Image
                  src={displayImage!}
                  alt={vm.title}
                  fill
                  sizes="80px"
                  onError={() => setImageFailed(true)}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  priority={priority}
                />
              ) : (
                <div className="w-full h-full opacity-30">
                  <SectorIllustration slug={sectorSlug} accentColor={SECTOR_ACCENTS[sectorSlug] || '#0A2164'} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold text-[#1b60bb] uppercase tracking-wider mb-1">
                {sectorName}
              </span>
              <h4 className="font-heading font-bold text-gray-900 text-[14px] leading-tight group-hover:text-[#0A2164] transition-colors">
                {vm.displayTitle}
              </h4>
              {vm.institution && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-[10px] text-gray-500 line-clamp-1">{vm.institution}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // ── FULL CARD variant ─────────────────────────────────────────────────────
  return (
    <Link
      href={`/instruments/${vm.id}`}
      className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
      id={`tech-card-${vm.id}`}
      aria-label={`View ${vm.title} by ${vm.institution}`}
    >
      <motion.div
        className="h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 ease-out"
        style={{
          background: '#FCFDFF',
          borderColor: 'rgba(37,99,235,0.08)',
          boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
          willChange: 'transform, box-shadow',
        }}
        {...cardMotion}
        whileHover={prefersReduced ? {} : {
          y: -8,
          scale: 1.015,
          boxShadow: '0 24px 48px rgba(15,23,42,0.16)',
          borderColor: 'rgba(37,99,235,0.22)',
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
      >

        {/* ── IMAGE AREA ────────────────────────────────────────── */}
        <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-gray-50 border-b border-gray-100">
          {hasImage ? (
            <>
              {/* Skeleton shimmer — visible while image loads */}
              {!imageLoaded && (
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(90deg, #e8edf5 25%, #f0f4fb 50%, #e8edf5 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s ease-in-out infinite',
                  }}
                />
              )}

              {/* Actual technology image */}
              <Image
                src={displayImage!}
                alt={vm.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageFailed(true); setImageLoaded(true); }}
                className="object-cover transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:brightness-[1.03]"
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease-out, transform 0.5s ease-out, filter 0.5s ease-out',
                  willChange: 'transform, opacity',
                }}
                referrerPolicy="no-referrer"
                priority={priority}
              />

              {/* Light gradient overlay for badge readability */}
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
                }}
              />
            </>
          ) : (
            /* Premium sector illustration placeholder */
            <div className="absolute inset-0 w-full h-full opacity-25 z-0">
              <SectorIllustration slug={sectorSlug} accentColor={SECTOR_ACCENTS[sectorSlug] || '#0A2164'} />
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  background: 'linear-gradient(to top, rgba(17,24,39,0.5) 0%, transparent 60%)',
                }}
              />
            </div>
          )}

          {/* ── District pill ─────────── */}
          {vm.location.district && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-white text-[#1b60bb] shadow-md tracking-wide">
                {vm.location.district}
              </span>
            </div>
          )}

        </div>

        {/* ── BODY ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-4 py-3.5 sm:px-5 sm:py-4 gap-0">

          {/* Institution */}
          {vm.institution && (
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2 min-w-0">
              <Building2 className="w-3 h-3 flex-shrink-0" style={{ color: '#94a3b8' }} />
              <span className="text-[11px] font-medium uppercase tracking-wide truncate" style={{ color: '#64748b' }}>
                {vm.institution}
              </span>
            </div>
          )}

          {/* Title — full name with 2-line clamp */}
          <h3
            title={vm.title}
            className="font-heading font-bold leading-snug transition-colors duration-200 group-hover:text-[#1b60bb] mb-1.5 sm:mb-2 line-clamp-2"
            style={{ fontSize: 15, color: '#0f172a' }}
          >
            {vm.displayTitle}
          </h3>

          <div className="mt-auto flex flex-col gap-0">
            {/* Short description */}
            {shortDesc && (
              <p
                className="line-clamp-1 sm:line-clamp-2 font-sans leading-relaxed mb-2 sm:mb-3 min-h-[1.25rem] sm:min-h-[2.25rem]"
                style={{ fontSize: 12, color: '#64748b' }}
              >
                {shortDesc}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
              {validTagChips.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold truncate max-w-[160px]"
                  style={{ fontSize: 10, background: 'rgba(37,99,235,0.07)', color: '#1d4ed8', border: '1px solid rgba(37,99,235,0.12)' }}
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {vm.id && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full font-mono font-semibold"
                  style={{ fontSize: 9.5, background: 'rgba(100,116,139,0.07)', color: '#64748b', border: '1px solid rgba(100,116,139,0.12)' }}
                >
                  # {vm.id}
                </span>
              )}
              <div className="flex-shrink-0">
                <MouBadge 
                  hasVerifiedMou={vm.hasVerifiedMou} 
                  policy={vm.subsidizedPolicy}
                />
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-2.5 sm:pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
              Equipment Access
            </span>
            <span
              className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-bold transition-all duration-300 group-hover:gap-2"
              style={{ color: '#1b60bb' }}
            >
              Explore Instrument
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>

      </motion.div>
    </Link>
  );
}
