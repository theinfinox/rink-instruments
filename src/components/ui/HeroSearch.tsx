'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Building2, Layers, Hash, X } from 'lucide-react';
import type { SearchIndexItem } from '@/types';
import { precisionSearch, type ScoredItem } from '@/lib/searchEngine';

/* ─────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────── */
export interface SearchConfig {
  placeholders: string[];
  searchRoute: string;
  detailRoute: string;
  indexUrl: string;
  ariaLabel?: string;
}

const DEFAULT_CONFIG: SearchConfig = {
  placeholders: [
    'Search Instruments, Facilities, Institutions, Categories or Instrument ID…',
    'Try "mass spectrometer" or "electron microscope"…',
    'Search by Instrument ID e.g. RINK-8DA73B…',
    'Explore testing facilities…',
    'Find agri-tech or biomedical equipment…',
  ],
  searchRoute: '/instruments',
  detailRoute: '/instruments',
  indexUrl: '/api/search-index',
};

/* ─────────────────────────────────────────────────────────────────
   Highlight helper — unchanged
───────────────────────────────────────────────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  let regex: RegExp;
  try {
    const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regex = new RegExp(`(${escaped})`, 'gi');
  } catch {
    return <>{text}</>;
  }
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ background: 'transparent', color: '#2563EB', fontWeight: 700 }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   IP Status badge colour — unchanged
───────────────────────────────────────────────────────────────── */
function ipColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('clean') || s.includes('verified')) return '#10B981';
  if (s.includes('attention')) return '#F59E0B';
  return '#94A3B8';
}

/* ─────────────────────────────────────────────────────────────────
   Skeleton row — upgraded to light theme
───────────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 border-b border-slate-100">
      <div className="h-3.5 rounded-full animate-pulse" style={{ background: '#e8edf5', width: '68%' }} />
      <div className="h-2.5 rounded-full animate-pulse" style={{ background: '#f0f4fb', width: '44%' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Suggestion card — upgraded to light glass theme
───────────────────────────────────────────────────────────────── */
function SuggestionCard({
  item,
  query,
  isActive,
  onHover,
  config,
}: {
  item: ScoredItem;
  query: string;
  isActive: boolean;
  onHover: () => void;
  config: SearchConfig;
}) {
  return (
    <Link
      href={`${config.detailRoute}/${item.id}`}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      className="flex flex-col gap-1.5 px-5 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors duration-200"
      style={{
        background: isActive ? 'rgba(37,99,235,0.06)' : 'transparent',
      }}
    >
      {/* Name */}
      <div className="font-semibold text-[#111827] text-sm leading-snug line-clamp-1">
        <Highlight text={item.name} query={query} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Building2 style={{ width: 10, height: 10 }} />
          <Highlight text={item.institution} query={query} />
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Layers style={{ width: 10, height: 10 }} />
          <Highlight text={item.category} query={query} />
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <Hash style={{ width: 10, height: 10 }} />
          {item.id}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {item.trl && item.trl !== 'TRL Not Available' && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
          >
            📍 {item.trl}
          </span>
        )}
        {item.ip_status && item.ip_status !== 'Not Available' && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${ipColor(item.ip_status)}14`,
              color: ipColor(item.ip_status),
              border: `1px solid ${ipColor(item.ip_status)}30`,
            }}
          >
            {item.ip_status}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────── */
export default function HeroSearch({ config = DEFAULT_CONFIG }: { config?: SearchConfig }) {
  const [query, setQuery]               = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused]           = useState(false);
  const [activeIdx, setActiveIdx]       = useState(-1);

  // Index state — unchanged
  const [index, setIndex]               = useState<SearchIndexItem[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);

  // Results — unchanged
  const [suggestions, setSuggestions]   = useState<ScoredItem[]>([]);
  const [searching, setSearching]       = useState(false);
  const [showDrop, setShowDrop]         = useState(false);


  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Load index once — unchanged ── */
  useEffect(() => {
    fetch(config.indexUrl)
      .then(r => r.json())
      .then((data: SearchIndexItem[]) => setIndex(data))
      .catch(() => {})
      .finally(() => setIndexLoading(false));
  }, [config.indexUrl]);

  /* ── Rotate placeholder — unchanged ── */
  useEffect(() => {
    if (focused || query) return;
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % config.placeholders.length), 4200);
    return () => clearInterval(id);
  }, [focused, query, config.placeholders]);

  /* ── Live search with 200ms debounce — unchanged ── */
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    setSearching(true);
    const results = await precisionSearch(q, index);
    setSuggestions(results);
    setShowDrop(true);
    setSearching(false);
  }, [index]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setTimeout(() => {
        setSuggestions([]);
        setShowDrop(false);
        setSearching(false);
      }, 0);
      return;
    }
    setTimeout(() => setSearching(true), 0);
    debounceRef.current = setTimeout(() => runSearch(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  /* ── Click-outside to close — unchanged ── */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDrop(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  /* ── Keyboard navigation — unchanged ── */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDrop) {
      if (e.key === 'Enter' && query.trim()) {
        window.location.href = `${config.searchRoute}?q=${encodeURIComponent(query.trim())}`;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        window.location.href = `/instruments/${suggestions[activeIdx].id}`;
      } else if (query.trim()) {
        window.location.href = `/instruments?q=${encodeURIComponent(query.trim())}`;
      }
    } else if (e.key === 'Escape') {
      setShowDrop(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  function clearSearch() {
    setQuery('');
    setSuggestions([]);
    setShowDrop(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  const dropVisible = showDrop && focused && query.trim().length > 0;
  const noResults   = !searching && !indexLoading && suggestions.length === 0 && query.trim().length >= 2;
  const isLoading   = searching || (indexLoading && query.trim().length > 0);

  return (
    <>
      <div
        ref={containerRef}
        className="vision-search-wrap w-full flex flex-col items-center"
        style={{ position: 'relative' }}
      >
        <div
          className="w-[95%] sm:w-[90%] md:w-[72%]"
          style={{ position: 'relative' }}
        >

          {/* ── VisionOS Floating Glass Search Bar ── */}
          <div
            className={`vision-bar relative flex items-center w-full h-14 sm:h-[68px] md:h-[74px] rounded-full md:rounded-[32px] ${focused ? 'is-focused' : ''}`}
            style={{
              background: '#ffffff',
              border: focused ? '1px solid #F4B400' : '1px solid rgba(255,255,255,0.55)',
              zIndex: 10,
              overflow: 'hidden',
            }}
          >
            {/* Search icon */}
            <span className="pl-3.5 sm:pl-5 md:pl-6 flex-shrink-0" aria-hidden>
              <Search
                className={focused ? 'vision-icon-focused' : 'vision-icon-idle'}
                style={{ width: 19, height: 19 }}
              />
            </span>

            {/* Input — all logic untouched */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIdx(-1); }}
              onFocus={() => {
                setFocused(true);
                if (query.trim() && suggestions.length > 0) setShowDrop(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={config.placeholders[placeholderIdx]}
              aria-label={config.ariaLabel}
              aria-autocomplete="list"
              aria-expanded={dropVisible}
              aria-controls="hero-search-listbox"
              role="combobox"
              className="vision-input w-full h-full py-2 sm:py-4 px-2.5 sm:px-4 text-xs sm:text-base md:text-[17px] min-w-0 font-sans bg-transparent truncate"
            />

            {/* Clear button */}
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="vision-clear flex-shrink-0 mr-1"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}

            {/* Divider */}
            <div
              className="flex-shrink-0 self-stretch"
              style={{
                width: 1, background: 'rgba(244,180,0,0.25)', margin: '10px 0'
              }}
              aria-hidden
            />

            {/* Search button */}
            <button
              type="button"
              onClick={() => {
                if (query.trim()) window.location.href = `${config.searchRoute}?q=${encodeURIComponent(query.trim())}`;
              }}
              disabled={!query.trim()}
              aria-label="Search"
              className="vision-btn flex-shrink-0 flex items-center justify-center gap-2 mx-1.5 sm:mx-[10px] px-3 sm:px-6 h-9 sm:h-[50px] min-w-[38px] sm:min-w-[120px] rounded-full"
              style={{
                fontSize: 15,
                letterSpacing: '0.3px',
              }}
            >
              <Search
                style={{ width: 16, height: 16, flexShrink: 0, color: '#082B63' }}
                aria-hidden
              />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* ── Suggestions Dropdown ── */}
          {dropVisible && (
            <div
              id="hero-search-listbox"
              role="listbox"
              aria-label="Search suggestions"
              className="vision-drop absolute left-0 right-0 mt-3 overflow-y-auto"
              style={{
                borderRadius: 24,
                background: '#ffffff',
                border: '1px solid rgba(244,180,0,0.12)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                zIndex: 50,
                maxHeight: 520,
              }}
            >
              {/* Loading skeletons */}
              {isLoading && [1, 2, 3].map(i => <SkeletonRow key={i} />)}

              {/* Results */}
              {!isLoading && suggestions.map((item, i) => (
                <SuggestionCard
                  key={item.id}
                  item={item}
                  query={query}
                  isActive={i === activeIdx}
                  onHover={() => setActiveIdx(i)}
                  config={config}
                />
              ))}

              {/* Empty state */}
              {noResults && (
                <div className="flex flex-col items-center gap-3 py-8 px-5 text-center">
                  <p className="text-sm text-slate-500">
                    No matching results found for{' '}
                    <span className="text-slate-800 font-semibold">&ldquo;{query}&rdquo;</span>.
                  </p>
                  <Link
                    href={config.searchRoute}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition-opacity hover:opacity-75"
                  >
                    Browse All <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              )}

              {/* Footer */}
              {suggestions.length > 0 && !isLoading && (
                <div
                  className="flex items-center justify-between px-5 py-3"
                  style={{ borderTop: '1px solid rgba(15,23,42,0.06)' }}
                >
                  <span className="text-[11px] text-slate-400">
                    {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} &nbsp;·&nbsp; ↑↓ navigate &nbsp;·&nbsp; ↵ open
                  </span>
                  <Link
                    href={`${config.searchRoute}?q=${encodeURIComponent(query.trim())}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F4B400] transition-opacity hover:opacity-80"
                  >
                    See all results <ArrowRight style={{ width: 11, height: 11 }} />
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
