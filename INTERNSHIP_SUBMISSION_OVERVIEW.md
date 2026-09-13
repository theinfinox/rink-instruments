# 📋 RINK Internship Project Submission & Technical Overview
**Research Innovation Network Kerala (RINK) — Kerala Startup Mission (KSUM)**

- **Intern Name**: Govind S R
- **Internship Role**: Software Engineering & Data Systems Intern
- **Host Organization**: Kerala Startup Mission (KSUM) / Research Innovation Network Kerala (RINK)
- **Project Title**: High-Performance Research Instrumentation & Startup Services Discovery Platform and Serverless Ingestion Pipeline
- **Project Duration**: June 2026 – August 2026
- **Primary Code Repositories**:
  - Ingestion Engine & CDN: [`theinfinox/rink-git-cron`](file:///c:/Users/1sree/Documents/rink-git-cron)
  - Next.js 16 Web Platform: [`theinfinox/rink-instruments`](file:///c:/Users/1sree/Documents/rink-instruments)
  - Discovery Client & Virtualization: [`theinfinox/rink-frontend`](file:///c:/Users/1sree/Desktop/rink-frontend)

---

## 🎯 1. Project Background & Context

The **Research Innovation Network Kerala (RINK)** is an initiative by the **Kerala Startup Mission (KSUM)** to bridge academic research with entrepreneurial commercialization. Premier research institutions, universities, and labs across Kerala house advanced scientific equipment and specialized testing infrastructure. However, startup founders, innovators, and academic researchers previously lacked a centralized, real-time, and searchable digital registry to discover and utilize these facilities.

Furthermore, administrative stakeholders manage instrumentation data through collaborative spreadsheets (Google Sheets) and intake forms. Manual transcription into web databases was slow, error-prone, and resulted in broken image links, stale listings, and high maintenance overhead.

---

## 🎯 2. Core Objectives & Aims

The primary objective of this internship project was to design, architect, and deploy an **end-to-end, zero-maintenance digital ecosystem** comprising:

1. **Automated Serverless Ingestion Pipeline (`rink-git-cron`)**:
   - Automatically compile live Google Sheets data and intake form responses into optimized, type-safe JSON endpoints.
   - Detect, download, and convert unoptimized Google Drive and web images into compressed, ultra-fast WebP assets.
   - Eliminate redundant computational costs using composite MD5 hashing to achieve 0ms incremental builds when data is unchanged.
   - Dynamically generate multi-tier relational filter taxonomies and AI search indexes (`llms.txt`, `{id}.json`).

2. **Unified High-Performance Web Portal (`rink-instruments`)**:
   - Architect a high-speed web application using **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.
   - Implement a **Dual-Portal architecture** allowing users to seamlessly toggle between **Research Instruments** (from institutions) and **Startup Services** (from incubators/startups).
   - Build a client-side, in-memory **Orama Search Engine** with custom word-boundary ranking for scientific acronyms (`SEM`, `TEM`, `XRD`, `HPLC`, `GC`, `AFM`).
   - Create canonical entity normalization (`InstitutionRepository`) linking 868+ instruments to 23 verified research institutions and institutional MoUs.

3. **Visual Configuration Studio (`/yaml-builder`)**:
   - Provide a zero-code visual dashboard for non-technical stakeholders to configure spreadsheet schemas, merge rules, and filters.
   - Develop live Google Sheets column discovery and sandboxed A4 PDF architecture report generation.

---

## 🚀 3. Key Achievements & Deliverables

### A. Data Engineering & Automation Pipeline (`rink-git-cron`)
- **Multi-Source Merge Engine**: Merged primary institutional records with secondary intake forms, stripping unmapped form noise using `onlyIncludeMapped: true` and applying row offsets (`skipFirstRows`).
- **Deterministic Auto-ID Generation**: Implemented collision-proof ID generation (`inst_100001+` for primary rows and `inst_form_200001+` for intake responses), preventing route breakage.
- **Automated WebP Asset Pipeline**: Scans spreadsheet cells for Google Drive file IDs and web URLs, automatically resizing and converting images to WebP via Sharp to achieve an ~80% bandwidth reduction.
- **Relational Filter Compilation**: Dynamically generated `/api/instrument/filters.json` by executing cross-tab foreign-key joins (`linkType: join`) between instruments and institution lookup tables.
- **CI/CD Cron Scheduling**: Deployed scheduled GitHub Action workflows running nightly syncs with fail-safe atomic writes (`FailSafeStore.js`).

### B. Frontend Engineering & User Experience (`rink-instruments`)
- **Dual-Portal Zero-Flicker Architecture**: Built `PortalManager` with client-side state switching and soft URL synchronization (`window.history.pushState`), eliminating full-page reload flickers.
- **Sub-Millisecond Acronym Search**: Integrated Orama search with a custom Tier-3 word-boundary algorithm (Score 880), guaranteeing that short acronym queries (`SEM`, `TEM`, `XRD`, `NMR`) prioritize exact instruments over prefix substrings.
- **Smart Dynamic Pagination**: Replaced simple previous/next pagination with a sliding window (`[1, 2, 3... 12... 47]`) and `±5` jump navigation across catalog views.
- **Canonical Institution Normalization**: Standardized all 868 instruments onto `institution_id`, with verified MoU badges, district geocoding, contact details, and direct booking CTAs.
- **Startup Services Infrastructure**: Added dedicated testing equipment cards (`equipmentUsed`), KSUM UID badges, ISO/GLP accreditation displays, and physical address routing.

### C. Visual Configuration Studio & Reporting
- **Interactive Schema Editor**: Developed interactive cards (`SheetCard`, `TabCard`, `MergeSourceCard`, `TaxonomyBuilder`) with live column autocomplete via the `/api/sheet-metadata` API route.
- **Sandboxed IFrame PDF Report Generation**: Created `CustomPrintReport.tsx` allowing administrators to export visual architecture manuals into print-ready A4 PDF documents with strict `@page` formatting.
- **Dedicated Developer Documentation**: Built an in-app interactive manual at `/yaml-builder/docs` with ScrollSpy table of contents, instant search, and code copiers.

---

## 📊 4. Quantifiable Impact & Metrics

| Metric | Measured Outcome |
|:---|:---|
| **Research Instruments Cataloged** | **868 Instruments** across Kerala |
| **Partner Institutions Integrated** | **23 Premier Institutions & Universities** |
| **Startup Services Mapped** | **100+ Specialized Testing & Research Services** |
| **Prerendered Static Pages (SSG)** | **1,009 Pages** compiled with **0 errors** |
| **TypeScript / Type Safety** | **100% Pass** (`npx tsc --noEmit` exited with code 0) |
| **Total Engineering Commits** | **313+ Direct Commits** across **17 Active Sprint Dates** |
| **Image Size Reduction** | **~80% bandwidth saved** via automated WebP conversion |
| **Search Response Latency** | **< 15ms** using local in-memory Orama indexing |

---

## 🛠️ 5. Technology Stack & Tools

- **Frontend**: Next.js 16 (App Router, Server Components, SSG), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Zustand.
- **Search Engine**: Orama Search (in-memory full-text indexing, token weighting).
- **Backend & Data Processing**: Node.js, Express, PapaParse (CSV streaming), Sharp (image optimization), YAML parser, Crypto (composite MD5 hashing).
- **DevOps & Deployment**: Vercel Edge Platform, GitHub Actions (cron automations), Docker, Model Context Protocol (MCP).
- **External Data Sources**: Google Sheets API, Google Drive Media Assets.
