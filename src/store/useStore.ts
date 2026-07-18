import { create } from 'zustand';
import { Instrument } from '@/types/instrument';
import { classifyInstitution } from '@/lib/utils/filterConstants';
import { CDN_HOST } from '@/lib/utils';
import type { Orama } from '@orama/orama';


export interface FilterGroupItem {
  label: string;
  value: string;
}

export interface TaxonomyCategory {
  id: string;
  title: string;
  gid?: number | null;
  tabKey?: string | null;
  linkType?: 'join';
  groups: Record<string, Array<string | FilterGroupItem>>;
}

interface ActiveFilters {
  dynamicFilters: Record<string, string[]>;
  institutionTypes: string[];
  instantBooking: boolean;
  hasPhone: boolean;
  hasEmail: boolean;
  hasVerifiedImage: boolean;
  showWarnings: boolean;
}

export interface AppState {
  instruments: Instrument[];
  isLoading: boolean;
  error: string | null;
  hasLoadedOnce: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oramaInstance: Orama<any> | null;
  
  searchQuery: string;
  draftSearchQuery: string;
  activeFilters: ActiveFilters;
  filteredData: Instrument[];

  viewMode: 'grid' | 'list';
  activeTab: 'instruments' | 'services';
  
  dynamicTaxonomy: TaxonomyCategory[];
  isUsingFallbackFilters: boolean;

  fetchData: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setDraftSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setActiveTab: (tab: 'instruments' | 'services') => void;
  toggleDynamicFilter: (category: string, value: string) => void;
  toggleInstitutionTypeFilter: (type: string) => void;
  setBooleanFilter: (key: keyof ActiveFilters, value: boolean) => void;
  removeFilter: (type: keyof ActiveFilters, value: string | boolean) => void;
  clearAllFilters: () => void;
  performSearch: () => Promise<void>;

}

export const useStore = create<AppState>((set, get) => ({
  instruments: [],
  isLoading: false,
  hasLoadedOnce: false,
  error: null,
  oramaInstance: null,

  searchQuery: '',
  draftSearchQuery: '',
  activeFilters: {
    dynamicFilters: {},
    institutionTypes: [],
    instantBooking: false,
    hasPhone: false,
    hasEmail: false,
    hasVerifiedImage: false,
    showWarnings: true
  },
  filteredData: [],

  viewMode: 'grid',
  activeTab: 'instruments',

  dynamicTaxonomy: [],
  isUsingFallbackFilters: true,

  setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }),
  setActiveTab: (tab: 'instruments' | 'services') => set({ activeTab: tab }),

  fetchData: async () => {
    if (get().isLoading || get().hasLoadedOnce) return;

    set({ isLoading: true, error: null });

    try {
      // 1. Fetch data and filters in parallel
      const [dataResponse, filtersResponse] = await Promise.all([
        fetch(`${CDN_HOST}/instrument.json`),
        fetch(`${CDN_HOST}/api/instrument/filters.json`).catch(() => null)
      ]);

      if (!dataResponse.ok) throw new Error(`Failed to fetch instrument.json: ${dataResponse.statusText}`);

      // 2. Process filters FIRST so we know which tabKey to load items from
      let fetchedTaxonomy: TaxonomyCategory[] = [];
      let usingFallback = true;

      if (filtersResponse && filtersResponse.ok) {
        try {
          const rawTaxonomy = await filtersResponse.json();
          if (Array.isArray(rawTaxonomy)) {
            fetchedTaxonomy = rawTaxonomy;
            usingFallback = false;
          }
        } catch {
          console.warn("Failed to parse filters.json, falling back to static constants.");
        }
      }

      // 3. Determine which tab to load items from:
      //    - Use the tabKey from the first filter category that has one
      //    - Fallback to first key of the object
      //    - Fallback to flat array
      const data = await dataResponse.json();
      const rawData = data.main_data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let tabRows: any[];

      if (Array.isArray(rawData)) {
        tabRows = rawData;
      } else {
        const primaryTabKey = fetchedTaxonomy.find(c => c.tabKey)?.tabKey;
        if (primaryTabKey && rawData[primaryTabKey]) {
          tabRows = rawData[primaryTabKey];
          console.log(`📦 Loading items from tab: '${primaryTabKey}' (resolved from filters.json)`);
        } else {
          // Last resort: first key in the object
          const firstKey = Object.keys(rawData)[0];
          tabRows = rawData[firstKey] || [];
          console.log(`📦 Loading items from first tab key: '${firstKey}' (fallback)`);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const safeData = tabRows.map((item: any) => {
        const instruments = item.instruments || '';
        const instruments1 = item.column_3 || item.instruments1 || '';

        return {
          id: item.id || '',
          instruments,
          instruments1,
          search_instruments: instruments.replace(/[-_/]/g, ' ').toLowerCase(),
          search_instruments1: instruments1.replace(/[-_/]/g, ' ').toLowerCase(),
          acronym: item.acronym || '',
          image_link: item.image_link || '',
          district: item.district || '',
          standardized_district: item.standardized_district || item.district || '',
          name_of_facility: item.name_of_facility || '',
          institution_name: item.institution_name || '',
          address: item.address || '',
          enquiry_contact_number: item.enquiry_contact_number || '',
          enquiry_mail: item.enquiry_mail || '',
          website_booking_link: item.website_booking_link || '',
          website_booking_link_fallback: item.website_booking_link_fallback || '',
          tag: Array.isArray(item.tag) ? item.tag.join(', ') : (item.tag || ''),
          provider_key: item.provider_key || item.id || '',
          correct_provider_key: item.correct_provider_key || '',
          warnings: 'CLEAN',
        };
      }) as Instrument[];

      if (!get().activeFilters.institutionTypes?.length && Object.keys(get().activeFilters.dynamicFilters || {}).length === 0) {
        set({ 
          instruments: safeData, 
          filteredData: safeData,
          isLoading: false,
          hasLoadedOnce: true,
          dynamicTaxonomy: fetchedTaxonomy,
          isUsingFallbackFilters: usingFallback
        });
      } else {
        set({ 
          instruments: safeData,
          isLoading: false,
          hasLoadedOnce: true,
          dynamicTaxonomy: fetchedTaxonomy,
          isUsingFallbackFilters: usingFallback
        });
      }
      
      // Initialize filtered data
      get().performSearch();
    } catch (error) {
      console.error("Error fetching and indexing data:", error);
      set({ 
        error: (error as Error).message, 
        isLoading: false,
        hasLoadedOnce: true // Prevent infinite retries if it fails completely
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, draftSearchQuery: query }); 
    get().performSearch();
  },

  setDraftSearchQuery: (query: string) => {
    set({ draftSearchQuery: query });
  },

  toggleDynamicFilter: (category: string, value: string) => {
    const { activeFilters } = get();
    const currentValues = activeFilters.dynamicFilters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
      
    const newDynamicFilters = { ...activeFilters.dynamicFilters };
    if (newValues.length === 0) {
      delete newDynamicFilters[category];
    } else {
      newDynamicFilters[category] = newValues;
    }
    
    set({ activeFilters: { ...activeFilters, dynamicFilters: newDynamicFilters } });
    get().performSearch();
  },

  toggleInstitutionTypeFilter: (type: string) => {
    const { activeFilters } = get();
    const newTypes = activeFilters.institutionTypes.includes(type)
      ? activeFilters.institutionTypes.filter(t => t !== type)
      : [...activeFilters.institutionTypes, type];
    set({ activeFilters: { ...activeFilters, institutionTypes: newTypes } });
    get().performSearch();
  },

  setBooleanFilter: (key: keyof ActiveFilters, value: boolean) => {
    const { activeFilters } = get();
    set({ activeFilters: { ...activeFilters, [key]: value } });
    get().performSearch();
  },

  removeFilter: (type: keyof ActiveFilters, value: string | boolean) => {
    const { activeFilters } = get();
    if (typeof value === 'boolean') {
      set({ activeFilters: { ...activeFilters, [type]: false } });
    } else {
      const currentArray = activeFilters[type] as string[];
      set({ activeFilters: { ...activeFilters, [type]: currentArray.filter(v => v !== value) } });
    }
    get().performSearch();
  },

  clearAllFilters: () => {
    const { activeFilters } = get();
    set({
      activeFilters: {
        dynamicFilters: {},
        institutionTypes: [],
        instantBooking: false,
        hasPhone: false,
        hasEmail: false,
        hasVerifiedImage: false,
        showWarnings: activeFilters.showWarnings // keep admin setting
      }
    });
    get().performSearch();
  },

  performSearch: async () => {
    const { searchQuery, activeFilters, instruments } = get();
    let oramaInstance = get().oramaInstance;
    
    let baseData = instruments;

    // 1. Detect if the user left a trailing space BEFORE trimming
    const hasTrailingSpace = searchQuery.endsWith(' ');
    const cleanQuery = searchQuery.trim();

    if (cleanQuery) {
      try {
        // Try server-side search first!
        const res = await fetch(`/api/instruments/search?q=${encodeURIComponent(searchQuery)}`, {
          signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
        });
        
        if (!res.ok) throw new Error('API Search Failed');
        
        const data = await res.json();
        const matchingIds: string[] = data.hits || [];
        baseData = instruments.filter(i => matchingIds.includes(i.id || ''));

      } catch (error) {
        console.warn("Server search failed, falling back to client-side Orama", error);

        // FALLBACK: Build Orama dynamically and search locally
        if (!oramaInstance) {
          const { create: createOrama, insertMultiple } = await import('@orama/orama');
          
          oramaInstance = await createOrama({
            schema: {
              search_instruments: 'string',
              search_instruments1: 'string',
              instruments: 'string',
              instruments1: 'string',
              acronym: 'string',
              district: 'string',
              name_of_facility: 'string',
              institution_name: 'string',
              address: 'string',
              standardized_district: 'string',
              correct_provider_key: 'string',
              tag: 'string',
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await insertMultiple(oramaInstance, instruments as any);
          set({ oramaInstance });
        }

        const { search: oramaSearch } = await import('@orama/orama');

        const isUppercase = cleanQuery === cleanQuery.toUpperCase() && /[A-Z]/.test(cleanQuery);
        const isShortWord = cleanQuery.length >= 2 && cleanQuery.length <= 6 && !cleanQuery.includes(' ');
        const forceExactMatch = (isUppercase && isShortWord) || (hasTrailingSpace && cleanQuery.length > 0);
        const normalizedTerm = cleanQuery.replace(/[-_/]/g, ' ').toLowerCase();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchParams: any = {
          term: normalizedTerm,
          limit: 1000,
          properties: ['search_instruments', 'search_instruments1', 'institution_name'],
          boost: {
            search_instruments: 100,
            search_instruments1: 80,
            institution_name: 40
          },
          exact: forceExactMatch,
          tolerance: forceExactMatch ? 0 : 1,
        };

        const results = await oramaSearch(oramaInstance, searchParams);
        baseData = results.hits.map((hit: Record<string, unknown>) => hit.document as unknown as Instrument);
      }
    }

    const newFilteredData = baseData.filter(item => {
      // Admin Warning Filter
      if (!activeFilters.showWarnings) {
        if (item.warnings !== 'CLEAN') return false;
      }

      // Dynamic category filters
      for (const [category, selectedValues] of Object.entries(activeFilters.dynamicFilters)) {
        if (selectedValues.length === 0) continue;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemVal = (item as any)[category];
        if (!itemVal) return false;
        
        const itemVals = Array.isArray(itemVal) 
          ? itemVal.map(String)
          : [String(itemVal)];
          
        // selectedValues are always raw key values (for join: the foreign key value)
        const hasMatching = selectedValues.some(v => itemVals.includes(v));
        if (!hasMatching) return false;
      }

      // Institution Type Filter
      if (activeFilters.institutionTypes.length > 0) {
        const type = classifyInstitution(item.institution_name);
        if (!activeFilters.institutionTypes.includes(type)) return false;
      }

      // Instant Booking Filter
      if (activeFilters.instantBooking) {
        const hasLink = (item.website_booking_link && item.website_booking_link.length > 0) || 
                        (item.website_booking_link_fallback && item.website_booking_link_fallback.length > 0);
        if (!hasLink) return false;
      }

      // Has Phone Filter
      if (activeFilters.hasPhone) {
        if (!item.enquiry_contact_number || item.enquiry_contact_number.length === 0) return false;
      }

      // Has Email Filter
      if (activeFilters.hasEmail) {
        if (!item.enquiry_mail || item.enquiry_mail.length === 0) return false;
      }

      // Has Verified Image
      if (activeFilters.hasVerifiedImage) {
        if (!item.image_link || item.image_link.length === 0) return false;
      }

      return true;
    });

    set({ filteredData: newFilteredData });
  }
}));
