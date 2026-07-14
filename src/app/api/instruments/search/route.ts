import { NextRequest, NextResponse } from 'next/server';
import { create, insertMultiple, search as oramaSearch } from '@orama/orama';
import { CDN_HOST } from '@/lib/utils';

// Global cache for the Orama DB in a server environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalDb: any = null;

async function getSearchIndex() {
  if (globalDb) return globalDb;

  try {
    const dataResponse = await fetch(`${CDN_HOST}/instrument.json`);
    if (!dataResponse.ok) throw new Error('Failed to fetch instrument.json');

    const data = await dataResponse.json();
    const rawData = data.main_data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tabRows: any[] = [];
    if (Array.isArray(rawData)) {
      tabRows = rawData;
    } else {
      for (const key of Object.keys(rawData)) {
        tabRows = tabRows.concat(rawData[key]);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeData = tabRows.map((item: any) => {
      const instruments = item.instruments || '';
      const instruments1 = item.column_3 || item.instruments1 || '';

      return {
        id: item.id || '',
        search_instruments: instruments.replace(/[-_/]/g, ' ').toLowerCase(),
        search_instruments1: instruments1.replace(/[-_/]/g, ' ').toLowerCase(),
        instruments,
        instruments1,
        acronym: item.acronym || '',
        district: item.district || '',
        name_of_facility: item.name_of_facility || '',
        institution_name: item.institution_name || '',
        address: item.address || '',
        standardized_district: item.standardized_district || item.district || '',
        correct_provider_key: item.correct_provider_key || '',
        tag: Array.isArray(item.tag) ? item.tag.join(', ') : (item.tag || ''),
      };
    });

    globalDb = await create({
      schema: {
        id: 'string', // crucial for returning IDs
        search_instruments: 'string',
        search_instruments1: 'string',
        instruments: 'string',
        instruments1: 'string',
        acronym: 'string',
        district: 'string',
        name_of_facility: 'string',
        institution_name: 'string',
        address: 'string',
        standardized_district: 'string',
        correct_provider_key: 'string',
        tag: 'string',
      },
    });

    await insertMultiple(globalDb, safeData);
    return globalDb;
  } catch (error) {
    console.error("Failed to build server-side Orama index:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ hits: [] });
  }

  const db = await getSearchIndex();
  if (!db) {
    return NextResponse.json({ error: 'Failed to initialize search index' }, { status: 500 });
  }

  const isUppercase = q === q.toUpperCase() && /[A-Z]/.test(q);
  const isShortWord = q.length >= 2 && q.length <= 6 && !q.includes(' ');
  const hasTrailingSpace = q.endsWith(' ');
  const cleanQuery = q.trim();
  const forceExactMatch = (isUppercase && isShortWord) || (hasTrailingSpace && cleanQuery.length > 0);
  const normalizedTerm = cleanQuery.replace(/[-_/]/g, ' ').toLowerCase();

  const results = await oramaSearch(db, {
    term: normalizedTerm,
    limit: 1000,
    properties: ['search_instruments', 'search_instruments1', 'institution_name'],
    boost: {
      search_instruments: 100,
      search_instruments1: 80,
      institution_name: 40
    },
    exact: forceExactMatch,
    tolerance: forceExactMatch ? 0 : 1,
  });

  // Only return the IDs to keep the network payload extremely small!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ids = results.hits.map((hit: any) => hit.document.id);

  return NextResponse.json({ hits: ids });
}
