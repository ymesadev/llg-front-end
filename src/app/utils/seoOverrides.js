/**
 * SEO Overrides for high-impression page 2-3 articles.
 * Improves titles and descriptions to boost CTR and rankings.
 * These override weak CMS defaults for articles that can't be updated via API.
 */

const SEO_OVERRIDES = {
  // === HIGH-IMPRESSION, LOW-CTR FIXES (2026-03-23) ===

  // #1: Progressive Select claim — 12,704 imps, 0.13% CTR, pos 9.8
  "how-to-file-a-claim-with-progressive-select-insurance-company": {
    title: "How to File a Progressive Select Claim (2026)",
    description: "Step-by-step guide to filing a Progressive Select Insurance claim. Deadlines, required docs, and what to do if denied. Free attorney help: (833) 657-4812.",
  },

  // #2: SSDI Reconsideration Texas — 12,063 imps, 0.11% CTR, pos 10.8
  // Override both canonical and dedup variant
  "ssdi-reconsideration-texas-2026": {
    title: "SSDI Reconsideration Texas: Win Your Appeal (2026)",
    description: "Denied SSDI in Texas? 67% of initial claims are denied. Learn how to file a winning reconsideration with the right evidence. Free attorney help: (833) 657-4812.",
  },
  "ssdi-reconsideration-texas-2026-5": {
    title: "SSDI Reconsideration Texas: Win Your Appeal (2026)",
    description: "Denied SSDI in Texas? 67% of initial claims are denied. Learn how to file a winning reconsideration with the right evidence. Free attorney help: (833) 657-4812.",
  },

  // #3: SSDI Approval Timeline Illinois — 7,833 imps, 0.20% CTR, pos 9.9
  "ssdi-approval-timeline-illinois-2026": {
    title: "SSDI Approval Timeline Illinois 2026: Wait Times",
    description: "Illinois SSDI approval takes 4-7 months on average. See wait times for each stage, how to speed up your claim, and when to hire a disability attorney.",
  },

  // #4: SSDI Application Missouri — 5,744 imps, 0.03% CTR, pos 2.5 (MOST URGENT — high position, almost zero clicks)
  "ssdi-application-online-missouri-missouri-guide": {
    title: "Apply for SSDI Online in Missouri (2026 Guide)",
    description: "How to apply for SSDI online in Missouri. Eligibility, required documents, SSA office locations, and what to do if denied. Free consultation: (833) 657-4812.",
  },

  // #5: Average SSDI Payment California — 5,373 imps, 0.35% CTR, pos 4.0
  "average-ssdi-payment-california-2026": {
    title: "Average SSDI Payment California 2026: $1,580/Mo",
    description: "California SSDI payments average $1,580/month in 2026. See what you should receive and find out if you are underpaid. Free disability attorney consultation.",
  },

  // #6: SSDI ALJ Hearing Tips — 4,601 imps, 0.07% CTR, pos 3.5
  // Override both canonical and dedup variant
  "ssdi-alj-hearing-tips-2026": {
    title: "SSDI ALJ Hearing Tips: How to Win (2026)",
    description: "Expert tips for your SSDI ALJ hearing. What to say, what to wear, and mistakes to avoid. Claimants with attorneys win more often. Free consult: (833) 657-4812.",
  },
  "ssdi-alj-hearing-tips-2026-171": {
    title: "SSDI ALJ Hearing Tips New York (2026)",
    description: "Preparing for an SSDI hearing in New York? What judges look for, how to present your case, and why hiring an attorney boosts your approval odds. Free consult.",
  },

  // === EXISTING OVERRIDES ===
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

  // === PAGE 2-3 KEYWORD OPTIMIZATION (2026-03-23) ===

  // #1: Miami Disability Lawyer — "disability lawyer" pos 5.9, 199 imps
  "miami-disability-lawyer-2026-2": {
    title: "Miami Disability Lawyer: Free SSDI Consultation (2026)",
    description: "Top-rated Miami disability lawyer helping Floridians win SSDI benefits. 3,000+ cases won, no fee unless you win. Call (844) 853-8996 for a free evaluation.",
  },

  // #2: Miami Disability Lawyer v2 — "social security disability lawyer" pos 15.4, 58 imps + "ssdi attorney" pos 5.4
  "miami-disability-lawyer-2026-1": {
    title: "Social Security Disability Lawyer Miami | Louis Law Group",
    description: "Experienced Social Security disability lawyer in Miami. We handle SSDI claims, appeals, and hearings. $200M+ recovered. Free consultation: (844) 853-8996.",
  },

  // #3: SSDI Attorney Indianapolis — "ssdi attorney near me" pos 16.3, 67 imps
  "ssdi-attorney-near-me-indianapolis-2026": {
    title: "SSDI Attorney Indianapolis: Win Your Disability Claim (2026)",
    description: "Indianapolis SSDI attorney helping you win disability benefits. We handle applications, denials, and appeals. No fee unless we win. Free consult: (844) 853-8996.",
  },

  // #4: SSDI Attorney Pittsburgh — "disability attorney near me" pos 9.3, 19 imps
  "ssdi-attorney-near-me-pittsburgh-2026": {
    title: "Disability Attorney Pittsburgh: SSDI Help Near You (2026)",
    description: "Pittsburgh disability attorney for SSDI claims and appeals. Get expert help with your application or denial. Free consultation: (844) 853-8996.",
  },

  // #5: Disability Lawyer Tampa — "disability attorneys near me" pos 18.2, 16 imps
  "disability-lawyer-near-tampa-2026": {
    title: "Tampa Disability Lawyer: SSDI Claims & Appeals (2026)",
    description: "Tampa Bay disability lawyer fighting for your SSDI benefits. Denied? We can help with appeals and hearings. No fee unless you win. Call (844) 853-8996.",
  },

  // #6: Disability Lawyer Chicago — "disability lawyers near me" pos 15.7, 14 imps
  "disability-lawyer-near-chicago-2026": {
    title: "Chicago Disability Lawyer: SSDI Benefits Help (2026)",
    description: "Chicago disability lawyer specializing in SSDI claims. We handle applications, denials, and ALJ hearings. 3,000+ cases won. Free consult: (844) 853-8996.",
  },

  // Chances of Winning Disability With a Lawyer — trending query pos 36.9→20.7
  "chances-of-winning-disability-with-a-lawyer": {
    title: "Chances of Winning Disability With a Lawyer (2026 Data)",
    description: "SSDI approval rates jump from 34% to 62% with attorney representation. See the data on why hiring a disability lawyer improves your chances of winning.",
  },

  // #7: Renters Insurance Flood FAQ — 2,000+ imps at pos 25 (MASSIVE opportunity)
  "faq-water-damage-does-renters-insurance-cover-flooding": {
    title: "Does Renters Insurance Cover Flooding? What You Need to Know",
    description: "Standard renters insurance does NOT cover floods. Learn what is and isn't covered, how to get flood insurance, and your legal options if your claim is denied.",
  },

  // #8: Miramar Personal Injury — "personal injury lawyer near me" pos 5.2
  "personal-injury-attorneys-near-me-miramar-florida": {
    title: "Personal Injury Lawyer Miramar FL: Free Case Review (2026)",
    description: "Miramar personal injury lawyer handling car accidents, slip & falls, and insurance claims. No fee unless we win your case. Call (844) 853-8996 today.",
  },

  // #9: Charlotte SSDI Attorney — "best disability attorney near me" pos 6.7
  "best-ssdi-attorney-charlotte-2026": {
    title: "Best SSDI Attorney Charlotte NC: Win Your Claim (2026)",
    description: "Charlotte's top-rated SSDI attorney. We fight denied disability claims and handle appeals. No fee unless you win. Free evaluation: (844) 853-8996.",
  },

  // #10: Nashville Disability Lawyer — "disability lawyers near me" pos 10.2
  "disability-lawyer-near-nashville-2026-1": {
    title: "Nashville Disability Lawyer: SSDI Claims & Appeals (2026)",
    description: "Nashville disability lawyer helping you get SSDI benefits. Expert help with applications, denials, and hearings. Free consultation: (844) 853-8996.",
  },
};

export function getSeoOverride(slug) {
  return SEO_OVERRIDES[slug] || null;
}
