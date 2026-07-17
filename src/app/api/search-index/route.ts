import { NextResponse } from 'next/server';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import { SearchIndexItem } from '@/types';
import { fetchDataset, DatasetType } from '@/lib/dataFetcher';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataset = (searchParams.get('dataset') as DatasetType) || 'instruments';

    const items = await fetchDataset(dataset);
    
    let index: SearchIndexItem[] = [];

    if (dataset === 'instruments') {
      const instruments = items as Instrument[];
      index = instruments.map(inst => {
        const tags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
        const sectorName = tags.length > 0 ? tags[0].trim() : 'General';
        
        return {
          id: inst.provider_key || inst.id || '',
          name: inst.instruments || '',
          institution: inst.institution_name || '',
          institution_slug: (inst.institution_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category: sectorName,
          category_slug: sectorName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ip_status: inst.warnings || '',
          trl: inst.standardized_district || '',
          keywords: tags,
          problem_solved: inst.name_of_facility || '',
          description: inst.address || '',
        };
      });
    } else {
      const services = items as Service[];
      index = services.map(srv => {
        return {
          id: srv.id || srv.serviceName, 
          name: srv.serviceName,
          institution: srv.startupName,
          institution_slug: srv.startupName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
