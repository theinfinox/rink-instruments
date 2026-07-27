// ============================================================
// RINK Instruments and Services Portal — Orama Search Engine
// High-performance full-text search with typo tolerance
// Replaces Gemini as primary search. Google Sheet remains source of truth.
// ============================================================

import { create, insert, search } from '@orama/orama';
import { Instrument } from '@/types/instrument';
import { Service } from '@/types/service';
import { fetchDataset, DatasetType } from '@/lib/dataFetcher';

// ── Orama schema with faceted metadata fields ───────────────────
const SCHEMA = {
  id: 'string' as const,
  name: 'string' as const,
  institution: 'string' as const,
  institutionId: 'string' as const,
  institutionName: 'string' as const,
  institutionShort: 'string' as const,
  provider: 'string' as const,
  district: 'string' as const,
  category: 'string' as const,
  problem_solved: 'string' as const,
  description: 'string' as const,
  keywords: 'string' as const,
};

// ── Normalization ────────────────────────────────────────────
function normalizeText(text: string): string {
  if (!text) return '';
  let normalized = text.toLowerCase();
  normalized = normalized.replace(/[^\w\s]/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim();

  const words = normalized.split(' ');
  const joinedPairs = [];
  for (let i = 0; i < words.length - 1; i++) {
    joinedPairs.push(words[i] + words[i + 1]);
  }
  const fullyJoined = words.join('');

  return `${normalized} ${joinedPairs.join(' ')} ${fullyJoined}`.trim();
}

// ── Multi-dataset Cache ──────────────────────────────────────────
type OramaDB = Awaited<ReturnType<typeof create>>;

const _oramaDBs: Partial<Record<DatasetType, OramaDB>> = {};
const _indexedData: Partial<Record<DatasetType, (Instrument | Service)[]>> = {};
const _indexTs: Partial<Record<DatasetType, number>> = {};
const INDEX_TTL = 60 * 1000; // Rebuild every 60s (matches ISR)

async function getIndex(dataset: DatasetType) {
  const ts = _indexTs[dataset] || 0;
  if (_oramaDBs[dataset] && Date.now() - ts < INDEX_TTL) {
    return { db: _oramaDBs[dataset]!, data: _indexedData[dataset]! };
  }

  const items = await fetchDataset(dataset);

  const db = await create({
    schema: SCHEMA,
  });

  if (dataset === 'instruments') {
    const techs = items as Instrument[];
    for (const tech of techs) {
      const tags = Array.isArray(tech.tag) ? tech.tag : (tech.tag ? tech.tag.split(',') : []);
      await insert(db, {
        id: tech.id || '',
        name: normalizeText(tech.instruments || ''),
        institution: normalizeText(`${tech.institution_name || ''} ${tech.matched_institution || ''}`),
        institutionId: tech.institution_id || '',
        institutionName: normalizeText(tech.institution_name || ''),
        institutionShort: normalizeText(tech.acronym || ''),
        provider: normalizeText(tech.provider_key || ''),
        district: normalizeText(tech.standardized_district || tech.district || ''),
        category: normalizeText(tags.join(' ')),
        problem_solved: normalizeText(tech.name_of_facility || ''),
        description: normalizeText(tech.address || ''),
        keywords: normalizeText(tags.join(', ')),
      });
    }
  } else if (dataset === 'services') {
    const services = items as Service[];
    for (const srv of services) {
      const id = srv.id || srv.serviceName;
      await insert(db, {
        id,
        name: normalizeText(srv.serviceName || ''),
        institution: normalizeText(srv.startupName || ''),
        institutionId: srv.ksumUid || '',
        institutionName: normalizeText(srv.startupName || ''),
        institutionShort: '',
        provider: '',
        district: normalizeText(srv.district || ''),
        category: normalizeText(srv.category || ''),
        problem_solved: normalizeText(srv.sector || ''),
        description: normalizeText(srv.description || ''),
        keywords: normalizeText(srv.keywords?.join(', ') || ''),
      });
    }
  }

  _oramaDBs[dataset] = db;
  _indexedData[dataset] = items;
  _indexTs[dataset] = Date.now();

  console.log(`[RINK Orama] Indexed ${items.length} items for ${dataset}`);
  return { db, data: items };
}

// ── Search interface ─────────────────────────────────────────
export interface OramaSearchResult<T = Instrument | Service> {
  item: T;
  score: number;
  highlight?: string;
}

export interface OramaSearchResponse<T = Instrument | Service> {
  results: OramaSearchResult<T>[];
  query: string;
  totalFound: number;
  elapsed: number; // milliseconds
}

// ── Main search function ─────────────────────────────────────
export async function oramaSearch<T = Instrument | Service>(
  dataset: DatasetType,
  query: string,
  filters?: {
    sector?: string;
    institution?: string;
    institution_id?: string;
    type?: string;
    patent?: string;
    potential?: string;
  },
  limit = 20
): Promise<OramaSearchResponse<T>> {
  const startTime = Date.now();
  const { db, data } = await getIndex(dataset);
  const q = query.trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDocId = (item: any) => item.id || item.serviceName;

  if (!q) {
    let filtered = data;
    if (filters?.institution_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filtered = filtered.filter((i: any) => i.institution_id === filters.institution_id);
    }
    return {
      results: filtered.slice(0, limit).map(t => ({ item: t as unknown as T, score: 1 })),
      query: q,
      totalFound: filtered.length,
      elapsed: Date.now() - startTime,
    };
  }

  // 1. Exact ID Match Override (Priority 1)
  const qLower = q.toLowerCase();
  const exactIdMatch = data.find(t => getDocId(t)?.toLowerCase() === qLower);
  if (exactIdMatch) {
    return {
      results: [{ item: exactIdMatch as unknown as T, score: 1000 }],
      query: q,
      totalFound: 1,
      elapsed: Date.now() - startTime,
    };
  }

  const STOP_WORDS = new Set(['the', 'and', 'for', 'of', 'with', 'using', 'based', 'system', 'method', 'technology', 'service']);
  const cleanTokens = q.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => !STOP_WORDS.has(w));

  const cleanQuery = cleanTokens.join(' ');
  const joinedQuery = cleanTokens.join('');

  const searchConfig = {
    term: cleanQuery,
    boost: {
      id: 100,
      name: 90,
      keywords: 80,
      problem_solved: 70,
      description: 60,
      institution: 40,
      institutionName: 40,
      category: 35,
    },
    limit: 100,
  };

  let oramaResults = await search(db, { ...searchConfig, tolerance: 0 });

  if (cleanTokens.length > 1 && joinedQuery) {
    const joinedResults = await search(db, { ...searchConfig, term: joinedQuery, tolerance: 0 });
    const seen = new Set(oramaResults.hits.map(h => h.id));
    for (const hit of joinedResults.hits) {
      if (!seen.has(hit.id)) {
        oramaResults.hits.push(hit);
        seen.add(hit.id);
      }
    }
    oramaResults.hits.sort((a, b) => b.score - a.score);
  }

  if (oramaResults.hits.length === 0) {
    oramaResults = await search(db, { ...searchConfig, tolerance: 1 });
  }

  const results: OramaSearchResult<T>[] = [];
  for (const hit of oramaResults.hits) {
    const hitId = (hit.document as { id: string }).id;
    const item = data.find(t => getDocId(t) === hitId);
    if (item) {
      results.push({ item: item as T, score: hit.score });
    }
  }

  return {
    results: results.slice(0, limit),
    query: q,
    totalFound: results.length,
    elapsed: Date.now() - startTime,
  };
}

export function isConversational(query: string): boolean {
  const GREETING_PATTERNS = [
    /^hi+\s*[!?.]*$/i, /^hey+\s*[!?.]*$/i, /^hello+\s*[!?.]*$/i,
    /^good\s*(morning|afternoon|evening|day)\s*[!?.]*$/i,
    /^greetings\s*[!?.]*$/i, /^howdy\s*[!?.]*$/i,
    /^how are you/i, /^how r u/i,
    /^thanks?\s*[!?.]*$/i, /^thank you\s*[!?.]*$/i,
    /^thx\s*[!?.]*$/i, /^cheers?\s*[!?.]*$/i,
  ];
  return GREETING_PATTERNS.some(p => p.test(query.trim()));
}

export function getConversationalReply(query: string): string {
  const q = query.trim().toLowerCase();
  if (/^(hi|hey|hello|greetings|howdy)/i.test(q)) {
    return "Hello! I can help you discover technologies and services from Kerala's research institutions and startups.";
  }
  if (/^good\s*(morning|afternoon|evening|day)/i.test(q)) {
    return "Good day! What area would you like to explore? You can search by sector, institution, or startup.";
  }
  if (/how are you|how r u/i.test(q)) {
    return "I'm doing well, thank you! I'm here to help you discover commercializable technologies and services. What area interests you?";
  }
  if (/thanks|thank you|thx|cheers/i.test(q)) {
    return "You're welcome! Feel free to search for more anytime.";
  }
  return "I can help you discover technologies and services. Try searching by name, sector, institution, or describe what you're looking for.";
}
