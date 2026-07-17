'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Building2, Layers } from 'lucide-react';

import { type SearchIndexItem } from '@/types';

interface Props {
  size?: 'lg' | 'md';
  defaultValue?: string;
  autoFocus?: boolean;
  searchRoute?: string;
  placeholder?: string;
  ariaLabel?: string;
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
  searchRoute = '/technologies',
  placeholder = 'Search technologies, sectors, institutions, applications...',
  ariaLabel = 'Search technologies'
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchIndexItem[]>([]);
  const [allItems, setAllItems] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch search index once
  useEffect(() => {
    fetch('/api/search-index')
      .then(r => r.json())
      .then(data => setAllItems(data))
      .catch(() => {/* silent */});
  }, []);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const ql = q.toLowerCase();
    const matched = allItems.filter(item =>
      item.name.toLowerCase().includes(ql) ||
      item.institution.toLowerCase().includes(ql) ||
      item.category.toLowerCase().includes(ql) ||
      item.keywords.some(k => k.toLowerCase().includes(ql)) ||
      item.problem_solved.toLowerCase().includes(ql)
    ).slice(0, 7);

    setSuggestions(matched);
    setOpen(matched.length > 0);
    setActiveIdx(-1);
  }, [allItems]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 180);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`${searchRoute}?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect(item: SearchIndexItem) {
    setOpen(false);
    router.push(`${searchRoute}/${item.id}`);
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
      setOpen(false);
    }
  }

  const inputPadding = size === 'lg'
    ? 'py-4 px-5 pl-14 text-base'
    : 'py-3 px-4 pl-12 text-sm';
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const iconPos = size === 'lg' ? 'left-4 top-4' : 'left-3.5 top-3.5';

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
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`search-input ${inputPadding} pr-24`}
          autoComplete="off"
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm"
        >
          Search
        </button>
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
            <span className="text-xs text-text-secondary">{suggestions.length} results</span>
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
