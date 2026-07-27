import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InstitutionFilterView from './InstitutionFilterView';
import InstitutionEcosystemBackground from '@/components/ui/InstitutionEcosystemBackground';
import { getSectorIcon } from '@/components/ui/SectorIcons';
import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';

async function getRepo() {
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(bundle.main_data, bundle.instituitiion_list, bundle.mou_list);
  return { repo, instruments: bundle.main_data };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { repo } = await getRepo();
  return repo.getAll().map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { repo } = await getRepo();
  const inst = repo.getBySlug(slug);
  if (!inst) return { title: 'Institution Not Found — RINK' };
  
  const metaDescription = `Explore ${inst.tech_count} instruments from ${inst.name}. Partner with top Kerala research institutions through the RINK Instruments and Services Portal.`;
  
  return {
    title: `${inst.name} Instruments | RINK Kerala`,
    description: metaDescription,
    openGraph: {
      title: `${inst.name} Instruments | RINK Kerala`,
      description: metaDescription,
      type: 'website',
    },
  };
}

const CUSTOM_LOGOS: Record<string, string> = {
  'icar-cpcri': '/images/institutions/cpcri.png',
  'cpcri': '/images/institutions/cpcri.png',
  'icar-ctcri': '/images/institutions/ctcri.png',
  'ctcri': '/images/institutions/ctcri.png',
  'kufos': '/images/institutions/kufos.png',
};

const getPrimarySectorSlug = (slug: string): string => {
  const s = slug.toLowerCase();
  if (s.includes('cpcri') || s.includes('ctcri') || s.includes('kau')) return 'agriculture';
  if (s.includes('kufos') || s.includes('cwrdm')) return 'water-environment-waste-management';
  if (s.includes('niist')) return 'advanced-materials-chemicals';
  if (s.includes('cdac') || s.includes('c-dac')) return 'digital-technologies-ai-software';
  return 'default';
};

export default async function InstitutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const { repo, instruments } = await getRepo();
  const institution = repo.getBySlug(slug);

  if (!institution) notFound();

  // Filter instruments using canonical institution_id (with name slug fallback)
  const institutionInstruments = instruments.filter(inst => {
    if (institution.institution_id && inst.institution_id) {
      return inst.institution_id === institution.institution_id;
    }
    return inst.institution_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug;
  });

  const institutionViewModels = institutionInstruments.map(inst => toInstrumentViewModel(inst, repo));

  const logoSrc = CUSTOM_LOGOS[slug.toLowerCase()];
  const primarySectorSlug = getPrimarySectorSlug(slug);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-card border-b border-border py-4">
        {/* Research Ecosystem Background SVG */}
        <InstitutionEcosystemBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/#institutions" className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Institutions
          </Link>
          <div className="flex items-center gap-3">
            {/* Visual Identity logo or fallback sector icon */}
            {logoSrc ? (
              <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-border shadow-sm p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt={institution.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                {getSectorIcon(primarySectorSlug, 'var(--accent)', 26)}
              </div>
            )}
            <div>
              <h1 className="text-lg md:text-xl font-heading font-bold text-heading leading-tight">{institution.name}</h1>
              <p className="text-xs text-text-secondary mt-0.5">
                {institution.tech_count} {institution.tech_count === 1 ? 'instrument' : 'instruments'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <InstitutionFilterView initialInstruments={institutionViewModels} />
      </div>
    </div>
  );
}
