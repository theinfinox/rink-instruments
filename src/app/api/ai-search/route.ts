// ============================================================
// RINK AI Search API Route
// POST /api/ai-search  { query: string }
// Returns matched technologies from the live Google Sheets DB
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { runAISearch } from '@/lib/aiSearch';
import { CDN_HOST } from '@/lib/utils';
import { Instrument } from '@/types/instrument';

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

    // Fetch all instruments from live CDN
    const res = await fetch(`${CDN_HOST}/instrument.json`);
    const data = await res.json();
    const instruments: Instrument[] = data.main_data || [];

    // Run AI search scoring
    const result = await runAISearch(query, instruments);

    return NextResponse.json(result);
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
  const res = await fetch(`${CDN_HOST}/instrument.json`);
  const data = await res.json();
  const instruments: Instrument[] = data.main_data || [];
  const result = await runAISearch(query, instruments);
  return NextResponse.json(result);
}
