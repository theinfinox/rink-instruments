// ============================================================
// RINK Technology Explorer — Core Type Definitions
// Aligned with the actual Google Sheet schema & institution data model
// ============================================================

export interface Technology {
  id: string;               // Technology ID (e.g. CPCRI-001)
  name: string;             // Technology Name
  institution: string;      // Institution (display name)
  institution_slug: string; // Derived slug for routing
  institution_id?: string;  // Canonical Institution ID
  sector: string;           // Sector (display)
  sector_slug: string;      // Derived slug for routing
  technology_type: string;  // Technology Type (freeform from sheet)
  problem_solved: string;   // Problem Solved
  description: string;      // Description
  applications: string[];   // Applications (split from comma/semicolon)
  startup_potential: StartupPotential; // High / Medium / Low
  startup_potential_score: number;     // 5 / 3 / 2 for star display
  trl: string;              // TRL (sourced directly or fallback)
  patent_status: string;    // Patent Status — COMPLETE legal text
  ip_status: string;        // IP Status for frontend — normalized value
  commercialization_status: string; // Commercialization Status
  contact_person: string;   // Contact Person
  phone: string;            // Phone
  email: string;            // Email
  keywords: string[];       // Keywords
  image_url: string;        // Image URL
  image_embed_url: string;  // Converted embed URL for <img>
  institution_website: string; // Institution Website
  // Derived / computed
  featured: boolean;
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
  institution_id?: string;
  slug: string;
  name: string;
  tech_count: number;
  image?: string;
  bannerImage?: string;
  specializations?: string[];
  institution_image?: string;
  institution_image_embed_url?: string;
  last_updated?: string;
  // Fields from Institution Details sheet / list
  logo_url?: string;
  logo_embed_url?: string;
  original_logo_link?: string;
  logo_link?: string;
  address?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  latitude?: string;
  longitude?: string;
  link?: string;
  plus_code?: string;
  correct_provider_key?: string;
  reason_classification?: string;
  has_verified_mou?: boolean;
}

// ── Search & Filter Types ───────────────────────────────────

export interface TechnologyFilters {
  query?: string;
  sector?: string;
  institution?: string;
  institution_id?: string;
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
  institution_id?: string;
  category: string;
  category_slug: string;
  ip_status: string;
  trl: string;
  keywords: string[];
  problem_solved: string;
  description: string;
}
