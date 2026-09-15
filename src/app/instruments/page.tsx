import { fetchInstrumentBundle, fetchDistrictTaxonomy } from '@/lib/dataFetcher';
import TechListClient from './TechListClient';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { precisionSearch, buildSearchIndex } from '@/lib/searchEngine';
import { SearchIndexItem } from '@/types';
import { Instrument } from '@/types/instrument';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';

import type { Metadata } from 'next';

type SearchParamsProps = {
  searchParams: Promise<{
    q?: string;
    sector?: string;
    institution?: string;
    district?: string;
    patent?: string;
    potential?: string;
    mou?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: SearchParamsProps): Promise<Metadata> {
  const params = await searchParams;
  
  if (params.district) {
    const districtName = params.district.charAt(0).toUpperCase() + params.district.slice(1).toLowerCase();
    const metaDescription = `Browse instruments and research facilities located in ${districtName}. Filter by sector, institution, and more on RINK.`;
    return {
      title: `Instruments in ${districtName} — RINK Kerala`,
      description: metaDescription,
      openGraph: {
        title: `Instruments in ${districtName} — RINK Kerala`,
        description: metaDescription,
        images: [`/images/districts/${params.district.toLowerCase()}.webp`],
        type: 'website',
      },
    };
  }

  // Fallback for all instruments without district filter
  return {
    title: 'All Instruments — RINK Instruments and Services Portal',
    description: 'Browse all instruments from Kerala research institutions. Filter by sector, institution, type, and more.',
  };
}

interface Props extends SearchParamsProps {}

export default async function TechnologiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);

  // Fetch Instrumentation Bundle and Backend District Taxonomy concurrently
  const [bundle, backendDistricts] = await Promise.all([
    fetchInstrumentBundle(),
    fetchDistrictTaxonomy(),
  ]);

  const instruments = bundle.main_data;
  const rawInstitutions = bundle.instituitiion_list;
  
  const repo = InstitutionRepository.fromInstrumentData(instruments, rawInstitutions, bundle.mou_list, bundle.subsidized_list);
  const institutions = repo.getAll();

  // Extract Categories (Tags), Districts, and Verification Statuses as fallback
  const sectorMap = new Map<string, { slug: string, name: string, tech_count: number, icon: string, color: string }>();
  const datasetDistrictSet = new Set<string>();
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

    if (inst.standardized_district) datasetDistrictSet.add(inst.standardized_district.trim());
    if (inst.warnings) statusSet.add(inst.warnings.trim());
  });

  const sectors = Array.from(sectorMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  // Prioritize official 14 Kerala districts from sheets.yaml, fallback to dataset
  const districts = backendDistricts && backendDistricts.length > 0
    ? backendDistricts
    : Array.from(datasetDistrictSet).filter(Boolean).sort();
  const statuses = Array.from(statusSet).filter(Boolean).sort();

  // Canonical case resolution for district parameter (e.g. "thiruvananthapuram" -> "Thiruvananthapuram")
  const canonicalDistrict = params.district
    ? (districts.find(d => d.toLowerCase() === params.district?.toLowerCase()) || params.district)
    : '';

  const searchIndex = buildSearchIndex(instruments, repo);

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

  if (canonicalDistrict) {
    const { normalizeDistrict } = require('@/lib/districtUtils');
    const target = normalizeDistrict(canonicalDistrict);
    filtered = filtered.filter(i => 
      normalizeDistrict(i.standardized_district) === target || 
      normalizeDistrict(i.district) === target
    );
  }

  if (params.patent) {
    const patentQuery = params.patent;
    filtered = filtered.filter(i => i.warnings === patentQuery);
  }

  const isMouOnly = params.mou === 'true' || params.mou === '1';
  if (isMouOnly) {
    filtered = filtered.filter(i => {
      const instEntity = repo.getInstitution(i);
      return instEntity.has_verified_mou === true;
    });
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

  const clientKey = `instruments-${params.q ?? ''}-${canonicalDistrict}-${params.institution ?? ''}-${params.sector ?? ''}-${isMouOnly ? 'mou' : ''}-${page}`;

  return (
    <TechListClient
      key={clientKey}
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
        district: canonicalDistrict,
        patent: params.patent ?? '',
        potential: params.potential ?? '',
        mou: isMouOnly ? 'true' : '',
      }}
    />
  );
}
