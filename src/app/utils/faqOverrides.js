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

  // === PROPERTY DAMAGE FAQ OVERRIDES (2026-04-13) ===

  "allstate-denied-my-roof-claim": [
    { q: "Why did Allstate deny my roof claim?", a: "Allstate commonly denies roof claims citing pre-existing damage, wear and tear, cosmetic-only damage, or missed filing deadlines. Many of these denials can be challenged with a public adjuster's report or independent inspection." },
    { q: "Can I appeal an Allstate roof claim denial in Florida?", a: "Yes. You can file an internal appeal with Allstate, request an appraisal under your policy, or file a complaint with the Florida Department of Financial Services. If those fail, a property damage attorney can file a lawsuit." },
    { q: "How long do I have to dispute an Allstate roof claim denial?", a: "In Florida, you generally have up to 5 years from the date of loss to file a breach of contract claim against your insurer (2 years for newer policies). However, acting quickly preserves evidence. Call (833) 657-4812 for a free case review." },
    { q: "Should I hire a lawyer if Allstate denied my roof claim?", a: "If your claim involves significant damage, yes. Property damage attorneys work on contingency (no fee unless you win) and routinely recover 2-3x what insurers initially offer. Call Louis Law Group at (833) 657-4812." },
    { q: "What evidence do I need to fight an Allstate roof denial?", a: "Gather your denial letter, policy documents, photos of damage, repair estimates, and an independent roof inspection report. A licensed public adjuster or contractor's assessment that contradicts Allstate's findings is especially valuable." },
  ],

  "ten-tips-handling-usaa-insurance-claim-denials": [
    { q: "Why does USAA deny homeowners insurance claims?", a: "USAA commonly denies claims for alleged pre-existing damage, failure to mitigate, policy exclusions (flood, mold), and documentation gaps. Even USAA members with long histories face denials on high-value property claims." },
    { q: "Can I sue USAA for denying my insurance claim?", a: "Yes. If USAA unreasonably denies or underpays your claim, you may have a breach of contract or bad faith claim. In Florida, you must first file a Civil Remedy Notice before suing for bad faith." },
    { q: "How do I appeal a USAA claim denial?", a: "Start by requesting a written explanation of the denial. Then submit a formal appeal with additional evidence such as contractor estimates, independent inspections, and photos. If the appeal fails, consult a property damage attorney." },
    { q: "Does USAA have to pay for temporary housing during repairs?", a: "If your policy includes Additional Living Expenses (ALE) coverage and your home is uninhabitable due to a covered loss, USAA must pay for temporary housing, meals, and related costs. Call (833) 657-4812 if they refuse." },
    { q: "What is the deadline to dispute a USAA claim denial in Florida?", a: "Florida allows up to 5 years to file a breach of contract lawsuit against your insurer (2 years for post-2023 policies). However, delays weaken your case as evidence deteriorates. Act within 60 days of denial for the strongest position." },
  ],

  "castle-key-insurance-florida-homeowners-guide": [
    { q: "What is Castle Key Insurance in Florida?", a: "Castle Key Insurance Company is Allstate's subsidiary that writes homeowners policies in Florida. Claims are handled through Allstate's network, but your policy terms may differ from standard Allstate policies." },
    { q: "Is Castle Key the same as Allstate?", a: "Castle Key is a wholly owned subsidiary of Allstate, created specifically for the Florida market. While Allstate handles claims processing, Castle Key policies have Florida-specific terms, endorsements, and rate structures." },
    { q: "How do I file a claim with Castle Key Insurance?", a: "File by calling Allstate's claims line at 1-800-547-8676 or through the Allstate mobile app. Document all damage with photos and videos before making temporary repairs. For claim disputes, call Louis Law Group at (833) 657-4812." },
    { q: "Does Castle Key cover hurricane damage in Florida?", a: "Castle Key policies typically cover wind damage from hurricanes but exclude flood damage. You'll have a separate hurricane deductible (usually 2-5% of your home's insured value) that applies to hurricane claims." },
    { q: "What should I do if Castle Key denies my Florida claim?", a: "Request the denial in writing, get an independent inspection, and file a complaint with the Florida Office of Insurance Regulation. If the denial is unjustified, a property damage attorney can pursue your claim at no upfront cost." },
  ],

  "statute-of-limitations-homeowners-insurance-claim-florida": [
    { q: "What is the statute of limitations for homeowners insurance claims in Florida?", a: "In Florida, you have 5 years from the date of loss to file a breach of contract lawsuit against your homeowners insurer. However, policies issued or renewed after March 2023 have a 2-year deadline." },
    { q: "Did Florida change the insurance claim deadline recently?", a: "Yes. In 2023, Florida reduced the time to file new property insurance lawsuits from 5 years to 2 years for policies issued or renewed after March 2023. Older policies may still have the 5-year window." },
    { q: "How long do I have to report roof damage to my insurance in Florida?", a: "Most Florida policies require prompt notice of damage. Under newer policies (post-2023), you must file suit within 2 years of the date of loss. Report damage as soon as possible to preserve your rights." },
    { q: "Can I still file a claim for hurricane damage from last year?", a: "Likely yes, depending on your policy's effective date. Contact your insurer immediately and document all damage. If you're unsure about deadlines, call (833) 657-4812 for a free consultation before time runs out." },
    { q: "What happens if I miss the filing deadline in Florida?", a: "If you miss the statute of limitations, courts will dismiss your lawsuit and you lose the right to sue your insurer. Some narrow exceptions exist (fraud, delayed discovery), but they are difficult to prove." },
  ],

  "tips-handling-claim-denials-progressive-select-insurance": [
    { q: "Why does Progressive Select deny property damage claims?", a: "Progressive Select commonly denies claims citing policy exclusions, insufficient documentation, pre-existing damage, or failure to mitigate. Many denials are based on their adjuster's inspection, which may undervalue your loss." },
    { q: "How do I dispute a Progressive Select claim denial?", a: "Request the denial in writing, review your policy exclusions, get independent repair estimates, and file a formal appeal. If Progressive Select won't budge, file a complaint with your state's insurance department." },
    { q: "Can I hire a public adjuster for my Progressive Select claim?", a: "Yes. A licensed public adjuster works for you (not the insurer) and can often identify covered damage that Progressive Select's adjuster missed. Their fee is typically 10-20% of the claim payout." },
    { q: "Is Progressive Select the same as Progressive Insurance?", a: "Progressive Select is a separate subsidiary of Progressive that writes homeowners and property policies. While related, Progressive Select has its own policy terms and claims process distinct from Progressive auto insurance." },
    { q: "Should I get a lawyer for a Progressive Select denial?", a: "If your claim exceeds $10,000 and you believe the denial is wrong, consulting a property damage attorney is worthwhile. Most work on contingency with no upfront fees. Call Louis Law Group at (833) 657-4812." },
  ],

  "are-roofers-responsible-for-leaks-in-florida": [
    { q: "Are roofers liable for leaks after a roof repair in Florida?", a: "Yes. Under Florida law, roofers can be held liable for leaks caused by defective workmanship, improper installation, or failure to meet building codes. Most roofing contracts also include implied warranties of fitness." },
    { q: "How long is a roofer's warranty on roof work in Florida?", a: "Florida requires roofers to warranty their work for a minimum of 2 years under the contractor licensing statute. Many roofers offer longer warranties. Manufacturer warranties on materials are separate and typically last 20-30 years." },
    { q: "Can I sue my roofer for a leaking roof in Florida?", a: "Yes. You can file a breach of contract or negligence claim. You may also file a complaint with the Florida Construction Industry Licensing Board. For claims over $8,000, consult an attorney. Call (833) 657-4812." },
    { q: "What if my insurance company blames the roofer for the leak?", a: "Insurance companies often blame roofers to avoid paying claims. Get an independent inspection to determine whether the leak is from storm damage (insurer's responsibility) or faulty workmanship (roofer's responsibility)." },
    { q: "How do I prove my roofer caused the leak?", a: "Hire a licensed home inspector or roofing expert to document the defective work. Preserve all contracts, receipts, photos, and communications with the roofer. Building code violation reports from your local building department are also strong evidence." },
  ],

  "allstate-denied-my-roof-claim-2026": [
    { q: "How often does Allstate deny roof claims in 2026?", a: "Allstate denies a significant percentage of roof claims, particularly in Florida and Texas. Common denial reasons include age of roof, cosmetic damage exclusions, and wear-and-tear arguments." },
    { q: "What should I do first after Allstate denies my roof claim?", a: "Request the denial letter in writing, review the specific reasons cited, and get an independent roof inspection from a licensed contractor. Compare their findings with Allstate's adjuster report to identify discrepancies." },
    { q: "Can Allstate deny my claim for an older roof?", a: "Allstate can limit coverage based on roof age, but they cannot deny a legitimate storm damage claim solely because your roof is old. Florida law requires insurers to cover sudden, accidental damage regardless of roof age." },
    { q: "How much does it cost to hire a lawyer for an Allstate roof denial?", a: "Most property damage attorneys work on contingency, meaning zero upfront cost. You only pay if they recover money for you. Call Louis Law Group at (833) 657-4812 for a free case evaluation." },
    { q: "Is Allstate acting in bad faith by denying my roof claim?", a: "If Allstate denied your claim without a reasonable basis, delayed payment unreasonably, or failed to properly investigate, they may be acting in bad faith. In Florida, bad faith can entitle you to damages beyond your policy limits." },
  ],

  "can-you-sue-for-property-damage-florida": [
    { q: "Can you sue for property damage in Florida?", a: "Yes. Florida allows lawsuits for property damage caused by negligence, breach of contract, or insurance bad faith. You can sue the responsible party, their insurer, or your own insurer if they wrongfully deny your claim." },
    { q: "How long do I have to sue for property damage in Florida?", a: "Florida's statute of limitations for property damage is 4 years for negligence claims and 5 years for breach of contract (2 years for newer insurance policies issued after March 2023)." },
    { q: "What damages can I recover in a Florida property damage lawsuit?", a: "You can recover repair or replacement costs, loss of use, diminished property value, additional living expenses, and in some cases attorney fees. Bad faith claims may allow recovery beyond policy limits." },
    { q: "Do I need a lawyer to sue for property damage in Florida?", a: "For claims under $8,000, you can use small claims court without a lawyer. For larger claims, an attorney significantly improves your chances of full recovery. Call (833) 657-4812 for a free consultation." },
    { q: "Can I sue my insurance company for underpaying my claim?", a: "Yes. If your insurer underpaid your property damage claim, you can file a breach of contract lawsuit. In Florida, you must first file a Civil Remedy Notice and give the insurer 60 days to respond before suing for bad faith." },
  ],

  "state-farm-closed-my-claim-florida": [
    { q: "Can State Farm close my claim without paying in Florida?", a: "State Farm can close a claim if they determine no coverage applies, but they must provide a written explanation. If they closed your claim improperly, you have legal options including filing a complaint with Florida regulators." },
    { q: "What should I do if State Farm closed my Florida claim?", a: "Request a written denial or closure letter, review your policy terms, get an independent damage assessment, and consider filing a complaint with the Florida Department of Financial Services. Call (833) 657-4812 for legal guidance." },
    { q: "Can I reopen a closed State Farm claim in Florida?", a: "Yes, in many cases. If you discover additional damage, obtain new evidence, or believe the claim was improperly handled, you can request reopening. The statute of limitations still applies, so act quickly." },
    { q: "How long does State Farm have to resolve a claim in Florida?", a: "Under Florida Statute 627.70131, insurers must acknowledge claims within 14 days, begin investigation within 14 days, and pay or deny within 90 days of filing. Violations can support a bad faith claim." },
    { q: "Is it bad faith for State Farm to close my claim without investigation?", a: "Potentially yes. Florida law requires insurers to conduct a reasonable investigation before denying or closing a claim. Failure to inspect the property or ignoring evidence of damage may constitute bad faith." },
  ],

  "why-does-state-farm-deny-roof-claims-2026": [
    { q: "Why does State Farm deny so many roof claims in 2026?", a: "State Farm frequently denies roof claims citing cosmetic damage exclusions, pre-existing wear, failure to maintain, and age-related deterioration. Their adjusters are trained to attribute damage to non-covered causes." },
    { q: "Can State Farm deny my roof claim for cosmetic damage?", a: "If your policy has a cosmetic damage exclusion (common in newer State Farm policies), they can deny claims for dents or marks that don't affect roof function. However, if the damage is functional, this exclusion should not apply." },
    { q: "What is the State Farm roof denial rate?", a: "While State Farm doesn't publish denial rates, industry data suggests they deny a higher percentage of roof claims than most carriers. Florida policyholders report particularly high denial rates for hurricane and hail damage." },
    { q: "How do I fight a State Farm roof claim denial?", a: "Get an independent inspection from a licensed roofer, file a formal appeal with supporting documentation, and consider hiring a property damage attorney. Call Louis Law Group at (833) 657-4812 for a free case review." },
    { q: "Should I switch from State Farm after a roof claim denial?", a: "Consider your options, but focus on resolving the current claim first. Switching insurers won't help recover money owed on an existing claim. An attorney can help you get paid before you decide on future coverage." },
  ],

  "suing-insurance-company-denying-coverage-florida": [
    { q: "Can I sue my insurance company for denying coverage in Florida?", a: "Yes. If your insurer wrongfully denies a valid claim, you can file a breach of contract lawsuit. For bad faith claims, Florida law requires you to first file a Civil Remedy Notice (CRN) and wait 60 days." },
    { q: "What is a Civil Remedy Notice in Florida?", a: "A Civil Remedy Notice (CRN) is a formal filing with the Florida Department of Financial Services that puts your insurer on notice of a potential bad faith claim. It gives them 60 days to pay before you can sue for bad faith." },
    { q: "How much can I recover by suing my insurer in Florida?", a: "You can recover the full claim amount, interest, and in bad faith cases, damages beyond policy limits including emotional distress and potentially punitive damages. Attorney fees may also be recoverable in certain circumstances." },
    { q: "How long does an insurance lawsuit take in Florida?", a: "Most property insurance lawsuits in Florida take 6-18 months. Many settle before trial once the insurer faces litigation costs. Complex bad faith cases may take longer. Call (833) 657-4812 for a timeline estimate." },
    { q: "Do I need a lawyer to sue my insurance company?", a: "While not legally required, insurance companies have teams of lawyers. Going without representation puts you at a significant disadvantage. Property damage attorneys work on contingency, so there's no upfront cost." },
  ],

  "florida-roof-damage-insurance-claim-timeline": [
    { q: "How long does a roof damage insurance claim take in Florida?", a: "A typical Florida roof claim takes 30-90 days if approved. Under Florida Statute 627.70131, insurers must acknowledge your claim within 14 days and pay or deny within 90 days. Delays beyond this may constitute bad faith." },
    { q: "What are the steps in a Florida roof damage claim?", a: "Report the damage immediately, document with photos and videos, get a contractor estimate, file the claim, meet with the adjuster, receive the adjuster's report, and get payment or a denial letter." },
    { q: "What if my insurer misses the 90-day deadline in Florida?", a: "If your insurer fails to pay or deny within 90 days without good cause, they may be in violation of Florida's prompt payment statute. This can support a bad faith claim with additional damages. Call (833) 657-4812." },
    { q: "Should I make temporary repairs before the adjuster visits?", a: "Yes. Florida law requires you to mitigate further damage. Make temporary repairs (tarps, board-ups) and keep all receipts. Your insurer must reimburse reasonable mitigation costs. Do not make permanent repairs before the inspection." },
    { q: "Can I choose my own contractor for roof repairs in Florida?", a: "Yes. Florida law gives you the right to choose your own licensed contractor. Your insurer cannot require you to use their preferred vendor, though they may only pay up to their estimate." },
  ],

  "examples-of-bad-faith-insurance-claims-florida": [
    { q: "What are examples of bad faith insurance practices in Florida?", a: "Common examples include: unreasonable claim delays, denying valid claims without investigation, lowball settlement offers, misrepresenting policy terms, failing to communicate claim status, and refusing to pay undisputed portions of a claim." },
    { q: "How do I prove insurance bad faith in Florida?", a: "You must show the insurer had no reasonable basis for denying or delaying your claim and that they knew or recklessly disregarded their obligation to pay. Documentation of all communications and timelines is critical." },
    { q: "What damages can I recover in a Florida bad faith claim?", a: "Beyond the original claim amount, you may recover damages exceeding policy limits, consequential damages (lost rental income, additional living expenses), emotional distress, and potentially punitive damages." },
    { q: "Do I need to file a Civil Remedy Notice for bad faith?", a: "Yes. Under Florida Statute 624.155, you must file a Civil Remedy Notice with the Florida Department of Financial Services and give the insurer 60 days to cure before filing a bad faith lawsuit. Call (833) 657-4812 for help filing." },
    { q: "How long do I have to file a bad faith claim in Florida?", a: "The statute of limitations for insurance bad faith in Florida is 5 years. However, you should file your Civil Remedy Notice as soon as you have evidence of bad faith to preserve your rights and maximize recovery." },
  ],

  "insurance-demand-letter-florida": [
    { q: "What is an insurance demand letter in Florida?", a: "An insurance demand letter is a formal written request to your insurer demanding payment on a claim. It outlines the damage, policy coverage, and the amount owed, and puts the insurer on notice that you may pursue legal action." },
    { q: "How do I write a demand letter to my insurance company?", a: "Include your policy number, date of loss, description of damage, relevant policy provisions, supporting documentation (estimates, photos), the specific amount demanded, and a reasonable deadline to respond (usually 30 days)." },
    { q: "Is a demand letter required before suing an insurer in Florida?", a: "While not always legally required for breach of contract, a demand letter creates a paper trail and may prompt settlement. For bad faith claims, a Civil Remedy Notice (CRN) is required. Call (833) 657-4812 for guidance." },
    { q: "How long does an insurer have to respond to a demand letter in Florida?", a: "There is no specific statutory deadline for demand letter responses, but insurers must comply with the 90-day claims handling deadline under Florida Statute 627.70131. Most demand letters set a 30-day response deadline." },
    { q: "Should I hire a lawyer to write my insurance demand letter?", a: "For claims over $10,000, an attorney-drafted demand letter carries significantly more weight. Insurers are more likely to take demands seriously when they come from a law firm. Property damage attorneys typically charge no upfront fee." },
  ],

  "sworn-proof-of-loss-florida-insurance-claim": [
    { q: "What is a sworn proof of loss in Florida?", a: "A sworn proof of loss is a notarized document required by many Florida insurance policies that formally states the details and amount of your loss. It must be signed under oath and submitted within the deadline specified in your policy." },
    { q: "How long do I have to submit a proof of loss in Florida?", a: "Most Florida policies require submission within 60 days of the insurer's request. Missing this deadline can result in claim denial, though courts have sometimes excused minor delays if the insurer wasn't prejudiced." },
    { q: "Can my insurer deny my claim if I don't submit a proof of loss?", a: "Yes. If your policy requires a sworn proof of loss and you fail to submit one after the insurer's request, they can deny your claim for non-compliance. Always respond to proof of loss requests promptly." },
    { q: "What information goes in a sworn proof of loss?", a: "Include: date and cause of loss, detailed description of damaged property, estimated repair/replacement cost, other insurance covering the loss, and any changes in ownership or occupancy. Call (833) 657-4812 for help completing yours." },
    { q: "Should I hire an attorney to help with my proof of loss?", a: "Yes, especially for large claims. The sworn proof of loss locks in your claimed amount under oath. Understating damages can limit your recovery, while overstating can be considered fraud. An attorney ensures accuracy." },
  ],
};

export function getFaqOverride(slug) {
  return FAQ_OVERRIDES[slug] || null;
}
