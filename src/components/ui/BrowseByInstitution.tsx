import type { Institution } from '@/types';
import InstitutionSearchGrid from './InstitutionSearchGrid';

interface Props {
  institutions: Institution[];
  startups?: Institution[];
  context?: 'instruments' | 'services';
}

export default function BrowseByInstitution({ institutions, startups = [], context }: Props) {
  const isServices = context === 'services';
  return (
    <section 
      className="relative py-10 sm:py-20 bg-white border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Proper Scroll Anchors for Institutions and Startups */}
        <div id="institutions" className="scroll-mt-[88px] sm:scroll-mt-[104px]" />
        <div id="startups" className="scroll-mt-[88px] sm:scroll-mt-[104px]" />

        <div className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-heading font-bold text-[#0F172A] tracking-tight leading-snug">
            {isServices ? (
              'Browse by Startups'
            ) : (
              <>
                Browse by Research Institutes{' '}
                <span className="block sm:inline text-slate-700 sm:text-inherit">&amp; Startups</span>
              </>
            )}
          </h2>
        </div>

        {/* ── Search + Filtered Grid ── */}
        <InstitutionSearchGrid institutions={institutions} startups={startups} context={context} />

      </div>
    </section>
  );
}
