'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ExternalLink, Building2,
  Layers, Loader2, RotateCcw
} from 'lucide-react';
import type { AISearchResponse, AISearchResult } from '@/lib/aiSearch';


// ── Parse **bold** markdown ───────────────────────────────────
function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}



// ── Single result card ────────────────────────────────────────
function ResultCard({ r }: { r: AISearchResult }) {
  const instr = r.instrument;
  const tags = Array.isArray(instr.tag) ? instr.tag : (instr.tag ? instr.tag.split(',') : []);

  return (
    <div
      className="group bg-card rounded-md border border-border p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-300"
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      {/* Name */}
      <h4 className="font-heading font-bold text-accent-secondary text-[15px] leading-snug mb-3 group-hover:text-accent transition-colors">
        {instr.instruments}
      </h4>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-text-primary bg-card-secondary px-2.5 py-1 rounded-lg border border-border">
          <Building2 size={10} className="text-text-secondary/60" /> {instr.institution_name}
        </span>
        {tags.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-text-primary bg-card-secondary px-2.5 py-1 rounded-lg border border-border">
            <Layers size={10} className="text-text-secondary/60" /> {tags[0]}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end">
        <Link
          href={`/instruments/${instr.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-lg transition-colors"
          id={`ai-result-${instr.id}`}
        >
          View Technology <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}


// ── Main AI Discovery Bar ─────────────────────────────────────
export default function AIDiscoveryBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResponse | null>(null);
  const [activeQuery, setActiveQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setResult(null);
    setActiveQuery(trimmed);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data: AISearchResponse = await res.json();
      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleReset = () => {
    setResult(null);
    setQuery('');
    setActiveQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Clean text label */}
      <div className="text-[10px] sm:text-xs font-bold text-accent uppercase tracking-widest mb-2 sm:mb-3.5 animate-fade-in">
        Describe Your Startup Idea
      </div>

      {/* ── Search box ── */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-row items-stretch w-full rounded-md overflow-hidden shadow-sm transition-all duration-300 search-glow-container">
          {/* Input container */}
          <div
            className={`flex-1 flex items-center bg-card border-2 rounded-l-2xl border-r-0 px-3 py-2.5 sm:px-4 sm:py-3.5 transition-all duration-300 ${
              loading
                ? 'border-accent'
                : result
                ? 'border-accent/30'
                : 'border-border'
            }`}
          >
            {/* Search Icon */}
            <div className="mr-3 flex-shrink-0">
              {loading ? (
                <Loader2 size={20} className="text-accent animate-spin" />
              ) : (
                <Search size={20} className="text-text-secondary" />
              )}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search technologies, patents, machinery, products, institutions, or startup opportunities..."
              className="flex-1 w-full min-w-0 bg-transparent text-heading text-[15px] outline-none placeholder:text-text-secondary placeholder:text-[13px] md:placeholder:text-[14px] border-none p-0"
              style={{ fontFamily: 'inherit' }}
              disabled={loading}
              id="ai-discovery-input"
            />

            {/* Reset */}
            {(result || query) && !loading && (
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card-secondary transition-colors flex-shrink-0"
                title="Clear search"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className={`flex-shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-r-2xl font-semibold text-xs sm:text-sm transition-all duration-200 border-2 border-transparent ${
              query.trim() && !loading
                ? 'bg-accent text-white hover:opacity-90 cursor-pointer'
                : 'bg-card-secondary text-text-secondary/40 border-border cursor-not-allowed'
            }`}
            id="ai-discover-btn"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Find Technologies</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </form>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="mt-8 space-y-4" ref={resultsRef}>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 size={14} className="text-accent-secondary animate-spin" />
              Searching for <span className="font-semibold text-text-primary">&quot;{activeQuery}&quot;</span>...
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-md border border-border p-5 animate-pulse">
              <div className="h-4 bg-card-secondary rounded w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-card-secondary rounded-lg w-28" />
                <div className="h-6 bg-card-secondary rounded-lg w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-card-secondary rounded-full w-32" />
                <div className="h-6 bg-accent-secondary/10 rounded-lg w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="mt-6" ref={resultsRef}>
          {/* Result header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-secondary/15 flex items-center justify-center">
                <Search size={14} className="text-accent-secondary" />
              </div>
              <p className="text-sm text-text-primary font-medium">
                <Bold text={result.responseMessage} />
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> New search
            </button>
          </div>

          {/* Cards grid */}
          {result.results.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.results.map(r => (
                  <ResultCard key={r.instrument.id} r={r} />
                ))}
              </div>

              {/* View all CTA */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/instruments?q=${encodeURIComponent(activeQuery)}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-accent-secondary border border-accent-secondary/20 bg-card hover:bg-card-secondary transition-colors"
                  id="ai-view-all-btn"
                >
                  <Search size={14} />
                  Browse All Results in Technology Transfer Portal
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
