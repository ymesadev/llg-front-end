/**
 * SEO Overrides for high-impression page 2-3 articles.
 * Improves titles and descriptions to boost CTR and rankings.
 * These override weak CMS defaults for articles that can't be updated via API.
 */

const SEO_OVERRIDES = {
  "ssdi-reconsideration-texas-2026-5": {
    title: "SSDI Reconsideration in Texas: How to Win Your Appeal (2026)",
    description: "Denied SSDI in Texas? Learn how to file a Request for Reconsideration, what evidence to include, and how Louis Law Group helps Texans win disability appeals.",
  },
  "ssdi-approval-timeline-oregon-2026-13": {
    title: "SSDI Approval Timeline in Oregon: Processing Times & What to Expect (2026)",
    description: "How long does SSDI take in Oregon? Average processing is 4-6 months for initial claims. Learn each stage's timeline and how to speed up your approval.",
  },
  "ssdi-approval-timeline-georgia-2026-13": {
    title: "SSDI Approval Timeline in Georgia: How Long Does It Take? (2026)",
    description: "Georgia SSDI processing takes 4-7 months on average. Learn approval timelines for each stage, hearing wait times, and how to avoid common delays.",
  },
  "ssa-3373-function-report-adult": {
    title: "SSA-3373 Function Report: Free Download & How to Fill It Out (2026)",
    description: "Download Form SSA-3373 (Function Report) and learn exactly how to complete it to strengthen your SSDI claim. Step-by-step guide with expert tips.",
  },
  "ssdi-approval-timeline-massachusetts-2026-23": {
    title: "SSDI Approval Timeline in Massachusetts: Wait Times & Tips (2026)",
    description: "Massachusetts SSDI claims take 3-6 months initially. Learn current processing times, hearing wait times in Boston, and how to speed up your application.",
  },
  "ssa-3368-disability-report-adult": {
    title: "SSA-3368 Disability Report: Free Download & Completion Guide (2026)",
    description: "Download Form SSA-3368 (Disability Report) with a step-by-step guide to completing it correctly. Avoid common mistakes that lead to SSDI denials.",
  },
  "florida-minimum-wage-employment-law-guide-miami-florida": {
    title: "Florida Minimum Wage & Employment Law Guide for Miami Workers (2026)",
    description: "Miami's minimum wage is $13/hour in 2026. Know your rights under Florida employment law — overtime, discrimination, wrongful termination. Free consultation.",
  },
};

export function getSeoOverride(slug) {
  return SEO_OVERRIDES[slug] || null;
}
