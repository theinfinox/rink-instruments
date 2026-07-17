import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';
import TechListClient from './TechListClient';

export const metadata = {
  title: 'All Instruments — RINK Technology Transfer Portal',
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

  // Fetch Instrumentation Data
  const res = await fetch(`${CDN_HOST}/instrument.json`);
  const data = await res.json();
  const instruments: Instrument[] = data.main_data || [];
  
  // Extract Institutions, Categories (Tags), Districts, and Verification Statuses
  const sectorMap = new Map<string, { slug: string, name: string, tech_count: number, icon: string, color: string }>();
  const institutionMap = new Map<string, { slug: string, name: string, tech_count: number }>();
  const districtSet = new Set<string>();
  const statusSet = new Set<string>();

  instruments.forEach(inst => {
    if (inst.institution_name) {
      const name = inst.institution_name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!institutionMap.has(slug)) {
        institutionMap.set(slug, { slug, name, tech_count: 0 });
      }
      institutionMap.get(slug)!.tech_count++;
    }

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
    if (inst.warnings) statusSet.add(inst.warnings.trim()); // 'verified', 'attention', etc.
  });

  const institutions = Array.from(institutionMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  const sectors = Array.from(sectorMap.values()).sort((a, b) => b.tech_count - a.tech_count);
  const districts = Array.from(districtSet).filter(Boolean).sort();
  const statuses = Array.from(statusSet).filter(Boolean).sort();

  // Basic filtering
  let filtered = instruments;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(i => 
      (i.instruments && i.instruments.toLowerCase().includes(q)) || 
      (i.institution_name && i.institution_name.toLowerCase().includes(q))
    );
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
    filtered = filtered.filter(i => i.institution_name && i.institution_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === institutionQuery);
  }
  if (params.district) {
    const districtQuery = params.district.toLowerCase();
    filtered = filtered.filter(i => i.standardized_district && i.standardized_district.toLowerCase() === districtQuery);
  }
  if (params.patent) {
    // using 'patent' query param for verification status
    const patentQuery = params.patent;
    filtered = filtered.filter(i => i.warnings === patentQuery);
  }

  const perPage = 12;
  const paginatedInstruments = filtered.slice((page - 1) * perPage, page * perPage);

  const result = {
    technologies: paginatedInstruments,
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
