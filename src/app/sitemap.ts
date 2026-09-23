import { MetadataRoute } from 'next';
import { fetchInstrumentBundle, fetchDataset } from '@/lib/dataFetcher';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://instruments.startupmission.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/instruments',
    '/services',
    '/about',
    '/contact',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // 2. Fetch all dynamic data
    const bundle = await fetchInstrumentBundle();
    const services = await fetchDataset('services');

    // 3. Dynamic Instruments
    const instrumentRoutes = (bundle.main_data || []).map((instrument) => ({
      url: `${baseUrl}/instruments/${instrument.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 4. Dynamic Services
    const serviceRoutes = (services || []).map((service) => ({
      url: `${baseUrl}/services/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 5. Dynamic Institutions
    const institutionRoutes = (bundle.instituitiion_list || [])
      .filter((inst: { name?: string }) => inst && inst.name)
      .map((inst: { name: string }) => ({
      // Clean slug generation assuming standard formatting
      url: `${baseUrl}/institutions/${inst.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...institutionRoutes, ...instrumentRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Graceful fallback to just static routes if API is completely down
    return staticRoutes;
  }
}
