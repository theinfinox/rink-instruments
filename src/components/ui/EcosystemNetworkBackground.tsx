'use client';

export default function EcosystemNetworkBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <svg
        viewBox="0 0 1400 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-full h-full object-cover opacity-[0.03] text-accent"
        preserveAspectRatio="none"
      >
        {/* Network Connections (connecting lines) */}
        <path
          d="M150 120 L300 180 L220 320 L450 250 L580 120 L720 280 L880 140 L1020 320 L1200 160"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M300 180 L580 120 L880 140 L1200 160"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M220 320 L450 250 L720 280 L1020 320"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M150 120 L220 320 M300 180 L450 250 M580 120 L720 280 M880 140 L1020 320"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Commercialization curves (curved pathways) */}
        <path
          d="M50 380 C 350 350, 450 100, 800 200 C 1050 270, 1150 80, 1350 120"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-70"
        />
        <path
          d="M100 400 C 400 370, 500 120, 850 220 C 1100 290, 1200 100, 1400 140"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 4"
          className="opacity-50"
        />

        {/* Network Nodes (circles) */}
        <circle cx="150" cy="120" r="6" fill="currentColor" />
        <circle cx="300" cy="180" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
        <circle cx="300" cy="180" r="4" fill="currentColor" />
        <circle cx="220" cy="320" r="8" fill="currentColor" />
        <circle cx="450" cy="250" r="12" stroke="currentColor" strokeWidth="2" fill="white" />
        <circle cx="450" cy="250" r="5" fill="currentColor" />
        <circle cx="580" cy="120" r="7" fill="currentColor" />
        <circle cx="720" cy="280" r="9" stroke="currentColor" strokeWidth="1.5" fill="currentColor" className="opacity-80" />
        <circle cx="880" cy="140" r="14" stroke="currentColor" strokeWidth="2" fill="white" />
        <circle cx="880" cy="140" r="6" fill="currentColor" />
        <circle cx="1020" cy="320" r="8" fill="currentColor" />
        <circle cx="1200" cy="160" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
        <circle cx="1200" cy="160" r="4" fill="currentColor" />

        {/* Patent Motifs (Shield/Document outlines centered on key nodes) */}
        {/* Node 880,140 document emblem overlay */}
        <path
          d="M874 133 h12 v14 h-12 z M878 137 h4 M878 141 h4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Node 300,180 gear motif */}
        <circle
          cx="300"
          cy="180"
          r="16"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <path
          d="M297 160 L303 160 M297 200 L303 200 M280 177 L280 183 M320 177 L320 183"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Another Gear motif at 100, 250 */}
        <g transform="translate(100, 250)" className="opacity-80">
          <circle cx="0" cy="0" r="24" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="12" stroke="currentColor" strokeWidth="1" />
          {/* Teeth */}
          <path d="M-4 -28 H4 L6 -24 H-6 Z" fill="currentColor" />
          <path d="M-4 28 H4 L6 24 H-6 Z" fill="currentColor" />
          <path d="M-28 -4 V4 L-24 6 V-6 Z" fill="currentColor" />
          <path d="M28 -4 V4 L24 6 V-6 Z" fill="currentColor" />
          <path d="M-20 -20 L-14 -14 L-11 -17 L-17 -23 Z" fill="currentColor" />
          <path d="M20 20 L14 14 L11 17 L17 23 Z" fill="currentColor" />
          <path d="M-20 20 L-14 14 L-11 17 L-17 23 Z" fill="currentColor" />
          <path d="M20 -20 L14 -14 L11 -17 L17 -23 Z" fill="currentColor" />
        </g>

        {/* Decorative Technology Commercialization pathway nodes */}
        <path
          d="M450 250 L500 330 L650 300"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle cx="500" cy="330" r="3" fill="currentColor" />
        <circle cx="650" cy="300" r="4" stroke="currentColor" strokeWidth="1" fill="white" />
      </svg>
    </div>
  );
}
