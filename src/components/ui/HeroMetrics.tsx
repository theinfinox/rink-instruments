'use client';

import { useEffect, useRef, useState } from 'react';

interface Metric {
  target: number;
  suffix: string;
  label: string;
}

export default function HeroMetrics({
  totalInstruments,
  totalCategories,
  totalInstitutions,
  totalStartups,
  totalDistricts = 14,
  context,
}: {
  totalInstruments: number;
  totalCategories: number;
  totalInstitutions: number;
  totalStartups?: number;
  totalDistricts?: number;
  context?: 'instruments' | 'services';
}) {
  const isServices = context === 'services';
  const metrics: Metric[] = isServices
    ? [
        { target: totalInstitutions, suffix: '+', label: 'Startups & Providers' },
        { target: totalInstruments, suffix: '+', label: 'Available Services' },
        { target: totalDistricts, suffix: '+', label: 'Districts Covered' }
      ]
    : [
        { target: totalInstitutions, suffix: '+', label: 'Research Institutions' },
        ...(totalStartups !== undefined && totalStartups > 0
          ? [{ target: totalStartups, suffix: '+', label: 'Startups' }]
          : []),
        { target: totalInstruments, suffix: '+', label: 'Available Instruments' },
        { target: totalDistricts, suffix: '+', label: 'Districts Covered' }
      ];


function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function MetricCard({ target, suffix, label, run, delay }: Metric & { run: boolean; delay: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const startAt = performance.now() + delay;
    const duration = 1200;
    const tick = (now: number) => {
      const elapsed = now - startAt;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      setVal(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, delay]);

  return (
    <div
      className="hero-metric-card bg-white border border-[rgba(15,23,42,0.08)] rounded-xl sm:rounded-md p-3.5 sm:p-7 text-center transition-all duration-300 hover:border-[#1B4D9B]/30 hover:shadow-md hover:-translate-y-1 shadow-2xs sm:shadow-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#1B4D9B] leading-none">
        {val}
        <span className="text-[#F5B301]">{suffix}</span>
      </div>
      <div className="text-xs sm:text-sm text-[#475569] font-sans mt-1.5 sm:mt-3 tracking-wide leading-tight line-clamp-2">{label}</div>
    </div>
  );
}

  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-white py-10 sm:py-16 md:py-20 border-b border-slate-100"
    >
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 grid gap-3 sm:gap-6 ${
        metrics.length === 4
          ? 'grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-3'
      }`}>
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} run={inView} delay={i * 150} />
        ))}
      </div>
    </section>
  );
}
