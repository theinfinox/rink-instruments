/**
 * Centralized Location Feature Flag & Safety-Net Control System
 * 
 * 1. MASTER SWITCH: Toggle ALL location placements across the portal with ONE command.
 *    - In code: `LOCATION_CONFIG.masterEnabled = true / false`
 *    - Via ENV: `NEXT_PUBLIC_ENABLE_LOCATIONS=true / false`
 * 
 * 2. INDIVIDUAL PLACEMENT CONTROLS: Toggle each of the 5 essential placements independently.
 */

export const LOCATION_CONFIG = {
  // ── Master Switch: Turn ON/OFF all location features with ONE command ──
  masterEnabled: process.env.NEXT_PUBLIC_ENABLE_LOCATIONS !== 'false', // Default: true

  // ── Individual Placement Controls (Safety Net) ──
  placements: {
    // Placement 1: Directory Grid Cards (Browse by Research Institutes & Startups)
    placement1_directoryGridCards: true,

    // Placement 2: Institution Detail Page (/institutions/[slug])
    placement2_institutionDetailPage: true,

    // Placement 3: Directory Search & Autocomplete (InstitutionSearchGrid.tsx)
    placement3_directorySearchAndAutocomplete: true,

    // Placement 4: Exclusive MoU Partnerships (ExclusivePartnershipsSection.tsx)
    placement4_exclusiveMoUPartnerships: true,

    // Placement 5: Instrument Detail Page Sidebar (/instruments/[id])
    placement5_instrumentDetailSidebar: true,

    // Placement 6: Legacy / Alternate Institution Card (InstitutionCard.tsx)
    placement6_institutionCard: true,
  },

  // ── Fallback Defaults ──
  fallbacks: {
    enableDistrictFallback: true,
    defaultDistrict: 'Kerala',
  },
};

/**
 * Type-safe helper to verify if a specific placement is currently active
 */
export function isLocationEnabled(
  placement: keyof typeof LOCATION_CONFIG.placements
): boolean {
  if (!LOCATION_CONFIG.masterEnabled) return false;
  return LOCATION_CONFIG.placements[placement] === true;
}
