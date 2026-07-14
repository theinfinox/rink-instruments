export interface TaxonomyPresentation {
  slugPatterns: string[]; // e.g., ["life", "bio", "science"]
  accentColor: string;
  illustrationType: "agriculture" | "food" | "biotech" | "medtech" | "energy" | "digital" | "materials" | "water" | "robotics" | "infrastructure" | "manufacturing" | "consumer" | "default";
}

// ── Map generic keywords → visual themes ────
export const TAXONOMY_PRESENTATION_MAPPING: TaxonomyPresentation[] = [
  {
    slugPatterns: ["agriculture", "agri", "farming", "crop"],
    accentColor: "#10B981", // Green
    illustrationType: "agriculture",
  },
  {
    slugPatterns: ["food", "processing", "nutrition"],
    accentColor: "#F97316", // Orange
    illustrationType: "food",
  },
  {
    slugPatterns: ["bio", "life", "genomics", "microbiology"],
    accentColor: "#8B5CF6", // Purple
    illustrationType: "biotech",
  },
  {
    slugPatterns: ["health", "med", "clinical", "diagnostic"],
    accentColor: "#06B6D4", // Cyan
    illustrationType: "medtech",
  },
  {
    slugPatterns: ["energy", "climate", "sustain", "green"],
    accentColor: "#F59E0B", // Yellow
    illustrationType: "energy",
  },
  {
    slugPatterns: ["digital", "software", "ai", "computer", "electronics", "tech"],
    accentColor: "#3B82F6", // Blue
    illustrationType: "digital",
  },
  {
    slugPatterns: ["water", "env", "aquaculture", "earth"],
    accentColor: "#0D9488", // Teal
    illustrationType: "water",
  },
  {
    slugPatterns: ["robot", "automation", "drone", "uav"],
    accentColor: "#6366F1", // Indigo
    illustrationType: "robotics",
  },
  {
    slugPatterns: ["material", "chemical", "polymer", "nano"],
    accentColor: "#8B5CF6", // Purple
    illustrationType: "materials",
  },
  {
    slugPatterns: ["manufactur", "industrial", "commercial", "additive"],
    accentColor: "#6366F1", // Indigo
    illustrationType: "manufacturing",
  },
  {
    slugPatterns: ["infrastructure", "construct", "city", "smart"],
    accentColor: "#F97316", // Orange
    illustrationType: "infrastructure",
  },
  {
    slugPatterns: ["consumer", "cosmetic", "lifestyle", "product"],
    accentColor: "#E9C46A", // Gold
    illustrationType: "consumer",
  }
];

export function getTaxonomyPresentation(slug: string): Omit<TaxonomyPresentation, "slugPatterns"> {
  const normalized = slug.toLowerCase();
  
  for (const mapping of TAXONOMY_PRESENTATION_MAPPING) {
    if (mapping.slugPatterns.some(pattern => normalized.includes(pattern))) {
      return {
        accentColor: mapping.accentColor,
        illustrationType: mapping.illustrationType
      };
    }
  }

  // Fallback
  return {
    accentColor: "#10B981",
    illustrationType: "default",
  };
}
