// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH — Warranty companies Louis Law Group can represent
// Florida clients AGAINST. The qualifier uses this as a HARD GATE.
//
// SYNCED 2026-06-17 to the FULL vetted case-intake index (00_INDEX.md, "FL
// Warranty Agreements — NO BINDING ARBITRATION"). All 49 litigation-target
// companies are now listed so every warranty-dispute article's CTA resolves to a
// covered company instead of the disqualification screen.
//
// Generated from ~/warranty-pipeline/companies_warranty.py (the same spine that
// builds the SEO keyword bank) so dropdown values == bank company_value exactly.
// To change the list, edit companies_warranty.py and re-run gen_qualifier_js.py.
//
// NOTE (American Auto Shield / CarShield): added per Pierre's 2026-06-17 decision.
// The final index dual-confirms the FL contract as NON-binding arbitration; pull
// the client's executed FL endorsement to lock the read on any specific matter.
// ---------------------------------------------------------------------------

export const WARRANTY_COMPANIES = [
  { value: "4-warranty-corporation", label: "4 Warranty Corporation" },
  { value: "access-protection-fl", label: "Access Protection Company (FL)" },
  { value: "aig-warranty-fl", label: "AIG Warranty Services of Florida" },
  { value: "american-auto-shield", label: "American Auto Shield / CarShield" },
  { value: "apple", label: "Apple" },
  { value: "applecare", label: "AppleCare" },
  { value: "assurant-home-fl", label: "Assurant Home Solutions of Florida" },
  { value: "badcock", label: "Badcock Home Furniture" },
  { value: "bonded-builders", label: "Bonded Builders" },
  { value: "broward-factory-service", label: "Broward Factory Service" },
  { value: "carchex", label: "CARCHEX" },
  { value: "centricity-bankers-warranty", label: "Centricity (Bankers Warranty Group of Florida)" },
  { value: "centricity-bonded-builders", label: "Centricity (Bonded Builders Service Corp.)" },
  { value: "cna-national-warranty", label: "CNA National Warranty Corporation" },
  { value: "complete-appliance-protection", label: "Complete Appliance Protection" },
  { value: "domestic-general-usa", label: "Domestic & General USA" },
  { value: "east-coast-mechanical", label: "East Coast Mechanical (ECM)" },
  { value: "ecm-warranty", label: "ECM Warranty" },
  { value: "endurance", label: "Endurance" },
  { value: "first-extended", label: "First Extended Service Corporation of Florida" },
  { value: "flynns-air-conditioning", label: "Flynn's Air Conditioning Service" },
  { value: "gai-warranty-fl", label: "GAI Warranty Company of Florida" },
  { value: "gopro-care", label: "GoPro Care Services" },
  { value: "hendrick-autoguard-fl", label: "Hendrick Autoguard Florida" },
  { value: "heritage-mechanical", label: "Heritage Mechanical Breakdown Corporation" },
  { value: "homemembership", label: "HomeMembership" },
  { value: "interstate-national", label: "Interstate National Dealer Services of Florida" },
  { value: "ironwood-warranty-fl", label: "Ironwood Warranty of Florida" },
  { value: "kubota", label: "Kubota Tractor Corporation" },
  { value: "mercury-marine", label: "Mercury Marine (Brunswick)" },
  { value: "mercury-select", label: "Mercury Select / American Mercury Warranty" },
  { value: "minnehoma", label: "Minnehoma Automobile Association" },
  { value: "nrg-protects", label: "NRG Protects" },
  { value: "onpoint-warranty", label: "OnPoint Warranty Solutions" },
  { value: "pds-warranty", label: "PDS Warranty Company" },
  { value: "portfolio-se", label: "Portfolio SE" },
  { value: "protect-my-car", label: "Protect My Car" },
  { value: "qbe-admin", label: "QBE Administration Services" },
  { value: "residential-warranty-home", label: "Residential Warranty Home Protection" },
  { value: "risk-assurance-partners", label: "Risk Assurance Partners" },
  { value: "safe-guard", label: "Safe-Guard Warranty Corporation" },
  { value: "service-net-fl", label: "Service Net Solutions of Florida" },
  { value: "signet-service-plans", label: "Signet Service Plans" },
  { value: "total-appliance-ac", label: "Total Appliance & Air Conditioning Repairs" },
  { value: "landcar-total-care", label: "Total Care Auto (Landcar Agency)" },
  { value: "united-service-protection", label: "United Service Protection" },
  { value: "vehicle-dealer-solutions-zurich", label: "Vehicle Dealer Solutions (Zurich Protection)" },
  { value: "warranty-solutions-ge", label: "Warranty Solutions Administrative Services (GE Capital)" },
  { value: "york-international", label: "York Heating & Air Conditioning (York International)" },
];

// Sentinel rendered LAST in the dropdown. There is NO free-text entry, so this is
// the only non-covered selection a user can make — it routes to disqualification.
export const NOT_LISTED_VALUE = "__not_listed__";

// All source-folder companies are now in the gate; nothing is excluded.
export const EXCLUDED_FROM_GATE = [];

export function isCoveredCompany(value) {
  return WARRANTY_COMPANIES.some((c) => c.value === value);
}

export function companyLabel(value) {
  return WARRANTY_COMPANIES.find((c) => c.value === value)?.label || "";
}
