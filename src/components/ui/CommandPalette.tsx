'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ArrowRight, Building2, Layers, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { type SearchIndexItem } from '@/types';
import { precisionSearch } from '@/lib/searchEngine';

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 text-blue-900 rounded px-0.5 font-medium">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchIndexItem[]>([]);
  const [allItems, setAllItems] = useState<SearchIndexItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isServices = pathname?.startsWith('/services') || false;
  const dataset = isServices ? 'services' : 'instruments';
  const detailRoute = isServices ? '/services' : '/instruments';

  // Toggle Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch index when opened
  useEffect(() => {
    if (open && allItems.length === 0) {
      setLoading(true);
      fetch(`/api/search-index?dataset=${dataset}`)
        .then(r => r.json())
        .then(data => {
          setAllItems(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open, dataset, allItems.length]);

  // Handle Search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setActiveIdx(-1);
      return;
    }
    const results = await precisionSearch(q, allItems);
    setSuggestions(results.slice(0, 10)); // top 10 for palette
    setActiveIdx(0);
  }, [allItems]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 150);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSelect = (item: SearchIndexItem) => {
    setOpen(false);
    setQuery('');
    router.push(`${detailRoute}/${item.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0 && suggestions[activeIdx]) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    }
  };

  // Prevent background scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden mx-4 ring-1 ring-black/5"
          >
            <div className="flex items-center px-4 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Search ${isServices ? 'services' : 'instruments'}...`}
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder-slate-400 font-sans"
              />
              <div className="flex items-center gap-1.5 ml-3">
                <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 text-xs font-medium text-slate-500 bg-slate-100 rounded border border-slate-200 shadow-sm font-sans">
                  ESC
                </kbd>
                <button onClick={() => setOpen(false)} className="sm:hidden text-slate-400 p-1">
                   Esc
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {loading && allItems.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500">Loading directory...</div>
              )}

              {!loading && query && suggestions.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-600 font-medium">No results found.</p>
                  <p className="text-slate-400 text-sm mt-1">Try tweaking your search terms.</p>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isServices ? 'Services' : 'Instruments'}
                  </div>
                  <ul className="px-2 pb-2">
                    {suggestions.map((item, idx) => {
                      const isSelected = idx === activeIdx;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${
                              isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-white shadow-sm text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                              <Command className="w-4 h-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate leading-snug">
                                {highlight(item.name, query)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`flex items-center gap-1 text-xs ${isSelected ? 'text-blue-600/80' : 'text-slate-500'}`}>
                                  <Building2 className="w-3 h-3" />
                                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{item.institution}</span>
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className={`flex items-center gap-1 text-xs ${isSelected ? 'text-blue-600/80' : 'text-slate-500'}`}>
                                  <Layers className="w-3 h-3" />
                                  <span className="truncate">{item.category}</span>
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1.5">
                   <kbd className="font-sans px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-sm">↑</kbd>
                   <kbd className="font-sans px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-sm">↓</kbd>
                   to navigate
                 </span>
                 <span className="flex items-center gap-1.5">
                   <kbd className="font-sans px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-sm">↵</kbd>
                   to select
                 </span>
               </div>
               <div className="hidden sm:block font-medium">RINK Portal</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
