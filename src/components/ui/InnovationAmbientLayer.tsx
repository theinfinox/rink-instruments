'use client';

import React from 'react';

interface FloatingElement {
  id: number;
  name: string;
  svg: React.ReactNode;
  left: string;
  top: string;
  duration: string;
  delay: string;
  color: string;
}

export default function InnovationAmbientLayer() {
  const elements: FloatingElement[] = [
    {
      id: 1,
      name: 'Patent Document',
      left: '4%',
      top: '12%',
      duration: '25s',
      delay: '0s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h8M8 14h5" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Research Paper',
      left: '92%',
      top: '8%',
      duration: '32s',
      delay: '-5s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h10M7 11h10" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Laboratory Flask',
      left: '14%',
      top: '45%',
      duration: '28s',
      delay: '-10s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M9 3h6M12 3v5M6 21h12L12 8z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Microscope',
      left: '88%',
      top: '52%',
      duration: '38s',
      delay: '-15s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M12 2v3M5 21h14M16 21a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4M10 17v-3M14 17v-3M8 14h8M12 5v9M9 5h6" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'AI Chip Outlines',
      left: '78%',
      top: '28%',
      duration: '22s',
      delay: '-2s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Technology Node',
      left: '28%',
      top: '80%',
      duration: '35s',
      delay: '-12s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" />
        </svg>
      )
    },
    {
      id: 7,
      name: 'Innovation Gear',
      left: '3%',
      top: '72%',
      duration: '24s',
      delay: '-8s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      )
    },
    {
      id: 8,
      name: 'Licensing Certificate',
      left: '84%',
      top: '85%',
      duration: '39s',
      delay: '-22s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M8 12l2.5 2.5 5.5-5.5" />
        </svg>
      )
    },
    {
      id: 9,
      name: 'Technology Transfer Arrow',
      left: '52%',
      top: '70%',
      duration: '27s',
      delay: '-6s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M17 3 L21 7 L17 11 M3 7 H21 M7 21 L3 17 L7 13 M21 17 H3" />
        </svg>
      )
    },
    {
      id: 10,
      name: 'Patent Blueprint',
      left: '32%',
      top: '18%',
      duration: '30s',
      delay: '-18s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      )
    },
    {
      id: 11,
      name: 'Technology Node 2',
      left: '64%',
      top: '85%',
      duration: '40s',
      delay: '-25s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <circle cx="12" cy="6" r="2.5" />
          <circle cx="6" cy="16" r="2" />
          <circle cx="18" cy="16" r="2" />
          <line x1="12" y1="8.5" x2="6" y2="14" />
          <line x1="12" y1="8.5" x2="18" y2="14" />
        </svg>
      )
    },
    {
      id: 12,
      name: 'Network Pathways',
      left: '42%',
      top: '8%',
      duration: '31s',
      delay: '-3s',
      color: 'text-[#0A2164]',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10" strokeWidth="1">
          <path d="M12 2v20M2 12h20M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" strokeDasharray="3 3" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* Dynamic Keyframes for exact requested transform offsets and reduced-motion fallback */}
      <style>{`
        @keyframes float-ambient-asset {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) translateX(8px) rotate(2deg);
          }
        }
        .animate-float-ambient {
          animation: float-ambient-asset 30s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float-ambient {
            animation: none !important;
          }
        }
      `}</style>

      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute animate-float-ambient blur-[1px] ${el.color}`}
          style={{
            left: el.left,
            top: el.top,
            opacity: 0.025, // Strictly 2.5% opacity (range 2% - 4%)
            animationDuration: el.duration,
            animationDelay: el.delay,
          }}
          title={el.name}
        >
          {el.svg}
        </div>
      ))}
    </div>
  );
}
