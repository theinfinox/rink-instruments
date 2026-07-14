import Link from 'next/link';
import type { Institution } from '@/types';
import InstitutionSearchGrid from './InstitutionSearchGrid';

interface Props {
  institutions: Institution[];
}

export default function BrowseByInstitution({ institutions }: Props) {
  return (
    <section id="institutions" className="relative scroll-mt-20 py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="text-xs font-bold text-[#1B4D9B] uppercase tracking-widest mb-3">Browse by Institution</div>
          <h2 className="text-3xl font-heading font-bold text-[#0F172A]">Technologies From Kerala&apos;s Leading Research Institutions</h2>
        </div>

        {/* ── Institution Search + Filtered Grid ── */}
        <InstitutionSearchGrid institutions={institutions} />

        {/* ── View all link ── */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/institutions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4D9B] hover:text-[#0A2164] transition-colors"
          >
            View all institutions →
          </Link>
        </div>
      </div>
    </section>
  );
}
