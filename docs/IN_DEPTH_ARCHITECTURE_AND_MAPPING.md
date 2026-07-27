# RINK Instruments Portal — Comprehensive Architecture & Data Mapping Guide

> **Authoritative Technical Specification & Blueprint**  
> *Repository:* `rink-instruments` (`theinfinox/rink-instruments`)  
> *Framework:* Next.js 16.2.6 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Zustand 5, Orama 3  

---

## Table of Contents
1. [Executive Summary & Architectural Overview](#1-executive-summary--architectural-overview)
2. [Data Source, Synchronisation & CDN Pipeline](#2-data-source-synchronisation--cdn-pipeline)
3. [Domain Types & Schema Definitions](#3-domain-types--schema-definitions)
4. [Data Mapping & Transformation Layer](#4-data-mapping--transformation-layer)
   - [4.1 Raw Instrument to InstrumentViewModel Mapping](#41-raw-instrument-to-instrumentviewmodel-mapping)
   - [4.2 Service Data Mapping](#42-service-data-mapping)
   - [4.3 Image URL Resolution Strategy](#43-image-url-resolution-strategy)
5. [State Management & Client Hydration (Zustand Store)](#5-state-management--client-hydration-zustand-store)
6. [Search Engine Architectures](#6-search-engine-architectures)
   - [6.1 Server-Assisted Orama API Search](#61-server-assisted-orama-api-search)
   - [6.2 Client-Side Fallback Orama Search](#62-client-side-fallback-orama-search)
   - [6.3 12-Tier Precision Search Engine](#63-12-tier-precision-search-engine)
   - [6.4 AI Natural Language / Vector Search](#64-ai-natural-language--vector-search)
7. [Routing, Page Layouts & Component Design](#7-routing-page-layouts--component-design)
   - [7.1 Layout Isolation & Navigation Control](#71-layout-isolation--navigation-control)
   - [7.2 Page & Route Catalog](#72-page--route-catalog)
   - [7.3 Design System & Motion System](#73-design-system--motion-system)
8. [Configuration & Administration Tooling (`yaml-builder`)](#8-configuration--administration-tooling-yaml-builder)
9. [Build, Deployment & Verification Workflow](#9-build-deployment--verification-workflow)

---

## 1. Executive Summary & Architectural Overview

The **RINK Instruments Portal** (`rink-instruments`) is a high-performance, static-first JAMstack web application designed for discovering high-end scientific equipment, research instruments, and specialized R&D services across academic and government institutions in Kerala.

### Core Architectural Pillars
- **Decoupled Backend Data Sync:** The application does not connect directly to an SQL or NoSQL database. Instead, an external automated CRON sync script (`rink-git-cron`) pulls data from Google Sheets, converts raw field names into snake_case, generates normalized JSON files (`instrument.json`, `services.json`, `api/instrument/filters.json`), and publishes them to Vercel CDN.
- **Hybrid Data Fetching Strategy (SSG + ISR + Client Store):**
  - **Build-Time Generation (SSG):** Detail routes (`/instruments/[id]`, `/institutions/[slug]`, `/services/[id]`) pre-render HTML pages at build time via Next.js `generateStaticParams()`.
  - **Incremental Static Regeneration (ISR):** Pages revalidate static content periodically (60-second window) without requiring full application rebuilds.
  - **Client-Side Hydration:** The frontend fetches fresh JSON manifests at runtime via Zustand (`useStore.ts`) to enable instant filtering, search, and dynamic taxonomy rendering.
- **Zero-Latency In-Memory Search:** Search queries are evaluated through a hybrid multi-tier search system combining server-assisted Orama endpoints, client-side Orama full-text indexes, and deterministic heuristic scoring.

```
 +------------------------+        +--------------------------+        +--------------------------+
 |  Google Sheets (CMS)   | -----> | rink-git-cron (Sync)    | -----> | Vercel CDN Host          |
 |  - Equipment Sheets    |        | - Normalizes field names |        | - instrument.json        |
 |  - R&D Services Sheets |        | - Formats WebP images    |        | - services.json          |
 +------------------------+        +--------------------------+        | - filters.json           |
                                                                       +--------------------------+
                                                                                    |
                                                                                    v
                                                                       +--------------------------+
                                                                       | rink-instruments App     |
                                                                       | - SSG / ISR Static Pages |
                                                                       | - Zustand Global Store   |
                                                                       | - Orama Search Engine    |
                                                                       +--------------------------+
```

---

## 2. Data Source, Synchronisation & CDN Pipeline

Data origin and distribution are governed by the following environment configuration:

```typescript
// src/lib/utils.ts
export const CDN_HOST = process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://rink-git-cron.vercel.app';
```

### Ingested JSON Endpoints
1. **`${CDN_HOST}/instrument.json`**: Main equipment catalog containing the `main_data` object or array.
2. **`${CDN_HOST}/services.json`**: Startup R&D services catalog containing `main_services`.
3. **`${CDN_HOST}/api/instrument/filters.json`**: Dynamic filter taxonomy tree defining sidebar filter categories, group items, and sheet tab key associations.

---

## 3. Domain Types & Schema Definitions

The application defines domain contracts across four TypeScript modules in `src/types/`:

### 3.1 Raw Instrument Entity (`src/types/instrument.ts`)
Represents the raw serialized structure received from `instrument.json`:

```typescript
export interface Instrument {
  id?: string;                          // Primary unique ID (e.g. inst_100001)
  instruments: string;                  // Primary instrument title
  instruments1?: string;                 // Secondary title or alternate name
  search_instruments?: string;           // Pre-cleaned lowercased title for fast matching
  search_instruments1?: string;          // Pre-cleaned lowercased secondary title
  acronym: string;                      // Acronym (e.g., XRD, HPLC, FE-SEM)
  image_link: string;                   // Relative or absolute image URL
  original_image_link?: string;         // Unmodified original source image URL
  district: string;                     // Raw district name from source sheet
  standardized_district: string;        // Standardized Kerala district name
  name_of_facility: string;             // Department or facility name
  institution_name: string;             // Host institution name
  address: string;                      // Physical location address
  enquiry_contact_number: string;       // Phone contact number(s)
  enquiry_mail: string;                 // Email contact address(es)
  website_booking_link: string;         // Primary direct booking URL
  website_booking_link_fallback: string;// Fallback institution website URL
  tag: string | string[];               // Associated tag(s) or classification strings
  provider_key: string;                 // Unique key assigned by backend sync
  warnings: string;                     // Data quality status (e.g. 'CLEAN')
}
```

### 3.2 Service Entity (`src/types/service.ts`)
Represents startup R&D testing and analytical services received from `services.json`:

```typescript
export interface Service {
  id?: string;                          // Service ID / key
  startupName: string;                  // Name of the offering startup
  ksumUid: string;                      // Kerala Startup Mission Unique Identifier
  serviceName: string;                  // Title of the R&D service
  description: string;                  // Service description
  category: string;                     // Main service category
  sector: string;                       // Industry sector
  keywords: string[];                   // Relevant tags / search keywords
  certifications: string;               // ISO / NABL / Quality accreditations
  infrastructure: string;               // Lab infrastructure backing the service
  thumbnail: string;                    // Image thumbnail URL
  originalLogoUrl?: string;             // Startup logo URL
  district: string;                     // District location
  email: string;                        // Contact email
  phone: string;                        // Contact phone number
  bookingUrl?: string;                  // Optional reservation URL
}
```

---

## 4. Data Mapping & Transformation Layer

Raw JSON entities are decoupled from the presentation layer through domain mapping models.

### 4.1 Raw Instrument to `InstrumentViewModel` Mapping (`src/domain/instrument/`)

To prevent UI components from dealing with messy fallback checks, empty string variations (`'None'`, `'N/A'`, `'Nil'`), and missing fields, `toInstrumentViewModel()` in `src/domain/instrument/mapper.ts` transforms raw `Instrument` data into an immutable, frozen View Model (`InstrumentViewModel`).

#### View Model Structure
```typescript
export interface InstrumentViewModel {
  readonly id: string;
  readonly title: string;
  readonly acronym: string | null;
  readonly displayTitle: string;        // E.g., "High Resolution Mass Spectrometer (HRMS)"
  readonly institution: string;
  readonly facility: string | null;
  readonly location: {
    readonly district: string;
    readonly address: string | null;
    readonly coordinates?: { lat: number; lng: number };
    readonly mapUrl: string;            // Google Maps search query URL
  };
  readonly media: {
    readonly thumbnail: string | null;
    readonly gallery: readonly string[];
  };
  readonly contact: {
    readonly phone: string | null;
    readonly email: string | null;
    readonly website: string | null;
  };
  readonly actions: {
    readonly primary: ActionLink | null;
    readonly secondary: readonly ActionLink[];
    readonly overflow: readonly ActionLink[];
  };
  readonly tags: readonly string[];
  readonly ui: {
    readonly hasImage: boolean;
    readonly hasBooking: boolean;
    readonly hasContact: boolean;
    readonly hasLocation: boolean;
    readonly canShare: boolean;
  };
}
```

#### Action Resolution Rules (`mapActions`)
1. **Primary Action:**
   - If `website_booking_link` is present and valid → Type `'booking'`, Label `'Book Instrument'`.
   - Else if fallback website exists → Type `'website'`, Label `'Visit Website'`.
   - Else if `enquiry_mail` exists → Type `'email'`, Label `'Contact Institution'`.
2. **Secondary Actions:**
   - Adds remaining valid contact channels (`Email`, `Call`, `Website`, `Open in Maps`) that were not assigned to primary.

### 4.2 Service Data Mapping (`src/lib/serviceMapper.ts`)
Maps `main_services` arrays from `services.json`, normalizing `keywords` (splitting comma-separated strings), assigning fallback thumbnails, and ensuring safe string types across all attributes.

### 4.3 Image URL Resolution Strategy (`src/lib/utils.ts`)
```typescript
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder-image.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const host = CDN_HOST.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${host}${path}`;
};
```
This guarantees that relative paths generated by the CDN sync script resolve correctly against Vercel CDN, while absolute HTTP/HTTPS links (such as external images or Google Drive links) pass through intact.

---

## 5. State Management & Client Hydration (Zustand Store)

Client-side application state is managed centrally in `src/store/useStore.ts` using Zustand.

### Key Store Responsibilities
1. **Parallel Data Bootstrapping (`fetchData`):**
   - Fetches `instrument.json` and `filters.json` concurrently via `Promise.all`.
   - Resolves dynamic taxonomy categories (`TaxonomyCategory[]`).
   - If `filters.json` defines a `tabKey`, dynamically loads records from `rawData[primaryTabKey]`.
   - Cleans instrument titles (replaces `-`, `/`, `_` with spaces for search optimization).
2. **Multi-Facet Active Filters (`activeFilters`):**
   - `dynamicFilters`: Key-value map of category IDs to arrays of selected values (`Record<string, string[]>`).
   - `institutionTypes`: Classification array (`National Institutes`, `Universities`, `Government R&D Labs`, `Private / Corporate Labs`, `Other`).
   - Boolean toggles: `instantBooking`, `hasPhone`, `hasEmail`, `hasVerifiedImage`, `showWarnings`.
3. **Execution Pipeline (`performSearch`):**
   - Combines active search query and active filters to produce `filteredData`.

---

## 6. Search Engine Architectures

`rink-instruments` incorporates **four complementary search implementations**:

```
                              +---------------------------------------+
                              |         User Search Query             |
                              +---------------------------------------+
                                                  |
                  +-------------------------------+-------------------------------+
                  |                                                               |
                  v                                                               v
      [ Standard Keyword Search ]                                     [ AI Conversational Search ]
                  |                                                               |
        +---------+---------+                                                     v
        |                   |                                         +-----------------------+
        v                   v                                         | /api/ai-search Route  |
[ 1. Server API ]   [ 2. Client Orama ]                               | - Term Vectors        |
| GET /api/...   |   | In-browser Orama|                               | - Semantic Categories |
+----------------+   +-----------------+                               +-----------------------+
```

### 6.1 Server-Assisted Orama API Search (`/api/instruments/search`)
- **Endpoint:** `GET /api/instruments/search?q={query}`
- **Execution:** Keeps a global Orama search index cached in server memory. Queries return a lightweight JSON array of matching record IDs (`{ hits: ["inst_100001", "inst_100005"] }`), reducing network payload size to under 1 KB.
- **Client Handling:** `useStore.ts` sends requests with an `AbortSignal.timeout(3000)`.

### 6.2 Client-Side Fallback Orama Search
- **Trigger:** Executes automatically if the server search API call fails or times out.
- **Execution:** Dynamically imports `@orama/orama` on the client, builds an in-memory index, and executes a full-text search with exact match boosting and typo tolerance (`tolerance: 1`).

### 6.3 12-Tier Precision Search Engine (`src/lib/searchEngine.ts`)
Deterministic heuristic scoring engine for exact matching:
- **Tier 1:** Exact Technology ID match (score `1000`)
- **Tier 2:** Partial ID match (score `850`)
- **Tier 3:** Exact Technology Name match (score `900`)
- **Tier 4:** Prefix match on Name (score `700`)
- **Tier 5:** Whole-word match in Name (score `500`)
- **Tier 6:** Substring match in Name (score `420`)
- **Tier 7:** Institution match (score `350–380`)
- **Tier 8:** Category match (score `300–320`)
- **Tier 9:** Keyword match (score `160–220`)
- **Tier 10:** Facility match (score `110–130`)
- **Tier 11/12:** Full-text description fallback (score `≤ 80`)
- **Minimum Relevance Cutoff:** Items scoring under `80` are filtered out.

### 6.4 AI Natural Language / Vector Search (`src/lib/aiSearch.ts` & `/api/ai-search`)
- **Endpoint:** `POST /api/ai-search`
- Handles complex conceptual queries (e.g. *"I need to analyze crystalline structure of thin films"*).
- Converts intent into domain concept vectors (e.g. X-Ray Diffraction / XRD), scores the catalog against semantic keyphrase definitions, and returns structured matches.

---

## 7. Routing, Page Layouts & Component Design

### 7.1 Layout Isolation & Navigation Control

The root layout (`src/app/layout.tsx`) wraps the application with a header `Navbar` and footer `Footer`:

```tsx
// src/components/layout/Navbar.tsx
export default function Navbar() {
  const pathname = usePathname();
  
  // Hides top navbar on unlisted admin routes
  if (pathname === '/yaml-builder') {
    return null;
  }
  
  return ( ... );
}
```

This guarantees that admin and developer utility pages remain **unlisted** without polluting the consumer interface.

### 7.2 Page & Route Catalog

| Route Path | Type | Revalidation | Description |
| :--- | :--- | :--- | :--- |
| `/` | Static (SSG) | 60s ISR | Homepage featuring `HeroSearch`, metrics, category grid, carousel, and partner institutions. |
| `/instruments` | Dynamic | Client Store | Interactive equipment catalog with search bar, taxonomy filter sidebar, and grid/list views. |
| `/instruments/[id]` | Static (SSG) | 60s ISR | Instrument detail page with specifications, facility details, map integration, and contact options. |
| `/services` | Static (SSG) | 60s ISR | R&D startup services directory. |
| `/services/[id]` | Static (SSG) | 60s ISR | Service detail page. |
| `/categories` | Static (SSG) | 60s ISR | High-level category grid. |
| `/categories/[slug]` | Static (SSG) | 60s ISR | Category filter page. |
| `/institutions` | Static (SSG) | 60s ISR | Research institution directory. |
| `/institutions/[slug]` | Static (SSG) | 60s ISR | Institution profile page showcasing hosted equipment and R&D facilities. |
| `/yaml-builder` | Static (SSG) | Unlisted | Admin tool for visual building and exporting of `sheets.yaml`. |

---

## 8. Configuration & Administration Tooling (`yaml-builder`)

Located under `src/components/yaml-builder/` and `/yaml-builder`, this tool allows administrators to visually construct the `sheets.yaml` manifest used by `rink-git-cron`.

### Key Features
- **Visual Sheet & Tab Card Construction:** Configure Google Spreadsheet IDs, GIDs, hierarchical row settings, array splits, and conditional row exclusions.
- **Dynamic Taxonomy Builder:** Drag-and-drop category and group assignment for the sidebar filter system.
- **Google Sheets Header Ingestion:** Calls `/api/sheet-metadata` to inspect live sheet CSV column headers.
- **Live YAML Export:** Real-time YAML generation via `js-yaml` with instant copy-to-clipboard functionality.

---

## 9. Build, Deployment & Verification Workflow

### Build Command
```bash
npm run build
```

### Build Steps Executed by Next.js Compiler:
1. **Compilation:** Transpiles TypeScript and bundles React components with Turbopack.
2. **Type Checking:** Validates all TypeScript types across app routes, components, and libraries.
3. **Static Generation:** Executes `generateStaticParams()` for all dynamic routes (`/instruments/[id]`, `/services/[id]`, `/institutions/[slug]`, `/categories/[slug]`) by pre-fetching `instrument.json` from Vercel CDN.
4. **Route Prerendering:** Emits static HTML files for static routes and sets up ISR revalidation handles.

---

*Document generated and verified against the authoritative codebase of `rink-instruments`.*
