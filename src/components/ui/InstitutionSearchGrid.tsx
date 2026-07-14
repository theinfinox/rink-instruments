'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Search, X } from 'lucide-react';
import type { Institution } from '@/types';

// ── Helpers ─────────────────────────────────────────────────────
function getLogo(inst: Institution): string | null {
  return inst.logo_embed_url || inst.institution_image_embed_url || inst.institution_image || inst.image || null;
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

// ── Suggestion Dropdown ─────────────────────────────────────────
function SuggestionItem({
  inst,
  isActive,
  onHover,
  onSelect,
}: {
  inst: Institution;
  isActive: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  const logo = getLogo(inst);
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
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={inst.name} className="object-contain w-6 h-6" loading="lazy" />
        ) : (
          <Building2 className="w-4 h-4 text-slate-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-1">
          {inst.name}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
        </div>
      </div>
    </button>
  );
}

// ── Institution Grid Card (unchanged card design) ────────────────
function InstitutionGridCard({ inst }: { inst: Institution }) {
  const logo = getLogo(inst);
  return (
    <Link
      key={inst.slug}
      href={`/technologies?institution=${encodeURIComponent(inst.slug)}`}
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
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={inst.name}
            className="object-contain"
            style={{ width: 64, height: 64, padding: 2 }}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <Building2 className="w-6 h-6 text-slate-300" />
            <span className="text-[8px] font-semibold text-slate-400 text-center leading-tight">
              Institution Logo<br />Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="font-heading font-bold text-[#0F172A] text-sm leading-snug line-clamp-2 group-hover:text-[#1B4D9B] transition-colors">
          {inst.name}
        </div>
        <div className="text-xs font-bold text-[#1B4D9B] mt-1.5">
          {inst.tech_count} {inst.tech_count === 1 ? 'technology' : 'technologies'}
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
}

export default function InstitutionSearchGrid({ institutions }: Props) {
  const sorted = [...institutions].sort((a, b) => b.tech_count - a.tech_count);
  const total = sorted.length;

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered cards
  const filtered = query.trim()
    ? sorted.filter(inst => matches(inst.name, query))
    : sorted;

  // Autocomplete suggestions (max 6, only when input focused)
  const suggestions = query.trim()
    ? sorted.filter(inst => matches(inst.name, query)).slice(0, 6)
    : [];

  const showDrop = focused && query.trim() !== '' && suggestions.length > 0;

  const clearSearch = useCallback(() => {
    setQuery('');
    setActiveIdx(-1);
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      clearSearch();
      setFocused(false);
      inputRef.current?.blur();
      return;
    }
    if (!showDrop) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0 && suggestions[activeIdx]) {
      e.preventDefault();
      setQuery(suggestions[activeIdx].name);
      setFocused(false);
    }
  }

  // Click outside to close dropdown
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Reset activeIdx when suggestions change
  useEffect(() => {
    setActiveIdx(-1);
  }, [query]);

  const countLabel = query.trim()
    ? `Showing ${filtered.length} of ${total} Institutions`
    : `Showing All ${total} Institutions`;

  return (
    <>
      {/* ── CSS animation ── */}
      <style>{`
        @keyframes inst-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Search Bar ── */}
      <div className="mb-6" ref={containerRef}>
        <div className="relative" style={{ maxWidth: 420 }}>
          {/* Input */}
          <div
            className="flex items-center bg-white transition-all duration-200"
            style={{
              height: 52,
              borderRadius: 16,
              border: focused
                ? '1px solid #2563EB'
                : '1px solid #E5E7EB',
              boxShadow: focused
                ? '0 0 0 4px rgba(37,99,235,.12), 0 4px 18px rgba(0,0,0,0.06)'
                : '0 4px 18px rgba(0,0,0,0.06)',
              padding: '0 14px',
            }}
          >
            <Search
              className="flex-shrink-0 mr-3"
              style={{ width: 18, height: 18, color: focused ? '#2563EB' : '#9CA3AF' }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Find an Institution..."
              aria-label="Search institutions by name"
              aria-autocomplete="list"
              aria-expanded={showDrop}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent outline-none border-0 text-sm"
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
                className="flex-shrink-0 ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDrop && (
            <div
              role="listbox"
              aria-label="Institution suggestions"
              className="absolute left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{
                top: 'calc(100% + 8px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {suggestions.map((inst, i) => (
                <SuggestionItem
                  key={inst.slug}
                  inst={inst}
                  isActive={i === activeIdx}
                  onHover={() => setActiveIdx(i)}
                  onSelect={() => {
                    setQuery(inst.name);
                    setFocused(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-500 mt-3 font-medium" aria-live="polite">
          {countLabel}
        </p>
      </div>

      {/* ── Institution Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(inst => (
            <InstitutionGridCard key={inst.slug} inst={inst} />
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-16 text-center">
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
          <h3 className="text-[15px] font-bold text-gray-700 mb-1">No institutions found.</h3>
          <p className="text-[13px] text-slate-400 mb-4">
            Try searching with another institution name.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-[#0F172A] hover:border-[#1B4D9B]/40 hover:text-[#1B4D9B] transition-all duration-200 shadow-sm"
          >
            <X style={{ width: 13, height: 13 }} />
            Clear Search
          </button>
        </div>
      )}
    </>
  );
}
