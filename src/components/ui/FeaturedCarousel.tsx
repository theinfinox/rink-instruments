'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TechnologyCard from './TechnologyCard';
import ServiceCard from './ServiceCard';

interface Props<T> {
  items: T[];
  itemType: 'instrument' | 'service';
  title?: string;
  eyebrow?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaMessage?: string;
}

export default function FeaturedCarousel<T>({ 
  items, 
  itemType, 
  title = "Featured Innovation Opportunities", 
  eyebrow,
  ctaText = "Browse All Instruments", 
  ctaLink = "/instruments",
  ctaMessage = "Ready to Discover Commercially Viable Technologies?"
}: Props<T>) {
  const eyebrowText = eyebrow ?? (itemType === 'service' ? 'Startup Services' : 'Instruments');
  const containerRef   = useRef<HTMLDivElement>(null);
  const isInteracting  = useRef(false);
  const isVisible      = useRef(false);
  const scrollTimeout  = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // ── Build a tripled array so seamless looping works in both directions ──────
  let base = items;
  if (base.length < 10 && base.length > 0) {
    while (base.length < 10) base = [...base, ...items];
  }
  const tripled = [...base, ...base, ...base];

  useEffect(() => { setTimeout(() => setIsMounted(true), 0); }, []);

  // ── Intersection observer: pause when section is off-screen ─────────────────
  useEffect(() => {
    if (!isMounted) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isMounted]);

  const pause  = useCallback(() => { isInteracting.current = true;  }, []);
  const resume = useCallback(() => { isInteracting.current = false; }, []);

  const handleScroll = useCallback(() => {
    isInteracting.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 150);
  }, []);

  // ── rAF infinite scroll via scrollLeft (matches reference architecture) ─────
  useEffect(() => {
    if (!isMounted || tripled.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    // Start at the middle third so dragging backward still works
    el.scrollLeft = el.scrollWidth / 3;

    let animId: number;
    let current = el.scrollLeft;
    let lastTs  = performance.now();
    const SPEED = 0.055; // px per ms — smooth & elegant

    const tick = (now: number) => {
      const dt = Math.min(now - lastTs, 32);
      lastTs   = now;

      if (!isInteracting.current && isVisible.current) {
        current += SPEED * dt;
        const third = el.scrollWidth / 3;
        if (current >= third * 2) current -= third;
        else if (current <= 0)    current += third;
        el.scrollLeft = current;
      } else {
        current = el.scrollLeft; // sync on drag
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isMounted, tripled.length]);

  if (!items || items.length === 0) {
    return null;
  }

  if (!isMounted) return null;

  return (
    <section 
      className="w-full relative flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #5BAEFF 0%, #3F8FEA 30%, #2367C9 70%, #153156 100%)'
      }}
    >
      {/* ── TOP WHITE CURVED PANEL (Hero Cap / Mask) ── */}
      <div
        className="relative z-20 flex items-center justify-center w-full h-24 sm:h-32 md:h-40 bg-[#F6F8FC] rounded-b-[1.5rem] sm:rounded-b-[3rem] shadow-[0_6px_32px_rgba(0,0,0,0.10)]"
      >
        <div className="text-center px-4">
          <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#1b60bb]/70 mb-1 sm:mb-2">
            {eyebrowText}
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-[46px] text-[#1b60bb] tracking-wide leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* ── CAROUSEL CONTENT ── */}
      <div
        className="w-full relative z-10 py-8 sm:py-12 lg:py-16"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {/* Scrolling Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden touch-pan-x px-4 sm:px-[5vw] md:px-[10vw] py-2 sm:py-4 featured-scroller"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {tripled.map((item, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const itemKey = (item as any).provider_key || (item as any).id || (item as any).ksumUid || `fallback-${idx}`;
            return (
            <div
              key={`${itemKey}-${idx}`}
              className="flex-shrink-0 w-[275px] xs:w-[290px] sm:w-[280px] md:w-[320px] relative h-[415px] sm:h-[415px] md:h-[420px]"
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
                {itemType === 'instrument' ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <TechnologyCard instrument={item as any} disableAnimation={true} />
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <ServiceCard service={item as any} disableAnimation={true} />
                )}
            </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM WHITE CURVED PANEL (Browse Cap / Mask) ── */}
      <div
        className="relative z-20 flex flex-col items-center justify-center px-4 w-full h-20 sm:h-36 md:h-40 bg-white rounded-t-[1.5rem] sm:rounded-t-[3rem] shadow-[0_-6px_32px_rgba(0,0,0,0.10)]"
      >
        <p className="hidden sm:block text-[#1b60bb] text-sm sm:text-[16px] md:text-[20px] font-medium text-center mb-3 sm:mb-4 leading-snug max-w-xl">
          {ctaMessage}
        </p>
        <Link
          href={ctaLink}
          id="browse-all-featured-cta"
          className="group/btn inline-flex items-center gap-2 bg-[#1b60bb] hover:bg-[#0d4a9a] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {ctaText}
          <ArrowUpRight
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]"
          />
        </Link>
      </div>
    </section>
  );
}
