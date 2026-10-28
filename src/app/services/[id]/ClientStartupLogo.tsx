'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface Props {
  logo?: string | null;
  name: string;
}

export default function ClientStartupLogo({ logo, name }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (logo && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={name}
        className="w-5 h-5 object-contain rounded-sm flex-shrink-0 border border-slate-100 bg-white shadow-2xs"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-[#0A2164] transition-colors flex-shrink-0" />
  );
}

