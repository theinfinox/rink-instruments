// ============================================================
// RINK Technology Explorer — Smart Search Engine v2
// - Intent detection (greetings, small talk, help, search)
// - Priority-ranked scoring: exact name > exact field > partial
// - Hard score threshold prevents false positives
// - Zero hallucination: only real DB records returned
// ============================================================

import { Instrument } from '@/types/instrument';

export interface AISearchResult {
  instrument: Instrument;
  score: number;
  matchedOn: string[];
}

export interface AISearchResponse {
  results: AISearchResult[];
  query: string;
  intent: ConversationIntent;
  responseMessage: string;
  totalFound: number;
}

// ── Intent classification ────────────────────────────────────
export type ConversationIntent =
  | 'greeting'
  | 'smalltalk'
  | 'who_are_you'
  | 'help'
  | 'thanks'
  | 'search'
  | 'startup'
  | 'patent'
  | 'trl'
  | 'commercial'
  | 'empty';

// ── Intent detection rules ───────────────────────────────────
const GREETING_PATTERNS = [
  /^hi+\s*[!?.]*$/i, /^hey+\s*[!?.]*$/i, /^hello+\s*[!?.]*$/i,
  /^good\s*(morning|afternoon|evening|day)\s*[!?.]*$/i,
  /^greetings\s*[!?.]*$/i, /^howdy\s*[!?.]*$/i,
  /^sup\s*[!?.]*$/i, /^yo\s*[!?.]*$/i,
];

const SMALLTALK_PATTERNS = [
  /how are you/i, /how r u/i, /how do you do/i,
  /what('?s| is) up/i, /wassup/i, /you good/i,
  /are you (ok|okay|fine|well|there)/i,
];

const WHO_ARE_YOU_PATTERNS = [
  /who are you/i, /what are you/i, /introduce yourself/i,
  /tell me about yourself/i, /what (can|do) you do/i,
  /what('?s| is) your (name|purpose|role)/i, /about (rink|this)/i,
  /how (does this|do you) work/i,
];

const HELP_PATTERNS = [
  /^help\s*[!?.]*$/i, /how (to|can i) (use|search|find|discover)/i,
  /what (should i|can i) (ask|search|type)/i,
  /give me (an )?(example|hint|tip)/i,
  /how does (this|search|it) work/i,
  /what (kind of|types of) (questions|queries)/i,
];

const THANKS_PATTERNS = [
  /^thanks?\s*[!?.]*$/i, /^thank you\s*[!?.]*$/i,
  /^thx\s*[!?.]*$/i, /^ty\s*[!?.]*$/i,
  /^cheers?\s*[!?.]*$/i, /^great\s*[!?.]*$/i,
  /^awesome\s*[!?.]*$/i, /^perfect\s*[!?.]*$/i,
  /^cool\s*[!?.]*$/i, /^nice\s*[!?.]*$/i,
];

export function classifyIntent(query: string): ConversationIntent {
  const q = query.trim();
  if (!q) return 'empty';
  if (GREETING_PATTERNS.some(p => p.test(q))) return 'greeting';
  if (SMALLTALK_PATTERNS.some(p => p.test(q))) return 'smalltalk';
  if (WHO_ARE_YOU_PATTERNS.some(p => p.test(q))) return 'who_are_you';
  if (HELP_PATTERNS.some(p => p.test(q))) return 'help';
  if (THANKS_PATTERNS.some(p => p.test(q))) return 'thanks';
  return 'search'; // Default — run database search
}

// ── Conversational responses (no DB search) ──────────────────
export function getConversationalResponse(intent: ConversationIntent, query: string): AISearchResponse {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  let greetingMsg = `Hello! Welcome to the **RINK Instruments and Services Portal**.\n\nWhat startup idea or technology area are you exploring today?`;
  if (normalizedQuery === 'hi') {
    greetingMsg = 'Hello! What startup idea are you exploring today?';
  } else if (normalizedQuery === 'hello') {
    greetingMsg = 'Welcome to the RINK Instruments and Services Portal.';
  }

  const messages: Record<ConversationIntent, string> = {
    greeting: greetingMsg,

    smalltalk:
      `I'm doing well, thank you!\n\nI'm here to help you discover technologies available for commercialization through Kerala's research ecosystem.\n\nWhat area would you like to explore? You can describe a startup idea, an industry, or a problem you're trying to solve.`,

    who_are_you:
      `I am the **RINK Discovery Assistant**.\n\nI help entrepreneurs and founders discover commercializable technologies developed by Kerala's leading research institutions and turn deep-tech patents into startups.`,

    help:
      `Here's how to get the best results:\n\n**Describe your startup idea:**\n→ *"I want to start a coconut processing business"*\n\n**Search by industry:**\n→ *"Agriculture technologies"*\n\n**Search by problem:**\n→ *"Water purification"*\n\nWhat would you like to discover today?`,

    thanks:
      `You're welcome!\n\nFeel free to describe a startup idea, challenge, or industry and I'll help you discover relevant technologies from the RINK database.`,

    empty:
      `Please describe your startup idea or the technology area you're interested in, and I'll search the RINK database for you.`,

    // These won't be used for conversational responses, but need to be defined
    search: '',
    startup: '',
    patent: '',
    trl: '',
    commercial: '',
  };

  return {
    results: [],
    query,
    intent,
    responseMessage: messages[intent] || messages.empty,
    totalFound: 0,
  };
}



// ── Common stop words ─────────────────────────────────────────
const STOP_WORDS = new Set([
  'want', 'need', 'show', 'find', 'get', 'give', 'tell', 'help',
  'suggest', 'recommend', 'please', 'looking', 'search', 'display',
  'related', 'using', 'about', 'with', 'from', 'that', 'this',
  'what', 'which', 'where', 'when', 'available', 'based',
  'into', 'like', 'some', 'any', 'all', 'will', 'would',
  'could', 'should', 'have', 'been', 'being', 'does', 'more',
  'technology', 'technologies', 'innovation', 'innovations',
  'startup', 'startups', 'opportunities', 'business', 'venture',
  'start', 'build', 'launch', 'create', 'establish', 'open',
  'make', 'develop', 'produce', 'manufacture',
  'also', 'very', 'just', 'most', 'best', 'good', 'great',
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else',
  'to', 'for', 'of', 'in', 'on', 'at', 'by', 'from', 'with',
  'about', 'as', 'into', 'through', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
]);

// ── Generic modifier terms that should not be used as primary search hooks ──
const GENERIC_MODIFIERS = new Set([
  // Actions and processes
  'monitoring', 'monitor', 'monitors', 'system', 'systems', 'device', 'devices',
  'machine', 'machines', 'process', 'processes', 'processing', 'method', 'methods',
  'apparatus', 'equipment', 'tool', 'tools', 'instrument', 'instruments',
  'unit', 'units', 'solution', 'solutions', 'product', 'products', 'idea', 'ideas',
  'technology', 'technologies', 'innovation', 'innovations', 'opportunity', 'opportunities',
  'startup', 'startups', 'business', 'venture', 'technological', 'technique', 'techniques',
  'kit', 'kits', 'mechanism', 'mechanisms', 'concept', 'concepts', 'prototype', 'prototypes',
  
  // Detection and analysis
  'detection', 'detecting', 'detect', 'detector', 'detectors',
  'screening', 'screen', 'screens', 'diagnostic', 'diagnostics', 'diagnosis',
  'analysis', 'analyzing', 'analyze', 'analyzer', 'analyzers', 'estimation',
  'identification', 'identifying', 'identify', 'assessment', 'assessing',
  
  // Extraction and production
  'extraction', 'extracting', 'extract', 'extractor', 'extractors',
  'production', 'producing', 'produce', 'producer', 'producers',
  'cultivation', 'cultivating', 'cultivate',
  'harvesting', 'harvest', 'harvester', 'harvesters',
  'preservation', 'preserving', 'preserve', 'preservative',
  
  // Treatment and control
  'treatment', 'treating', 'treat',
  'purification', 'purifying', 'purifier', 'purifiers',
  'separation', 'separating', 'separate', 'separator', 'separators',
  'fabrication', 'fabricating', 'fabricate',
  'manufacturing', 'manufacture',
  'management', 'managing', 'manage',
  'control', 'controlling', 'control', 'controller', 'controllers',
  'generation', 'generating', 'generate', 'generator', 'generators',
  'conversion', 'converting', 'convert', 'converter', 'converters',
  'formulation', 'formulating', 'formulate', 'formula',
  
  // Quality and improvement
  'improvement', 'improving', 'improve',
  'enhancement', 'enhancing', 'enhance',
  'reduction', 'reducing', 'reduce',
  'prevention', 'preventing', 'prevent',
  'development', 'developing', 'develop',
  'application', 'applying', 'apply', 'applications',
  'utilization', 'utilizing', 'utilize'
]);

// ── Minimum token length (prevents "ca" matching "cassava") ──
const MIN_TOKEN_LEN = 3;

// ── Tokenise: lowercase, remove punctuation, filter stops ────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= MIN_TOKEN_LEN && !STOP_WORDS.has(t));
}

// ── Extract TRL filter ────────────────────────────────────────
function extractTRLFilter(q: string): number | null {
  const m = q.match(/trl\s*(\d+)/i) || q.match(/readiness level\s*(\d+)/i);
  if (m) return parseInt(m[1]);
  if (/trl\s*[78]\s*(and|or|&|\+)?\s*above/i.test(q)) return 7;
  if (/trl\s*9/i.test(q)) return 9;
  return null;
}

// ── Startup intent patterns ───────────────────────────────────
function detectStartupIntent(query: string): boolean {
  return /i want to start|i want to build|i want to launch|starting a|build a|launch a|open a|i am looking for|looking for|show me|find me|suggest|recommend/i.test(query);
}





// ── Build response message ────────────────────────────────────
function buildMessage(
  query: string,
  count: number,
  isStartup: boolean,
  trlFilter: number | null,
  patentFilter: boolean,
): string {
  if (count === 0) {
    return `No closely matching technologies found in the RINK database for **"${query}"**.\n\nTry a more specific keyword, or browse by sector to explore all available technologies.`;
  }
  if (patentFilter) return `Found **${count} patented technolog${count === 1 ? 'y' : 'ies'}** in the RINK database:`;
  if (trlFilter !== null) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** with TRL ${trlFilter}+:`;
  if (isStartup) return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** relevant to your startup idea:`;
  return `Found **${count} technolog${count === 1 ? 'y' : 'ies'}** matching **"${query}"**:`;
}

// ── Local Sector Classifier (for fallback) ────────────────────
function detectLocalSector(query: string): string {
  const q = query.toLowerCase();
  if (/agricult|farm|crop|plant|soil|fertiliz|pest|insect/i.test(q)) return 'agriculture';
  if (/coconut|food|beverage|juice|milk|flour|biscuit|dryer|drier|baker/i.test(q)) return 'food-technology';
  if (/biotech|dna|gene|cell|bacteri|fungi|microb|tissue/i.test(q)) return 'biotechnology-life-sciences';
  if (/cancer|tumor|breast|cervic|cardi|heart|diabet|medical|health|health.?care|clinical|biosensor/i.test(q)) return 'medtech-health-care';
  if (/solar|wind|turbin|energi|battery|batteries|climate|carbon|green/i.test(q)) return 'energy-climate-sustainability';
  if (/water|purif|sewag|waste|pollut|filter|recycl/i.test(q)) return 'water-environment-waste-management';
  if (/robot|drone|automat|sensor|sensor|acoustic|uav/i.test(q)) return 'robotics-automation-drones';
  if (/software|ai|digital|app|cloud|network|algorithm|deep.?learning/i.test(q)) return 'digital-technologies-ai-software';
  if (/chemical|material|plastic|polym|nano|compos/i.test(q)) return 'advanced-materials-chemicals';
  if (/manufactur|industrial|metal|machin|weld|lathe|gear/i.test(q)) return 'manufacturing-industrial-technologies';
  if (/construct|build|smart.?citi|infrastructure/i.test(q)) return 'infrastructure-construction-smart-cities';
  if (/consumer|cosmetic|soap|shampoo|lifestyle|fashion/i.test(q)) return 'consumer-products-cosmetics-lifestyle';
  return 'none';
}

// ── Gemini Search Integration ────────────────────────────────
interface GeminiAnalysisJSON {
  intent: string;
  responseMessage: string;
  analysis: {
    sector: string;
    needs: string[];
  };
}

async function runGeminiSearch(query: string, instruments: Instrument[]): Promise<AISearchResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[RINK AI] GEMINI_API_KEY is not defined. Falling back to local search.');
    return null;
  }

  try {
    const prompt = `You are the RINK AI Discovery Assistant, the intelligent brain behind Kerala Startup Mission's Technology Transfer & Commercialization Portal.
Your task is to analyze the user's startup idea or query, extract the most accurate sector/industry it belongs to, and identify what key technologies or capabilities they need.

Available consolidated sectors (use exactly one of these slugs, or "none"):
- "agriculture" (Agriculture & Agritech)
- "food-technology" (Food Technology)
- "biotechnology-life-sciences" (Biotech & Life Sciences)
- "medtech-health-care" (Medtech & Healthcare)
- "energy-climate-sustainability" (Energy, Climate & Sustainability)
- "digital-technologies-ai-software" (Digital Technologies, AI & Software)
- "water-environment-waste-management" (Water, Environment & Waste Management)
- "robotics-automation-drones" (Robotics & Drones)
- "advanced-materials-chemicals" (Advanced Materials & Chemicals)
- "manufacturing-industrial-technologies" (Manufacturing & Industrial Technologies)
- "infrastructure-construction-smart-cities" (Infrastructure, Construction & Smart Cities)
- "consumer-products-cosmetics-lifestyle" (Consumer Products, Cosmetics & Lifestyle)

User Query: "${query}"

Instructions:
1. Classify the user query into one of these intents:
   - "greeting": if the user says hello (e.g. "hi", "hello")
   - "smalltalk": if the user is asking how you are or chatting generically
   - "who_are_you": if the user asks about your identity or what you do
   - "help": if the user asks how to use the search or what they can ask
   - "thanks": if the user says thank you or generic closing words
   - "search": if the user is searching for technologies, problem solutions, products, etc.
   - "empty": if the query is blank or doesn't have words

2. Response Message:
   - If the intent is conversational (greeting, smalltalk, help, thanks, who_are_you), write a helpful, friendly response.
   - If the intent is "search", write a concise, professional summary response in markdown introducing the matches found (e.g., "I found 3 technologies matching your request..."). Highlight key requirements.

3. Extract Sector and Needs:
   - "sector": Choose the most fitting sector slug from the list above. If it's a general question or doesn't fit any single sector, use "none".
   - "needs": Extract 1 to 4 specific search keywords representing what they need. Exclude generic verbs or generic modifiers (like "system", "device", "monitoring"). Focus on domain nouns (e.g., "coconut", "pest", "sensor", "cancer").

Return a JSON object matching this schema:
{
  "intent": "greeting" | "smalltalk" | "who_are_you" | "help" | "thanks" | "search" | "empty",
  "responseMessage": string,
  "analysis": {
    "sector": string,
    "needs": string[]
  }
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              intent: {
                type: "STRING",
                enum: ["greeting", "smalltalk", "who_are_you", "help", "thanks", "search", "empty"]
              },
              responseMessage: { type: "STRING" },
              analysis: {
                type: "OBJECT",
                properties: {
                  sector: { type: "STRING" },
                  needs: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  }
                },
                required: ["sector", "needs"]
              }
            },
            required: ["intent", "responseMessage", "analysis"]
          }
        }
      })
    });

    if (!response.ok) {
      console.error('[RINK AI] Gemini API request failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
      console.error('[RINK AI] Gemini returned empty response');
      return null;
    }

    const parsed: GeminiAnalysisJSON = JSON.parse(textResult.trim());

    // Filter out any generic modifiers that Gemini might have outputted
    const cleanNeeds = (parsed.analysis.needs || []).filter(
      need => !GENERIC_MODIFIERS.has(need.toLowerCase())
    );

    // Query our local database using the extracted sector and needs
    return runLocalSearchWithAnalysis(
      query,
      instruments,
      parsed.analysis.sector,
      cleanNeeds,
      parsed.intent as ConversationIntent,
      parsed.responseMessage
    );
  } catch (error) {
    console.error('[RINK AI] Error in runGeminiSearch:', error);
    return null;
  }
}

// ── Main search function ──────────────────────────────────────
export async function runAISearch(query: string, instruments: Instrument[]): Promise<AISearchResponse> {
  const q = query.trim();

  // 1. Try Gemini Analysis Search first
  const geminiResult = await runGeminiSearch(q, instruments);
  if (geminiResult) {
    return geminiResult;
  }

  // 2. Fallback to Local Search with Local Classifier
  return runLocalSearchFallback(q, instruments);
}

// ── Local search fallback ─────────────────────────────────────
export function runLocalSearchFallback(query: string, instruments: Instrument[]): AISearchResponse {
  const q = query.trim();
  const intent = classifyIntent(q);

  if (intent !== 'search') {
    return getConversationalResponse(intent, q);
  }

  const sector = detectLocalSector(q);
  const tokens = tokenise(q);
  const needs = tokens.filter(tok => !GENERIC_MODIFIERS.has(tok));

  return runLocalSearchWithAnalysis(q, instruments, sector, needs, intent);
}

// ── Local Search and Scoring with extracted parameters ────────
export function runLocalSearchWithAnalysis(
  query: string,
  instruments: Instrument[],
  sector: string,
  needs: string[],
  intent: ConversationIntent,
  responseMessage?: string
): AISearchResponse {
  const q = query.trim();
  const scored: AISearchResult[] = [];

  const patentFilter = /patent/i.test(q);
  const trlFilter = extractTRLFilter(q);
  const commercialFilter = /commercial|market.?ready|trl\s*[89]/i.test(q);

  for (const inst of instruments) {
    let score = 0;
    const matchedOn: string[] = [];
    const tags = Array.isArray(inst.tag) ? inst.tag : (inst.tag ? inst.tag.split(',') : []);
    const sectorSlug = tags.length > 0 ? tags[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general';

    // 1. Sector Boost (+50 points)
    if (sector !== 'none' && sectorSlug === sector) {
      score += 50;
      matchedOn.push('sector');
    }

    // 2. Needs Matching
    let needsMatched = 0;
    for (const need of needs) {
      const nameLower = (inst.instruments || '').toLowerCase();
      const keywordsLower = tags.map(k => k.toLowerCase()).join(' ');
      const problemLower = (inst.name_of_facility || '').toLowerCase();
      const appsLower = '';
      const descLower = (inst.address || '').toLowerCase();
      const typeLower = '';
      const sectorLower = tags.join(' ').toLowerCase();
      const instLower = (inst.institution_name || '').toLowerCase();

      const text = `${nameLower} ${keywordsLower} ${problemLower} ${appsLower} ${descLower} ${typeLower} ${sectorLower} ${instLower}`;
      const escaped = need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}`, 'i');

      if (regex.test(text)) {
        needsMatched++;

        // Add specific field scoring boosts
        if (new RegExp(`\\b${escaped}`, 'i').test(nameLower)) {
          score += 40;
          matchedOn.push('name');
        } else if (keywordsLower.includes(need)) {
          score += 25;
          matchedOn.push('keywords');
        } else if (problemLower.includes(need) || appsLower.includes(need)) {
          score += 20;
          matchedOn.push('problem_solved');
        } else {
          score += 10;
          matchedOn.push('description');
        }
      }
    }

    // Must match at least one need if needs are specified
    if (score > 0 && (needs.length === 0 || needsMatched > 0)) {
      // Apply TRL and patent filters if requested
      if (patentFilter) {
        const ps = (inst.warnings || '').toLowerCase();
        if (!ps.includes('patent') || ps.includes('not patent') || ps === 'not available' || ps === 'not specified' || ps === 'clean') continue;
      }
      if (trlFilter !== null) {
        const trlNum = parseInt(inst.standardized_district?.replace(/[^0-9]/g, '') || '0');
        if (isNaN(trlNum) || trlNum < trlFilter) continue;
      }
      if (commercialFilter && !patentFilter && trlFilter === null) {
        const trlNum = parseInt(inst.standardized_district?.replace(/[^0-9]/g, '') || '0');
        if (!isNaN(trlNum) && trlNum > 0 && trlNum < 7) continue;
      }

      scored.push({
        instrument: inst,
        score: Math.min(100, score),
        matchedOn: Array.from(new Set(matchedOn))
      });
    }
  }

  // Sort and slice
  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);

  const defaultMsg = buildMessage(q, sorted.length, detectStartupIntent(q), trlFilter, patentFilter);

  return {
    results: sorted,
    query: q,
    intent: intent,
    responseMessage: responseMessage || defaultMsg,
    totalFound: sorted.length
  };
}
