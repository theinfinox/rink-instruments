import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import TechListClient from './TechListClient';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { precisionSearch } from '@/lib/searchEngine';
import { SearchIndexItem } from '@/types';
import { Instrument } from '@/types/instrument';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';

export const metadata = {
  title: 'All Instruments — RINK Instruments and Services Portal',
  description: 'Browse all instruments from Kerala research institutions. Filter by sector, institution, type, and more.',
};

interface Props {
  searchParams: Promise<{
    q?: string;
    sector?: string;
    institution?: string;
    district?: string;
    patent?: string;
    potential?: string;
    page?: string;
  }>;
}

export default async function TechnologiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);

  // Fetch Instrumentation Bundle (main_data + instituitiion_list)
  const bundle = await fetchInstrumentBundle();
  const instruments = bundle.main_data;
  const rawInstitutions = bundle.instituitiion_list;
  
  const repo = InstitutionRepository.fromInstrumentData(instruments, rawInstitutions, bundle.mou_list);
  const institutions = repo.getAll();

  // Extract Categories (Tags), Districts, and Verification Statuses
  const sectorMap = new Map<string, { slug: string, name: string, tech_count: number, icon: string, color: string }>();
  const districtSet = new Set<string>();
  const statusSet = new Set<string>();

  instruments.forEach(inst => {
    const rawTags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    rawTags.forEach((t) => {
      const name = t.trim();
      if (!name) return;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!sectorMap.has(slug)) {
        sectorMap.set(slug, { slug, name, tech_count: 0, icon: 'cpu', color: 'blue' });
      }
      sectorMap.get(slug)!.tech_count++;
    });

    if (inst.standardized_district) districtSet.add(inst.standardized_district.trim());
    if (inst.warnings) statusSet.add(inst.warnings.trim());
  });

  const sectors = Array.from(sectorMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  const districts = Array.from(districtSet).filter(Boolean).sort();
  const statuses = Array.from(statusSet).filter(Boolean).sort();

  // Build SearchIndex for precision search engine
  const searchIndex: SearchIndexItem[] = instruments.map(inst => {
    const tags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    const sectorName = tags.length > 0 ? tags[0].trim() : 'General';
    const instEntity = repo.getInstitution(inst);
    
    return {
      id: inst.provider_key || inst.id || '',
      name: inst.instruments || '',
      institution: instEntity.name,
      institution_slug: instEntity.slug,
      institution_id: instEntity.institution_id || inst.institution_id || '',
      category: sectorName,
      category_slug: sectorName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ip_status: inst.warnings || '',
      trl: inst.standardized_district || '',
      keywords: tags,
      problem_solved: inst.name_of_facility || '',
      description: inst.address || '',
    };
  });

  // Basic filtering & unified precision search ranking
  let filtered = instruments;

  if (params.q && params.q.trim()) {
    const scoredResults = await precisionSearch(params.q, searchIndex);
    const instMap = new Map(instruments.map(i => [i.provider_key || i.id || '', i]));
    
    filtered = scoredResults
      .map(item => instMap.get(item.id))
      .filter((inst): inst is Instrument => inst !== undefined);
  }

  if (params.sector) {
    const sectorQuery = params.sector;
    filtered = filtered.filter(i => {
      const tags = Array.isArray(i.tag) ? i.tag : (i.tag ? i.tag.split(',') : []);
      return tags.some(t => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') === sectorQuery);
    });
  }

  if (params.institution) {
    const institutionQuery = params.institution;
    const matchedInst = repo.getBySlug(institutionQuery);
    filtered = filtered.filter(i => {
      if (matchedInst?.institution_id && i.institution_id) {
        return i.institution_id === matchedInst.institution_id;
      }
      return i.institution_name && i.institution_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === institutionQuery;
    });
  }

  if (params.district) {
    const districtQuery = params.district.toLowerCase();
    filtered = filtered.filter(i => i.standardized_district && i.standardized_district.toLowerCase() === districtQuery);
  }

  if (params.patent) {
    const patentQuery = params.patent;
    filtered = filtered.filter(i => i.warnings === patentQuery);
  }

  const perPage = 12;
  const paginatedInstruments = filtered.slice((page - 1) * perPage, page * perPage);

  // Map instruments to InstrumentViewModels ON THE SERVER with full InstitutionRepository & MoU context
  const paginatedViewModels = paginatedInstruments.map(inst => toInstrumentViewModel(inst, repo));

  const result = {
    technologies: paginatedViewModels,
    total: filtered.length,
    page,
    per_page: perPage
  };

  return (
    <TechListClient
      initialResult={result}
      sectors={sectors}
      institutions={institutions}
      patentStatuses={statuses}
      districts={districts}
      totalCount={instruments.length}
      initialFilters={{
        q: params.q ?? '',
        sector: params.sector ?? '',
        institution: params.institution ?? '',
        district: params.district ?? '',
        patent: params.patent ?? '',
        potential: params.potential ?? '',
      }}
    />
  );
}
