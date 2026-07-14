'use client';

interface Props {
  slug: string;
}

export default function SectorBackground({ slug }: Props) {
  const s = slug.toLowerCase();

  // Helper styles: low opacity and matching the primary accent color
  const svgClass = "absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] text-accent select-none z-0";

  if (s.includes('agriculture') || s.includes('agritech')) {
    return (
      <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
        {/* Precision farming crop rows */}
        <path d="M-50 220 L300 20 L320 20 L-30 220" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <path d="M0 220 L350 20 L370 20 L20 220" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <path d="M50 220 L400 20 L420 20 L70 220" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        <path d="M100 220 L450 20 L470 20 L120 220" stroke="currentColor" strokeWidth="1" className="opacity-40" />
        
        {/* Precision Farming Grid (vertical and horizontal lines) */}
        <path d="M600 40 L900 40 M600 80 L900 80 M600 120 L900 120 M600 160 L900 160 M600 200 L900 200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M600 40 L600 200 M650 40 L650 200 M700 40 L700 200 M750 40 L750 200 M800 40 L800 200 M850 40 L850 200 M900 40 L900 200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        
        {/* Smart Irrigation nodes */}
        <circle cx="700" cy="80" r="4" fill="currentColor" />
        <circle cx="800" cy="160" r="4" fill="currentColor" />
        <circle cx="650" cy="120" r="3" fill="currentColor" />
        <circle cx="850" cy="120" r="3" fill="currentColor" />
        
        {/* Connections */}
        <path d="M650 120 C 700 100, 750 180, 800 160" stroke="currentColor" strokeWidth="1.2" />
        <path d="M700 80 C 750 100, 800 100, 850 120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
      </svg>
    );
  }

  if (s.includes('food') || s.includes('processing')) {
    return (
      <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
        {/* Food technology Innovation geometry - hexagons */}
        <g transform="translate(150, 100)" className="opacity-50">
          <polygon points="0,-40 34.6,-20 34.6,20 0,40 -34.6,20 -34.6,-20" stroke="currentColor" strokeWidth="1" />
          <polygon points="60,-75 94.6,-55 94.6,-15 60,5 25.4,-15 25.4,-55" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
          <polygon points="60,35 94.6,55 94.6,95 60,115 25.4,95 25.4,55" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2="60" y2="-35" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2="60" y2="75" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Processing flow lines and containers */}
        <g transform="translate(550, 50)">
          {/* Main flow line */}
          <path d="M50 70 L180 70 C 220 70, 220 130, 260 130 L380 130" stroke="currentColor" strokeWidth="1.5" />
          <path d="M80 70 L80 130 L150 130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Vessel 1 */}
          <rect x="10" y="50" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="70" r="10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 1" />
          
          {/* Vessel 2 */}
          <circle cx="180" cy="70" r="20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M170 70 H190 M180 60 V80" stroke="currentColor" strokeWidth="1" />

          {/* Vessel 3 */}
          <rect x="380" y="110" width="50" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="405" cy="130" r="6" fill="currentColor" />
        </g>
      </svg>
    );
  }

  if (s.includes('water') || s.includes('env') || s.includes('aquaculture')) {
    return (
      <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
        {/* Wave structures (sine curves) */}
        <path d="M-50 140 C 150 90, 250 190, 450 140 C 650 90, 750 190, 950 140 C 1050 110, 1150 150, 1200 140" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-50 160 C 150 110, 250 210, 450 160 C 650 110, 750 210, 950 160 C 1050 130, 1150 170, 1200 160" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
        <path d="M-50 120 C 150 70, 250 170, 450 120 C 650 70, 750 170, 950 120" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />

        {/* Circular treatment flow & monitoring nodes */}
        <g transform="translate(250, 60)" className="opacity-70">
          <circle cx="0" cy="0" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="0" cy="0" r="18" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 -30 L5 -24 M0 30 L-5 24 M-30 0 L-24 -5 M30 0 L24 5" stroke="currentColor" strokeWidth="1.5" />
        </g>

        <g transform="translate(750, 90)">
          <circle cx="0" cy="0" r="6" fill="currentColor" />
          <circle cx="0" cy="0" r="16" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="0" r="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
          
          <path d="M0 0 L50 -30" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="-30" r="4" fill="currentColor" />
        </g>
      </svg>
    );
  }

  if (s.includes('digital') || s.includes('software') || s.includes('ai') || s.includes('robotics')) {
    return (
      <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
        {/* Digital circuit traces */}
        <path d="M50 40 H180 L230 90 H450 L480 120 H600 L630 90 H850" stroke="currentColor" strokeWidth="1.2" />
        <path d="M150 90 H280 L310 120 H490 L520 150 H750" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        <path d="M380 20 V60 L410 90 H500" stroke="currentColor" strokeWidth="0.8" />
        
        {/* Circuit nodes (circles) */}
        <circle cx="50" cy="40" r="4" fill="currentColor" />
        <circle cx="180" cy="70" r="3" fill="currentColor" />
        <circle cx="230" cy="90" r="3" fill="currentColor" />
        <circle cx="450" cy="90" r="3.5" stroke="currentColor" strokeWidth="1" fill="var(--background)" />
        <circle cx="480" cy="120" r="3" fill="currentColor" />
        <circle cx="600" cy="120" r="4" fill="currentColor" />
        <circle cx="850" cy="90" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />

        {/* Neural network nodes / AI structures */}
        <g transform="translate(750, 140)">
          <line x1="0" y1="0" x2="-40" y2="-30" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2="-40" y2="30" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2="40" y2="-10" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="1" />
          
          <line x1="-40" y1="-30" x2="-80" y2="-10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="-40" y1="30" x2="-80" y2="10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="40" y1="-10" x2="80" y2="-30" stroke="currentColor" strokeWidth="0.8" />
          <line x1="40" y1="40" x2="80" y2="20" stroke="currentColor" strokeWidth="0.8" />

          <circle cx="0" cy="0" r="6" fill="currentColor" />
          <circle cx="-40" cy="-30" r="4" fill="currentColor" />
          <circle cx="-40" cy="30" r="4" fill="currentColor" />
          <circle cx="40" cy="-10" r="5" stroke="currentColor" strokeWidth="1.2" fill="var(--background)" />
          <circle cx="40" cy="40" r="5" stroke="currentColor" strokeWidth="1.2" fill="var(--background)" />
          
          <circle cx="-80" cy="-10" r="3" fill="currentColor" className="opacity-60" />
          <circle cx="-80" cy="10" r="3" fill="currentColor" className="opacity-60" />
          <circle cx="80" cy="-30" r="3" fill="currentColor" />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
        </g>
      </svg>
    );
  }

  if (s.includes('energy') || s.includes('climate') || s.includes('sustainability') || s.includes('renewable')) {
    return (
      <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
        {/* Solar geometry */}
        <g transform="translate(180, 80)">
          <circle cx="0" cy="0" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <circle cx="0" cy="0" r="16" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" fill="currentColor" />
          {/* Radiating rays */}
          <path d="M0 -40 V-28 M0 40 V28 M-40 0 H-28 M40 0 H28 M-28 -28 L-20 -20 M28 28 L20 20 M-28 28 L-20 20 M28 -28 L20 -20" stroke="currentColor" strokeWidth="1.2" />
        </g>

        {/* Wind Turbine Outlines */}
        <g transform="translate(820, 150)" className="opacity-80">
          {/* Tower */}
          <path d="M-3 60 L-1 0 H1 L3 60 Z" fill="currentColor" />
          {/* Rotating Blades */}
          <g className="animate-spin-slow" style={{ transformOrigin: '0px 0px' }}>
            <path d="M0 0 L-2 -35 C -3 -45, 3 -45, 2 -35 Z" fill="currentColor" />
            <path d="M0 0 L28 20 C 36 26, 31 34, 25 30 Z" fill="currentColor" />
            <path d="M0 0 L-26 24 C -34 30, -38 22, -32 16 Z" fill="currentColor" />
            <circle cx="0" cy="0" r="3" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          </g>
        </g>
        
        {/* Secondary small turbine */}
        <g transform="translate(890, 170)" className="opacity-60">
          <path d="M-2 40 L-0.5 0 H0.5 L2 40 Z" fill="currentColor" />
          <g className="animate-spin-slow" style={{ transformOrigin: '0px 0px', animationDuration: '25s' }}>
            <path d="M0 0 L-1.5 -25 C -2 -32, 2 -32, 1.5 -25 Z" fill="currentColor" />
            <path d="M0 0 L20 14 C 25 18, 22 24, 18 21 Z" fill="currentColor" />
            <path d="M0 0 L-18 17 C -23 21, -26 15, -22 11 Z" fill="currentColor" />
            <circle cx="0" cy="0" r="2" fill="var(--background)" stroke="currentColor" strokeWidth="0.8" />
          </g>
        </g>

        {/* Energy network flows */}
        <path d="M180 80 C 350 30, 600 200, 820 150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 4" />
        <circle cx="500" cy="115" r="4" fill="currentColor" />
      </svg>
    );
  }

  // Default Fallback: Clean Innovation Network Geometry
  return (
    <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="none">
      <path d="M100 40 L250 90 L180 180 L400 130 L550 50 L680 150 L820 70 L950 160" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M250 90 L550 50 L820 70" stroke="currentColor" strokeWidth="1" />
      
      <circle cx="100" cy="40" r="4" fill="currentColor" />
      <circle cx="250" cy="90" r="6" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
      <circle cx="180" cy="180" r="4" fill="currentColor" />
      <circle cx="400" cy="130" r="7" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
      <circle cx="550" cy="50" r="4" fill="currentColor" />
      <circle cx="680" cy="150" r="6" fill="currentColor" />
      <circle cx="820" cy="70" r="8" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
      <circle cx="950" cy="160" r="4" fill="currentColor" />
    </svg>
  );
}
