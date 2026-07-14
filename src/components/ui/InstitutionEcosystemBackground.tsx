'use client';

import React from 'react';

export default function InstitutionEcosystemBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] text-accent select-none">
      <svg
        viewBox="0 0 1000 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="none"
      >
        {/* Research Facilities (Lab structures / Domes) */}
        <g transform="translate(80, 40)" className="opacity-70">
          <path d="M10 80 H90 M20 80 V50 C20 35, 35 20, 50 20 C65 20, 80 35, 80 50 V80 Z" stroke="currentColor" strokeWidth="1.5" />
          <rect x="42" y="35" width="16" height="25" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="50" cy="70" r="1.5" fill="currentColor" />
          <path d="M90 80 L110 60 H130 L140 80" stroke="currentColor" strokeWidth="1.2" />
        </g>

        {/* Publications (Research paper outlines) */}
        <g transform="translate(320, 70)" className="opacity-80">
          {/* Stacked sheets */}
          <path d="M10 15 H40 V55 H10 Z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M15 10 H45 V50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="16" y1="23" x2="34" y2="23" stroke="currentColor" strokeWidth="1" />
          <line x1="16" y1="31" x2="34" y2="31" stroke="currentColor" strokeWidth="1" />
          <line x1="16" y1="39" x2="28" y2="39" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Technology Nodes and Collaboration Network */}
        <g transform="translate(540, 60)">
          <path d="M20 70 L90 20 L180 50 L110 100 L20 70 Z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="90" y1="20" x2="110" y2="100" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="70" r="8" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="20" cy="70" r="3.5" fill="currentColor" />
          
          <circle cx="90" cy="20" r="5" fill="currentColor" />
          <circle cx="180" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" fill="var(--background)" />
          <circle cx="180" cy="50" r="4.5" fill="currentColor" />
          
          <circle cx="110" cy="100" r="6" fill="currentColor" />
        </g>

        {/* Connected Collaborator Network */}
        <g transform="translate(820, 50)" className="opacity-75">
          <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="30" cy="30" r="5" fill="currentColor" />
          
          <path d="M30 30 L90 90" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="90" cy="90" r="6" fill="currentColor" />
          
          <path d="M90 90 C 70 110, 40 100, 30 80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
        </g>
      </svg>
    </div>
  );
}
