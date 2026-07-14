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
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-100 border border-slate-200 ${className}`}>
        <div className="w-14 h-14 rounded-md bg-white border border-slate-200 flex items-center justify-center">
          <Cpu className="w-7 h-7 text-slate-400" />
        </div>
        <span className="text-sm text-slate-500 font-medium text-center px-4 font-sans">
          Image will be updated soon
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
