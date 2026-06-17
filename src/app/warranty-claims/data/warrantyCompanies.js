// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH — Warranty companies Louis Law Group can represent
// Florida clients AGAINST.
//
// Derived verbatim from the case-intake source file `00_INDEX.md`
// ("FL Warranty Agreements — NO BINDING ARBITRATION / litigation targets",
// Louis Law Group, updated 2026-06-17). DO NOT add companies that are not in
// that index. The qualifier uses this list as a HARD GATE: a claimant whose
// provider is not on this list cannot advance past the company step.
//
// Dedup note: the index lists "Bonded Builders Service Corp. DBA Bonded
// Builders Risk Management" three times (files 06/07/08 — identical FL clause);
// collapsed to one entry. Distinct DBAs (e.g. Centricity) are kept separate
// because a consumer sees the brand printed on their own contract.
//
// DELIBERATE EXCLUSIONS (NOT shown in the dropdown) — each documented so the
// decision is auditable and reversible in one edit:
//   • American Auto Shield, Inc. / CarShield (source file 10) — the index flags
//     this 🔴 UNRESOLVED: "BINDING BBB arbitration + class waiver in 2023+
//     templates ... Don't rely on either verdict until the FL endorsement is
//     reviewed." We do not gate a consumer IN on an unresolved litigability
//     verdict. Move into WARRANTY_COMPANIES once the FL endorsement is
//     confirmed non-binding.
//   • First Extended Service Corporation of Florida (source file 30) — present
//     in the source folder but NOT promoted into the 00_INDEX.md target table
//     (low confidence, below the verification cutoff). Add once promoted.
// ---------------------------------------------------------------------------

export const WARRANTY_COMPANIES = [
  // A. Verified high-demand core (index section A)
  { value: "endurance", label: "Endurance" },
  { value: "carchex", label: "CARCHEX (Royal Administration)" },
  { value: "protect-my-car", label: "Protect My Car" },
  // B. No-binding-arbitration targets (index section B)
  { value: "bonded-builders", label: "Bonded Builders" },
  { value: "centricity-bonded-builders", label: "Centricity (issued by Bonded Builders Service Corp.)" },
  { value: "aig-warranty-fl", label: "AIG Warranty Services of Florida" },
  { value: "assurant-home-fl", label: "Assurant Home Solutions of Florida" },
  { value: "complete-appliance-protection", label: "Complete Appliance Protection (Complete Protection)" },
  { value: "broward-factory-service", label: "Broward Factory Service (Herd Enterprises)" },
  { value: "homemembership", label: "HomeMembership" },
  { value: "4-warranty-corporation", label: "4 Warranty Corporation" },
  { value: "access-protection-fl", label: "Access Protection Company (FL)" },
  { value: "centricity-bankers-warranty", label: "Centricity (issued by Bankers Warranty Group of Florida)" },
  { value: "domestic-general-usa", label: "Domestic & General USA" },
  { value: "east-coast-mechanical", label: "East Coast Mechanical (ECM)" },
  { value: "ecm-warranty", label: "ECM Warranty" },
  { value: "apple", label: "Apple" },
  { value: "applecare", label: "AppleCare (AppleCare Service Company)" },
  { value: "cna-national-warranty", label: "CNA National Warranty Corporation" },
  { value: "gai-warranty-fl", label: "GAI Warranty Company of Florida" },
  { value: "hendrick-autoguard-fl", label: "Hendrick Autoguard Florida" },
  { value: "flynns-air-conditioning", label: "Flynn's Air Conditioning Service" },
  { value: "badcock", label: "Badcock Home Furniture (Badcock's)" },
];

// Sentinel rendered LAST in the dropdown. There is NO free-text entry, so this
// is the only non-covered selection a user can make — and it routes straight to
// the disqualification screen. Selecting it never advances the qualifier.
export const NOT_LISTED_VALUE = "__not_listed__";

// Documented exclusions, exported for transparency / tests (NOT rendered in UI).
export const EXCLUDED_FROM_GATE = [
  {
    label: "American Auto Shield / CarShield",
    sourceFile: "10_AMERICAN_AUTO_SHIELD_INC_NONBIND_high.pdf",
    reason:
      "Litigability UNRESOLVED in the source index (possible binding BBB arbitration + class waiver in 2023+ templates). Excluded until the FL endorsement is confirmed non-binding.",
  },
  {
    label: "First Extended Service Corporation of Florida",
    sourceFile: "30_FIRST_EXTENDED_SERVICE_CORPORATION_OF_FLORIDA_NO_low.pdf",
    reason:
      "Present in the source folder but not promoted into the 00_INDEX.md target table (low confidence).",
  },
];

export function isCoveredCompany(value) {
  return WARRANTY_COMPANIES.some((c) => c.value === value);
}

export function companyLabel(value) {
  return WARRANTY_COMPANIES.find((c) => c.value === value)?.label || "";
}
