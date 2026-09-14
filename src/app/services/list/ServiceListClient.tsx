'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Service } from '@/types/service';
import ServiceCard from '@/components/ui/ServiceCard';
import SmartPagination from '@/components/ui/SmartPagination';
import SearchBar from '@/components/ui/SearchBar';
import {
  Filter, X, ChevronRight, ChevronDown,
  LayoutGrid, List, Loader2
} from 'lucide-react';

interface LocalSearchResult {
  services: Service[];
  total: number;
  page: number;
  per_page: number;
}

interface InitialFilters {
  q: string;
  district: string;
}

interface Props {
  initialResult: LocalSearchResult;
  districts: string[];
  totalCount: number;
  initialFilters: InitialFilters;
}

export default function ServiceListClient({
  initialResult, districts, initialFilters
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  function buildUrl(overrides: Partial<InitialFilters> & { page?: string }) {
    const merged = { ...filters, ...overrides };
    const params = new URLSearchParams();
    if (merged.q) params.set('q', merged.q);
    if (merged.district) params.set('district', merged.district);
    const p = (overrides as { page?: string }).page;
    if (p && p !== '1') params.set('page', p);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function applyFilter(key: keyof InitialFilters, value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    startTransition(() => {
      router.push(buildUrl({ [key]: value, page: '1' }));
    });
  }

  function clearFilters() {
    const empty: InitialFilters = { q: '', district: '' };
    setFilters(empty);
    startTransition(() => router.push(pathname));
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const { services, total, page, per_page } = initialResult;
  const totalPages = Math.ceil(total / per_page);

  const currentDistrict = districts.find(
    d => d.toLowerCase() === filters.district.toLowerCase()
  );
  const districtDisplayName = currentDistrict || filters.district;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-3 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            {hasActiveFilters ? (
              <Link href="/services/list" className="hover:text-accent transition-colors">
                All Services
              </Link>
            ) : (
              <span className="text-text-primary font-medium">All Services</span>
            )}
            {filters.district && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <span className="text-accent font-semibold">{districtDisplayName}</span>
              </>
            )}
            {filters.q && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <span className="text-accent font-semibold">&ldquo;{filters.q}&rdquo;</span>
              </>
            )}
          </nav>

          <div>
            <h1 className="text-xl md:text-3xl font-heading font-bold text-heading">
              {filters.district ? `Services in ${districtDisplayName}` : 'All Services'}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Showing {total} {total === 1 ? 'service' : 'services'} from Kerala startups{filters.district ? ` in ${districtDisplayName}` : ''}.
              {filters.q && <span> matching &ldquo;<strong>{filters.q}</strong>&rdquo;</span>}
            </p>
          </div>

          {/* Scalable Two-Tier Control Deck */}
          <div className="mt-5 bg-card-secondary/60 border border-border rounded-xl p-3.5 sm:p-4 space-y-3">
            {/* Tier 1: Search Bar (prominent) + View Mode Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <SearchBar 
                  defaultValue={filters.q} 
                  searchRoute="/services/list"
                  itemRoute="/services"
                  placeholder="Search services, startups..."
                  ariaLabel="Search services"
                  dataset="services"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0 bg-card shadow-2xs">
                <button
                  id="grid-view-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-accent-secondary text-white' : 'text-text-secondary/60 hover:bg-card-secondary'}`}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  id="list-view-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-accent-secondary text-white' : 'text-text-secondary/60 hover:bg-card-secondary'}`}
                  title="List view"
                  aria-label="List view"
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Tier 2: Extensible Filter Facets Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              {/* District Dropdown */}
              <div className="relative w-full sm:w-auto sm:min-w-[180px] flex-1 sm:flex-none">
                <select
                  id="filter-district"
                  value={filters.district ? districtDisplayName : ''}
                  onChange={e => applyFilter('district', e.target.value)}
                  className="w-full text-xs font-semibold border border-border rounded-lg px-3 py-2 sm:py-2.5 bg-card text-text-primary focus:outline-none focus:border-accent hover:border-accent/40 transition-colors cursor-pointer appearance-none pr-8 shadow-2xs"
                  aria-label="Filter by district"
                >
                  <option value="">All Districts ({districts.length})</option>
                  {districts.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-secondary">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Tier 3: Active Filter Chips */}
            {hasActiveFilters && (
              <div className="pt-2.5 border-t border-border/80" id="active-filter-chips">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Active Filters
                  </span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold py-0.5 px-1 cursor-pointer transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {filters.district && (
                    <button
                      type="button"
                      onClick={() => applyFilter('district', '')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1B4D9B] border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors group cursor-pointer shadow-2xs"
                      title="Remove district filter"
                    >
                      <span>District: <strong>{districtDisplayName}</strong></span>
                      <X className="w-3 h-3 text-blue-500 group-hover:text-red-500 transition-colors" />
                    </button>
                  )}

                  {filters.q && (
                    <button
                      type="button"
                      onClick={() => applyFilter('q', '')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      title="Clear search query"
                    >
                      <span>Query: &ldquo;<strong>{filters.q}</strong>&rdquo;</span>
                      <X className="w-3 h-3 text-slate-500 group-hover:text-red-500 transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: 100% Full-Width Grid (Zero Layout Shift) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        {isPending && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent-secondary animate-spin" />
          </div>
        )}

        {!isPending && services.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-card-secondary flex items-center justify-center mx-auto mb-4">
              <Filter className="w-7 h-7 text-text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No services found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        )}

        {!isPending && services.length > 0 && (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
                : 'flex flex-col gap-3'
            }>
              {services.map((svc) => (
                <ServiceCard key={svc.id || svc.serviceName} service={svc} compact={viewMode === 'list'} />
              ))}
            </div>

            {/* Smart Dynamic Pagination */}
            <SmartPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                startTransition(() => router.push(buildUrl({ page: String(newPage) })));
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
