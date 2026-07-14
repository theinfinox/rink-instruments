// ============================================================
// RINK Technology Explorer — Core Type Definitions
// Aligned with the actual Google Sheet schema
// ============================================================

export interface Technology {
  id: string;               // Technology ID (e.g. CPCRI-001)
  name: string;             // Technology Name
  institution: string;      // Institution (display name)
  institution_slug: string; // Derived slug for routing
  sector: string;           // Sector (display)
  sector_slug: string;      // Derived slug for routing
  technology_type: string;  // Technology Type (freeform from sheet)
  problem_solved: string;   // Problem Solved
  description: string;      // Description
  applications: string[];   // Applications (split from comma/semicolon)
  startup_potential: StartupPotential; // High / Medium / Low
  startup_potential_score: number;     // 5 / 3 / 2 for star display
  trl: string;              // TRL (sourced directly or fallback)
  patent_status: string;    // Patent Status — COMPLETE legal text (e.g. "GRANTED (Patent No: 394501)")
  ip_status: string;        // IP Status for frontend — normalized value (Patented/Published/Filed/Patent Pending/Not Patented/Not Available)
  commercialization_status: string; // Commercialization Status (sourced directly or fallback)
  contact_person: string;   // Contact Person
  phone: string;            // Phone
  email: string;            // Email
  keywords: string[];       // Keywords (split from comma)
  image_url: string;        // Image URL (Google Drive or other)
  image_embed_url: string;  // Converted embed URL for <img>
  institution_website: string; // Institution Website
  // Derived / computed
  featured: boolean;        // High/Very High/Featured startup potential = featured
  technology_image?: string;
  technology_image_embed_url?: string;
  institution_image?: string;
  institution_image_embed_url?: string;
  last_updated?: string;
}

export type StartupPotential = 'Featured' | 'Very High' | 'High' | 'Medium' | 'Low' | 'Not Specified';

// ── Derived aggregates ──────────────────────────────────────

export interface Sector {
  slug: string;
  name: string;
  tech_count: number;
  icon: string;
  color: string;
  top_tags?: string[];
}

export interface Institution {
  slug: string;
  name: string;
  tech_count: number;
  image?: string;
  bannerImage?: string;
  specializations?: string[];
  institution_image?: string;
  institution_image_embed_url?: string;
  last_updated?: string;
  // Fields from Institution Details sheet
  logo_url?: string;
  logo_embed_url?: string;
  address?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
}

// ── Search & Filter Types ───────────────────────────────────

export interface TechnologyFilters {
  query?: string;
  sector?: string;
  institution?: string;
  trl?: string;
  patent_status?: string;
  ip_status?: string;
  startup_potential?: StartupPotential;
  featured?: 'featured' | 'non-featured';
}

export interface SearchResult {
  technologies: Technology[];
  total: number;
  page: number;
  per_page: number;
}

export interface SearchIndexItem {
  id: string;
  name: string;
  institution: string;
  institution_slug: string;
  category: string;
  category_slug: string;
  ip_status: string;
  trl: string;
  keywords: string[];
  problem_solved: string;
  description: string;
}
