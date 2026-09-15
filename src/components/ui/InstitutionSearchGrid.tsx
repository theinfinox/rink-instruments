'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Search, X, Check, Rocket, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
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
              · <ShieldCheck className="w-3 h-3 inline" /> Subsidized Rates
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Institution Grid Card ────────────────────────────────────────
function InstitutionGridCard({ 
  inst, 
  context,
  hiddenOnMobile,
}: { 
  inst: Institution; 
  context?: 'instruments' | 'services';
  hiddenOnMobile?: boolean;
}) {
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
      className={`group items-center gap-3 sm:gap-[18px] bg-white border border-[rgba(15,23,42,0.08)] rounded-xl sm:rounded-md p-3 sm:p-4 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] hover:border-[#1B4D9B]/25 ${
        hiddenOnMobile ? 'hidden sm:flex' : 'flex'
      }`}
      id={`browse-inst-${inst.slug}`}
      style={{
        animation: 'inst-fadeIn 200ms ease both',
      }}
    >
      {/* Logo tile */}
      <div
        className="w-14 h-14 sm:w-[84px] sm:h-[84px] rounded-lg sm:rounded-[14px] bg-white border border-[#E5E7EB] shadow-[0_2px_10px_rgba(15,23,42,0.05)] flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
      >
        {logo && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={inst.name}
            className="object-contain w-10 h-10 sm:w-16 sm:h-16 p-0.5 sm:p-1"
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
                  ? 'text-lg sm:text-2xl'
                  : monogram.length === 3
                  ? 'text-base sm:text-xl font-black tracking-normal'
                  : monogram.length <= 5
                  ? 'text-xs sm:text-sm font-extrabold tracking-normal px-1'
                  : 'text-[10px] sm:text-xs font-bold tracking-tight px-1'
              }`}
            >
              {monogram}
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div title={inst.name} className="font-heading font-bold text-[#0F172A] text-xs sm:text-sm leading-snug line-clamp-2 sm:line-clamp-3 group-hover:text-[#1B4D9B] transition-colors">
          {inst.name}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
          <span className="text-[11px] sm:text-xs font-bold text-[#1B4D9B]">
            {inst.tech_count} {inst.tech_count === 1 ? (isServices ? 'service' : 'instrument') : (isServices ? 'services' : 'instruments')}
          </span>
          {isStartup && !isServices && (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Startup
            </span>
          )}
          <MouBadge hasVerifiedMou={inst.has_verified_mou} variant="pill" details={inst.mou_details} />
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-[#1B4D9B] group-hover:translate-x-1 transition-all duration-250 flex-shrink-0" />
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

  // Active filter tab: 'all' | 'startups' | 'partnered' (single-select mutually exclusive)
  const [filterTab, setFilterTab] = useState<'all' | 'startups' | 'partnered'>('all');

  // Mobile progressive disclosure (initially shows 6 on mobile)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const MOBILE_THRESHOLD = 6;

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<Institution[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate live counts
  const countResearch = institutions.length;
  const countStartups = startups.length;
  const countTotal = institutions.length + startups.length;
  const countPartnered = useMemo(() => {
    let count = institutions.filter(i => i.has_verified_mou).length;
    count += startups.filter(s => s.has_verified_mou).length;
    return count;
  }, [institutions, startups]);

  // Derive the active pool of providers based on active single-select filterTab
  const currentPool: Institution[] = useMemo<Institution[]>(() => {
    if (isServices) {
      return [...institutions].sort((a, b) =>
        (a.name || '').trim().localeCompare((b.name || '').trim(), undefined, { sensitivity: 'base' })
      );
    }

    let pool: Institution[] = [];
    if (filterTab === 'startups') {
      pool = startups;
    } else if (filterTab === 'partnered') {
      pool = [...institutions, ...startups].filter((inst: Institution) => inst.has_verified_mou === true);
    } else {
      // 'all'
      pool = [...institutions, ...startups];
    }

    return [...pool].sort((a, b) =>
      (a.name || '').trim().localeCompare((b.name || '').trim(), undefined, { sensitivity: 'base' })
    );
  }, [isServices, institutions, startups, filterTab]);

  // Filtered cards by search query
  const filteredInstitutions: Institution[] = useMemo<Institution[]>(() => {
    if (!query.trim()) return currentPool;
    return currentPool.filter((inst: Institution) => matches(inst.name, query));
  }, [currentPool, query]);

  // Reset mobile expansion when query or tab changes
  useEffect(() => {
    setIsMobileExpanded(false);
  }, [query, filterTab]);

  const mobileToggleLabel = useMemo(() => {
    if (isServices) return 'Startups';
    if (filterTab === 'partnered') return 'Partnered Institutions';
    if (filterTab === 'startups') return 'Startups';
    return 'Institutions & Startups';
  }, [isServices, filterTab]);

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
        setFilterTab('startups');
      } else if (h === 'institutions') {
        setFilterTab('all');
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

  // Compute dynamic, descriptive counter info with clean mobile sentence breaking
  const countInfo = useMemo(() => {
    if (isServices) {
      return {
        primary: query.trim()
          ? `Showing ${filteredInstitutions.length} of ${institutions.length} Startups`
          : `Showing All ${institutions.length} Startups`,
        secondary: null,
      };
    }

    if (filterTab === 'partnered') {
      return {
        primary: query.trim()
          ? `Showing ${filteredInstitutions.length} of ${countPartnered} Partnered Institutions`
          : `Showing All ${countPartnered} Partnered Institutions`,
        secondary: 'with Subsidized Startup Rates',
      };
    }

    if (filterTab === 'startups') {
      return {
        primary: query.trim()
          ? `Showing ${filteredInstitutions.length} of ${countStartups} Startups`
          : `Showing All ${countStartups} Startups`,
        secondary: null,
      };
    }

    // 'all'
    return {
      primary: query.trim()
        ? `Showing ${filteredInstitutions.length} of ${countTotal} Providers`
        : `Showing All ${countTotal} Providers`,
      secondary: `(${countResearch} Research Institutions · ${countStartups} Startups)`,
    };
  }, [isServices, filterTab, query, filteredInstitutions.length, countPartnered, countResearch, countStartups, countTotal, institutions.length]);

  return (
    <>
      {/* ── Search Bar & Filter Controls ── */}
      <div className="mb-5 sm:mb-6" ref={containerRef}>
        <div className="relative" style={{ maxWidth: 460 }}>
          {/* Input */}
          <div
            className={`flex items-center bg-white transition-all duration-200 h-11 sm:h-[52px] rounded-xl sm:rounded-2xl px-3 sm:px-3.5 ${
              isOpen
                ? 'border border-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,.12),0_4px_18px_rgba(0,0,0,0.06)]'
                : 'border border-[#E5E7EB] shadow-[0_4px_18px_rgba(0,0,0,0.06)]'
            }`}
          >
            <Search
              className="flex-shrink-0 mr-2.5 sm:mr-3 w-4 h-4 sm:w-[18px] sm:h-[18px]"
              style={{ color: isOpen ? '#2563EB' : '#9CA3AF' }}
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
              className="flex-1 bg-transparent outline-none border-0 text-xs sm:text-sm placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm"
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
                className="flex-shrink-0 ml-1.5 sm:ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              role="listbox"
              aria-label="Suggestions"
              className="absolute left-0 right-0 bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{
                top: 'calc(100% + 6px)',
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

        {/* ── 3 Filter Tabs: All, Startups, Partnered (Strict 1-line layout) ── */}
        {!isServices && (
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5 max-w-[460px] sm:max-w-none">
            {/* 1. All */}
            <button
              type="button"
              role="radio"
              aria-checked={filterTab === 'all'}
              id="filter-tab-all"
              onClick={() => setFilterTab('all')}
              className={`group flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3.5 h-8 sm:h-9 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-blue-50 text-[#1B4D9B] border-[#1B4D9B]/35 shadow-[0_1px_3px_rgba(27,77,155,0.12)]'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 flex-shrink-0 ${filterTab === 'all' ? 'text-[#1B4D9B]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>All</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex-shrink-0 ${
                filterTab === 'all' ? 'bg-[#1B4D9B]/15 text-[#1B4D9B]' : 'bg-slate-100 text-slate-500'
              }`}>
                {countTotal}
              </span>
            </button>

            {/* 2. Startups */}
            <button
              type="button"
              role="radio"
              aria-checked={filterTab === 'startups'}
              id="filter-tab-startups"
              onClick={() => setFilterTab('startups')}
              className={`group flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3.5 h-8 sm:h-9 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterTab === 'startups'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-[0_1px_3px_rgba(217,119,6,0.12)]'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Rocket className={`w-3.5 h-3.5 flex-shrink-0 ${filterTab === 'startups' ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>Startups</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex-shrink-0 ${
                filterTab === 'startups' ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {countStartups}
              </span>
            </button>

            {/* 3. Partnered */}
            <button
              type="button"
              role="radio"
              aria-checked={filterTab === 'partnered'}
              id="filter-tab-partnered"
              onClick={() => setFilterTab('partnered')}
              className={`group flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3.5 h-8 sm:h-9 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none shadow-xs cursor-pointer ${
                filterTab === 'partnered'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-1 ring-emerald-400/25 shadow-[0_1px_4px_rgba(5,150,105,0.15)]'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
              title="Filter for institutions with verified KSUM MoU offering subsidized rates for startups"
            >
              <ShieldCheck className={`w-3.5 h-3.5 flex-shrink-0 ${filterTab === 'partnered' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>Partnered</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex-shrink-0 ${
                filterTab === 'partnered' ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {countPartnered}
              </span>
              <span className="hidden lg:inline-block text-[10px] font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                Subsidized Rates
              </span>
            </button>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center gap-2 mt-2.5 sm:mt-3 flex-wrap text-[11px] sm:text-xs text-slate-500 font-medium" aria-live="polite">
          <p className="leading-snug">
            <span>{countInfo.primary}</span>
            {countInfo.secondary && (
              <span className="block sm:inline sm:ml-1 text-slate-400 sm:text-slate-500 text-[10px] sm:text-xs font-normal sm:font-medium">
                {countInfo.secondary}
              </span>
            )}
          </p>
          {filterTab === 'partnered' && (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              KSUM Subsidized Rates Active
            </span>
          )}
        </div>
      </div>

      {/* ── Institution Grid ── */}
      {filteredInstitutions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstitutions.map((inst: Institution, index: number) => (
              <InstitutionGridCard 
                key={inst.slug} 
                inst={inst} 
                context={context} 
                hiddenOnMobile={!isMobileExpanded && index >= MOBILE_THRESHOLD}
              />
            ))}
          </div>

          {/* ── Mobile Progressive Disclosure: View All / Show Less ── */}
          {filteredInstitutions.length > MOBILE_THRESHOLD && (
            <div className="sm:hidden flex justify-center mt-4">
              <button
                type="button"
                onClick={() => {
                  if (isMobileExpanded) {
                    setIsMobileExpanded(false);
                    const el = document.getElementById('institutions') || containerRef.current;
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  } else {
                    setIsMobileExpanded(true);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-xl font-semibold text-xs text-[#1B4D9B] bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-2xs active:scale-[0.98] transition-all cursor-pointer select-none"
              >
                <span>
                  {isMobileExpanded 
                    ? `Show Fewer ${mobileToggleLabel}` 
                    : `View All ${filteredInstitutions.length} ${mobileToggleLabel} (${filteredInstitutions.length - MOBILE_THRESHOLD} More)`}
                </span>
                {isMobileExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#1B4D9B]/70" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#1B4D9B]/70" />
                )}
              </button>
            </div>
          )}
        </>
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
              setFilterTab('all');
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
