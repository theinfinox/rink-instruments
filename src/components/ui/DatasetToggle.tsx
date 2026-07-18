'use client';

export type PortalView = 'instruments' | 'services';

interface DatasetToggleProps {
  view: PortalView;
  onChange: (view: PortalView) => void;
}

export default function DatasetToggle({ view, onChange }: DatasetToggleProps) {
  const isServices = view === 'services';

  return (
    <div className="relative flex items-center p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 mt-4 shadow-xl">
      {/* ── Sliding Pill Background ── */}
      <div
        className="absolute top-1.5 bottom-1.5 w-[140px] bg-[#3b82f6] rounded-full shadow-[0_0_16px_rgba(59,130,246,0.5)]"
        style={{
          transform: isServices ? 'translateX(140px)' : 'translateX(0)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-hidden
      />

      <button
        onClick={() => onChange('instruments')}
        className="relative z-10 w-[140px] flex items-center justify-center py-2.5 text-sm md:text-base font-semibold transition-colors duration-300"
        style={{ color: !isServices ? '#ffffff' : 'rgba(255,255,255,0.6)' }}
      >
        Instruments
      </button>

      <button
        onClick={() => onChange('services')}
        className="relative z-10 w-[140px] flex items-center justify-center py-2.5 text-sm md:text-base font-semibold transition-colors duration-300"
        style={{ color: isServices ? '#ffffff' : 'rgba(255,255,255,0.6)' }}
      >
        Services
      </button>
    </div>
  );
}
