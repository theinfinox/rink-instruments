'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PartnerLogoTileProps {
  inst: {
    name: string;
    slug: string;
    logo: string | null;
    acronym: string;
  }
}

export default function PartnerLogoTile({ inst }: PartnerLogoTileProps) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link
      href={`/institutions/${inst.slug}`}
      className="group flex flex-col items-center justify-center bg-white border border-gray-100 rounded-md p-[20px] h-[140px] hover:border-blue-400 hover:shadow-md hover:scale-[1.03] transition-all duration-200"
      title={inst.name}
      aria-label={`View ${inst.name} technologies`}
    >
      {!imgErr && inst.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={inst.logo}
          alt={inst.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
          <span className="text-xl font-black text-[#0A2164] leading-none">{inst.acronym}</span>
          <span className="text-[10px] text-gray-400 text-center line-clamp-2 leading-tight px-2">{inst.name}</span>
        </div>
      )}
    </Link>
  );
}
