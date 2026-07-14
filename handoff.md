# RINK Technology Transfer Portal - Project Handoff

## Project Objective and Vision
The RINK Technology Transfer Portal is designed to bridge the gap between research institutions and startups, investors, and industry partners. It serves as a centralized technology discovery platform where users can explore, search, and submit Expressions of Interest (EOI) for technologies developed by research institutions across Kerala under the Research Innovation Network Kerala (RINK).

## Current Implementation Status
The core portal is fully implemented and deployed. It successfully integrates with a Google Sheets database (via an automated static generation pipeline) and uses Orama Search for fast client-side full-text search.

### Completed Features
- Full technology catalogue with detail pages (`/technologies/[id]`).
- Institution-wise browsing (`/institutions/[slug]`).
- Sector-wise browsing (`/sectors/[slug]`).
- Advanced Search powered by Orama.
- Client-side filtering by Sector, Institution, TRL, IP Status.
- Featured technologies display (driven by internal "High/Very High" startup potential markers).
- EOI Workflow and contact details exposure.

### Storage Strategy & Data Flow
- **Data Source:** Google Sheets acts as the primary headless CMS.
- **Persistent Storage/Build:** A background sync script (external to this frontend project, running via `rink-git-cron`) pulls the sheets, normalizes headers, resolves image Drive links into static WebP assets, and outputs JSON files.
- **Frontend Consumption:** The Next.js 15 app fetches these static JSON files, bypassing rate limits of the Google API and ensuring high performance. The data is transformed into `Technology`, `Sector`, and `Institution` TypeScript objects.

### Important Architectural Decisions
- **Static First:** By converting Google Sheets to static JSON at build/sync time, the app avoids runtime database latency and API quota limits.
- **Local Search with Orama:** Instead of relying on a backend search API like Algolia or ElasticSearch, Orama is used to build a search index that runs entirely on the client. This provides instant type-ahead search with zero backend cost.
- **Slug-based Routing:** Institutions and Sectors are dynamically slugified for SEO-friendly URLs (`/sectors/food-technology`), which ensures clean linking without spaces or special characters.

### Future Considerations
- Adding an Admin Dashboard for institutions to track EOI.
- Implementing an AI-powered recommendation system based on user search history.
- User authentication, allowing users to save and track technologies of interest.
- PDF Preview implementations for patent and research documents.
