// ============================================================
// RINK Technology Explorer — Sector SVG Icons
// Custom minimal SVG icons for each sector (no emojis)
// ============================================================

interface IconProps {
  color?: string;
  size?: number;
}

export function AgricultureIcon({ color = '#16a34a', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 2 4 6 4 10c0 2.5 1.2 4.7 3 6.1V20h2v-3h2v3h2v-3.9c1.8-1.4 3-3.6 3-6.1 0-4-4-8-4-8z" fill={color} opacity="0.2"/>
      <path d="M12 2s-1 2-1 5c0 2.2 1 4 1 4s1-1.8 1-4c0-3-1-5-1-5z" fill={color}/>
      <path d="M12 8c0 0-3-1.5-5-1 1 2.5 3 4 5 4s4-1.5 5-4c-2-.5-5 1-5 1z" fill={color} opacity="0.8"/>
      <rect x="11" y="13" width="2" height="8" rx="1" fill={color} opacity="0.6"/>
      <path d="M5 20h14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function BiotechIcon({ color = '#7c3aed', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 3c0 0 1 2 1 4s-2 3-2 5 2 3 2 5-1 4-1 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M15 3c0 0-1 2-1 4s2 3 2 5-2 3-2 5 1 4 1 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="5" x2="15" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="9" x2="15" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="13" x2="15" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="17" x2="15" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="5" r="1.2" fill={color}/>
      <circle cx="15" cy="19" r="1.2" fill={color}/>
    </svg>
  );
}

export function FoodTechIcon({ color = '#ea580c', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 3v5c0 2.2 1.8 4 4 4s4-1.8 4-4V3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M13 3v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M13 12v9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 9v2a2 2 0 002 2h0a2 2 0 002-2V3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="3" y1="6" x2="7" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 13v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function MaterialsIcon({ color = '#9333ea', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2" fill={color}/>
      <circle cx="12" cy="4" r="1.5" fill={color} opacity="0.7"/>
      <circle cx="12" cy="20" r="1.5" fill={color} opacity="0.7"/>
      <circle cx="4" cy="8" r="1.5" fill={color} opacity="0.7"/>
      <circle cx="20" cy="8" r="1.5" fill={color} opacity="0.7"/>
      <circle cx="4" cy="16" r="1.5" fill={color} opacity="0.7"/>
      <circle cx="20" cy="16" r="1.5" fill={color} opacity="0.7"/>
      <line x1="12" y1="5.5" x2="12" y2="10" stroke={color} strokeWidth="1.2" opacity="0.5"/>
      <line x1="12" y1="14" x2="12" y2="18.5" stroke={color} strokeWidth="1.2" opacity="0.5"/>
      <line x1="5.3" y1="8.7" x2="10" y2="11" stroke={color} strokeWidth="1.2" opacity="0.5"/>
      <line x1="14" y1="13" x2="18.7" y2="15.3" stroke={color} strokeWidth="1.2" opacity="0.5"/>
      <line x1="18.7" y1="8.7" x2="14" y2="11" stroke={color} strokeWidth="1.2" opacity="0.5"/>
      <line x1="10" y1="13" x2="5.3" y2="15.3" stroke={color} strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
}

export function MedTechIcon({ color = '#be185d', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-8-5.5-8-11a5 5 0 0110 0 5 5 0 0110 0c0 5.5-8 11-8 11z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <path d="M9 12h6M12 9v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function RoboticsIcon({ color = '#4f46e5', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="8" width="10" height="9" rx="2" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <rect x="9" y="3" width="6" height="4" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <line x1="12" y1="7" x2="12" y2="8" stroke={color} strokeWidth="1.5"/>
      <circle cx="9.5" cy="12" r="1" fill={color}/>
      <circle cx="14.5" cy="12" r="1" fill={color}/>
      <path d="M10 15.5h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 11H4v3h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 11h3v3h-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 17v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 17v2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function InfrastructureIcon({ color = '#b45309', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="18" rx="0.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <rect x="3" y="9" width="5" height="12" rx="0.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <rect x="16" y="11" width="5" height="10" rx="0.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="21" x2="21" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="11" y="15" width="2" height="6" rx="0.5" fill={color}/>
      <rect x="10.5" y="6" width="1.5" height="2" rx="0.5" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function DigitalTechIcon({ color = '#0891b2', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      <path d="M7 9l2 3-2 3M11 15h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="5" r="2.5" fill={color}/>
      <path d="M15.5 5h3M17 3.5v3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export function ManufacturingIcon({ color = '#dc2626', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill={color}/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function ConsumerIcon({ color = '#db2777', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.5"/>
      <path d="M16 10a4 4 0 01-8 0" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function EnergyIcon({ color = '#ca8a04', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill={color} opacity="0.2"/>
      <circle cx="12" cy="12" r="2" fill={color}/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M13 9l-3 4h4l-3 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
    </svg>
  );
}

export function WaterEnvIcon({ color = '#2563eb', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C12 3 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-12-7-12z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      <path d="M9 16.5a3 3 0 004 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M19 8c1 1 2 2.5 2 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

// Map sector slug → icon component
// Lucide-based sector icons for the premium card redesign
import { Sprout, UtensilsCrossed, HeartPulse, Dna, Cpu, Leaf, Droplets, Atom, ShoppingBag, Bot, Building2, Cog } from 'lucide-react';

export function getSectorIcon(slug: string, color: string, size = 24) {
  const s = slug.toLowerCase();
  const props = { color, size, strokeWidth: 1.8 };
  if (s.includes('agriculture') || s.includes('agri')) return <Sprout {...props} />;
  if (s.includes('food')) return <UtensilsCrossed {...props} />;
  if (s.includes('medtech') || s.includes('health') || s.includes('medical')) return <HeartPulse {...props} />;
  if (s.includes('biotech') || s.includes('life-science')) return <Dna {...props} />;
  if (s.includes('digital') || s.includes('software') || s.includes('ai') || s.includes('ict')) return <Cpu {...props} />;
  if (s.includes('energy') || s.includes('climate') || s.includes('sustainab') || s.includes('renewable')) return <Leaf {...props} />;
  if (s.includes('water') || s.includes('environ') || s.includes('waste')) return <Droplets {...props} />;
  if (s.includes('material') || s.includes('chemical')) return <Atom {...props} />;
  if (s.includes('consumer') || s.includes('cosmet') || s.includes('lifestyle')) return <ShoppingBag {...props} />;
  if (s.includes('robot') || s.includes('drone') || s.includes('automat')) return <Bot {...props} />;
  if (s.includes('infra') || s.includes('construct') || s.includes('smart-cit') || s.includes('city')) return <Building2 {...props} />;
  if (s.includes('manufactur') || s.includes('industrial')) return <Cog {...props} />;
  return <Cpu {...props} />;
}
