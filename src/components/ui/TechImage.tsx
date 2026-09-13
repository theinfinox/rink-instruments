'use client';

import { useState } from 'react';
import { Cpu } from 'lucide-react';

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

/**
 * Technology image with inline fallback.
 * Shows a professional placeholder if the URL is missing or fails to load.
 */
export default function TechImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/80 ${className}`}>
        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center">
          <Cpu className="w-7 h-7 text-[#1B4D9B]/60" />
        </div>
        <span className="text-xs text-slate-400 font-medium text-center px-4 font-sans tracking-wide">
          Instrumentation Facility
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="async"
    />
  );
}
