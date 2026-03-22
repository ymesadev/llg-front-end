/**
 * FAQ overrides for high-impression articles lacking FAQ sections.
 * Used by [...slug]/page.js to inject FAQ schema + visible HTML.
 */

const FAQ_OVERRIDES = {
  "ssdi-reconsideration-texas-2026-5": [
    { q: "How long do I have to request SSDI reconsideration in Texas?", a: "You have 60 days from the date of your denial letter to file a Request for Reconsideration with the SSA. Missing this deadline means you may need to start a new application from scratch, which can add months to your case." },
    { q: "What is the SSDI reconsideration approval rate in Texas?", a: "The reconsideration approval rate in Texas is approximately 10-15%, lower than the national average. However, with strong medical evidence and legal representation, your chances improve significantly. Most successful claims are won at the hearing level." },
    { q: "Can I work while my SSDI reconsideration is pending in Texas?", a: "You can work during reconsideration, but your earnings must stay below the Substantial Gainful Activity (SGA) limit of $1,550/month in 2026. Earning above this threshold may result in automatic denial of your claim." },
    { q: "What new evidence should I submit for SSDI reconsideration?", a: "Submit updated medical records, new test results, doctor statements about functional limitations, and any documentation showing your condition has worsened. A detailed Function Report (SSA-3373) and a supportive letter from your treating physician can strengthen your case." },
    { q: "Should I hire a disability lawyer for SSDI reconsideration in Texas?", a: "Yes. Claimants with legal representation are statistically more likely to be approved. A disability attorney can identify weaknesses in your initial application, gather stronger evidence, and ensure your reconsideration addresses the specific reasons for denial." },
  ],
  "ssdi-approval-timeline-oregon-2026-13": [
    { q: "How long does it take to get approved for SSDI in Oregon?", a: "Initial SSDI applications in Oregon typically take 4-6 months to process. If denied and you appeal, reconsideration takes another 3-5 months, and a hearing before an ALJ can take 12-18 months." },
    { q: "What is the SSDI approval rate in Oregon?", a: "Oregon's initial approval rate is approximately 30-35%, close to the national average. The approval rate at the hearing level jumps to about 50-55%, especially for claimants with attorney representation." },
    { q: "Can I get expedited SSDI processing in Oregon?", a: "Yes, if you have a terminal illness, a condition on the SSA's Compassionate Allowances list, or qualify for a TERI designation. Military veterans disabled during service may also receive expedited processing." },
    { q: "What happens after I apply for SSDI in Oregon?", a: "After filing, Oregon's Disability Determination Services (DDS) reviews your medical records, may schedule a consultative exam, and makes an initial determination. You'll receive a written decision by mail." },
    { q: "Does Oregon have a backlog for SSDI hearings?", a: "Yes, Oregon SSDI hearing wait times average 12-16 months depending on the hearing office. The Portland office typically has shorter wait times than rural offices." },
  ],
  "ssdi-approval-timeline-georgia-2026-13": [
    { q: "How long does SSDI take to approve in Georgia?", a: "Initial SSDI applications in Georgia take 4-7 months on average. Georgia has historically had longer processing times due to high application volume. Appeals through reconsideration add 3-5 months, while hearings can take 14-20 months." },
    { q: "What is the SSDI denial rate in Georgia?", a: "Georgia denies approximately 65-70% of initial SSDI applications. However, many denials are overturned on appeal — the hearing approval rate is approximately 48-52%." },
    { q: "Where are the SSDI hearing offices in Georgia?", a: "Georgia has hearing offices in Atlanta, Savannah, Macon, Columbus, and Albany. The Atlanta office typically has the longest wait times due to case volume." },
    { q: "What medical conditions get approved fastest for SSDI in Georgia?", a: "Conditions on the SSA's Compassionate Allowances list (certain cancers, ALS, early-onset Alzheimer's) receive fast-track approval. Conditions meeting Blue Book listings with clear documentation are also approved faster." },
    { q: "Should I get a lawyer for my SSDI claim in Georgia?", a: "Statistics show claimants with legal representation are approved at significantly higher rates. SSDI attorneys work on contingency — you pay nothing unless you win, with fees capped at 25% of back pay or $7,200." },
  ],
  "ssa-3373-function-report-adult": [
    { q: "What is the SSA-3373 Function Report?", a: "The SSA-3373 is a form used by Social Security to evaluate how your disability affects daily activities. It asks about your ability to care for yourself, prepare meals, do housework, manage money, and interact socially." },
    { q: "How should I fill out the SSA-3373 to help my SSDI case?", a: "Be honest but describe your worst days, not your best. Focus on limitations, not abilities. If you can cook but only microwave meals, say that. Specific descriptions are more effective than vague statements." },
    { q: "What mistakes should I avoid on the SSA-3373?", a: "The biggest mistakes are: understating limitations, being too vague, contradicting your medical records, and leaving sections blank. Consistency between your Function Report and medical records is critical." },
    { q: "Can the SSA-3373 hurt my disability claim?", a: "Yes. If you describe daily activities that suggest you can work (extensive shopping, long drives, active hobbies), the SSA may use your own words to deny your claim. Have a disability attorney review your form." },
    { q: "How long do I have to return the SSA-3373?", a: "The SSA typically gives you 10 days to return the Function Report, though extensions are possible. Failing to return it can result in denial for non-cooperation." },
  ],
  "ssdi-approval-timeline-massachusetts-2026-23": [
    { q: "How long does SSDI take in Massachusetts?", a: "Initial SSDI applications in Massachusetts are processed in 3-6 months on average. Reconsideration takes 3-5 months, and ALJ hearings average 12-15 months." },
    { q: "What is the SSDI approval rate in Massachusetts?", a: "Massachusetts has a slightly higher initial approval rate than the national average, at approximately 35-40%. The hearing-level approval rate is around 50-55%." },
    { q: "Where do SSDI hearings take place in Massachusetts?", a: "Massachusetts has hearing offices in Boston, Springfield, Worcester, and Fall River. Most hearings are now offered via video teleconference as well as in person." },
    { q: "Can MassHealth cover me while I wait for SSDI approval?", a: "Yes. Massachusetts residents may qualify for MassHealth (Medicaid) while their SSDI application is pending. Once approved for SSDI, you become eligible for Medicare after a 24-month waiting period." },
    { q: "How much does SSDI pay in Massachusetts?", a: "The average SSDI payment in Massachusetts is approximately $1,500-$1,700/month, though benefits range from $800 to over $3,800 depending on your lifetime earnings." },
  ],
  "ssa-3368-disability-report-adult": [
    { q: "What is the SSA-3368 Disability Report?", a: "The SSA-3368 is the core disability report form used in SSDI and SSI applications. It collects information about your medical conditions, treatments, medications, work history, and daily limitations." },
    { q: "What information do I need to fill out the SSA-3368?", a: "You'll need: names and contact information for all treating doctors and hospitals, dates of medical visits, a complete list of medications with dosages, work history for the past 15 years, and a description of how conditions limit your ability to work." },
    { q: "How detailed should my answers be on the SSA-3368?", a: "Very detailed. Instead of 'back pain,' describe it as 'chronic lower back pain that prevents sitting for more than 20 minutes and requires lying down 3-4 times per day.' Specific, measurable descriptions are far more persuasive." },
    { q: "Can mistakes on the SSA-3368 cause my SSDI claim to be denied?", a: "Yes. Common mistakes include listing incomplete medical provider information, understating symptoms, inconsistencies with medical records, and failing to describe how conditions affect work capacity." },
    { q: "What is the difference between the SSA-3368 and SSA-3373?", a: "The SSA-3368 focuses on medical conditions, treatments, and work history. The SSA-3373 (Function Report) focuses on how disability affects daily activities. Both are typically required during SSDI evaluation." },
  ],
  "florida-minimum-wage-employment-law-guide-miami-florida": [
    { q: "What is the minimum wage in Miami, Florida in 2026?", a: "The minimum wage in Miami and all of Florida is $13.00 per hour as of 2026. Florida's minimum wage increases annually under Amendment 2 and will reach $15.00 per hour by September 2026." },
    { q: "Can my employer fire me without cause in Florida?", a: "Florida is an at-will employment state, meaning employers can terminate employees without giving a reason. However, termination is illegal if based on discrimination, retaliation, or exercising protected rights." },
    { q: "Am I entitled to overtime pay in Miami?", a: "Under the FLSA, most Miami workers are entitled to 1.5x their regular rate for hours over 40 per week. Some salaried employees earning above $35,568/year may be exempt, but misclassification is common." },
    { q: "What should I do if I experience workplace discrimination in Miami?", a: "Document every incident with dates and witnesses. File a complaint with HR, then with the EEOC or Florida Commission on Human Relations (FCHR) within 300 days. An employment lawyer can help protect you from retaliation." },
    { q: "How long do I have to file an employment lawsuit in Florida?", a: "Deadlines vary: discrimination claims must be filed with the EEOC within 300 days, wage theft claims within 2-5 years, and wrongful termination claims typically within 1-4 years." },
  ],
};

export function getFaqOverride(slug) {
  return FAQ_OVERRIDES[slug] || null;
}
