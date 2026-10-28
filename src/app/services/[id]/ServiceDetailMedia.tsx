'use client';

import { useState } from 'react';
import { SectorIllustration, SECTOR_ACCENTS } from '@/components/ui/SectorCard';

interface Props {
  src?: string | null;
  alt: string;
  category?: string;
  sector?: string;
}

export default function ServiceDetailMedia({ src, alt, category, sector }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sectorSlug = (sector || category || 'general').toLowerCase().replace(/\s+/g, '-');
  const accentColor = SECTOR_ACCENTS[sectorSlug] || '#0A2164';
  const hasImage = !!src && !imageFailed;

  return (
    <div className="relative aspect-[16/9] max-h-[380px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-50 shadow-sm mb-6 sm:mb-8">
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
            src={src!}
            alt={alt}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageFailed(true);
              setImageLoaded(true);
            }}
            className="w-full h-full object-cover transition-all duration-500"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
          />
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)',
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 w-full h-full opacity-30 flex items-center justify-center">
          <SectorIllustration slug={sectorSlug} accentColor={accentColor} />
        </div>
      )}
    </div>
  );
}

