# System Architecture

## Overall Architecture
The portal follows a static-first, JAMstack architecture built on Next.js 15 (App Router). The data layer is completely decoupled from the frontend presentation layer. A CRON-based sync engine pulls data from Google Sheets, transforming it into static JSON files. The Next.js frontend consumes these JSON files during build and at runtime to populate the UI.

## Folder & Module Responsibilities
- `src/app/`: Next.js App Router pages (Home, Technologies, Institutions, Sectors, Contact, About).
- `src/components/`: Reusable React components (UI elements, layout, cards, filters, navigation).
- `src/lib/`: Core utilities, Orama search initialization, data fetching/parsing helpers.
- `src/types/`: TypeScript definitions for the core domain objects mapping closely to the ingested JSON schema.
- `public/`: Hosts the static assets, including the normalized JSON files injected by the backend sync engine.

## Data Models

### Technology Object
The core domain entity representing a research technology.
- **Metadata:** ID, Name, Institution, Sector, Technology Type, Problem Solved, Description.
- **Commercialization:** Startup Potential, TRL (Technology Readiness Level), Patent Status, IP Status.
- **Media:** Image URL (converted to WebP), PDF links.
- **Derived Fields:** Slugs for routing, boolean flags for featured status based on `startup_potential`.

### Sector & Institution Objects
Aggregate representations of technologies grouped by their sector or institution.
- **Sector:** Name, Slug, Technology Count, Icon, Color.
- **Institution:** Name, Slug, Technology Count, Logo, Banner, Contact Info.

## Search Engine Integration
- **Orama Search:** The application initializes an Orama search index locally in the browser memory for blazingly fast querying.
- **Indexed Fields:** Full-text indexing is applied to critical string properties: `technology_name`, `keywords`, `applications`, `problem_solved`, and `description`.
- **Flow:** When a user types a query, the Orama instance queries the local index and returns an array of matching Technology IDs. The React state uses these IDs to filter the displayed array of Technology objects.

## UI Interaction Flow
1. **Discovery:** Users land on the homepage and see featured technologies or browse categorically by sector/institution.
2. **Search & Filter:** Users navigate to the exploration page where client-side state (React hooks) and URL query parameters keep the search and filter UI in sync.
3. **Detail View:** Clicking a card routes to `/technologies/[id]`, presenting full textual details, readiness badges, and the EOI Call-to-Action.
