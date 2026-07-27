// ============================================================
// RINK AI Search API Route
// POST /api/ai-search  { query: string }
// Returns matched technologies from the live Google Sheets DB
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { runAISearch } from '@/lib/aiSearch';
import { fetchInstrumentBundle } from '@/lib/dataFetcher';
import { InstitutionRepository } from '@/repositories/InstitutionRepository';
import { toInstrumentViewModel } from '@/domain/instrument/mapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query: string = (body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query too long' },
        { status: 400 }
      );
    }

    // Fetch bundle and initialize repository
    const bundle = await fetchInstrumentBundle();
    const repo = InstitutionRepository.fromInstrumentData(bundle.main_data, bundle.instituitiion_list, bundle.mou_list);

    // Run AI search scoring
    const result = await runAISearch(query, bundle.main_data);

    // Map matched instruments to InstrumentViewModel on the server
    const mappedResults = {
      ...result,
      results: result.results.map(r => ({
        ...r,
        viewModel: toInstrumentViewModel(r.instrument, repo)
      }))
    };

    return NextResponse.json(mappedResults);
  } catch (err) {
    console.error('[RINK AI] Search error:', err);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Also support GET for quick testing
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  const bundle = await fetchInstrumentBundle();
  const repo = InstitutionRepository.fromInstrumentData(bundle.main_data, bundle.instituitiion_list, bundle.mou_list);
  const result = await runAISearch(query, bundle.main_data);

  const mappedResults = {
    ...result,
    results: result.results.map(r => ({
      ...r,
      viewModel: toInstrumentViewModel(r.instrument, repo)
    }))
  };

  return NextResponse.json(mappedResults);
}
