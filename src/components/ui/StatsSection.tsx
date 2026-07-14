'use client';

import React, { useEffect, useState, useRef } from 'react';

interface FloatingIcon {
  id: number;
  name: string;
  svg: React.ReactNode;
  left: string;
  top: string;
  duration: string;
  delay: string;
}

interface Props {
  totalCount?: number;
  sectorsCount?: number;
  institutionsCount?: number;
}

export default function StatsSection({ totalCount = 160, sectorsCount = 11, institutionsCount = 11 }: Props) {
  const [techs, setTechs]         = useState(0);
  const [insts, setInsts]         = useState(0);
  const [sectors, setSectors]     = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(totalCount, setTechs);
          animateCount(institutionsCount, setInsts);
          animateCount(sectorsCount, setSectors);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, totalCount, sectorsCount, institutionsCount]);

  const animateCount = (target: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    let start = 0;
    const duration = 1200;
    const increment = target / (duration / 16);
    const step = () => {
      start += increment;
      if (start >= target) {
        setter(target);
      } else {
        setter(Math.floor(start));
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const floatingIcons: FloatingIcon[] = [
    {
      id: 1, name: 'Patent Document',
      left: '6%', top: '15%', duration: '32s', delay: '0s',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1.2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h8M8 14h5" />
        </svg>
      )
    },
    {
      id: 2, name: 'Research Paper',
      left: '86%', top: '25%', duration: '38s', delay: '-5s',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h10M7 11h10" />
        </svg>
      )
    },
    {
      id: 3, name: 'Laboratory Flask',
      left: '22%', top: '60%', duration: '29s', delay: '-10s',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1.2">
          <path d="M9 3h6M12 3v5M6 21h12L12 8z" />
        </svg>
      )
    },
    {
      id: 4, name: 'AI Chip',
      left: '72%', top: '50%', duration: '35s', delay: '-15s',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1.2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
        </svg>
      )
    },
    {
      id: 5, name: 'Innovation Node',
      left: '46%', top: '35%', duration: '27s', delay: '-2s',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1.2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      )
    }
  ];

  const stats = [
    {
      value: `${techs}+`,
      label: 'Technologies Available',
      color: 'text-[#0A2164]',
    },
    {
      value: `${insts}+`,
      label: 'Research Institutions',
      color: 'text-[#D97706]',
    },
    {
      value: `${sectors}+`,
      label: 'Technology Sectors',
      color: 'text-[#0A2164]',
    },
    {
      value: 'Live',
      label: 'Continuously Updated',
      color: 'text-[#059669]',
    },
    {
      value: 'Kerala',
      label: 'Research Network',
      color: 'text-[#0A2164]',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-white border-b border-gray-100 py-10 overflow-hidden"
    >
      {/* Floating ambient icons — Electric Blue at 2.5% opacity */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {floatingIcons.map((icon) => (
          <div
            key={icon.id}
            className="absolute animate-float-asset text-[#0A2164]"
            style={{
              left: icon.left,
              top: icon.top,
              opacity: 0.025,
              animationDuration: icon.duration,
              animationDelay: icon.delay,
            }}
          >
            {icon.svg}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── LIVE INDICATOR ── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span
            className="w-2.5 h-2.5 rounded-full bg-red-500 animate-red-dot mr-1"
            style={{ boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}
          />
          <span className="text-[11px] font-bold tracking-widest text-gray-700 uppercase font-heading">
            {totalCount} Technologies Available
          </span>
        </div>

        {/* ── STATISTICS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-md p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-250"
            >
              <div className={`text-3xl md:text-4xl font-heading font-black mb-1.5 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center font-heading">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
