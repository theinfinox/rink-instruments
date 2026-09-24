import { NextResponse } from 'next/server';
import { Service } from '@/types/service';
import { SearchIndexItem } from '@/types';
import { fetchDataset, fetchInstrumentBundle, DatasetType } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { buildSearchIndex } from '@/lib/searchEngine';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataset = (searchParams.get('dataset') as DatasetType) || 'instruments';

    let index: SearchIndexItem[] = [];

    if (dataset === 'instruments') {
      const bundle = await fetchInstrumentBundle();
      const instruments = bundle.main_data;
      const repo = InstitutionRepository.fromInstrumentData(
        instruments, 
        bundle.instituitiion_list, 
        bundle.subsidized_list
      );

      index = buildSearchIndex(instruments, repo);
    } else {
      const services = await fetchDataset('services') as Service[];
      index = services.map(srv => {
        return {
          id: srv.id || srv.serviceName, 
          name: srv.serviceName,
          institution: srv.startupName,
          institution_slug: srv.startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          institution_id: srv.ksumUid || '',
          category: srv.category,
          category_slug: srv.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ip_status: srv.certifications || '',
          trl: srv.district || '',
          keywords: srv.keywords,
          problem_solved: srv.sector,
          description: srv.description,
        };
      });
    }

    return NextResponse.json(index, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error("Failed to fetch search index:", error);
    return NextResponse.json([], { status: 500 });
  }
}
