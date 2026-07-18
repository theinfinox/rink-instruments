// ============================================================
// RINK Instruments and Services Portal — Orama Search API
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

    const dataset = body.dataset || 'instruments';

    // Perform Orama search
    const searchResult = await oramaSearch(dataset, query, body.filters, 12);

    // Build response message
    const count = searchResult.totalFound;
    const itemLabel = dataset === 'services' ? 'service' : 'technology';
    const itemLabelPlural = dataset === 'services' ? 'services' : 'technologies';
    const responseMessage = count === 0
      ? `No ${itemLabelPlural} found matching **"${query}"**. Try a different keyword or browse by sector.`
      : `Found **${count} ${count === 1 ? itemLabel : itemLabelPlural}** matching **"${query}"**:`;

    return NextResponse.json({
      results: searchResult.results.map(r => ({
        instrument: r.item, // kept as instrument for legacy chat UI support
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
