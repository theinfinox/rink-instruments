'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Search, X, Check, Rocket, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Institution } from '@/types';

import MouBadge from './MouBadge';
import { toDriveEmbedUrl } from '@/lib/mapper';
import { getImageUrl } from '@/lib/utils';

// ── Helpers ─────────────────────────────────────────────────────
function getLogo(inst: Institution): string | null {
  return (
    (inst.logo_link ? getImageUrl(inst.logo_link) : null) ||
    (inst.original_logo_link ? toDriveEmbedUrl(inst.original_logo_link) : null) ||
    inst.logo_embed_url ||
    inst.institution_image_embed_url ||
    inst.institution_image ||
    inst.image ||
    null
  );
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function matches(institutionName: string, query: string): boolean {
  const nq = norm(query);
  if (!nq) return true;
  const nName = norm(institutionName);
  // Match partial substrings — case-insensitive, space-agnostic
  if (nName.includes(nq)) return true;
  // Also match joined version (no spaces) e.g. "NIIST" matches "National Institute..."
  const joinedQ = nq.replace(/\s+/g, '');
  const joinedName = nName.replace(/\s+/g, '');
  if (joinedName.includes(joinedQ)) return true;
  return false;
}

function getMonogram(name: string): string {
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
    if (insideWords.length === 1 && insideWords[0].length <= 6) {
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

// ── Suggestion Dropdown ─────────────────────────────────────────
function SuggestionItem({
  inst,
  isActive,
  onHover,
  onSelect,
  context,
}: {
  inst: Institution;
  isActive: boolean;
  onHover: () => void;
  onSelect: () => void;
  context?: 'instruments' | 'services';
}) {
  const isServices = context === 'services';
  const isStartup = inst.is_startup || inst.entity_type === 'startup' || isServices;
  const logo = getLogo(inst);
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onMouseDown={(e) => { e.preventDefault(); onSelect(); }}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 border-b border-gray-50 last:border-0"
      style={{
        background: isActive ? 'rgba(37,99,235,0.06)' : 'transparent',
      }}
      role="option"
      aria-selected={isActive}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 border border-gray-100"
        style={{ width: 32, height: 32 }}
      >
        {logo && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={logo} 
            alt={inst.name} 
            className="object-contain w-6 h-6" 
            loading="lazy" 
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center font-heading font-bold text-xs select-none ${
            isStartup ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-[#1B4D9B]'
          }`}>
            {getMonogram(inst.name).slice(0, 2)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-1">
            {inst.name}
          </span>
          {isStartup && (
            <span className="text-[9px] px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold flex-shrink-0">
              Startup
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
          <span>
            {inst.tech_count} {inst.tech_count === 1 ? (isServices ? 'service' : 'instrument') : (isServices ? 'services' : 'instruments')}
          </span>
          {inst.has_verified_mou && (
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              · <ShieldCheck className="w-3 h-3 inline" /> MoU Partner
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Institution Grid Card ────────────────────────────────────────
function InstitutionGridCard({ inst, context }: { inst: Institution, context?: 'instruments' | 'services' }) {
  if (!inst.name || !inst.slug) return null;
  const isServices = context === 'services';
  const isStartup = inst.is_startup || inst.entity_type === 'startup';
  const logo = getLogo(inst);
  const [imageFailed, setImageFailed] = useState(false);
  const linkHref = isServices 
    ? `/services/list?startup=${encodeURIComponent(inst.slug)}` 
    : `/institutions/${encodeURIComponent(inst.slug)}`;

  const monogram = getMonogram(inst.name);

  return (
    <Link
      key={inst.slug}
      href={linkHref}
      className="group flex items-center gap-[18px] bg-white border border-[rgba(15,23,42,0.08)] rounded-md p-4 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:border-[#1B4D9B]/25"
      id={`browse-inst-${inst.slug}`}
      style={{
        animation: 'inst-fadeIn 200ms ease both',
      }}
    >
      {/* Logo tile */}
      <div
        className="flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
        style={{
          width: 84,
          height: 84,
          borderRadius: 14,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(15,23,42,0.05)',
        }}
      >
        {logo && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={inst.name}
            className="object-contain"
            style={{ width: 64, height: 64, padding: 2 }}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center select-none transition-transform duration-200 group-hover:scale-105 ${
              isStartup
                ? 'bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/50 text-amber-800'
                : 'bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/40 text-[#1B4D9B]'
            }`}
          >
            <span
              className={`font-heading font-black uppercase text-center leading-none tracking-wider ${
                monogram.length <= 2
                  ? 'text-2xl'
                  : monogram.length === 3
                  ? 'text-xl font-black tracking-normal'
                  : monogram.length <= 5
                  ? 'text-sm font-extrabold tracking-normal px-1'
                  : 'text-xs font-bold tracking-tight px-1'
              }`}
            >
              {monogram}
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div title={inst.name} className="font-heading font-bold text-[#0F172A] text-sm leading-snug line-clamp-3 group-hover:text-[#1B4D9B] transition-colors">
          {inst.name}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#1B4D9B]">
            {inst.tech_count} {inst.tech_count === 1 ? (isServices ? 'service' : 'instrument') : (isServices ? 'services' : 'instruments')}
          </span>
          {isStartup && !isServices && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Startup
            </span>
          )}
          <MouBadge hasVerifiedMou={inst.has_verified_mou} variant="pill" details={inst.mou_details} />
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1B4D9B] group-hover:translate-x-1 transition-all duration-250 flex-shrink-0" />
    </Link>
  );
}

// ── Main Component ───────────────────────────────────────────────
interface Props {
  institutions: Institution[];
  startups?: Institution[];
  context?: 'instruments' | 'services';
}

export default function InstitutionSearchGrid({ institutions, startups = [], context }: Props) {
  const router = useRouter();
  const isServices = context === 'services';

  // Active filters (checkbox state) - default: all institutions including startups listed
  const [filterResearch, setFilterResearch] = useState(true);
  const [filterStartups, setFilterStartups] = useState(true);
  const [filterPartnered, setFilterPartnered] = useState(false);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Institution[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate live counts
  const countResearch = institutions.length;
  const countStartups = startups.length;
  const countPartnered = useMemo(() => {
    let count = institutions.filter(i => i.has_verified_mou).length;
    count += startups.filter(s => s.has_verified_mou).length;
    return count;
  }, [institutions, startups]);

  // Derive the active pool of providers based on active filter checkboxes
  const currentPool: Institution[] = useMemo<Institution[]>(() => {
    if (isServices) {
      return [...institutions].sort((a, b) =>
        (a.name || '').trim().localeCompare((b.name || '').trim(), undefined, { sensitivity: 'base' })
      );
    }

    let pool: Institution[] = [];
    if (filterResearch && filterStartups) {
      pool = [...institutions, ...startups];
    } else if (filterResearch) {
      pool = institutions;
    } else if (filterStartups) {
      pool = startups;
    } else {
      // Fallback if both unselected: show all
      pool = [...institutions, ...startups];
    }

    // Apply MoU (Partnered Institutions) condition
    if (filterPartnered) {
      pool = pool.filter((inst: Institution) => inst.has_verified_mou === true);
    }

    return [...pool].sort((a, b) =>
      (a.name || '').trim().localeCompare((b.name || '').trim(), undefined, { sensitivity: 'base' })
    );
  }, [isServices, institutions, startups, filterResearch, filterStartups, filterPartnered]);

  // Filtered cards by search query
  const filteredInstitutions: Institution[] = useMemo<Institution[]>(() => {
    if (!query.trim()) return currentPool;
    return currentPool.filter((inst: Institution) => matches(inst.name, query));
  }, [currentPool, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const matchesList = currentPool
      .filter((inst: Institution) => matches(inst.name, val))
      .slice(0, 6);
    setSuggestions(matchesList);
    setIsOpen(matchesList.length > 0);
    setSelectedIndex(-1);
  };

  const handleSelect = useCallback((inst: Institution) => {
    setQuery(inst.name);
    setIsOpen(false);
    
    if (isServices) {
      router.push(`/services/list?startup=${encodeURIComponent(inst.slug)}`);
    } else {
      router.push(`/institutions/${encodeURIComponent(inst.slug)}`);
    }
  }, [router, isServices]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      clearSearch();
      return;
    }
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        e.preventDefault();
        handleSelect(suggestions[0]);
      }
      return;
    }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    }
  }

  // Click outside to close dropdown
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Listen for hash navigation from Navbar (#institutions vs #startups)
  useEffect(() => {
    const handleHash = (rawHash: string) => {
      const h = rawHash.replace(/^#/, '');
      if (h === 'startups') {
        setFilterResearch(false);
        setFilterStartups(true);
        setFilterPartnered(false);
      } else if (h === 'institutions') {
        setFilterResearch(true);
        setFilterStartups(true);
        setFilterPartnered(false);
      }
    };

    if (typeof window !== 'undefined' && window.location.hash) {
      handleHash(window.location.hash);
    }

    const onHashChange = () => {
      handleHash(window.location.hash);
    };
    window.addEventListener('hashchange', onHashChange);

    const onNavFilter = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleHash(customEvent.detail);
      }
    };
    window.addEventListener('rink-hash-navigate', onNavFilter);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('rink-hash-navigate', onNavFilter);
    };
  }, []);

  // Compute dynamic, descriptive counter label
  const countLabel = useMemo(() => {
    if (isServices) {
      return query.trim()
        ? `Showing ${filteredInstitutions.length} of ${institutions.length} Startups`
        : `Showing All ${institutions.length} Startups`;
    }

    if (filterPartnered) {
      return query.trim()
        ? `Showing ${filteredInstitutions.length} of ${countPartnered} Partnered Institutions with Subsidized Startup Rates`
        : `Showing All ${countPartnered} Partnered Institutions with Subsidized Startup Rates`;
    }

    if (filterResearch && !filterStartups) {
      return query.trim()
        ? `Showing ${filteredInstitutions.length} of ${countResearch} Research Institutions`
        : `Showing All ${countResearch} Research Institutions`;
    }

    if (filterStartups && !filterResearch) {
      return query.trim()
        ? `Showing ${filteredInstitutions.length} of ${countStartups} Startups`
        : `Showing All ${countStartups} Startups`;
    }

    const totalProviders = countResearch + countStartups;
    return query.trim()
      ? `Showing ${filteredInstitutions.length} of ${totalProviders} Providers (${countResearch} Research Institutions, ${countStartups} Startups)`
      : `Showing All ${totalProviders} Providers (${countResearch} Research Institutions, ${countStartups} Startups)`;
  }, [isServices, filterPartnered, filterResearch, filterStartups, query, filteredInstitutions.length, countPartnered, countResearch, countStartups, institutions.length]);

  return (
    <>
      {/* ── Search Bar & Filter Controls ── */}
      <div className="mb-6" ref={containerRef}>
        <div className="relative" style={{ maxWidth: 460 }}>
          {/* Input */}
          <div
            className="flex items-center bg-white transition-all duration-200"
            style={{
              height: 52,
              borderRadius: 16,
              border: isOpen
                ? '1px solid #2563EB'
                : '1px solid #E5E7EB',
              boxShadow: isOpen
                ? '0 0 0 4px rgba(37,99,235,.12), 0 4px 18px rgba(0,0,0,0.06)'
                : '0 4px 18px rgba(0,0,0,0.06)',
              padding: '0 14px',
            }}
          >
            <Search
              className="flex-shrink-0 mr-3"
              style={{ width: 18, height: 18, color: isOpen ? '#2563EB' : '#9CA3AF' }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => { if(query.trim()) setIsOpen(true); }}
              onKeyDown={handleKeyDown}
              placeholder={isServices ? "Find a Startup..." : "Find an Institution or Startup..."}
              aria-label={isServices ? "Search by startup" : "Search by institution"}
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent outline-none border-0 text-base sm:text-sm"
              style={{
                color: query ? '#111827' : undefined,
                caretColor: '#2563EB',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex-shrink-0 ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              role="listbox"
              aria-label="Suggestions"
              className="absolute left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{
                top: 'calc(100% + 8px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {suggestions.map((inst, index) => (
                <SuggestionItem
                  key={inst.slug}
                  inst={inst}
                  isActive={index === selectedIndex}
                  onHover={() => setSelectedIndex(index)}
                  onSelect={() => handleSelect(inst)}
                  context={context}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── 3 Filter Checkboxes (Only shown on home / instruments view) ── */}
        {!isServices && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {/* 1. Research Institutions */}
            <button
              type="button"
              role="checkbox"
              aria-checked={filterResearch}
              id="filter-checkbox-research"
              onClick={() => {
                if (filterResearch && !filterStartups) {
                  setFilterStartups(true);
                }
                setFilterResearch(prev => !prev);
              }}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterResearch
                  ? 'bg-blue-50 text-[#1B4D9B] border-[#1B4D9B]/35 shadow-[0_1px_3px_rgba(27,77,155,0.12)]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                filterResearch ? 'bg-[#1B4D9B] text-white' : 'border border-slate-300 bg-white group-hover:border-slate-400'
              }`}>
                {filterResearch && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <Building2 className="w-3.5 h-3.5 text-[#1B4D9B]" />
              <span>Research Institutions</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterResearch ? 'bg-[#1B4D9B]/15 text-[#1B4D9B]' : 'bg-slate-100 text-slate-500'
              }`}>
                {countResearch}
              </span>
            </button>

            {/* 2. Startups */}
            <button
              type="button"
              role="checkbox"
              aria-checked={filterStartups}
              id="filter-checkbox-startups"
              onClick={() => {
                if (filterStartups && !filterResearch) {
                  setFilterResearch(true);
                }
                setFilterStartups(prev => !prev);
              }}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterStartups
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-[0_1px_3px_rgba(217,119,6,0.12)]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                filterStartups ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-white group-hover:border-slate-400'
              }`}>
                {filterStartups && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <Rocket className="w-3.5 h-3.5 text-amber-600" />
              <span>Startups</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterStartups ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {countStartups}
              </span>
            </button>

            {/* 3. Partnered Institutions (MoU Subsidized Rates) */}
            <button
              type="button"
              role="checkbox"
              aria-checked={filterPartnered}
              id="filter-checkbox-partnered"
              onClick={() => setFilterPartnered(prev => !prev)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterPartnered
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-1 ring-emerald-400/25 shadow-[0_1px_4px_rgba(5,150,105,0.15)]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
              title="Filter for institutions with verified KSUM MoU offering subsidized rates for startups"
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                filterPartnered ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white group-hover:border-slate-400'
              }`}>
                {filterPartnered && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Partnered Institutions</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterPartnered ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {countPartnered}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                Subsidized Rates
              </span>
            </button>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center gap-2 mt-3 flex-wrap" aria-live="polite">
          <p className="text-xs text-slate-500 font-medium">
            {countLabel}
          </p>
          {filterPartnered && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              KSUM Subsidized Rates Active
            </span>
          )}
        </div>
      </div>

      {/* ── Institution Grid ── */}
      {filteredInstitutions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstitutions.map((inst: Institution) => (
            <InstitutionGridCard key={inst.slug} inst={inst} context={context} />
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8">
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#F1F5F9',
            }}
          >
            <Building2 className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-700 mb-1">No matching institutions found</h3>
          <p className="text-[13px] text-slate-400 mb-4 max-w-sm">
            Try adjusting your search terms or unchecking filter constraints.
          </p>
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setFilterResearch(true);
              setFilterStartups(false);
              setFilterPartnered(false);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-[#0F172A] hover:border-[#1B4D9B]/40 hover:text-[#1B4D9B] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <X style={{ width: 13, height: 13 }} />
            Reset All Filters
          </button>
        </div>
      )}
    </>
  );
}
