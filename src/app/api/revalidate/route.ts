// ============================================================
// RINK Technology Explorer — Manual Revalidation Endpoint
//
// Clears the in-memory sheet cache AND triggers Next.js ISR
// revalidation for all key pages.
//
// Usage (from browser or cURL):
//   GET /api/revalidate?secret=rink-refresh-2024
//
// You can call this right after editing the Google Sheet to
// see changes instantly without waiting 5 minutes.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Simple secret token to prevent accidental or malicious revalidation
// Change this value if you want a different password
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'rink-refresh-2024';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret. Add ?secret=rink-refresh-2024 to the URL.' },
      { status: 401 }
    );
  }

  try {
    // 2. Revalidate all key pages in Next.js ISR cache
    revalidatePath('/');
    revalidatePath('/instruments');
    revalidatePath('/categories');
    revalidatePath('/institutions');
    revalidatePath('/api/search-index');

    const timestamp = new Date().toISOString();
    console.log(`[RINK] Manual revalidation triggered at ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: 'Cache cleared! All pages will reload fresh data from Google Sheets.',
      revalidated_at: timestamp,
      pages_cleared: [
        '/',
        '/instruments',
        '/categories',
        '/institutions',
        '/api/search-index',
      ],
    });
  } catch (err) {
    console.error('[RINK] Revalidation error:', err);
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(err) },
      { status: 500 }
    );
  }
}
