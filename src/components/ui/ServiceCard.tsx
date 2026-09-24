'use client';

import { useState } from 'react';
import { Service } from '@/types/service';
import Link from 'next/link';
import { Building2, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { SectorIllustration, SECTOR_ACCENTS } from './SectorCard';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  service: Service;
  compact?: boolean;
  disableAnimation?: boolean;
  priority?: boolean;
}
export default function ServiceCard({ service, compact = false, disableAnimation = false, priority = false }: Props) {
  const [imageFailed, setImageFailed]   = useState(false);
  const [imageLoaded, setImageLoaded]   = useState(false);
  const prefersReduced = useReducedMotion();

  const displayImage = service.thumbnail;
  const hasImage = !!displayImage && !imageFailed;
  
  const sectorSlug = (service.sector || service.category || 'general').toLowerCase().replace(/\s+/g, '-');
  const serviceId = service.id || service.serviceName;

  const cardMotion = (prefersReduced || disableAnimation)
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.4, ease: 'easeOut' as const },
      };

  if (compact) {
    return (
      <Link href={`/services/${encodeURIComponent(serviceId)}`} className="block group" id={`service-card-compact-${serviceId}`}>
        <motion.div
          className="bg-[#FCFDFF] rounded-xl border border-blue-900/10 shadow-sm p-4 hover:shadow-md hover:border-blue-300/30 transition-all duration-300"
          {...cardMotion}
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 relative">
              {hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage!}
                  alt={service.serviceName}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading={priority ? "eager" : "lazy"}
                />
              ) : (
                <div className="w-full h-full opacity-30">
                  <SectorIllustration slug={sectorSlug} accentColor={SECTOR_ACCENTS[sectorSlug] || '#0A2164'} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold text-[#1b60bb] uppercase tracking-wider mb-1">
                {service.category || service.sector}
              </span>
              <h4 className="font-heading font-bold text-gray-900 text-[14px] leading-tight group-hover:text-[#0A2164] transition-colors">
                {service.serviceName}
              </h4>
              {service.startupName && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-[10px] text-gray-500 line-clamp-1">{service.startupName}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${encodeURIComponent(serviceId)}`}
      className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
      id={`service-card-${serviceId}`}
      aria-label={`View ${service.serviceName} by ${service.startupName}`}
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
        <div className="relative aspect-[16/9] w-full overflow-hidden flex-shrink-0 bg-gray-50 border-b border-gray-100">
          {hasImage ? (
            <>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage!}
                alt={service.serviceName}
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageFailed(true); setImageLoaded(true); }}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:brightness-[1.03]"
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease-out, transform 0.5s ease-out, filter 0.5s ease-out',
                  willChange: 'transform, opacity',
                }}
                referrerPolicy="no-referrer"
                loading={priority ? "eager" : "lazy"}
                decoding="async"
              />
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
                }}
              />
            </>
          ) : (
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

          {service.district && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold bg-white text-[#1b60bb] shadow-md tracking-wide">
                {service.district}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-4 py-3.5 sm:px-5 sm:py-4 gap-0">
          {service.startupName && (
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2 min-w-0">
              <Building2 className="w-3 h-3 flex-shrink-0" style={{ color: '#94a3b8' }} />
              <span className="text-[11px] font-medium uppercase tracking-wide truncate" style={{ color: '#64748b' }}>
                {service.startupName}
              </span>
            </div>
          )}

          <h3
            title={service.serviceName}
            className="font-heading font-bold leading-snug transition-colors duration-200 group-hover:text-[#1b60bb] mb-1.5 sm:mb-2 line-clamp-2"
            style={{ fontSize: 15, color: '#0f172a' }}
          >
            {service.serviceName}
          </h3>

          <div className="mt-auto flex flex-col gap-0">
            <div className="min-h-[1.25rem] sm:min-h-[2.25rem] mb-2 sm:mb-3">
              {/* Spacer to align heights with TechnologyCard shortDesc */}
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold truncate max-w-[160px]"
                style={{ fontSize: 10, background: 'rgba(37,99,235,0.07)', color: '#1d4ed8', border: '1px solid rgba(37,99,235,0.12)' }}
                title={service.category || 'General Service'}
              >
                {service.category || 'General Service'}
              </span>

              {service.certifications && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold truncate max-w-[160px]"
                  style={{ fontSize: 10, background: 'rgba(16,185,129,0.07)', color: '#059669', border: '1px solid rgba(16,185,129,0.12)' }}
                  title={service.certifications}
                >
                  <CheckCircle className="w-3 h-3" />
                  {service.certifications}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2.5 sm:pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <span className="text-[11px] font-medium" style={{ color: '#94a3b8' }}>
              Service Access
            </span>
            <span
              className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-bold transition-all duration-300 group-hover:gap-2"
              style={{ color: '#1b60bb' }}
            >
              Explore Service
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
