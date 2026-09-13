'use client';

import { useState, useMemo } from 'react';
import { InstrumentViewModel } from '@/domain/instrument/view-model';
import TechnologyCard from '@/components/ui/TechnologyCard';
import { Search, X, FlaskConical, SlidersHorizontal } from 'lucide-react';

interface Props {
  initialInstruments: InstrumentViewModel[];
  institutionName?: string;
}

export default function InstitutionFilterView({ initialInstruments, institutionName }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('all');

  // Discover all unique facilities at this institution
  const facilities = useMemo(() => {
    const map = new Map<string, number>();
    initialInstruments.forEach(inst => {
      const fac = inst.facility?.trim();
      if (fac) {
        map.set(fac, (map.get(fac) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [initialInstruments]);

  // Filter instruments by query and facility
  const filteredInstruments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return initialInstruments.filter(inst => {
      // 1. Facility filter
      if (selectedFacility !== 'all') {
        const fac = inst.facility?.trim();
        if (fac !== selectedFacility) return false;
      }

      // 2. Search query filter
      if (!q) return true;

      const title = (inst.title || '').toLowerCase();
      const acronym = (inst.acronym || '').toLowerCase();
      const facility = (inst.facility || '').toLowerCase();
      const location = (inst.location?.district || '').toLowerCase();
      const tags = (inst.tags || []).join(' ').toLowerCase();

      return (
        title.includes(q) ||
        acronym.includes(q) ||
        facility.includes(q) ||
        location.includes(q) ||
        tags.includes(q)
      );
    });
  }, [initialInstruments, searchQuery, selectedFacility]);

  const hasActiveFilters = searchQuery !== '' || selectedFacility !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFacility('all');
  };

  return (
    <div className="space-y-6">
      {/* ── Search Bar & Filter Controls ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search instruments by name, acronym, or facility...`}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2164]/20 focus:border-[#0A2164] transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results Count & Reset */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-sans text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-semibold">{filteredInstruments.length}</strong> of{' '}
              <strong className="text-slate-900 font-semibold">{initialInstruments.length}</strong> instruments
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#0A2164] hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Facility Filters (rendered only if institution has multiple facilities) */}
        {facilities.length > 1 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Filter by Facility:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedFacility('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedFacility === 'all'
                    ? 'bg-[#0A2164] text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                All Facilities ({initialInstruments.length})
              </button>
              {facilities.map((fac) => {
                const isSelected = selectedFacility === fac.name;
                return (
                  <button
                    key={fac.name}
                    type="button"
                    onClick={() => setSelectedFacility(fac.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#0A2164] text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {fac.name} ({fac.count})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Instruments Grid ── */}
      {filteredInstruments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-6">
          <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
          <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
            No Instruments Found
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-4 font-sans">
            {searchQuery
              ? `We couldn't find any instruments matching "${searchQuery}" at this institution.`
              : `No instruments are currently available in the selected facility.`}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A2164] text-white text-xs font-semibold hover:bg-blue-900 transition-colors shadow-2xs"
            >
              Clear filters &amp; view all {initialInstruments.length} instruments
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredInstruments.map((instrument) => (
            <TechnologyCard key={instrument.id} instrument={instrument} />
          ))}
        </div>
      )}
    </div>
  );
}
