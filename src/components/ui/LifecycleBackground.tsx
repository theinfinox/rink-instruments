'use client';

import React from 'react';

export default function LifecycleBackground() {
  return (
    <div className="absolute inset-y-0 left-4 md:left-12 w-[180px] pointer-events-none z-0 select-none hidden lg:flex items-center justify-center opacity-[0.02] text-[#00FA9A]">
      <svg
        viewBox="0 0 100 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[75%] max-h-[750px]"
      >
        {/* Animated glowing vertical flow line */}
        <path d="M 50 30 L 50 590" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <path
          d="M 50 30 L 50 590"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="12 24"
          className="animate-[pipeline-flow_12s_linear_infinite]"
        />

        {/* Node 1: Research */}
        <circle cx="50" cy="40" r="4.5" fill="currentColor" />
        <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <text x="50" y="65" textAnchor="middle" fill="#F8FAF8" fontSize="7.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">RESEARCH</text>
        <path d="M 50 78 L 50 90 L 46 86 M 50 90 L 54 86" stroke="currentColor" strokeWidth="1" className="opacity-40" />

        {/* Node 2: Prototype */}
        <circle cx="50" cy="160" r="4.5" fill="currentColor" />
        <circle cx="50" cy="160" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <text x="50" y="185" textAnchor="middle" fill="#F8FAF8" fontSize="7.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">PROTOTYPE</text>
        <path d="M 50 198 L 50 210 L 46 206 M 50 210 L 54 206" stroke="currentColor" strokeWidth="1" className="opacity-40" />

        {/* Node 3: Patent */}
        <circle cx="50" cy="280" r="4.5" fill="currentColor" />
        <circle cx="50" cy="280" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <text x="50" y="305" textAnchor="middle" fill="#F8FAF8" fontSize="7.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">PATENT</text>
        <path d="M 50 318 L 50 330 L 46 326 M 50 330 L 54 326" stroke="currentColor" strokeWidth="1" className="opacity-40" />

        {/* Node 4: Licensing */}
        <circle cx="50" cy="400" r="4.5" fill="currentColor" />
        <circle cx="50" cy="400" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <text x="50" y="425" textAnchor="middle" fill="#F8FAF8" fontSize="7.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">LICENSING</text>
        <path d="M 50 438 L 50 450 L 46 446 M 50 450 L 54 446" stroke="currentColor" strokeWidth="1" className="opacity-40" />

        {/* Node 5: Commercialization */}
        <circle cx="50" cy="520" r="4.5" fill="currentColor" />
        <circle cx="50" cy="520" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <text x="50" y="545" textAnchor="middle" fill="#F8FAF8" fontSize="7.5" fontWeight="900" fontFamily="Outfit, sans-serif" letterSpacing="0.05em">COMMERCIALIZATION</text>
      </svg>
    </div>
  );
}
