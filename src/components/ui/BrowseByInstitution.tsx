import type { Institution } from '@/types';
import InstitutionSearchGrid from './InstitutionSearchGrid';

interface Props {
  institutions: Institution[];
  context?: 'instruments' | 'services';
}

export default function BrowseByInstitution({ institutions, context }: Props) {
  const isServices = context === 'services';
  return (
    <section 
      id={isServices ? "startups" : "institutions"} 
      className="relative py-20 bg-white border-b border-slate-100"
    >
      <div id="startups" className="absolute -top-20" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">
            Browse by
          </div>
          <h2 className="text-3xl font-heading font-bold text-[#0F172A]">
            {isServices ? 'List of Services' : 'List of Research & Technology Institutions'}
          </h2>
        </div>

        {/* ── Search + Filtered Grid ── */}
        <InstitutionSearchGrid institutions={institutions} context={context} />

      </div>
    </section>
  );
}
