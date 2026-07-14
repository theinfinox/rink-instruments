'use client';

const STEPS = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="4 2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M15 3h4a2 2 0 0 1 2 2v4" />
      </svg>
    ),
    label: 'Research',
    shortDesc: 'Conducted at partner institutions',
    detail: 'Scientists and researchers at Kerala\'s partner institutions develop novel technologies, methodologies, and innovations addressing real-world challenges across agriculture, health, energy, and more.',
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
    label: 'Prototype',
    shortDesc: 'Proof-of-concept developed',
    detail: 'Research outcomes are validated through laboratory prototypes and proof-of-concept models. Technology Readiness Levels (TRL) are assessed to gauge commercialization readiness.',
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 12l2 2 4-4" />
        <path d="M9 7h6M9 17h4" />
      </svg>
    ),
    label: 'Patent',
    shortDesc: 'Intellectual property protected',
    detail: 'Innovations are protected through patents, trademarks, and other intellectual property registrations. IP rights are assigned to the institution, forming the legal basis for licensing.',
  },
  {
    id: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    label: 'Licensing',
    shortDesc: 'Technology licensed to partners',
    detail: 'RINK facilitates technology licensing agreements between research institutions and startups, industries, or MSMEs. Licensing terms are negotiated with Kerala Startup Mission support.',
  },
  {
    id: 5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    label: 'Startup',
    shortDesc: 'Venture built on technology',
    detail: 'Entrepreneurs and startup founders build ventures based on licensed technologies. KSUM provides incubation, funding, mentoring, and ecosystem support to accelerate growth.',
  },
  {
    id: 6,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M16.24 7.76A6 6 0 1 1 7.76 16.24" />
      </svg>
    ),
    label: 'Commercialization',
    shortDesc: 'Scaled to market',
    detail: 'Products reach the market at scale. Technology benefits society, creates employment, and contributes to Kerala\'s innovation economy. RINK tracks outcomes for ecosystem reporting.',
  },
];

interface Props {
  compact?: boolean; // true = homepage preview (condensed), false = full about page version
}

export default function TechTransferPathway({ compact = false }: Props) {
  return (
    <section className={`relative bg-white border-b border-gray-100 ${compact ? 'py-14' : 'py-20'}`}>
      {/* Subtle circuit-trace background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]">
        <svg viewBox="0 0 1200 300" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 150 H200 V80 H500 V220 H800 V100 H1200" stroke="#0A2164" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="200" cy="150" r="5" fill="#0A2164" />
          <circle cx="500" cy="80" r="5" fill="#0A2164" />
          <circle cx="800" cy="220" r="5" fill="#0A2164" />
          <path d="M0 80 H100 V200 H300" stroke="#0A2164" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M900 50 H1200" stroke="#0A2164" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={`text-center ${compact ? 'mb-10' : 'mb-14'}`}>
          <div className="text-xs font-bold text-[#0A2164] uppercase tracking-widest mb-3">
            Technology Transfer Process
          </div>
          <h2 className={`font-heading font-bold text-gray-900 ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} mb-3`}>
            From Research to Market
          </h2>
          {!compact && (
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-sans leading-relaxed">
              RINK facilitates a structured pathway that takes research innovations from laboratories to the marketplace through six defined stages.
            </p>
          )}
        </div>

        {/* Pathway — Desktop horizontal, Mobile vertical */}
        <div className="relative">

          {/* Desktop: horizontal line connector */}
          <div className="hidden md:block absolute top-[52px] left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-[2px] z-0">
            <div className="w-full h-full bg-gradient-to-r from-blue-200 via-[#0A2164] to-blue-200 opacity-40 rounded-full" />
            <style>{`
              @keyframes pathway-scan {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
              .pathway-scan {
                animation: pathway-scan 3s ease-in-out infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .pathway-scan { animation: none; }
              }
            `}</style>
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="pathway-scan absolute top-0 bottom-0 w-1/4 bg-gradient-to-r from-transparent via-[#0A2164] to-transparent opacity-60 rounded-full" />
            </div>
          </div>

          {/* Steps grid */}
          <div className={`
            grid gap-4
            grid-cols-2 sm:grid-cols-3 md:grid-cols-6
            ${compact ? '' : 'md:gap-6'}
          `}>
            {STEPS.map((step, i) => (
              <div key={step.id} className="relative flex flex-col items-center">
                {/* Mobile vertical connector */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden absolute left-1/2 top-[60px] -translate-x-1/2 w-[2px] h-8 bg-blue-200 z-0" />
                )}

                {/* Step node (non-interactive) */}
                <div
                  className="relative z-10 w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center bg-white border-gray-200 text-[#0A2164]"
                  title={step.label}
                  aria-label={step.label}
                >
                  <span className="text-[#0A2164]">
                    {step.icon}
                  </span>
                  {/* Step number */}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center bg-[#0A2164] text-white">
                    {step.id}
                  </span>
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div className="text-[13px] font-bold font-heading text-gray-800">
                    {step.label}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
