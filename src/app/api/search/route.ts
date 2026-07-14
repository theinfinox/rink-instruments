// ============================================================
// RINK Technology Transfer Portal — Orama Search API
// Replaces Gemini-based /api/ai-search for technology queries
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { oramaSearch, isConversational, getConversationalReply } from '@/lib/oramaSearch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = (body.query || '').trim();

    if (!query) {
      return NextResponse.json({
        results: [],
        query: '',
        intent: 'empty',
        responseMessage: 'Please describe what you are looking for.',
        totalFound: 0,
      });
    }

    // Handle conversational queries
    if (isConversational(query)) {
      return NextResponse.json({
        results: [],
        query,
        intent: 'greeting',
        responseMessage: getConversationalReply(query),
        totalFound: 0,
      });
    }

    // Perform Orama search
    const searchResult = await oramaSearch(query, body.filters, 12);

    // Build response message
    const count = searchResult.totalFound;
    const responseMessage = count === 0
      ? `No technologies found matching **"${query}"**. Try a different keyword or browse by sector.`
      : `Found **${count} ${count === 1 ? 'technology' : 'technologies'}** matching **"${query}"**:`;

    return NextResponse.json({
      results: searchResult.results.map(r => ({
        instrument: r.instrument,
        score: r.score,
        matchedOn: [],
      })),
      query,
      intent: 'search',
      responseMessage,
      totalFound: count,
      elapsed: searchResult.elapsed,
    });
  } catch (error) {
    console.error('[RINK Search] Error:', error);
    return NextResponse.json(
      { results: [], query: '', intent: 'empty', responseMessage: 'Search temporarily unavailable.', totalFound: 0 },
      { status: 500 }
    );
  }
}
