// Lightweight, elegant research-themed floating layer for the hero.
// Pure CSS animations (no JS loop) → smooth 60fps, respects reduced motion.

const ELEMENTS = [
  // DNA helix
  {
    left: '6%', top: '22%', size: 54, duration: '13s', delay: '0s', opacity: 0.18,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        <path d="M7 3c0 5 10 5 10 10S7 18 7 21" />
        <path d="M17 3c0 5-10 5-10 10s10 5 10 8" />
        <path d="M8 6h8M8 12h8M8 18h8" strokeWidth="0.7" />
      </svg>
    ),
  },
  // Molecule
  {
    left: '84%', top: '18%', size: 60, duration: '16s', delay: '-4s', opacity: 0.16,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        <circle cx="6" cy="7" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="12" cy="15" r="2.2" /><circle cx="19" cy="17" r="1.8" />
        <path d="M8 8l3 5M16 7l-3 6M14 15l3 1.5" strokeWidth="0.7" />
      </svg>
    ),
  },
  // Research node cluster
  {
    left: '70%', top: '64%', size: 70, duration: '18s', delay: '-8s', opacity: 0.13,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
        <circle cx="4" cy="5" r="1.6" fill="currentColor" /><circle cx="20" cy="8" r="1.6" fill="currentColor" />
        <circle cx="12" cy="13" r="2" /><circle cx="6" cy="20" r="1.6" fill="currentColor" /><circle cx="19" cy="19" r="1.6" fill="currentColor" />
        <path d="M4 5l8 8M20 8l-8 5M12 13l-6 7M12 13l7 6" strokeWidth="0.6" />
      </svg>
    ),
  },
  // Atom / orbit
  {
    left: '16%', top: '70%', size: 56, duration: '15s', delay: '-6s', opacity: 0.15,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  // Innovation dots / flask
  {
    left: '46%', top: '12%', size: 46, duration: '14s', delay: '-10s', opacity: 0.14,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        <path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3" />
        <path d="M8 3h8" />
      </svg>
    ),
  },
];

export default function ResearchParticles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden>
      {/* Network connection lines */}
      <svg className="absolute inset-0 w-full h-full text-[#60A5FA]" style={{ opacity: 0.08 }} fill="none" preserveAspectRatio="none" viewBox="0 0 1200 600">
        <path d="M80 120 L320 220 L520 100 L760 260 L1040 140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <path d="M140 480 L380 360 L600 460 L900 340 L1120 440" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="320" cy="220" r="3" fill="currentColor" />
        <circle cx="760" cy="260" r="3" fill="currentColor" />
        <circle cx="380" cy="360" r="3" fill="currentColor" />
        <circle cx="900" cy="340" r="3" fill="currentColor" />
      </svg>

      {ELEMENTS.map((el, i) => (
        <div
          key={i}
          className="research-particle absolute text-[#7CB3FF]"
          style={{
            left: el.left,
            top: el.top,
            width: el.size,
            height: el.size,
            opacity: el.opacity,
            animationDuration: el.duration,
            animationDelay: el.delay,
          }}
        >
          {el.svg}
        </div>
      ))}

      <style>{`
        @keyframes research-float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-18px) translateX(8px) rotate(4deg); }
          66% { transform: translateY(10px) translateX(-6px) rotate(-3deg); }
        }
        .research-particle { animation: research-float 14s ease-in-out infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .research-particle { animation: none; }
        }
      `}</style>
    </div>
  );
}
