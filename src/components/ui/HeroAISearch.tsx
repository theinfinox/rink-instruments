'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, Building2, Layers, RotateCcw } from 'lucide-react';
import type { AISearchResponse, AISearchResult } from '@/lib/aiSearch';

const PLACEHOLDERS = [
  'Describe your startup idea...',
  'Looking for breast cancer screening technologies?',
  'Search food processing technologies...',
  'Explore renewable energy innovations...',
  'Find startup-ready research technologies...',
];

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-white">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

function ResultCard({ r }: { r: AISearchResult }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vm = (r as any).viewModel;
  if (!vm) return null;
  const tags = vm.tags || [];
  return (
    <Link
      href={`/instruments/${vm.id}`}
      className="block bg-white/5 border border-white/10 backdrop-blur-sm rounded-md p-4 hover:border-[#F5B400]/40 hover:bg-white/[0.08] transition-all"
    >
      <div className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2">{vm.displayTitle}</div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-300">
        <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3 opacity-70" /> {vm.institution}</span>
        {tags.length > 0 && <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3 opacity-70" /> {tags[0]}</span>}
      </div>
    </Link>
  );
}

export default function HeroAISearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResponse | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder
  useEffect(() => {
    if (focused || query) return;
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [focused, query]);

  async function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setResult(null);
    setActiveQuery(trimmed);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data: AISearchResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        results: [],
        query: trimmed,
        intent: 'empty',
        responseMessage: 'Could not connect to the RINK database. Please try again.',
        totalFound: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function reset() {
    setResult(null);
    setQuery('');
    setActiveQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Search container */}
      <form onSubmit={handleSubmit} className="w-full max-w-[1000px] flex justify-center">
        <div
          className={`hero-search-container relative flex items-center w-full rounded-[28px] overflow-hidden transition-all duration-300 ${focused ? 'focused' : ''}`}
          style={{
            height: 90,
            background: 'rgba(10,29,55,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: focused ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: focused
              ? '0 10px 40px rgba(0,0,0,0.25), 0 0 30px rgba(59,130,246,0.20)'
              : '0 10px 40px rgba(0,0,0,0.25)',
          }}
        >
          <span className="pl-5 md:pl-7 flex-shrink-0 text-slate-400">
            <Search className="hero-search-icon w-6 h-6 transition-colors" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            aria-label="Search technologies"
            className="hero-search-input w-full h-full py-4 px-4 md:px-5 bg-transparent text-white text-lg md:text-xl placeholder:text-slate-400 focus:outline-none font-sans min-w-0 placeholder:transition-opacity placeholder:duration-500"
          />
          {(query || result) && !loading && (
            <button
              type="button"
              onClick={reset}
              title="Clear"
              className="flex-shrink-0 p-3 mr-1 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="hero-search-btn flex-shrink-0 h-full px-7 sm:px-10 bg-[#F5B400] hover:bg-yellow-500 disabled:opacity-60 text-slate-900 font-bold text-base md:text-lg transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-[#F5B400]" />
          Searching for <span className="font-semibold text-white">&ldquo;{activeQuery}&rdquo;</span>…
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-6 w-full max-w-[1000px] animate-fade-in">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-md p-4 text-slate-200 text-sm leading-relaxed">
            <Bold text={result.responseMessage} />
          </div>

          {result.results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {result.results.map((r) => (
                  <ResultCard key={r.instrument.id} r={r} />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Link
                  href={`/instruments?q=${encodeURIComponent(activeQuery)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5B400] hover:underline"
                >
                  Browse all results <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
