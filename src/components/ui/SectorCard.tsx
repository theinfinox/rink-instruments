'use client';

import { useState } from 'react';
import { Sector } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSectorIcon } from './SectorIcons';

interface Props {
  sector: Sector;
}

// ── Map each sector slug → its accent color ────
export const SECTOR_ACCENTS: Record<string, string> = {
  'agriculture':                              '#10B981', // Green
  'food-technology':                          '#F97316', // Orange
  'biotechnology-life-sciences':              '#8B5CF6', // Purple
  'biotechnology-life-sciences-1':            '#8B5CF6', // Purple
  'medtech-health-care':                      '#06B6D4', // Cyan
  'energy-climate-sustainability':            '#F59E0B', // Yellow
  'digital-technologies-ai-software':        '#3B82F6', // Blue
  'digital-technologies-al-software':        '#3B82F6', // Blue
  'water-environment-waste-management':       '#0D9488', // Teal
  'robotics-automation-drones':               '#6366F1', // Indigo
  'manufacturing-industrial-technologies':    '#6366F1', // Indigo
  'advanced-materials-chemicals':             '#8B5CF6', // Purple
  'consumer-products-cosmetics-lifestyle':    '#E9C46A', // Gold
  'consumer-lifestyle-products':              '#E9C46A', // Gold (actual slug from sheet)
  'infrastructure-construction-smart-cities': '#F97316', // Orange
};

// ── Map each sector slug → its dynamic sub-sectors ────
const SECTOR_SUBSECTORS: Record<string, string[]> = {
  'agriculture':                              ['Kerala farms', 'Smart irrigation', 'Agricultural drones'],
  'food-technology':                          ['Processing line', 'Packaging', 'Food innovation lab'],
  'water-environment-waste-management':       ['Rivers & treatment', 'Smart monitoring', 'Circular economy'],
  'energy-climate-sustainability':            ['Solar & wind', 'Clean energy', 'Green tech'],
  'digital-technologies-ai-software':        ['AI network', 'Smart computing', 'Cloud systems'],
  'digital-technologies-al-software':        ['AI network', 'Smart computing', 'Cloud systems'],
  'biotechnology-life-sciences':              ['DNA & Lab', 'Research labs', 'Biotech innovation'],
  'biotechnology-life-sciences-1':            ['DNA & Lab', 'Research labs', 'Biotech innovation'],
  'medtech-health-care':                      ['Medical devices', 'Diagnostics', 'Digital health'],
  'robotics-automation-drones':               ['Industrial robots', 'UAVs', 'Smart automation'],
  'manufacturing-industrial-technologies':    ['Industrial robots', 'UAVs', 'Smart automation'],
  'default':                                  ['Kerala Innovation', 'Research', 'Tech Transfer'],
};

// ── Illustrated Custom Vector Artwork component (Colored pencil / soft vector editorial style) ────
export function SectorIllustration({ slug, accentColor }: { slug: string; accentColor: string }) {
  const s = slug.toLowerCase();

  // 1. AGRICULTURE
  if (s.includes('agriculture') || s.includes('agritech')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Soft mountain/hill silhouettes */}
        <path d="M-50 210 C 50 150, 150 170, 250 140 C 320 120, 370 140, 450 210 Z" fill={accentColor} className="opacity-15" />
        <path d="M100 210 C 180 160, 260 180, 320 150 C 370 120, 420 140, 480 210 Z" fill={accentColor} className="opacity-20" />
        {/* Coconut tree silhouettes (Kerala Farms theme) */}
        <g transform="translate(40, 110)">
          <path d="M10 90 L15 10 C 15 5, 20 5, 20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 0 C 10 -5, 2 -1, -5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 0 C 15 -8, 8 -12, 0 -10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 0 C 25 -10, 32 -10, 38 -5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 0 C 28 -5, 36 2, 40 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <g transform="translate(320, 120) scale(0.8)">
          <path d="M10 90 L12 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 10 C 4 5, -2 8, -8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 10 C 8 2, 0 -2, -6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 10 C 16 0, 22 0, 28 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 10 C 18 5, 24 10, 28 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Paddy field grids / Precision farming */}
        <path d="M-20 190 L120 155 M150 150 L260 145 M100 200 L180 160" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="210" cy="80" r="4" fill={accentColor} className="opacity-40" />
        <line x1="210" y1="80" x2="250" y2="100" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="250" cy="100" r="3" fill="currentColor" />
      </svg>
    );
  }

  // 2. FOOD TECHNOLOGY
  if (s.includes('food') || s.includes('processing')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Processing machinery / Lab tanks */}
        <rect x="50" y="80" width="45" height="70" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="110" x2="95" y2="110" stroke="currentColor" strokeWidth="1" />
        <circle cx="72" cy="98" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="72" cy="130" r="3" fill={accentColor} />

        <path d="M95 110 C 120 110, 120 140, 145 140" stroke="currentColor" strokeWidth="1.5" />

        <circle cx="165" cy="140" r="20" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
        <path d="M155 140 H175 M165 130 V150" stroke="currentColor" strokeWidth="1" />

        {/* Grains / Packaged boxes / value-added products */}
        <rect x="230" y="110" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M230 125 H270" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="250" cy="135" r="4" fill={accentColor} />

        {/* Abstract innovation network */}
        <circle cx="320" cy="60" r="3" fill="currentColor" />
        <circle cx="340" cy="90" r="4" stroke="currentColor" strokeWidth="1" />
        <line x1="320" y1="60" x2="340" y2="90" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }

  // 3. BIOTECHNOLOGY
  if (s.includes('biotech') || s.includes('life')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* DNA Helix Illustration */}
        <g transform="translate(80, 50)" className="opacity-80">
          <path d="M10 20 C 30 40, 50 40, 70 20 C 90 0, 110 0, 130 20 C 150 40, 170 40, 190 20" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M10 0 C 30 -20, 50 -20, 70 0 C 90 20, 110 20, 130 0 C 150 -20, 170 -20, 190 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Strands */}
          <line x1="40" y1="11" x2="40" y2="-11" stroke="currentColor" strokeWidth="1" />
          <line x1="70" y1="20" x2="70" y2="0" stroke={accentColor} strokeWidth="1" />
          <line x1="100" y1="11" x2="100" y2="-11" stroke="currentColor" strokeWidth="1" />
          <line x1="130" y1="0" x2="130" y2="20" stroke={accentColor} strokeWidth="1" />
          <line x1="160" y1="11" x2="160" y2="-11" stroke="currentColor" strokeWidth="1" />
        </g>
        {/* Research Lab flask & Tissue culture */}
        <path d="M260 140 L280 80 H290 L310 140 Z" stroke="currentColor" strokeWidth="1.5" />
        <line x1="265" y1="125" x2="305" y2="125" stroke="currentColor" strokeWidth="1" />
        <circle cx="285" cy="110" r="5" fill={accentColor} />
      </svg>
    );
  }

  // 4. MEDTECH
  if (s.includes('medtech') || s.includes('health')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Diagnostics / Heart rate rhythm */}
        <path d="M30 110 H70 L80 85 L90 135 L100 100 L110 115 L120 110 H160" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Medical Devices gears / cross shield */}
        <g transform="translate(260, 100)">
          {/* Stylized Cross Shield */}
          <rect x="-25" y="-25" width="50" height="50" rx="12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-10 0 H10 M0 -10 V10" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
        </g>
        
        {/* Tech dots */}
        <circle cx="160" cy="110" r="4" fill="currentColor" />
        <circle cx="205" cy="75" r="3" fill="currentColor" />
        <circle cx="225" cy="125" r="3" fill="currentColor" />
        <line x1="160" y1="110" x2="205" y2="75" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="205" y1="75" x2="260" y2="100" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
      </svg>
    );
  }

  // 5. ENERGY
  if (s.includes('energy') || s.includes('climate') || s.includes('sustain')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Solar Panel grid */}
        <g transform="translate(50, 90)">
          <polygon points="0,50 80,50 100,0 20,0" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <line x1="40" y1="50" x2="50" y2="0" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="50" x2="35" y2="0" stroke="currentColor" strokeWidth="1" />
          <line x1="60" y1="50" x2="65" y2="0" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="25" x2="90" y2="25" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Wind Turbine silhouetted */}
        <g transform="translate(280, 130)">
          <line x1="0" y1="0" x2="0" y2="-65" stroke="currentColor" strokeWidth="2.5" />
          <g className="animate-spin-slow" style={{ transformOrigin: '0px -65px', animationDuration: '28s' }}>
            <path d="M0 -65 L-12 -95 C -15 -100, -5 -100, -2 -95 Z" fill={accentColor} />
            <path d="M0 -65 L22 -45 C 26 -40, 20 -35, 16 -40 Z" fill={accentColor} />
            <path d="M0 -65 L-20 -50 C -25 -45, -23 -38, -18 -43 Z" fill={accentColor} />
            <circle cx="0" cy="-65" r="3.5" fill="currentColor" />
          </g>
        </g>
      </svg>
    );
  }

  // 6. DIGITAL / AI
  if (s.includes('digital') || s.includes('software') || s.includes('ai') || s.includes('computer')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Neural Innovation Network / AI connections */}
        <g transform="translate(20, 20)">
          <path d="M50 80 L140 50 L110 120 L230 90 L260 140" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M140 50 L230 90 L300 40" stroke={accentColor} strokeWidth="1.5" />
          
          <circle cx="50" cy="80" r="5" fill="currentColor" />
          <circle cx="140" cy="50" r="7" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="140" cy="50" r="3" fill={accentColor} />
          <circle cx="110" cy="120" r="4" fill="currentColor" />
          <circle cx="230" cy="90" r="8" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="230" cy="90" r="3" fill={accentColor} />
          <circle cx="300" cy="40" r="5" fill="currentColor" />
          <circle cx="260" cy="140" r="4" fill="currentColor" />
        </g>
      </svg>
    );
  }

  // 7. ADVANCED MATERIALS
  if (s.includes('materials') || s.includes('chemical')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Molecular Hexagon clusters / Advanced manufacturing */}
        <g transform="translate(100, 95)" className="opacity-80">
          <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="45,-55 71,-40 71,-10 45,5 19,-10 19,-40" stroke={accentColor} strokeWidth="1.5" />
          <polygon points="45,35 71,50 71,80 45,95 19,80 19,50" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="0" y1="0" x2="45" y2="-25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="45" y2="60" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4.5" fill="currentColor" />
          <circle cx="45" cy="-25" r="4" fill={accentColor} />
          <circle cx="45" cy="60" r="4" fill="currentColor" />
        </g>
        {/* Chemical flask */}
        <path d="M280 140 H330 L310 90 V75 H300 V90 Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="305" cy="120" r="6" fill={accentColor} />
        <circle cx="293" cy="130" r="3" fill="currentColor" />
      </svg>
    );
  }

  // 8. WATER / ENVIRONMENT (Kerala Rivers & Hydrology)
  if (s.includes('water') || s.includes('env') || s.includes('aquaculture')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Wave structures (Sine curves representing Rivers) */}
        <path d="M-20 120 C 80 80, 150 160, 250 120 C 330 90, 380 140, 420 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M-20 140 C 80 100, 150 180, 250 140 C 330 110, 380 160, 420 140" stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 3" />
        
        {/* Treatment Nodes & Leaf graphics */}
        <g transform="translate(120, 70)" className="opacity-80">
          <circle cx="0" cy="0" r="15" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="0" r="6" fill={accentColor} />
          <path d="M0 -22 V-15 M0 22 V15 M-22 0 H-15 M22 0 H15" stroke="currentColor" strokeWidth="1" />
        </g>

        <g transform="translate(280, 75)" className="opacity-80">
          <path d="M0 0 C 10 -15, 25 -15, 30 -5 C 20 15, 5 15, 0 0 Z" fill={accentColor} />
          <line x1="0" y1="0" x2="20" y2="-7" stroke="currentColor" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  // 9. ROBOTICS / DRONES
  if (s.includes('robot') || s.includes('automation') || s.includes('drone') || s.includes('manufactur')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        {/* Drone outlines (Kerala Innovation themed) */}
        <g transform="translate(80, 80)">
          {/* Center chassis */}
          <rect x="-15" y="-10" width="30" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill={accentColor} />
          {/* Arms */}
          <line x1="-15" y1="-10" x2="-35" y2="-25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="15" y1="-10" x2="35" y2="-25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="-15" y1="10" x2="-35" y2="25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="15" y1="10" x2="35" y2="25" stroke="currentColor" strokeWidth="1.5" />
          {/* Rotors */}
          <line x1="-42" y1="-25" x2="-28" y2="-25" stroke={accentColor} strokeWidth="2" />
          <line x1="28" y1="-25" x2="42" y2="-25" stroke={accentColor} strokeWidth="2" />
          <line x1="-42" y1="25" x2="-28" y2="25" stroke={accentColor} strokeWidth="2" />
          <line x1="28" y1="25" x2="42" y2="25" stroke={accentColor} strokeWidth="2" />
        </g>
        
        {/* Robotic Joint manipulator arm */}
        <g transform="translate(270, 140)">
          <path d="M0 0 L20 -40 L55 -50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="7" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="20" cy="-40" r="5" fill={accentColor} />
          <circle cx="55" cy="-50" r="3.5" fill="currentColor" />
        </g>
      </svg>
    );
  }

  // 10. INFRASTRUCTURE, CONSTRUCTION & SMART CITIES
  if (s.includes('infrastructure') || s.includes('construct') || s.includes('cities')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        <path d="M50 160 L50 40 L160 40 M50 70 L90 40 M90 40 L90 160" stroke="currentColor" strokeWidth="1.5" />
        <path d="M140 40 L140 80 L160 85 L150 40" stroke="currentColor" strokeWidth="1" />
        <line x1="50" y1="160" x2="180" y2="160" stroke="currentColor" strokeWidth="2" />
        <rect x="230" y="60" width="50" height="100" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="295" y="90" width="45" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M245 80 h20 M245 100 h20 M245 120 h20" stroke={accentColor} strokeWidth="1.5" />
        <path d="M305 110 h25 M305 130 h25" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  // 11. MANUFACTURING & INDUSTRIAL TECHNOLOGIES
  if (s.includes('manufactur') || s.includes('industrial') || s.includes('gear')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        <g transform="translate(120, 100)">
          <circle cx="0" cy="0" r="30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" stroke="currentColor" strokeWidth="1" />
          <path d="M0 -36 v6 M0 30 v6 M-36 0 h6 M30 0 h6 M-25 -25 l4 4 M21 21 l4 4 M-25 25 l4 -4 M21 -21 l4 -4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="translate(180, 140) scale(0.7)">
          <circle cx="0" cy="0" r="30" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" stroke="currentColor" strokeWidth="1" />
          <path d="M0 -36 v6 M0 30 v6 M-36 0 h6 M30 0 h6" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <path d="M250 140 H350 M250 150 H350" stroke="currentColor" strokeWidth="1" />
        <circle cx="260" cy="145" r="4" fill="currentColor" />
        <circle cx="340" cy="145" r="4" fill="currentColor" />
        <rect x="280" y="115" width="30" height="25" rx="3" stroke={accentColor} strokeWidth="1" fill="var(--background)" />
      </svg>
    );
  }

  // 12. CONSUMER PRODUCTS, COSMETICS & LIFESTYLE
  if (s.includes('consumer') || s.includes('cosmetic') || s.includes('lifestyle') || s.includes('product')) {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10">
        <g transform="translate(100, 100)">
          <rect x="-15" y="-15" width="30" height="30" rx="8" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="0" cy="0" r="8" stroke={accentColor} strokeWidth="1.2" />
          <path d="M-8 -15 V-35 H8 V-15 M-8 15 V35 H8 V15" stroke="currentColor" strokeWidth="1" />
        </g>
        <g transform="translate(250, 90)">
          <rect x="-20" y="-10" width="40" height="60" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <rect x="-8" y="-22" width="16" height="12" rx="2" stroke={accentColor} strokeWidth="1.5" />
          <line x1="-20" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="30" r="8" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>
      </svg>
    );
  }

  // Default / Fallback: Clean Innovation Cluster Network
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/15">
      <path d="M50 40 L150 90 L100 150 L220 110 L300 50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="40" r="4" fill="currentColor" />
      <circle cx="150" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="150" cy="90" r="3" fill={accentColor} />
      <circle cx="100" cy="150" r="4" fill="currentColor" />
      <circle cx="220" cy="110" r="8" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="220" cy="110" r="3" fill={accentColor} />
      <circle cx="300" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}

export default function SectorCard({ sector }: Props) {
  const tags = sector.top_tags && sector.top_tags.length > 0
    ? sector.top_tags.slice(0, 2)
    : (SECTOR_SUBSECTORS[sector.slug] || SECTOR_SUBSECTORS['default']).slice(0, 2);
  const accentColor = SECTOR_ACCENTS[sector.slug] || '#10B981';
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      href={`/technologies?sector=${sector.slug}`}
      id={`sector-card-${sector.slug}`}
      className="block group"
    >
      {/* ── Card shell ── */}
      <div className="relative overflow-hidden rounded-2xl h-44 sm:h-56 cursor-pointer bg-[#0A0F1E] shadow-lg group-hover:shadow-2xl transition-all duration-300 ease-out">

        {/* ── Background image ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/images/sectors/${sector.slug}.png`}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <SectorIllustration slug={sector.slug} accentColor={accentColor} />
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
            {sector.tech_count}
          </span>
          <span className="text-white/70 text-xs leading-none font-medium">
            {sector.tech_count === 1 ? 'Technology' : 'Technologies'}
          </span>
        </div>

        {/* ── Bottom content panel ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-3 flex flex-col gap-2.5">

          {/* Sector name + arrow */}
          <div className="flex items-end justify-between gap-3">
            <h3
              className="font-bold leading-tight line-clamp-2 text-base sm:text-lg md:text-[20px] flex-1 min-w-0"
              style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              {sector.name}
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

