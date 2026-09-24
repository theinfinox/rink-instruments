'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

interface Props {
  src?: string | null;
  alt: string;
  acronym?: string;
}

export default function InstitutionHeaderLogo({ src, alt, acronym }: Props) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 text-[#0A2164] flex-shrink-0 select-none">
        {acronym ? (
          <span className="font-heading font-extrabold text-base sm:text-lg text-[#0A2164] tracking-wider text-center">
            {acronym}
          </span>
        ) : (
          <Building2 className="w-8 h-8 text-[#0A2164]" />
        )}
      </div>
    );
  }

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden p-2 flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        onError={() => setError(true)}
        className="w-full h-full object-contain"
        priority={true}
      />
    </div>
  );
}
