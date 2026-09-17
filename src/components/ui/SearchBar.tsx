'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Building2, Layers, X } from 'lucide-react';

import { type SearchIndexItem } from '@/types';
import { precisionSearch } from '@/lib/searchEngine';

interface Props {
  size?: 'lg' | 'md';
  defaultValue?: string;
  autoFocus?: boolean;
  searchRoute?: string;
  itemRoute?: string;
  placeholder?: string;
  ariaLabel?: string;
  dataset?: 'instruments' | 'services';
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar({ 
  size = 'md', 
  defaultValue = '', 
  autoFocus = false, 
  searchRoute = '/instruments',
  itemRoute,
  placeholder = 'Search instruments, sectors, institutions, applications...',
  ariaLabel = 'Search instruments',
  dataset = 'instruments'
}: Props) {
  const router = useRouter();
  const detailRoute = itemRoute ?? (dataset === 'services' || searchRoute.startsWith('/services') ? '/services' : searchRoute);
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchIndexItem[]>([]);
  const [allItems, setAllItems] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserTypingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch search index once
  useEffect(() => {
    fetch(`/api/search-index?dataset=${dataset}`)
      .then(r => r.json())
      .then(data => setAllItems(data))
      .catch(() => {/* silent */});
  }, [dataset]);

  useEffect(() => {
    isUserTypingRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(defaultValue);
     
    setOpen(false);
  }, [defaultValue]);

  const clearQuery = useCallback(() => {
    isUserTypingRef.current = false;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
    if (defaultValue) {
      router.push(searchRoute);
    }
  }, [defaultValue, router, searchRoute]);

  // Debounced search — delegates to unified precisionSearch engine
  const doSearch = useCallback(async (q: string, forceOpen?: boolean) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const results = await precisionSearch(q, allItems);
    const top7 = results.slice(0, 7);

    setSuggestions(top7);
    // Only open if explicitly requested OR user is actively typing
    if (forceOpen || isUserTypingRef.current) {
      setOpen(top7.length > 0);
    }
    setActiveIdx(-1);
  }, [allItems]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      doSearch(query);
    }, 180);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, doSearch]);

  // Close on outside click or mobile touch
  useEffect(() => {
    function handleOutside(e: Event) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        isUserTypingRef.current = false;
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    isUserTypingRef.current = false;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setOpen(false);
    inputRef.current?.blur();
    if (query.trim()) {
      router.push(`${searchRoute}?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect(item: SearchIndexItem) {
    isUserTypingRef.current = false;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setOpen(false);
    router.push(`${detailRoute}/${item.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    } else if (e.key === 'Escape') {
      isUserTypingRef.current = false;
      setOpen(false);
    }
  }

  const inputPadding = size === 'lg'
    ? 'py-3.5 sm:py-4 px-4 sm:px-5 pl-10 sm:pl-14 text-sm sm:text-base'
    : 'py-2 sm:py-2.5 px-3 sm:px-4 pl-9 sm:pl-10 text-xs sm:text-sm';
  const iconSize = size === 'lg' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4 h-4';
  const iconPos = size === 'lg' ? 'left-3 sm:left-4 top-1/2 -translate-y-1/2' : 'left-3 top-1/2 -translate-y-1/2';

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className={`absolute ${iconPos} ${iconSize} text-gray-400 pointer-events-none z-10`}
        />
        <input
          ref={inputRef}
          id="rink-search-input"
          type="text"
          value={query}
          onChange={e => {
            isUserTypingRef.current = true;
            setQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => { 
            if (query.trim().length >= 2 && suggestions.length > 0) {
              setOpen(true);
            }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`search-input ${inputPadding} pr-9 sm:pr-24 w-full rounded-xl sm:rounded-lg`}
          autoComplete="off"
          aria-label={ariaLabel}
          aria-autocomplete="list"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              aria-label="Clear search"
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="hidden sm:inline-flex items-center justify-center bg-[#1B4D9B] hover:bg-[#143B77] text-white py-1.5 px-3.5 text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-md shadow-sm z-50 overflow-hidden"
          role="listbox"
        >
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Suggestions
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">{suggestions.length} results</span>
              <button
                type="button"
                onClick={() => {
                  isUserTypingRef.current = false;
                  setOpen(false);
                }}
                className="sm:hidden text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded bg-slate-100/90 border border-slate-200/80 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                aria-label="Close suggestions"
              >
                <span>Close</span>
                <X className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border last:border-0 ${
                idx === activeIdx ? 'bg-accent-secondary/15 text-accent-secondary' : 'hover:bg-card-secondary'
              }`}
              role="option"
              aria-selected={idx === activeIdx}
            >
              <Search className="w-4 h-4 text-text-secondary/50 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-heading leading-snug">
                  {highlight(item.name, query)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <Building2 className="w-3 h-3" />
                    {item.institution}
                  </span>
                  <span className="text-text-secondary/40">·</span>
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <Layers className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-secondary/50 mt-1 flex-shrink-0" />
            </button>
          ))}
          <div className="px-4 py-2.5 bg-card-secondary border-t border-border">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`${searchRoute}?q=${encodeURIComponent(query)}`);
              }}
              className="text-xs text-accent-secondary font-semibold hover:underline"
            >
              View all results for &quot;{query}&quot; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
