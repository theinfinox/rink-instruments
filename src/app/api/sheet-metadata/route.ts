import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get('spreadsheetId');
  const gid = searchParams.get('gid');

  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Missing spreadsheetId' }, { status: 400 });
  }

  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`;
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch CSV: HTTP ${response.status}` }, { status: response.status });
    }
    
    const csvText = await response.text();
    
    // Parse just the first line (headers)
    const firstLine = csvText.split(/\r?\n/)[0];
    if (!firstLine) {
      return NextResponse.json({ error: 'Empty CSV returned' }, { status: 400 });
    }

    // Split by comma, respecting quotes if papaparse is too heavy for an API route
    // But since this is a simple extraction, a regex works well enough for headers.
    // Or we can just do a simple split and trim for now, as headers rarely contain complex commas.
    const rawHeaders = firstLine.split(',').map(h => {
      // Remove leading/trailing quotes if present
      let clean = h.trim();
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.substring(1, clean.length - 1);
      }
      return clean;
    });

    // Apply the exact same snake_case transformation as rink-git-cron's sync.js
    const headers = rawHeaders.map((header, idx) => {
      let cleanHeader = header.toString().toLowerCase()
          .replace(/[^a-z0-9]+/g, '_') 
          .replace(/^_+|_+$/g, '');
      
      if (cleanHeader === 'fid') cleanHeader = 'id';
      if (cleanHeader === 'instrtnents') cleanHeader = 'instruments';
      
      return cleanHeader || `column_${idx + 1}`;
    });

    return NextResponse.json({ columns: headers });
  } catch (error) {
    console.error('Error fetching sheet metadata:', error);
    return NextResponse.json({ error: 'Failed to process sheet metadata' }, { status: 500 });
  }
}
