'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface Props {
  logo: string | null;
  institutionName: string;
}

export default function ClientPartnerLogo({ logo, institutionName }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (logo && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={institutionName}
        className="w-5 h-5 object-contain flex-shrink-0"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-[#0A2164] transition-colors flex-shrink-0" />
  );
}
