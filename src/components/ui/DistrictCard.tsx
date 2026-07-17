'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface District {
  slug: string;
  name: string;
  tech_count: number;
  image: string;
}

interface Props {
  district: District;
  linkPrefix?: string;
  itemName?: string;
}

export default function DistrictCard({ district, linkPrefix = '/technologies?district=', itemName = 'Instrument' }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const accentColor = '#1B4D9B'; // Consistent brand blue for districts

  return (
    <Link
      href={`${linkPrefix}${district.slug}`}
      id={`district-card-${district.slug}`}
      className="block group"
    >
      {/* ── Card shell ── */}
      <div className="relative overflow-hidden rounded-2xl h-44 sm:h-56 cursor-pointer bg-[#0A0F1E] shadow-lg group-hover:shadow-2xl transition-all duration-300 ease-out">

        {/* ── Background image ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={district.image}
              alt={district.name}
              aria-hidden="true"
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-white/20 font-bold uppercase tracking-widest text-xl">{district.name.substring(0, 3)}</span>
            </div>
          )}
        </div>

        {/* ── Gradient overlay: transparent top → dark bottom ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,8,20,0.08) 0%, rgba(5,8,20,0.30) 40%, rgba(5,8,20,0.82) 75%, rgba(5,8,20,0.97) 100%)',
          }}
        />

        {/* ── Hover scrim: intensifies on hover ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(5,8,20,0.22)' }}
        />

        {/* ── Count badge — top-right ── */}
        <div
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <span className="font-bold text-[#FFD54A] text-sm leading-none tabular-nums">
            {district.tech_count}
          </span>
          <span className="text-white/70 text-xs leading-none font-medium">
            {district.tech_count === 1 ? itemName : `${itemName}s`}
          </span>
        </div>

        {/* ── Bottom content panel ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-3 flex flex-col gap-2.5">

          {/* District name + arrow */}
          <div className="flex items-end justify-between gap-3">
            <h3
              className="font-bold leading-tight line-clamp-2 text-base sm:text-lg md:text-[20px] flex-1 min-w-0"
              style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              {district.name}
            </h3>

            {/* Arrow */}
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
              style={{
                width: 34,
                height: 34,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
              aria-hidden="true"
            >
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#FFD54A] transition-colors duration-300" />
            </span>
          </div>

          {/* Accent underline that slides in on hover */}
          <div
            className="h-[2px] w-0 group-hover:w-full rounded-full transition-all duration-300 ease-out"
            style={{ background: `linear-gradient(to right, ${accentColor}, transparent)` }}
          />

        </div>
      </div>
    </Link>
  );
}
