import { fetchDataset } from '@/lib/dataFetcher';
import { Service } from '@/types/service';
import ServiceListClient from './ServiceListClient';

export const metadata = {
  title: 'All Services — RINK Services Portal',
  description: 'Browse all services from Kerala startups. Filter by category, startup, district, and more.',
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

  const services: Service[] = await fetchDataset('services');
  
  const categoryMap = new Map<string, { slug: string, name: string }>();
  const startupMap = new Map<string, { slug: string, name: string }>();
  const districtSet = new Set<string>();
  const certificationSet = new Set<string>();

  services.forEach(svc => {
    if (svc.startupName) {
      const name = svc.startupName;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!startupMap.has(slug)) {
        startupMap.set(slug, { slug, name });
      }
    }

    if (svc.category) {
      const name = svc.category.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, { slug, name });
      }
    }

    if (svc.district) districtSet.add(svc.district.trim());
    if (svc.certifications) certificationSet.add(svc.certifications.trim());
  });

  const startups = Array.from(startupMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const categories = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const districts = Array.from(districtSet).filter(Boolean).sort();
  const certifications = Array.from(certificationSet).filter(Boolean).sort();

  let filtered = services;
  
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(s => 
      (s.serviceName && s.serviceName.toLowerCase().includes(q)) || 
      (s.startupName && s.startupName.toLowerCase().includes(q)) ||
      (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q)))
    );
  }
  if (params.category) {
    const categoryQuery = params.category;
    filtered = filtered.filter(s => 
      s.category && s.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categoryQuery
    );
  }
  if (params.startup) {
    const startupQuery = params.startup;
    filtered = filtered.filter(s => 
      s.startupName && s.startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === startupQuery
    );
  }
  if (params.district) {
    const districtQuery = params.district.toLowerCase();
    filtered = filtered.filter(s => 
      s.district && s.district.toLowerCase() === districtQuery
    );
  }
  if (params.certification) {
    const certQuery = params.certification;
    filtered = filtered.filter(s => s.certifications === certQuery);
  }

  const perPage = 12;
  const paginatedServices = filtered.slice((page - 1) * perPage, page * perPage);

  const result = {
    services: paginatedServices,
    total: filtered.length,
    page,
    per_page: perPage
  };

  return (
    <ServiceListClient
      initialResult={result}
      categories={categories}
      startups={startups}
      certifications={certifications}
      districts={districts}
      totalCount={services.length}
      initialFilters={{
        q: params.q ?? '',
        category: params.category ?? '',
        startup: params.startup ?? '',
        district: params.district ?? '',
        certification: params.certification ?? '',
      }}
    />
  );
}
