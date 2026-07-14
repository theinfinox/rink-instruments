'use client';

import React from 'react';

interface Asset {
  id: number;
  name: string;
  svg: React.ReactNode;
  left: string;
  top: string;
  duration: string;
  delay: string;
  color: string; // Tailored accent colors
}

export default function FloatingResearchAssets() {
  const assets: Asset[] = [
    {
      id: 1,
      name: 'Patent Document',
      left: '8%',
      top: '18%',
      duration: '28s',
      delay: '0s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h8M8 14h5" />
          <circle cx="15" cy="15" r="2.5" fill="currentColor" fillOpacity="0.1" />
          <path d="M15 17.5l1 2.5-1-1-1 1z" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Research Paper',
      left: '85%',
      top: '22%',
      duration: '34s',
      delay: '-4s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h10M7 11h10M7 15h4" />
          <line x1="14" y1="15" x2="14" y2="17" />
          <line x1="17" y1="13" x2="17" y2="17" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Laboratory Flask',
      left: '18%',
      top: '68%',
      duration: '31s',
      delay: '-8s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <path d="M9 3h6M12 3v5M6 21h12L12 8z" />
          <path d="M8.5 16h7" strokeDasharray="2 2" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'AI Chip',
      left: '76%',
      top: '55%',
      duration: '38s',
      delay: '-12s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.1" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'Innovation Gear',
      left: '46%',
      top: '28%',
      duration: '26s',
      delay: '-2s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 16.5l2-2M16.5 7l2-2" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Technology Node',
      left: '88%',
      top: '78%',
      duration: '39s',
      delay: '-18s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8" y1="8" x2="16" y2="16" />
        </svg>
      )
    },
    {
      id: 7,
      name: 'Microscope',
      left: '12%',
      top: '84%',
      duration: '35s',
      delay: '-10s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12" strokeWidth="1.2">
          <path d="M12 2v3M5 21h14M16 21a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4M10 17v-3M14 17v-3M8 14h8M12 5v9M9 5h6" />
        </svg>
      )
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <style>{`
        @keyframes float-innovation {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(2deg);
          }
        }
        .animate-float-asset {
          animation: float-innovation 30s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float-asset {
            animation: none !important;
          }
        }
      `}</style>
      {assets.map((asset) => (
        <div
          key={asset.id}
          className={`absolute animate-float-asset blur-[1px] transition-all ${asset.color}`}
          style={{
            left: asset.left,
            top: asset.top,
            opacity: 0.025, // 2-3% opacity as requested
            animationDuration: asset.duration,
            animationDelay: asset.delay,
          }}
          title={asset.name}
        >
          {asset.svg}
        </div>
      ))}
    </div>
  );
}
