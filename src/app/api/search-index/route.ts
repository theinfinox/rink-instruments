import { NextResponse } from 'next/server';
import { Instrument } from '@/types/instrument';
import { SearchIndexItem } from '@/types';
import { CDN_HOST } from '@/lib/utils';

export const revalidate = 60; // 1 minute

export async function GET() {
  try {
    const res = await fetch(`${CDN_HOST}/instrument.json`);
    const data = await res.json();
    const instruments: Instrument[] = data.main_data || [];
    
    const index: SearchIndexItem[] = instruments.map(inst => {
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
