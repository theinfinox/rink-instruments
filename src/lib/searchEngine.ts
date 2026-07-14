/**
 * RINK Precision Search Engine
 * ────────────────────────────────────────────────────────────────
 * Priority pipeline:
 *   1. Exact Technology ID match               (score 1000)
 *   2. Partial ID match                        (score 850)
 *   3. Exact Technology Name match             (score 900)
 *   4. Prefix match on Technology Name         (score 700)
 *   5. Whole-word match in Technology Name     (score 500)
 *   6. Substring match in Technology Name      (score 420)
 *   7. Institution match                       (score 350–380)
 *   8. Category match                            (score 300–320)
 *   9. Keyword match                           (score 160–220)
 *  10. Problem Solved match                    (score 110–130)
 *  12. Orama full-text (Desc)   (score ≤80)
 *
 * Minimum relevance threshold: 80
 */

// ── Orama — import only what's needed and keep types loose to avoid TS2589 ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyOrama = any;

import type { SearchIndexItem } from '@/types';

// ── Constants ─────────────────────────────────────────────────────
const MIN_SCORE = 80;
const MAX_RESULTS = 8;

// ── Lazy-loaded Orama (avoid bundling in SSR) ─────────────────────
let _create: ((schema: Record<string, string>) => Promise<AnyOrama>) | null = null;
let _insert: ((db: AnyOrama, doc: Record<string, unknown>) => Promise<void>) | null = null;
let _search: ((db: AnyOrama, params: Record<string, unknown>) => Promise<{ hits: Array<{ document: { id: string }; score?: number }> }>) | null = null;

async function loadOrama() {
  if (_create) return;
  const mod = await import('@orama/orama');
  _create = mod.create as unknown as typeof _create;
  _insert = mod.insert as unknown as typeof _insert;
  _search = mod.search as unknown as typeof _search;
}

// ── Orama DB (rebuilt when index changes) ─────────────────────────
let oramaDb: AnyOrama | null = null;
let oramaStamp = 0;

async function getOramaDb(items: SearchIndexItem[]): Promise<AnyOrama> {
  await loadOrama();
  if (oramaDb && oramaStamp === items.length) return oramaDb;

  const db = await _create!({
    id:               'string',
    name:             'string',
    institution:      'string',
    category:           'string',
    keywords_str:     'string',
    problem_solved:   'string',
    description:      'string',
  });

  for (const item of items) {
    await _insert!(db, {
      id:               item.id,
      name:             item.name,
      institution:      item.institution,
      category:           item.category,
      keywords_str:     item.keywords.join(' '),
      problem_solved:   item.problem_solved || '',
      description:      item.description || '',
    });
  }

  oramaDb = db;
  oramaStamp = items.length;
  return db;
}

// ── Normalise string for comparison ──────────────────────────────
function norm(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Scored result ─────────────────────────────────────────────────
export interface ScoredItem extends SearchIndexItem {
  _score: number;
  _matchField: string;
}

// ── Score an item against a query (deterministic tiers) ───────────
function scoreItem(item: SearchIndexItem, q: string): ScoredItem | null {
  const nq  = norm(q);
  if (!nq) return null;
  const jQ = nq.replace(/\s+/g, ''); // Fully joined query (e.g. "sea weed" -> "seaweed")

  const nId          = norm(item.id);
  const nName        = norm(item.name);
  const nInstitution = norm(item.institution);
  const nCategory      = norm(item.category);
  const nProblem     = norm(item.problem_solved || '');
  const nKeywords    = item.keywords.map(norm);

  const jId          = nId.replace(/\s+/g, '');
  const jName        = nName.replace(/\s+/g, '');
  const jInstitution = nInstitution.replace(/\s+/g, '');
  const jCategory      = nCategory.replace(/\s+/g, '');
  const jProblem     = nProblem.replace(/\s+/g, '');

  // Safe regex: escape special chars
  let wordBoundary: RegExp;
  try {
    wordBoundary = new RegExp(`\\b${nq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
  } catch {
    wordBoundary = /(?!)/; // never matches
  }

  // Tier 1: Exact ID
  if (nId === nq || jId === jQ) {
    return { ...item, _score: 1000, _matchField: 'id_exact' };
  }
  // Tier 2: Partial ID (prefix or substring)
  if (nId.startsWith(nq) || nId.includes(nq) || jId.includes(jQ)) {
    return { ...item, _score: 850, _matchField: 'id_partial' };
  }
  // Tier 3: Exact Name
  if (nName === nq || jName === jQ) {
    return { ...item, _score: 900, _matchField: 'name_exact' };
  }
  // Tier 4: Prefix Name
  if (nName.startsWith(nq) || jName.startsWith(jQ)) {
    return { ...item, _score: 700, _matchField: 'name_prefix' };
  }
  // Tier 5: Whole-word in Name
  if (wordBoundary.test(nName)) {
    return { ...item, _score: 500, _matchField: 'name_word' };
  }
  // Tier 6: Substring Name
  if (nName.includes(nq) || jName.includes(jQ)) {
    return { ...item, _score: 420, _matchField: 'name_substr' };
  }
  // Tier 7: Institution
  if (nInstitution === nq || jInstitution === jQ) return { ...item, _score: 380, _matchField: 'institution_exact' };
  if (nInstitution.includes(nq) || jInstitution.includes(jQ)) return { ...item, _score: 350, _matchField: 'institution_substr' };

  // Tier 8: Category
  if (nCategory === nq || jCategory === jQ) return { ...item, _score: 320, _matchField: 'category_exact' };
  if (nCategory.includes(nq) || jCategory.includes(jQ)) return { ...item, _score: 300, _matchField: 'category_substr' };

  // Tier 9: Keywords
  for (const kw of nKeywords) {
    const jKw = kw.replace(/\s+/g, '');
    if (kw === nq || jKw === jQ)          return { ...item, _score: 220, _matchField: 'keyword_exact' };
    if (kw.startsWith(nq) || jKw.startsWith(jQ)) return { ...item, _score: 200, _matchField: 'keyword_prefix' };
    if (kw.includes(nq) || jKw.includes(jQ))   return { ...item, _score: 160, _matchField: 'keyword_substr' };
  }

  // Tier 10: Problem Solved
  if (wordBoundary.test(nProblem)) return { ...item, _score: 130, _matchField: 'problem_word' };
  if (nProblem.includes(nq) || jProblem.includes(jQ)) return { ...item, _score: 110, _matchField: 'problem_substr' };

  return null;
}

// ── Main precision search ─────────────────────────────────────────
export async function precisionSearch(
  query: string,
  index: SearchIndexItem[]
): Promise<ScoredItem[]> {
  const q = query.trim();
  if (!q || index.length === 0) return [];

  // Phase 1 — deterministic scoring
  const seen = new Set<string>();
  const results: ScoredItem[] = [];

  for (const item of index) {
    const scored = scoreItem(item, q);
    if (scored && scored._score >= MIN_SCORE && !seen.has(item.id)) {
      seen.add(item.id);
      results.push(scored);
    }
  }

  results.sort((a, b) => b._score - a._score);

  // Return early if we already have enough confident results
  if (results.length >= MAX_RESULTS) {
    return results.slice(0, MAX_RESULTS);
  }

  // Phase 2 — Orama full-text on applications + description (fills remaining slots)
  try {
    const db = await getOramaDb(index);
    const oramaResult = await _search!(db, {
      term: q,
      properties: ['description', 'keywords_str', 'problem_solved'],
      limit: 20,
      tolerance: q.length > 5 ? 1 : 0,
    });

    const topScore = oramaResult.hits[0]?.score ?? 1;
    for (const hit of oramaResult.hits) {
      const id = hit.document.id;
      if (seen.has(id)) continue;
      const original = index.find(i => i.id === id);
      if (!original) continue;
      const mappedScore = Math.round(((hit.score ?? 0) / Math.max(topScore, 0.001)) * 78);
      if (mappedScore < 20) continue; // drop very weak Orama hits
      seen.add(id);
      results.push({ ...original, _score: mappedScore, _matchField: 'orama_fulltext' });
    }
  } catch {
    // non-fatal
  }

  return results.sort((a, b) => b._score - a._score).slice(0, MAX_RESULTS);
}
