import { fetchDataset, fetchDistrictTaxonomy } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import ServiceListClient from './ServiceListClient';

export const metadata = {
  title: 'All Services — RINK Services Portal',
  description: 'Browse all services from Kerala startups. Filter by district and search capabilities.',
};

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    startup?: string;
    district?: string;
    certification?: string;
    page?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? '1', 10);

  // Concurrently fetch services and backend district taxonomy (governed by sheets.yaml)
  const [services, backendDistricts] = await Promise.all([
    fetchDataset('services') as Promise<Service[]>,
    fetchDistrictTaxonomy(),
  ]);

  // Combine backend taxonomy districts with any districts present in the dataset
  const districtSet = new Set<string>(backendDistricts);
  services.forEach(svc => {
    if (svc.district) districtSet.add(svc.district.trim());
  });
  const districts = Array.from(districtSet).filter(Boolean);

  // Case-insensitive canonical district resolution
  const districtParam = params.district?.trim();
  const canonicalDistrict = districtParam 
    ? districts.find(d => d.toLowerCase() === districtParam.toLowerCase()) || districtParam
    : '';

  let filtered = services;
  
  if (params.q) {
    const q = params.q.toLowerCase().trim();
    filtered = filtered.filter(s => 
      (s.serviceName && s.serviceName.toLowerCase().includes(q)) || 
      (s.startupName && s.startupName.toLowerCase().includes(q)) ||
      (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q)))
    );
  }

  if (canonicalDistrict) {
    const districtLower = canonicalDistrict.toLowerCase();
    filtered = filtered.filter(s => 
      s.district && s.district.toLowerCase() === districtLower
    );
  }

  // Preserve compatibility if category or startup is passed via legacy URL
  if (params.category) {
    const catQuery = params.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    filtered = filtered.filter(s => 
      s.category && s.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === catQuery
    );
  }
  if (params.startup) {
    const startupQuery = params.startup.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    filtered = filtered.filter(s => 
      s.startupName && s.startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === startupQuery
    );
  }

  const perPage = 12;
  const paginatedServices = filtered.slice((page - 1) * perPage, page * perPage);

  const result = {
    services: paginatedServices,
    total: filtered.length,
    page,
    per_page: perPage
  };

  const filterKey = `${canonicalDistrict}_${params.q ?? ''}_${page}`;

  return (
    <ServiceListClient
      key={filterKey}
      initialResult={result}
      districts={districts}
      totalCount={services.length}
      initialFilters={{
        q: params.q?.trim() ?? '',
        district: canonicalDistrict,
      }}
    />
  );
}
