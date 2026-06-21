// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH — Binding-arbitration warranty companies where the
// COMPANY PAYS the arbitration costs (AAA/JAMS consumer rules). Mass-arbitration
// targets: consumer is forced into arbitration, but the company funds the forum,
// so Louis Law Group can file the consumer's individual arbitration. DISTINCT
// from warrantyCompanies.js (those are NO-binding-arbitration / court matters).
// Generated from ~/arb_companies.json (still-pays set). To change, edit there.
// ---------------------------------------------------------------------------

export const WARRANTY_COMPANIES = [
  { value: "2-10-home-buyers-warranty", label: "2-10 Home Buyers Warranty" },
  { value: "advantage-warranty", label: "Advantage Warranty" },
  { value: "american-auto-guardian", label: "American Auto Guardian (AAGI)" },
  { value: "american-guardian", label: "American Guardian (AGWS)" },
  { value: "american-home-shield", label: "American Home Shield (AHS)" },
  { value: "armstrong-air-allied-air", label: "Armstrong Air / Allied Air" },
  { value: "century-warranty-services", label: "Century Warranty Services" },
  { value: "choice-home-warranty", label: "Choice Home Warranty" },
  { value: "cinch-home-services", label: "Cinch Home Services (HMS)" },
  { value: "dzaf", label: "DZAF" },
  { value: "easycare", label: "EasyCare (APCO)" },
  { value: "efg-companies", label: "EFG Companies (Enterprise Financial Group)" },
  { value: "fidelity-national-home-warranty", label: "Fidelity National Home Warranty" },
  { value: "fidelity-warranty-services", label: "Fidelity Warranty Services (JM&A)" },
  { value: "first-american-home-warranty", label: "First American Home Warranty" },
  { value: "gwc-warranty", label: "GWC Warranty" },
  { value: "homeserve-usa", label: "HomeServe USA" },
  { value: "honda-care", label: "Honda Care" },
  { value: "liberty-home-guard", label: "Liberty Home Guard" },
  { value: "liberty-stf", label: "Liberty STF" },
  { value: "national-auto-care", label: "National Auto Care" },
  { value: "niu", label: "NIU (vehicle service contract)" },
  { value: "old-republic-home-protection", label: "Old Republic Home Protection" },
  { value: "olympicare", label: "OlympiCare (Ethos Group)" },
  { value: "oncourse-home-solutions-american-water-resources", label: "OnCourse Home Solutions / American Water Resources" },
  { value: "porch-warranty", label: "Porch Warranty" },
  { value: "royal-administration-services", label: "Royal Administration Services" },
  { value: "select-home-warranty", label: "Select Home Warranty" },
  { value: "serviceplan", label: "ServicePlan (FL)" },
  { value: "silverrock", label: "SilverRock (Carvana)" },
  { value: "truwarranty", label: "TruWarranty (Pablo Creek)" },
  { value: "warrantech", label: "Warrantech" },
];

export const NOT_LISTED_VALUE = "__not_listed__";
export const EXCLUDED_FROM_GATE = [];

// vertical + fee basis per company (for messaging / intake routing)
export const ARB_META = {
  "first-american-home-warranty": { vertical: "HOME" },
  "homeserve-usa": { vertical: "HOME" },
  "american-home-shield": { vertical: "HOME" },
  "fidelity-national-home-warranty": { vertical: "HOME" },
  "choice-home-warranty": { vertical: "HOME" },
  "cinch-home-services": { vertical: "HOME" },
  "liberty-home-guard": { vertical: "HOME" },
  "old-republic-home-protection": { vertical: "HOME" },
  "oncourse-home-solutions-american-water-resources": { vertical: "HOME" },
  "porch-warranty": { vertical: "HOME" },
  "serviceplan": { vertical: "HOME" },
  "select-home-warranty": { vertical: "HOME" },
  "warrantech": { vertical: "CARS" },
  "truwarranty": { vertical: "CARS" },
  "silverrock": { vertical: "CARS" },
  "century-warranty-services": { vertical: "CARS" },
  "olympicare": { vertical: "CARS" },
  "royal-administration-services": { vertical: "CARS" },
  "niu": { vertical: "CARS" },
  "american-guardian": { vertical: "CARS" },
  "easycare": { vertical: "CARS" },
  "dzaf": { vertical: "CARS" },
  "efg-companies": { vertical: "CARS" },
  "fidelity-warranty-services": { vertical: "CARS" },
  "gwc-warranty": { vertical: "CARS" },
  "liberty-stf": { vertical: "CARS" },
  "national-auto-care": { vertical: "CARS" },
  "advantage-warranty": { vertical: "CARS" },
  "american-auto-guardian": { vertical: "CARS" },
  "2-10-home-buyers-warranty": { vertical: "BUILDERS" },
  "armstrong-air-allied-air": { vertical: "HVAC/MFR" },
  "honda-care": { vertical: "HVAC/MFR" },
};

// company value -> WARRANTY_TYPE_LABELS index (ad/article prefill skips Q1)
export const COMPANY_TYPE_IDX = {
  "first-american-home-warranty": 1,
  "homeserve-usa": 1,
  "american-home-shield": 1,
  "fidelity-national-home-warranty": 1,
  "choice-home-warranty": 1,
  "cinch-home-services": 1,
  "liberty-home-guard": 1,
  "old-republic-home-protection": 1,
  "oncourse-home-solutions-american-water-resources": 1,
  "porch-warranty": 1,
  "serviceplan": 1,
  "select-home-warranty": 1,
  "warrantech": 0,
  "truwarranty": 0,
  "silverrock": 0,
  "century-warranty-services": 0,
  "olympicare": 0,
  "royal-administration-services": 0,
  "niu": 0,
  "american-guardian": 0,
  "easycare": 0,
  "dzaf": 0,
  "efg-companies": 0,
  "fidelity-warranty-services": 0,
  "gwc-warranty": 0,
  "liberty-stf": 0,
  "national-auto-care": 0,
  "advantage-warranty": 0,
  "american-auto-guardian": 0,
  "2-10-home-buyers-warranty": 3,
  "armstrong-air-allied-air": 4,
  "honda-care": 4,
};

export function isCoveredCompany(value) {
  return WARRANTY_COMPANIES.some((c) => c.value === value);
}
export function companyLabel(value) {
  return WARRANTY_COMPANIES.find((c) => c.value === value)?.label || "";
}
