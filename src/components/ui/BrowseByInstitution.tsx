import Link from 'next/link';
import type { Institution } from '@/types';
import InstitutionSearchGrid from './InstitutionSearchGrid';

interface Props {
  institutions: Institution[];
  context?: 'instruments' | 'services';
}

export default function BrowseByInstitution({ institutions, context }: Props) {
  const isServices = context === 'services';
  return (
    <section id="institutions" className="relative py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">
            {isServices ? 'Browse by Startup' : 'Browse by Institution'}
          </div>
          <h2 className="text-3xl font-heading font-bold text-[#0F172A]">
            {isServices ? 'Services From Kerala\'s Promising Startups' : 'Technologies From Kerala\'s Leading Research Institutions'}
          </h2>
        </div>

        {/* ── Search + Filtered Grid ── */}
        <InstitutionSearchGrid institutions={institutions} context={context} />

        {/* ── View all link ── */}
        <div className="mt-8 flex justify-center">
          <Link
            href={isServices ? "/services/list" : "/institutions"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4D9B] hover:text-[#0A2164] transition-colors"
          >
            {isServices ? 'View all services →' : 'View all institutions →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
