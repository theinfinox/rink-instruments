# Engineering & Architecture Work Report

**Date**: July 27, 2026  
**Project**: RINK Instruments & Services Portal (`rink-instruments`)  

---

## Executive Summary

Today's work delivered major architectural upgrades, data model normalizations, search engine precision enhancements, and UI layout fixes across the RINK Instruments application:

1. **Complete Canonical Institution Normalization**: Standardized all 868 instruments and 23 research institutions onto `institution_id` as the primary key and `data.instituitiion_list` as the Single Source of Truth for display metadata.
2. **Search Engine Ranking Unification & Acronym Boosting**: Introduced word-boundary token boosting for acronyms (`SEM`, `TEM`, `XRD`, `HPLC`, `GC`, `ICP`, `AFM`), and unified the search algorithm so that autocomplete suggestions and the `/instruments?q=...` results page share the exact same ranking engine.
3. **App Router Navigation Standardization**: Replaced legacy `window.history` manipulation with Next.js App Router navigation (`router.push()` / `router.replace()`).
4. **UI Layout Clamping Fix**: Updated `InstitutionSearchGrid` from `line-clamp-2` to `line-clamp-3` with native `title` tooltips, displaying full 80-character institution names cleanly.

---

## Detailed Task Breakdown & Modifications

### 1. Canonical Institution Dataset Migration (`institution_id`)

- **Objective**: Use `data.instituitiion_list` inside `instrument.json` as the authoritative source of truth for all institution metadata, mapping via `institution_id`.
- **Files Modified**:
  - [dataFetcher.ts](file:///c:/Users/1sree/Documents/rink-instruments/src/lib/dataFetcher.ts): Introduced `fetchInstrumentBundle()` returning `{ main_data, instituitiion_list }`.
  - [InstitutionRepository.ts](file:///c:/Users/1sree/Documents/rink-instruments/src/repositories/InstitutionRepository.ts): Updated `fromInstrumentData` to populate from `instituitiion_list`, added `getInstitution(instrument)` entity resolver, and added global singleton helpers.
  - [mapper.ts](file:///c:/Users/1sree/Documents/rink-instruments/src/domain/instrument/mapper.ts): Updated `toInstrumentViewModel()` to resolve canonical names via `InstitutionRepository`.
  - [PortalManager.tsx](file:///c:/Users/1sree/Documents/rink-instruments/src/components/ui/PortalManager.tsx): Updated repository initialization to pass `institutionList` and refactored institution aggregation.
  - Page Server Components: [page.tsx (root)](file:///c:/Users/1sree/Documents/rink-instruments/src/app/page.tsx), [page.tsx (institutions/[slug])](file:///c:/Users/1sree/Documents/rink-instruments/src/app/institutions/[slug]/page.tsx), [page.tsx (instruments)](file:///c:/Users/1sree/Documents/rink-instruments/src/app/instruments/page.tsx).
- **Data Validation**: Audit script confirmed **0 missing `institution_id`s** and **0 orphan records** across all 868 instruments.

---

### 2. Search Index Endpoint Normalization

- **Objective**: Ensure `/api/search-index` returns canonical institution names in search suggestions.
- **Files Modified**:
  - [route.ts (search-index)](file:///c:/Users/1sree/Documents/rink-instruments/src/app/api/search-index/route.ts): Updated route handler to use `fetchInstrumentBundle()` and `repo.getInstitution(inst)`, setting canonical `institution` and `institution_slug`.

---

### 3. Card Title Clamping & Tooltip Fix

- **Objective**: Prevent 3-line institution names (e.g. `"ICAR - Central Plantation Crops Research Institute (CPCRI)"`) from being cut off by CSS layout rules.
- **Files Modified**:
  - [InstitutionSearchGrid.tsx](file:///c:/Users/1sree/Documents/rink-instruments/src/components/ui/InstitutionSearchGrid.tsx): Changed title container from `line-clamp-2` to `line-clamp-3` and added `title={inst.name}` hover tooltips.

---

### 4. Acronym Ranking & Word-Boundary Token Boosting

- **Objective**: Ensure short acronym queries (`SEM`, `TEM`, `XRD`, `HPLC`, `GC`, `AFM`, `NMR`, `ICP`) rank acronym-bearing instruments (e.g. `"Scanning Electron Microscope (SEM)"`) above prefix matches (`"Semiconductor..."`).
- **Files Modified**:
  - [searchEngine.ts](file:///c:/Users/1sree/Documents/rink-instruments/src/lib/searchEngine.ts): Added **Tier 3 Acronym Boundary Token Match (Score 880)** for `\bquery\b` token matches in instrument titles.
  - [route.ts (instruments/search)](file:///c:/Users/1sree/Documents/rink-instruments/src/app/api/instruments/search/route.ts): Removed case-sensitive `isUppercase` requirement so `sem`, `SEM`, and `Sem` are evaluated identically.

---

### 5. Search Pipeline Unification Across Autocomplete & Results Page

- **Objective**: Eliminate ranking discrepancies between autocomplete dropdown suggestions and the search results page.
- **Files Modified**:
  - [SearchBar.tsx](file:///c:/Users/1sree/Documents/rink-instruments/src/components/ui/SearchBar.tsx): Replaced un-ranked `Array.prototype.filter()` substring logic with direct calls to `precisionSearch(q, allItems).slice(0, 7)`.
  - [page.tsx (instruments)](file:///c:/Users/1sree/Documents/rink-instruments/src/app/instruments/page.tsx): Replaced un-ranked `filtered.filter(includes(q))` with `precisionSearch(params.q, searchIndex)`.
- **Outcome**: Typing `SEM` in the search bar and pressing Enter now produce the **exact same ranked order** across both views.

---

### 6. App Router Navigation Refactor

- **Objective**: Enforce Next.js App Router navigation best practices and remove history API workarounds.
- **Files Modified**:
  - Pages & Navigation Components: Replaced manual `window.history.pushState()` / `replaceState()` calls with `router.push()` / `router.replace()`, preserving native browser back/forward navigation history (`/` -> `/services` -> `/services/list`).

---

## File Modification Log

| File Path | Description of Changes |
| :--- | :--- |
| `src/lib/dataFetcher.ts` | Added `fetchInstrumentBundle()` |
| `src/repositories/InstitutionRepository.ts` | Added `fromInstrumentData` dual-dataset support, `getInstitution()`, singleton helpers |
| `src/domain/instrument/mapper.ts` | Connected `toInstrumentViewModel` to `InstitutionRepository` |
| `src/components/ui/PortalManager.tsx` | Passed `institutionList` to `InstitutionRepository` |
| `src/app/page.tsx` | Updated homepage server component to fetch instrument bundle |
| `src/app/institutions/[slug]/page.tsx` | Updated institution detail page to fetch instrument bundle |
| `src/app/instruments/page.tsx` | Updated `/instruments` page to fetch bundle and use `precisionSearch()` |
| `src/app/api/search-index/route.ts` | Normalized search index route to use `InstitutionRepository` canonical names |
| `src/components/ui/HeroAISearch.tsx` | Updated result cards to use `toInstrumentViewModel()` |
| `src/components/ui/InstitutionSearchGrid.tsx` | Updated layout to `line-clamp-3` with `title` tooltips |
| `src/lib/searchEngine.ts` | Added Tier 3 acronym word-boundary boosting (score 880) |
| `src/app/api/instruments/search/route.ts` | Made short-word exact matching case-agnostic |
| `src/components/ui/SearchBar.tsx` | Unified autocomplete ranking with `precisionSearch()` |

---

## Verification & Build Summary

- ✅ **TypeScript Verification**: `0` errors across the entire codebase.
- ✅ **Production Build**: Next.js 16 Turbopack build completed in **3.2s** with **911 static pages** prerendered cleanly.
- ✅ **Data Integrity**: 100% clean mapping across 868 instruments and 23 canonical institutions.
