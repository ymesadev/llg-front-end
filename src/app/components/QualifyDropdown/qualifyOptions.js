// Single source of truth for the "which issue are you having?" → qualifier routing.
// Used by QualifyDropdown (nav button) and the /free-case-evaluation chooser page.

export const QUALIFY_OPTIONS_EN = [
  {
    key: "property",
    label: "Property Damage / Denied Claim",
    desc: "Insurance denied, delayed, or underpaid your claim",
    href: "/property-damage-claims/qualify",
    icon: "Home",
  },
  {
    key: "contractor",
    label: "A Contractor Damaged My Property",
    desc: "Plumber, roofer, HVAC, or general contractor negligence",
    href: "/contractor-damage-claims/qualify",
    icon: "Hammer",
  },
  {
    key: "ssdi",
    label: "Social Security Disability",
    desc: "SSDI / SSI benefits — denied or applying",
    href: "/ssdi/qualify",
    icon: "Accessibility",
  },
  {
    key: "personal-injury",
    label: "Personal Injury / Accident",
    desc: "Car accident, slip & fall, or other injury",
    href: "/personal-injury/qualify",
    icon: "Car",
  },
  {
    key: "warranty",
    label: "Warranty Dispute",
    desc: "Home or vehicle warranty claim denied",
    href: "/warranty-claims/qualify",
    icon: "ShieldCheck",
  },
];

// Spanish-language qualifiers that currently exist (property + disability).
export const QUALIFY_OPTIONS_ES = [
  {
    key: "property",
    label: "Daños a la Propiedad",
    desc: "Su seguro negó, retrasó o pagó de menos su reclamo",
    href: "/reclamos-propiedad/calificar",
    icon: "Home",
  },
  {
    key: "ssdi",
    label: "Discapacidad (Seguro Social)",
    desc: "Beneficios de SSDI / SSI — negados o solicitando",
    href: "/ssdi/calificar",
    icon: "Accessibility",
  },
];
