import { toDriveEmbedUrl } from './mapper';
import { getImageUrl } from './utils';

// ── Verified Local Institution Logos ─────────────────────────────
export const LOCAL_INSTITUTION_LOGOS: Record<string, string> = {
  // CUSAT / STIC
  'cusat': '/images/institutions/cusat.webp',
  'cochin-university-of-science-and-technology-cusat': '/images/institutions/cusat.webp',
  'cochin-university-of-science-and-technology': '/images/institutions/cusat.webp',
  'stic': '/images/institutions/stic.jpg',
  'sophisticated-test-and-instrumentation-centre-stic': '/images/institutions/stic.jpg',
  'sophisticated-test-instrumentation-centre-stic': '/images/institutions/stic.jpg',

  // IIT Palakkad
  'iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'indian-institute-of-technology-palakkad-iit-palakkad': '/images/institutions/iit-palakkad.jpg',
  'indian-institute-of-technology-palakkad': '/images/institutions/iit-palakkad.jpg',

  // IISER Thiruvananthapuram
  'iiser-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'indian-institute-of-science-education-and-research-thiruvananthapuram-iiser-tvm': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'indian-institute-of-science-education-and-research-thiruvananthapuram': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iiser-tvm': '/images/institutions/iiser-thiruvananthapuram.jpg',
  'iiser': '/images/institutions/iiser-thiruvananthapuram.jpg',

  // KSCSTE Institutes
  'kscste-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jawaharlal-nehru-tropical-botanic-garden-research-institute-jntbgri': '/images/institutions/kscste-jntbgri.jpg',
  'jawaharlal-nehru-tropical-botanic-garden-and-research-institute': '/images/institutions/kscste-jntbgri.jpg',
  'jntbgri': '/images/institutions/kscste-jntbgri.jpg',

  'centre-for-water-resources-development-and-management-cwrdm': '/images/institutions/cwrdm.jpg',
  'centre-for-water-resources-development-and-management': '/images/institutions/cwrdm.jpg',
  'cwrdm': '/images/institutions/cwrdm.jpg',
  'kscste-cwrdm': '/images/institutions/cwrdm.jpg',

  'kerala-forest-research-institute-kscste-kfri': '/images/institutions/kscste.jpg',
  'kerala-forest-research-institute': '/images/institutions/kscste.jpg',
  'kscste-kfri': '/images/institutions/kscste.jpg',
  'kfri': '/images/institutions/kscste.jpg',
  'kscste': '/images/institutions/kscste.jpg',

  'natpac': '/images/institutions/natpac.jpg',
  'kscste-natpac': '/images/institutions/natpac.jpg',
  'national-transportation-planning-and-research-centre-natpac': '/images/institutions/natpac.jpg',

  'mbgips': '/images/institutions/mbgips.jpg',
  'kscste-mbgips': '/images/institutions/mbgips.jpg',
  'malabar-botanical-garden-institute-for-plant-sciences-mbgips': '/images/institutions/mbgips.jpg',
  'malabar-botanical-garden-and-institute-for-plant-sciences': '/images/institutions/mbgips.jpg',

  // Central / ICAR / CSIR Institutes
  'icar-cpcri': '/images/institutions/cpcri.png',
  'cpcri': '/images/institutions/cpcri.png',
  'icar-central-plantation-crops-research-institute-cpcri': '/images/institutions/cpcri.png',

  'icar-ctcri': '/images/institutions/ctcri.png',
  'ctcri': '/images/institutions/ctcri.png',
  'icar-central-tuber-crops-research-institute-ctcri': '/images/institutions/ctcri.png',

  'csir-niist': '/images/institutions/csir-niist.png',
  'niist': '/images/institutions/csir-niist.png',
  'national-institute-for-interdisciplinary-science-and-technology': '/images/institutions/csir-niist.png',

  'c-dac': '/images/institutions/cdac.png',
  'cdac': '/images/institutions/cdac.png',

  'c-met': '/images/institutions/c-met.png',
  'cmet': '/images/institutions/c-met.png',

  'iisr': '/images/institutions/iisr.png',
  'icar-iisr': '/images/institutions/iisr.png',
  'icar-indian-institute-of-spices-research-iisr': '/images/institutions/iisr.png',

  'kau': '/images/institutions/kau.png',
  'kerala-agricultural-university': '/images/institutions/kau.png',

  'sctimst': '/images/institutions/sctimst.jpg',
  'sree-chitra-tirunal-institute-for-medical-sciences-technology-sctimst': '/images/institutions/sctimst.jpg',
  'timed': '/images/institutions/sctimst.jpg',

  'rgcb': '/images/institutions/rgcb.jpg',
  'rajiv-gandhi-centre-for-biotechnology-rgcb': '/images/institutions/rgcb.jpg',

  'iav': '/images/institutions/iav.jpg',
  'institute-of-advanced-virology-iav': '/images/institutions/iav.jpg',
  'institute-of-advanced-virology': '/images/institutions/iav.jpg',

  'kufos': '/images/institutions/kufos-kochi.jpg',
  'kerala-university-of-fisheries-and-ocean-studies-kufos': '/images/institutions/kufos-kochi.jpg',
  'kerala-university-of-fisheries-and-ocean-studies': '/images/institutions/kufos-kochi.jpg',

  'dr-moopens-inest': '/images/institutions/inest.jpg',
  'inest': '/images/institutions/inest.jpg',

  'iccs': '/images/institutions/iccs.jpg',
  'nielit': '/images/institutions/nielit.jpg',
  'trest': '/images/institutions/trest.jpg',
};

// ── Monogram Generator ──────────────────────────────────────────
export function getMonogram(name: string): string {
  if (!name) return 'RI';

  // 1. Check for acronym in parentheses: e.g. "(CUSAT)", "(KFRI)", "(CLIF)", "(JNTBGRI)"
  const parenMatch = name.match(/\(([A-Za-z0-9\s-]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].trim();
    if (!inside.includes(' ') && inside.length >= 2 && inside.length <= 7) {
      return inside.toUpperCase();
    }
    const insideWords = inside.split(/[\s-]+/).filter(Boolean);
    if (insideWords.length >= 2 && insideWords[0].toUpperCase() === 'IIT') {
      return 'IIT';
    }
    // Select the most distinctive institutional acronym (skipping prefix like KSCSTE when specific sub-institute exists)
    const specificAcronym = insideWords.find(w => w.toUpperCase() !== 'KSCSTE' && w.length >= 2 && w.length <= 7);
    if (specificAcronym) {
      return specificAcronym.toUpperCase();
    }
    if (insideWords[0] && insideWords[0].length >= 2 && insideWords[0].length <= 7) {
      return insideWords[0].toUpperCase();
    }
  }

  // 2. Clean name: replace punctuation, dashes, en-dashes, em-dashes
  const cleanName = name
    .replace(/[–—\-_/\\()[\],.:;+]/g, ' ')
    .replace(/['’]/g, '')
    .trim();

  const stopWords = new Set([
    'and', 'of', 'for', 'the', 'in', 'at', 'to',
    'private', 'pvt', 'ltd', 'limited', 'solution', 'solutions', 'llp', 
    'center', 'centre', 'facility', 'services', 'service', 'tech', 'technologies', 'technology'
  ]);

  const words = cleanName
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 0 && !stopWords.has(w.toLowerCase()));

  // Check if first word is internal camelCase e.g. BioQuatix (B, Q) or PhyEcoSyS (P, E)
  if (words.length > 0) {
    const firstWord = words[0];
    const upperCount = (firstWord.match(/[A-Z]/g) || []).length;
    const lowerCount = (firstWord.match(/[a-z]/g) || []).length;
    if (upperCount >= 2 && lowerCount >= 2) {
      const caps = firstWord.replace(/[^A-Z]/g, '');
      return caps.slice(0, 2);
    }
  }

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const rawClean = cleanName.replace(/\s+/g, '');
  return rawClean.slice(0, 2).toUpperCase() || 'RI';
}

// ── Multi-Tier Logo Resolver ────────────────────────────────────
export interface LogoResolvable {
  slug?: string | null;
  name?: string | null;
  localLogo?: string | null;
  original_logo_link?: string | null;
  originalLogoLink?: string | null;
  logo_link?: string | null;
  cdnLogo?: string | null;
  logo_embed_url?: string | null;
  institution_image_embed_url?: string | null;
  institution_image?: string | null;
  image?: string | null;
}

/**
 * Resolves the highest-fidelity, most reliable image source for an institution:
 * 1. Verified local static logo (exact slug match or substring match).
 * 2. Explicit localLogo provided by caller.
 * 3. Original Google Drive sharing link converted to CORS-safe direct embed (lh3.googleusercontent.com).
 * 4. Hosted or external logo URL (if valid URL or starts with http/https).
 * 5. Relative asset link via getImageUrl().
 * 6. Other image fields.
 */
export function resolveInstitutionLogo(source: LogoResolvable): string | null {
  const s = (source.slug || '').toLowerCase().trim();

  // 1. Official database logo_link (Source of truth from instrument.json)
  const logoLink = source.logo_link || source.cdnLogo;
  if (logoLink) {
    if (logoLink.startsWith('http://') || logoLink.startsWith('https://')) {
      const driveConverted = toDriveEmbedUrl(logoLink);
      if (driveConverted) return driveConverted;
      return logoLink;
    }
    // Relative asset path from CDN
    return getImageUrl(logoLink);
  }

  // 2. Original Google Drive link (converted to lh3 direct image)
  const driveRaw = source.original_logo_link || source.originalLogoLink;
  if (driveRaw) {
    const driveUrl = toDriveEmbedUrl(driveRaw);
    if (driveUrl) return driveUrl;
  }

  // 3. If cdnLogo itself is a Drive link
  if (source.cdnLogo) {
    const driveFromCdn = toDriveEmbedUrl(source.cdnLogo);
    if (driveFromCdn && driveFromCdn.includes('googleusercontent.com')) {
      return driveFromCdn;
    }
  }

  // 4. Explicit localLogo if provided and exists
  if (source.localLogo && source.localLogo.trim() !== '') {
    return source.localLogo;
  }

  // 5. Check local verified static logo (Fallback)
  if (s && LOCAL_INSTITUTION_LOGOS[s]) {
    return LOCAL_INSTITUTION_LOGOS[s];
  }
  if (s) {
    for (const [key, path] of Object.entries(LOCAL_INSTITUTION_LOGOS)) {
      if (s.includes(key) || key.includes(s)) {
        return path;
      }
    }
  }

  // Check by name if slug did not match
  if (source.name) {
    const cleanNameSlug = source.name
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (LOCAL_INSTITUTION_LOGOS[cleanNameSlug]) {
      return LOCAL_INSTITUTION_LOGOS[cleanNameSlug];
    }
    for (const [key, path] of Object.entries(LOCAL_INSTITUTION_LOGOS)) {
      if (cleanNameSlug.includes(key) || key.includes(cleanNameSlug)) {
        return path;
      }
    }
  }

  // 6. Other image fields
  return (
    source.logo_embed_url ||
    source.institution_image_embed_url ||
    source.institution_image ||
    source.image ||
    null
  );
}
