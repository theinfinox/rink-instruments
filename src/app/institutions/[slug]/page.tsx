import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe } from 'lucide-react';
import InstitutionFilterView from './InstitutionFilterView';
import InstitutionEcosystemBackground from '@/components/ui/InstitutionEcosystemBackground';
import InstitutionHeaderLogo from '@/components/ui/InstitutionHeaderLogo';
import MouBadge from '@/components/ui/MouBadge';
import SubsidizedClaimSection from '@/components/ui/SubsidizedClaimSection';
import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';
import { getImageUrl, getSafeUrl } from '@/lib/utils';

async function getRepo() {
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(
    bundle.main_data,
    bundle.instituitiion_list,
    bundle.mou_list,
    bundle.subsidized_list
  );
  return { repo, instruments: bundle.main_data };
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string }>;
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

  const metaDescription = `Explore ${inst.tech_count} scientific instruments and testing facilities from ${inst.name}. Partner with top Kerala research institutions through the RINK Instruments and Services Portal.`;

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

const LOCAL_LOGOS: Record<string, string> = {
  'cochin-university-of-science-and-technology-cusat': '/images/institutions/cusat.webp',
  'cusat': '/images/institutions/cusat.webp',
  'icar-cpcri': '/images/institutions/cpcri.png',
  'cpcri': '/images/institutions/cpcri.png',
  'icar-ctcri': '/images/institutions/ctcri.png',
  'ctcri': '/images/institutions/ctcri.png',
  'kufos': '/images/institutions/kufos-kochi.jpg',
  'kerala-university-of-fisheries-and-ocean-studies-kufos': '/images/institutions/kufos-kochi.jpg',
  'iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'indian-institute-of-technology-palakkad-iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'iiser-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'indian-institute-of-science-education-and-research-thiruvananthapuram-iiser-tvm': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'kscste-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jawaharlal-nehru-tropical-botanic-garden-research-institute-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'centre-for-water-resources-development-and-management-cwrdm': '/images/institutions/cwrdm.jpg',
  'cwrdm': '/images/institutions/cwrdm.jpg',
  'csir-niist': '/images/institutions/csir-niist.png',
  'c-dac': '/images/institutions/cdac.png',
  'cdac': '/images/institutions/cdac.png',
  'c-met': '/images/institutions/c-met.png',
  'iisr': '/images/institutions/iisr.png',
  'kau': '/images/institutions/kau.png',
  'sctimst': '/images/institutions/sctimst.jpg',
  'rgcb': '/images/institutions/rgcb.jpg',
  'iav': '/images/institutions/iav.jpg',
};



function getAcronym(name: string): string {
  const match = name.match(/\(([^)]+)\)/);
  if (match && match[1]) return match[1].trim();
  const upper = name.toUpperCase();
  if (upper.includes('DOCTOR JOHN')) return 'DJBC';
  if (upper.includes('PHYTOCOM')) return 'PHYTOCOM';
  if (upper.includes('BAGMO')) return 'BAGMO';
  if (upper.includes('CUSAT')) return 'CUSAT';
  if (upper.includes('IIT')) return 'IIT';
  if (upper.includes('IISER')) return 'IISER';
  if (upper.includes('NIT')) return 'NIT';
  if (upper.includes('KFRI')) return 'KFRI';
  if (upper.includes('JNTBGRI')) return 'JNTBGRI';
  if (upper.includes('CWRDM')) return 'CWRDM';
  if (upper.includes('CPCRI')) return 'CPCRI';
  if (upper.includes('CTCRI')) return 'CTCRI';
  if (upper.includes('KUFOS')) return 'KUFOS';
  if (upper.includes('CDAC') || upper.includes('C-DAC')) return 'C-DAC';
  if (upper.includes('CMET') || upper.includes('C-MET')) return 'C-MET';
  if (upper.includes('SCTIMST')) return 'SCTIMST';
  if (upper.includes('RGCB')) return 'RGCB';
  if (upper.includes('NIIST')) return 'NIIST';

  // Generate clean initialism from significant words
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => !['for', 'and', 'the', 'of', 'in', 'at', 'centre', 'center'].includes(w.toLowerCase()));
  
  if (words.length >= 2) {
    return words.slice(0, 4).map(w => w[0].toUpperCase()).join('');
  }
  return name.slice(0, 4).toUpperCase();
}

export default async function InstitutionDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const from = resolvedSearchParams?.from;

  const backTarget = from === 'partnerships' ? '/#exclusive-partnerships' : '/#institutions';
  const backLabel = from === 'partnerships' ? 'Subsidized Partnerships' : 'All Institutions';

  const { repo, instruments } = await getRepo();
  const institution = repo.getBySlug(slug);

  if (!institution) notFound();

  // Filter instruments using canonical institution_id (with name slug fallback)
  const institutionInstruments = instruments.filter(inst => {
    if (institution.institution_id && inst.institution_id) {
      return inst.institution_id === institution.institution_id;
    }
    return repo.getInstitution(inst).slug === slug;
  });

  const institutionViewModels = institutionInstruments.map(inst =>
    toInstrumentViewModel(inst, repo)
  );

  // Authoritative Logo Resolution:
  // 1. Check official database logo_link (primary authoritative crest)
  // 2. Check local static logos
  // 3. Check original_logo_link
  const normalizedSlug = slug.toLowerCase();
  const rawLogoLink = institution.logo_link || institution.original_logo_link;
  const logoSrc =
    (rawLogoLink ? getImageUrl(rawLogoLink) : null) ||
    LOCAL_LOGOS[normalizedSlug] ||
    null;

  const acronym = getAcronym(institution.name);
  const subsidizedPolicy = repo.getSubsidizedPolicy(institution.institution_id);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      {/* ── Institution Header ── */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 py-8 sm:py-10">
        {/* Ambient Ecosystem Background SVG */}
        <InstitutionEcosystemBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href={backTarget}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A2164] transition-colors mb-4 font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Institution Brand Logo */}
            <InstitutionHeaderLogo
              src={logoSrc}
              alt={institution.name}
              acronym={acronym}
            />

            {/* Title & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-[#0A2164] border border-blue-200/80">
                  {acronym}
                </span>

                {institution.has_verified_mou && (
                  <MouBadge
                    hasVerifiedMou={true}
                    variant="detailed"
                    details={institution.mou_details}
                  />
                )}

                {institution.is_startup && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                    Startup Facility
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-slate-900 leading-tight mb-2">
                {institution.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans">
                <span>
                  <strong className="text-slate-800 font-semibold">{institution.tech_count}</strong>{' '}
                  {institution.tech_count === 1 ? 'instrument' : 'instruments'} available
                </span>

                {institution.district && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{institution.district}</span>
                  </span>
                )}

                {getSafeUrl(institution.website) !== '#' && (
                  <a
                    href={getSafeUrl(institution.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0A2164] hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Portal</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 space-y-8">
        {subsidizedPolicy && subsidizedPolicy.hasSubsidizedRates && (
          <SubsidizedClaimSection
            policy={subsidizedPolicy}
            institutionName={institution.name}
          />
        )}
        <InstitutionFilterView
          initialInstruments={institutionViewModels}
          institutionName={institution.name}
        />
      </div>
    </div>
  );
}
