# Phase 1 - Project Overview

## 1. Tech Stack
- **Framework**: Next.js 16.2.6 (App Router, Turbopack)
- **Routing**: Next.js App Router (File-based routing, SSG + ISR)
- **UI library**: Custom React 19 components
- **CSS framework**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Custom CSS Variables (`src/app/globals.css`) + `clsx` & `tailwind-merge` (`cn` helper in `src/lib/utils.ts`)
- **State management**: Zustand v5.0.14 (`src/store/useStore.ts`)
- **Icons**: Lucide React (`lucide-react` v1.16.0)
- **Animation library**: Framer Motion v12.40.0 (`framer-motion`)
- **Data fetching**: Native `fetch` with Next.js ISR (`revalidate: 60`) & parallel `Promise.all` in Zustand store
- **Table library**: None (Custom CSS grid/flex cards and lists)
- **Virtualization**: None
- **Search implementation**: Dual-tier Orama v3.1.18 search (Server API `/api/instruments/search` + Client-side Orama in-memory index fallback) + 12-tier Precision Search Engine (`src/lib/searchEngine.ts`) + Natural Language AI Search (`src/lib/aiSearch.ts`)

---

## 2. Folder Structure

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── api/
│   │   ├── ai-search/
│   │   │   └── route.ts
│   │   ├── instruments/
│   │   │   └── search/
│   │   │       └── route.ts
│   │   ├── revalidate/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   ├── search-index/
│   │   │   └── route.ts
│   │   └── sheet-metadata/
│   │       └── route.ts
│   ├── categories/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── institutions/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── instruments/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── TechListClient.tsx
│   │   └── page.tsx
│   ├── services/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── list/
│   │   │   ├── ServiceListClient.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── yaml-builder/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ai/
│   │   └── RinkAIAssistant.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeToggle.tsx
│   ├── ui/
│   │   ├── AIDiscoveryBar.tsx
│   │   ├── BrowseByInstitution.tsx
│   │   ├── ConnectWithRINK.tsx
│   │   ├── ContactModal.tsx
│   │   ├── DatasetToggle.tsx
│   │   ├── DistrictCard.tsx
│   │   ├── EcosystemNetworkBackground.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── FloatingParticles.tsx
│   │   ├── FloatingResearchAssets.tsx
│   │   ├── HeroAISearch.tsx
│   │   ├── HeroMetrics.tsx
│   │   ├── HeroSearch.tsx
│   │   ├── InnovationAmbientLayer.tsx
│   │   ├── InstitutionCard.tsx
│   │   ├── InstitutionEcosystemBackground.tsx
│   │   ├── InstitutionSearchGrid.tsx
│   │   ├── KeralaInnovationMap.tsx
│   │   ├── LifecycleBackground.tsx
│   │   ├── MotionSection.tsx
│   │   ├── PartnerInstitutionsSection.tsx
│   │   ├── PartnerLogoWall.tsx
│   │   ├── PortalManager.tsx
│   │   ├── ResearchParticles.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SectorBackgrounds.tsx
│   │   ├── SectorCard.tsx
│   │   ├── SectorIcons.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TechImage.tsx
│   │   ├── TechTransferPathway.tsx
│   │   └── TechnologyCard.tsx
│   └── yaml-builder/
│       ├── SheetCard.tsx
│       ├── TabCard.tsx
│       ├── TaxonomyBuilder.tsx
│       ├── Tooltip.tsx
│       └── types.ts
├── hooks/
│   └── useInstrumentViewModels.ts
├── lib/
│   ├── utils/
│   │   └── filterConstants.ts
│   ├── aiSearch.ts
│   ├── config.ts
│   ├── dataFetcher.ts
│   ├── iconMap.ts
│   ├── mapper.ts
│   ├── oramaSearch.ts
│   ├── searchEngine.ts
│   ├── serviceMapper.ts
│   └── utils.ts
├── store/
│   └── useStore.ts
└── styles/
    └── (None - styles configured in src/app/globals.css)
```

---

## 3. Route Map

/
  page.tsx (`src/app/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - HeroSearch
   - StatsSection
   - FeaturedCarousel
   - TechTransferPathway
   - PartnerInstitutionsSection
   - ConnectWithRINK
   - DatasetToggle

/instruments
  page.tsx (`src/app/instruments/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - TechListClient
   - SearchBar
   - FilterSidebar
   - TechnologyCard
   - DatasetToggle
   - ServiceCard

/instruments/[id]
  page.tsx (`src/app/instruments/[id]/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - TechImage
   - TechnologyCard
   - Lucide Icons (ChevronRight, ArrowRight, FileText, Microscope, Building2)

/services
  page.tsx (`src/app/services/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - Service overview catalog links

/services/list
  page.tsx (`src/app/services/list/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - ServiceListClient
   - SearchBar
   - ServiceCard
   - DatasetToggle

/services/[id]
  page.tsx (`src/app/services/[id]/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - Service details presentation layout
   - Booking / Enquiry CTA

/categories
  page.tsx (`src/app/categories/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - SectorCard
   - SectorIcons
   - SectorBackgrounds

/categories/[slug]
  page.tsx (`src/app/categories/[slug]/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - FilterSidebar
   - TechnologyCard

/institutions/[slug]
  page.tsx (`src/app/institutions/[slug]/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - Institution header banner
   - TechnologyCard

/about
  page.tsx (`src/app/about/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - PortalManager
   - StatsSection
   - TechTransferPathway

/contact
  page.tsx (`src/app/contact/page.tsx`)
  Layout: `src/app/layout.tsx`
  uses:
   - Contact form & details
   - ContactModal

/yaml-builder
  page.tsx (`src/app/yaml-builder/page.tsx`)
  Layout: `src/app/layout.tsx` (Navbar hidden via `pathname === '/yaml-builder'` check)
  uses:
   - SheetCard
   - TabCard
   - TaxonomyBuilder
   - Tooltip

---

## 4. Shared Components

- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/ThemeToggle.tsx`
- `src/components/ui/AIDiscoveryBar.tsx`
- `src/components/ui/BrowseByInstitution.tsx`
- `src/components/ui/ConnectWithRINK.tsx`
- `src/components/ui/ContactModal.tsx`
- `src/components/ui/DatasetToggle.tsx`
- `src/components/ui/DistrictCard.tsx`
- `src/components/ui/EcosystemNetworkBackground.tsx`
- `src/components/ui/FeaturedCarousel.tsx`
- `src/components/ui/FilterSidebar.tsx`
- `src/components/ui/FloatingParticles.tsx`
- `src/components/ui/FloatingResearchAssets.tsx`
- `src/components/ui/HeroAISearch.tsx`
- `src/components/ui/HeroMetrics.tsx`
- `src/components/ui/HeroSearch.tsx`
- `src/components/ui/InnovationAmbientLayer.tsx`
- `src/components/ui/InstitutionCard.tsx`
- `src/components/ui/InstitutionEcosystemBackground.tsx`
- `src/components/ui/InstitutionSearchGrid.tsx`
- `src/components/ui/KeralaInnovationMap.tsx`
- `src/components/ui/LifecycleBackground.tsx`
- `src/components/ui/MotionSection.tsx`
- `src/components/ui/PartnerInstitutionsSection.tsx`
- `src/components/ui/PartnerLogoWall.tsx`
- `src/components/ui/PortalManager.tsx`
- `src/components/ui/ResearchParticles.tsx`
- `src/components/ui/SearchBar.tsx`
- `src/components/ui/SectorBackgrounds.tsx`
- `src/components/ui/SectorCard.tsx`
- `src/components/ui/SectorIcons.tsx`
- `src/components/ui/ServiceCard.tsx`
- `src/components/ui/StatsSection.tsx`
- `src/components/ui/TechImage.tsx`
- `src/components/ui/TechTransferPathway.tsx`
- `src/components/ui/TechnologyCard.tsx`
- `src/components/ai/RinkAIAssistant.tsx`
- `src/components/yaml-builder/SheetCard.tsx`
- `src/components/yaml-builder/TabCard.tsx`
- `src/components/yaml-builder/TaxonomyBuilder.tsx`
- `src/components/yaml-builder/Tooltip.tsx`

---

## 5. Global Providers

- **Theme**: Light-mode system defined via CSS custom variables in `src/app/globals.css` with dark accents (`ThemeToggle.tsx`).
- **Store**: Zustand store (`src/store/useStore.ts`) — global store initialized via `create()`, imported directly by client components without Context Providers.
- **Contexts**: None (Component state via `useState`/`useRef` and URL parameters).
- **Layouts**: Root layout (`src/app/layout.tsx`) wrapping `<Navbar />`, `<main>{children}</main>`, `<Footer />`.

---

## 6. Styling Convention

- **CSS Framework**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/app/globals.css`)
- **Utility Helpers**: `clsx` + `tailwind-merge` (`cn()` helper function in `src/lib/utils.ts`)
- **Component Libraries**: Custom Tailwind CSS components (No Radix, No shadcn/ui)
- **Custom CSS Variables**: Defined in `:root` in `src/app/globals.css`:
  - `--background`: `#F6F8FC`
  - `--card`: `#FFFFFF`
  - `--card-secondary`: `#F1F5FB`
  - `--text-primary`: `#0F172A`
  - `--text-secondary`: `#475569`
  - `--heading`: `#0F172A`
  - `--accent`: `#1B4D9B`
  - `--accent-hover`: `#153E7C`
  - `--accent-light`: `#EEF2FB`
  - `--accent-secondary`: `#F5B301`
  - `--border`: `rgba(15, 23, 42, 0.08)`

---

## 7. Design Tokens

- **Colors**:
  - Background: `#F6F8FC`
  - Card: `#FFFFFF`
  - Primary Text: `#0F172A`
  - Secondary Text: `#475569`
  - Accent Primary Blue: `#1B4D9B`
  - Accent Light Blue: `#EEF2FB`
  - Accent Gold/Yellow: `#F5B301`
  - Border: `rgba(15, 23, 42, 0.08)`
- **Spacing**: Standard Tailwind scale (`p-2`, `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `gap-8`, `max-w-7xl`)
- **Radius**: Tailwind rounded scale (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`)
- **Typography**:
  - Sans: Plus Jakarta Sans (`'Plus Jakarta Sans'`, sans-serif)
  - Serif: Playfair Display (`'Playfair Display'`, serif)
- **Breakpoints**: Tailwind standard (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`)

---

## 8. Known UI Constraints

- **Responsive**: Mobile-first design; desktop sidebar filters (`FilterSidebar.tsx`) collapse into drawers or responsive stacks on mobile viewports. Sticky mobile CTA bar on detail views.
- **Accessibility**: Standard semantic HTML tags (`<main>`, `<header>`, `<footer>`, `<nav>`), standard focus rings (`focus:ring-2 focus:ring-blue-500`).
- **Performance Optimizations**: Next.js SSG + ISR (`revalidate: 60`), static page pre-rendering, in-memory Orama search index avoiding API latency, server API returning ID-only payloads (`{ hits: string[] }`).
- **Virtualization**: None implemented.
- **Infinite scroll**: None implemented (standard grid rendering).
