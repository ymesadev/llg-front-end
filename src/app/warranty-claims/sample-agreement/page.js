import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";

export const metadata = {
  title:
    "Sample Vehicle Service Contract (Florida) — Warranty Agreement Example | Louis Law Group",
  description:
    "Read a real, representative Florida vehicle service contract (extended auto warranty) reproduced for educational reference — coverage, exclusions, how to file a claim, cancellation, transfer, and the Florida amendment that makes arbitration non-binding. Published by Louis Law Group.",
  alternates: {
    canonical:
      "https://www.louislawgroup.com/warranty-claims/sample-agreement",
  },
  openGraph: {
    title:
      "Sample Vehicle Service Contract — Florida (Warranty Agreement Example)",
    description:
      "A representative third-party Florida vehicle service contract, cleanly typeset for reference: what is covered, what is excluded, how claims work, and the Florida non-binding arbitration amendment.",
    url: "https://www.louislawgroup.com/warranty-claims/sample-agreement",
    siteName: "Louis Law Group",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Sample Vehicle Service Contract — Florida (Warranty Agreement Example)",
  description:
    "A representative third-party Florida vehicle service contract reproduced for educational reference, including coverage, exclusions, claim procedures, cancellation, transfer, and the Florida amendment making arbitration non-binding.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://www.louislawgroup.com/warranty-claims/sample-agreement",
  },
  about: {
    "@type": "Thing",
    name: "Vehicle Service Contract (Extended Auto Warranty)",
  },
  publisher: {
    "@type": "LegalService",
    name: "Louis Law Group",
    url: "https://www.louislawgroup.com",
    areaServed: "Florida",
  },
  author: {
    "@type": "Organization",
    name: "Louis Law Group",
  },
};

// Table of contents — mirrors the contract's natural sections in order.
const toc = [
  { id: "purchaser-acknowledgment", label: "Purchaser Acknowledgment" },
  { id: "how-to-read", label: "I. How to Read This Agreement" },
  { id: "definitions", label: "II. Definitions" },
  { id: "scope", label: "III. Scope of This Agreement" },
  { id: "responsibilities", label: "IV. Your Responsibilities" },
  { id: "filing-a-claim", label: "V. Filing a Breakdown Claim" },
  { id: "what-is-covered", label: "VI. What Is Covered" },
  { id: "additional-benefits", label: "VII. Additional Benefits" },
  { id: "exclusions", label: "VIII. Exclusions — What Is Not Covered" },
  { id: "legal-disputes", label: "IX. Legal Claims and Disputes" },
  { id: "florida-requirements", label: "X. Florida State-Specific Requirements" },
];

export default function SampleAgreementPage() {
  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className={styles.page}>
        {/* ---------------- HERO ---------------- */}
        <header className={styles.hero}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className={styles.sep}>›</span>
            <a href="/warranty-claims">Warranty Claims</a>
            <span className={styles.sep}>›</span>
            <span className={styles.current}>Sample Agreement</span>
          </nav>

          <h1 className={styles.h1}>
            Sample Vehicle Service Contract — Florida
          </h1>

          <p className={styles.intro}>
            Below is a real, representative vehicle service contract (the kind
            of agreement sold as an &ldquo;extended auto warranty&rdquo;),
            reproduced and cleanly typeset so Florida consumers can see exactly
            what these contracts say before they sign — what is covered, what is
            excluded, how a claim works, and what their rights are.
          </p>

          <div className={styles.disclaimer} role="note">
            <h2 className={styles.disclaimerTitle}>
              Important — please read first
            </h2>
            <p>
              This document is a <strong>representative third-party sample</strong>{" "}
              published for <strong>educational reference only</strong>. It is{" "}
              <strong>not legal advice</strong>, it does not create an
              attorney–client relationship, and it is{" "}
              <strong>not a Louis Law Group product</strong>. Louis Law Group
              does not sell, administer, or underwrite vehicle service contracts.
              Your own contract&rsquo;s terms control your situation — always
              read the actual agreement you were given. Section and benefit
              specifics (terms, mileage, deductible, and the coverage level you
              selected) are set out on that contract&rsquo;s Application Page and
              Identification Card.
            </p>
          </div>

          <div className={styles.callout}>
            <span className={styles.calloutTag}>Florida consumers</span>
            <p>
              In this sample contract, the standard arbitration clause is
              changed by the Florida amendment. The Florida-specific section
              states:{" "}
              <q className={styles.quote}>
                Arbitration is non-binding in the State of Florida. Arbitration
                proceedings shall be conducted in the county in which You reside.
              </q>{" "}
              In plain English: even where a contract pushes disputes into
              arbitration, the Florida amendment means that arbitration is{" "}
              <strong>non-binding</strong> — Florida consumers keep the right to
              take the matter to court.
            </p>
          </div>

          <a className={styles.cta} href="/warranty-claims/qualify">
            See if you qualify — free
          </a>
        </header>

        {/* ---------------- TABLE OF CONTENTS ---------------- */}
        <nav className={styles.toc} aria-label="Table of contents">
          <h2 className={styles.tocTitle}>Contents</h2>
          <ol className={styles.tocList}>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ---------------- CONTRACT BODY ---------------- */}
        <div className={styles.contract}>
          <p className={styles.docMeta}>
            Vehicle Service Contract &mdash; Form VSC-01D-EDS (06/22).
            Administrator/Obligor: Endurance Dealer Services, LLC, 400 Skokie
            Blvd, Suite 105, Northbrook, IL 60062, 877-414-0134. The
            Administrator/Obligor&rsquo;s performance under this Contract is
            insured by Wesco Insurance Company. In Florida, Administrator and
            Obligor means Northcoast Warranty Services, Inc., 800 Superior Avenue
            E, 21st Floor, Cleveland, OH 44114, License&nbsp;# 49127.
          </p>

          {/* PURCHASER ACKNOWLEDGMENT */}
          <section id="purchaser-acknowledgment" className={styles.section}>
            <h2>Purchaser Acknowledgment</h2>
            <p>
              I, the Contract Purchaser, acknowledge that this Vehicle Service
              Contract, including the Application Page, Terms and Conditions,
              Identification Card, limitations, exceptions, definitions, and
              Exclusions, together with any endorsements, if any, constitutes the
              entire Contract. The Coverage I have selected expires according to
              the terms indicated on the Application Page and Identification
              Card, and as defined in Section III.D. Coverage Period. The
              components and parts eligible for Coverage are listed under Section
              VI. What is Covered. I agree to maintain the Vehicle in accordance
              with Section IV. Your Responsibilities. I understand to file a
              claim in the event I have a Breakdown, I am to follow the
              instructions in Section V. Filing a Breakdown Claim.
            </p>
            <p>
              This Contract is neither an insurance policy nor a seller&rsquo;s
              warranty. This Contract may run concurrent with and is secondary to
              any applicable manufacturer&rsquo;s or repair facility&rsquo;s
              warranty or other vehicle service contract or similar component
              protection product. Purchase of this Contract is not required in
              order to purchase or lease a vehicle or to obtain vehicle
              financing.
            </p>
            <p>
              I have reviewed and understand the time and mileage limitations,
              Waiting Period, Coverage, and Exclusions, and that the repair of
              non-Eligible Components is excluded from Coverage. I have read and
              understand Section IV. Your Responsibilities. I hereby declare that
              I have received the Contract and the above information is correct. I
              understand that the Contract will be between the Administrator
              (Endurance Dealer Services, LLC) and Contract Purchaser.
            </p>
          </section>

          {/* I. HOW TO READ */}
          <section id="how-to-read" className={styles.section}>
            <h2>I. How to Read This Agreement</h2>
            <p>
              This Vehicle Service Contract provides for the payment of Covered
              Repairs to Eligible Components within Your Vehicle and other
              Benefits, as more fully explained below. The terms in BOLD have
              specific meanings provided in Section II. Definitions. Please read
              all Definitions carefully.
            </p>
            <p>
              This Contract is not a warranty or insurance policy, and does not
              cover every repair, but only Covered Repairs to Eligible Components
              identified in Section VI. What is Covered. Administrator will not
              pay for repairs to components that have failed, or begun to fail,
              prior to the expiration of the Waiting Period. There is an
              additional list of Exclusions under Section VIII. Exclusions — What
              Is Not Covered. Please read these sections carefully.
            </p>
            <p>
              You have certain Responsibilities under this Contract, set forth in
              Section IV. Your Responsibilities, including maintaining Your
              Vehicle, preserving all records, and preventing any damage from
              continued use or operation after You suspect something is wrong.
              One of the Benefits under this Contract is complimentary roadside
              assistance, available 24 hours a day across the United States of
              America, as set forth in Section VII. Additional Benefits.
            </p>
            <p>
              You have the right to Cancellation of this Contract at any time.
              Administrator also has the right to Cancellation of this Contract
              if You fail to satisfy Your Responsibilities, including providing
              accurate information regarding mileage and the condition of Your
              Vehicle. If You have any questions or concerns, please contact
              Administrator at 877-414-0134 to speak with a Certified Vehicle
              Protection Specialist.
            </p>
          </section>

          {/* II. DEFINITIONS */}
          <section id="definitions" className={styles.section}>
            <h2>II. Definitions</h2>
            <p>
              The following definitions apply to words frequently used in this
              Contract:
            </p>
            <ul className={styles.defList}>
              <li>
                <strong>Administrator</strong> means Endurance Dealer Services,
                LLC, 400 Skokie Blvd, Suite 105, Northbrook, IL 60062,
                877-414-0134, the entity that is obligated to perform hereunder.
                In Florida, Administrator means Northcoast Warranty Services,
                Inc., 800 Superior Avenue E, 21st Floor, Cleveland, OH 44114,
                844-371-1014, License&nbsp;# 49127.
              </li>
              <li>
                <strong>Application Page</strong> means the first page of this
                document, and contains information provided by You regarding Your
                Vehicle, among other things.
              </li>
              <li>
                <strong>Benefits</strong> means the specific items listed in
                Section VII. Additional Benefits, and nothing else.
              </li>
              <li>
                <strong>Breakdown</strong> means the failure of a Vehicle
                component to perform the function for which it was designed
                without regard to the cause of the failure or the eligibility of
                repairs for Coverage.
              </li>
              <li>
                <strong>Cancellation</strong> means the termination of this
                Contract pursuant to Section III.H. Cancellations.
              </li>
              <li>
                <strong>Commercial Use</strong> means Vehicles used for farming,
                ranching, route work, job-site activities, service or repair
                work, snow removal, ride share (Uber, Lyft, etc.), rental, taxi,
                limousine or shuttle, towing/wrecker service, dumping, cherry
                pickers, lifting or hoisting, police or emergency service, car
                hauling and delivery, or any other business enterprises, or has
                been issued commercial plates in the state in which it is titled,
                or is used for a commercial purpose.
              </li>
              <li>
                <strong>Coverage Period</strong> means the time when Coverage
                under this Contract begins upon the expiration of the Waiting
                Period and continuing until the Contract Expiration Months or
                Odometer Miles listed on the Application Page is reached and/or
                when the Limit of Liability for the Contract has been reached,
                whichever comes first.
              </li>
              <li>
                <strong>Coverage</strong> means the component protection You
                selected as shown on Your Identification Card and in the Coverage
                box on the Application Page of this Contract.
              </li>
              <li>
                <strong>Covered Repair</strong> means the pre-authorized
                reasonable expenses incurred for the repair or replacement of an
                Eligible Component that has experienced a Breakdown under normal
                service upon the expiration of the Waiting Period solely because
                of the Eligible Component&rsquo;s condition and not because of
                the action, inaction or failure of any non-Eligible Component,
                subject to all Exclusions.
              </li>
              <li>
                <strong>Deductible</strong> means the amount You are required to
                pay as selected on the Application Page per Covered Repair. No
                Deductible payment is required with respect to Benefits. If no
                Deductible is stated on the Application Page, the standard
                Deductible will be one hundred dollars ($100).
              </li>
              <li>
                <strong>Eligible Component(s)</strong> means the specific part(s)
                identified and described under Section VI. What is Covered, and
                nothing else. Any part not specifically identified and described
                in Section VI is a non-Eligible Component.
              </li>
              <li>
                <strong>Licensed Repair Facility</strong> means any for-profit
                entity in the business of repairing or maintaining motor vehicles
                and recognized as such in the state where the facility is
                located.
              </li>
              <li>
                <strong>Limit of Liability</strong> means Our maximum liability
                for Coverage as defined in Section III.E. Limit of Liability.
              </li>
              <li>
                <strong>Pre-Existing</strong> means a condition that within all
                reasonable mechanical probability relates to the mechanical
                condition of Your Vehicle prior to Contract issuance or prior to
                the expiration of the Waiting Period. Failures that occur, or
                begin to occur, prior to the expiration of the Waiting Period are
                not eligible for Coverage under this Contract.
              </li>
              <li>
                <strong>Verifiable Document</strong> means a computer-generated
                maintenance or repair invoice from a Licensed Repair Facility
                printed on the facility&rsquo;s letterhead. The document must
                include Your name, Vehicle year, make, model and VIN, date, and
                mileage at the time of service to be considered verifiable.
                Handwritten documents, invoices, and/or receipts will not be
                accepted.
              </li>
              <li>
                <strong>Waiting Period</strong> means the period of time and
                mileage specified on the Application Page that precedes the
                Coverage Period of this Contract. Coverage under this Contract
                begins upon the expiration of the Waiting Period. No claims will
                be authorized or reimbursed for failures that occur, or begin to
                occur, prior to the expiration of the Waiting Period.
              </li>
              <li>
                <strong>We, Us, Our (the &ldquo;Obligor&rdquo;)</strong> means
                the entity who is obligated to perform under this Contract. The
                Obligor of this Contract is Endurance Dealer Services, LLC. In
                Florida, We, Us, Our, Obligor means Northcoast Warranty Services,
                Inc., License&nbsp;# 49127.
              </li>
              <li>
                <strong>You, Your</strong> means the person who purchased this
                Contract, i.e. the Contract Purchaser shown on the Application
                Page, or the person to whom this Contract was properly
                transferred, i.e. the Contract Holder.
              </li>
            </ul>
          </section>

          {/* III. SCOPE */}
          <section id="scope" className={styles.section}>
            <h2>III. Scope of This Agreement</h2>
            <p>
              This is a Vehicle Service Contract between You and Us. You agree and
              understand that this Contract is a Vehicle Service Contract and not
              a warranty or an insurance policy. This Contract does not cover
              everything that might go wrong with Your Vehicle.
            </p>
            <p>
              <strong>A. Parties.</strong> There are two parties to this
              Contract: You and Administrator. This Contract relates only to Your
              Vehicle. This Contract does not apply to any other person or thing.
            </p>
            <p>
              <strong>B. Payment of Covered Repairs.</strong> Administrator
              agrees to provide payment or reimbursement for Covered Repairs,
              less any Deductible, in accordance with the terms and provisions
              contained in this Contract. Reasonable expenses are not to exceed
              the manufacturer&rsquo;s suggested retail price (MSRP) for parts,
              and the Licensed Repair Facility&rsquo;s published hourly rate
              multiplied by the appropriate operation time, as published in a
              national labor time guide. Replacement of Eligible Components may be
              made with original equipment manufacturer parts, non-original
              equipment manufacturer parts, re-manufactured parts, or used parts
              at Administrator&rsquo;s discretion. Administrator will NOT pay for
              any Covered Repairs performed without Our knowledge and prior
              approval, and will NOT pay for Covered Repairs if You have failed to
              pay for this Contract.
            </p>
            <p>
              <strong>C. Entire Agreement.</strong> This Contract, including the
              Application Page, Terms and Conditions, Identification Card,
              limitations, exceptions, definitions, and Exclusions, together with
              any endorsements, constitutes the entire Contract. No one other
              than the parties hereto, by mutual agreement in writing, may change
              this Contract or waive any of its provisions. This Contract gives
              You specific rights. You may have other rights, which may vary from
              state to state. This Contract shall be invalidated if there has
              been an inaccuracy, tampering or alteration to the odometer mileage
              of the Vehicle.
            </p>
            <p>
              <strong>D. Coverage Period.</strong> Benefits under this Contract
              are available on the Purchase Date; however, Coverage begins upon
              the expiration of the Waiting Period. Any Breakdown that occurs, or
              begins to occur, prior to the expiration of the Waiting Period is
              not covered. This Contract terminates when the Contract Expiration
              Months or Odometer Miles listed on the Application Page is reached,
              or when the Administrator has paid the Limit of Liability,
              whichever occurs first.
            </p>
            <p>
              <strong>E. Limit of Liability.</strong> For Secure and Secure Plus
              Coverage: Our maximum Limit of Liability per covered Vehicle for
              all Covered Repairs and Benefits shall not exceed the lesser of a
              total dollar amount of ten thousand dollars ($10,000) or the NADA
              average trade-in value at the time of Covered Repair and/or
              Benefits. For Superior, Supreme and Supreme Wrap Coverage: Our
              maximum Limit of Liability shall not exceed the NADA average
              trade-in value at the time of Covered Repair and/or Benefits. Once
              the combined maximum Limit of Liability has been reached, this
              Contract, and its transfer and Cancellation rights, terminate. Our
              liability for incidental and consequential damages — including
              personal injury, physical damage, property damage, loss of use,
              loss of time, loss of wages, inconvenience, and commercial loss —
              is expressly excluded.
            </p>
            <p>
              <strong>F. Ineligible Vehicles &amp; Uses.</strong> This Contract
              does not cover any vehicle that has ever been issued a restricted
              title (including gray market, NAM, total loss, salvage, rebuilt,
              assembled, dismantled, scrap, fire, flood, physical damage,
              saltwater damage, frame change, motor change, body exchange, junk
              or parts only). This Contract does not cover any vehicle used for
              towing unless equipped with a factory installed or factory
              authorized tow package, nor any Vehicle used for Commercial Use
              (unless the Commercial Use Option has been selected and the
              surcharge paid), principally off-road use, or organized racing or
              competitive driving.
            </p>
            <p>
              <strong>G. Transfer of Manufacturer&rsquo;s Warranty.</strong> You
              are responsible for the transfer, and any applicable transfer fees,
              to retain all manufacturers&rsquo; warranties available on the
              Vehicle. Failure to transfer the manufacturer&rsquo;s warranty can
              result in nonpayment of a claim if the manufacturer&rsquo;s
              warranty would normally have been in effect.
            </p>
            <p>
              <strong>H. Cancellations.</strong> You may cancel this Contract at
              any time, including when the Vehicle is sold, lost, stolen or
              destroyed, by notifying Us in writing and submitting a request to
              cancel and a Federal Odometer Statement or notarized affidavit
              verifying mileage. We may cancel this Contract for non-payment of
              the Purchase Price or for Your intentional misrepresentation in
              obtaining this Contract or in submitting a claim. If this Contract
              is cancelled by You within thirty (30) days of purchase and no
              claim has been filed, the entire Contract Purchase Price paid will
              be refunded. After the first thirty (30) days, the unearned
              Contract Purchase Price will be refunded on a pro-rata basis, less
              an administrative fee of fifty dollars ($50) and the total amount
              of all claims paid. (See Section X for the Florida-specific
              cancellation terms, which supersede this provision in Florida.)
            </p>
            <p>
              <strong>I. Contract Holder&rsquo;s Transfer Conditions.</strong>{" "}
              This Contract, while in-force, may be transferred by the original
              Contract Holder to the subsequent owner of the Vehicle for a fee of
              fifty dollars ($50) (see Section X for the Florida transfer fee).
              The subsequent owner must also transfer the manufacturer&rsquo;s
              warranty, if available. Transfer is limited to an individual
              purchaser of the Vehicle (not a Dealer) and the title may not pass
              through a Dealer. A Transfer Application must be completed within
              thirty (30) days of the sale or transfer.
            </p>
            <p>
              <strong>J. Renewability.</strong> You have the right to purchase a
              Contract for additional time/mileage provided the request is made
              within thirty (30) days and one thousand (1,000) miles prior to the
              Expiration Date or Mileage.
            </p>
            <p>
              <strong>K. Guarantee.</strong> Our obligations and performance under
              this Contract are guaranteed and insured by a policy issued by
              Wesco Insurance Company, 59 Maiden Lane, 43rd Floor, New York, NY
              10038, 866-505-4048. If a covered claim or refund is not paid
              within sixty (60) days after proof of loss has been filed, You may
              file a claim directly with the Insurance Company.
            </p>
          </section>

          {/* IV. RESPONSIBILITIES */}
          <section id="responsibilities" className={styles.section}>
            <h2>IV. Your Responsibilities</h2>
            <p>
              <strong>A. Duty to Provide Accurate Information.</strong> You are
              required to ensure that all information You provide to Administrator
              is accurate, including all information provided on the Application
              Page and in connection with any claim. If Administrator discovers
              that You have failed to provide accurate information, or to update
              incorrect information, Administrator has the right to cancel this
              Contract immediately. This Contract shall be invalidated if there
              has been an inaccuracy, tampering or alteration to the odometer
              mileage. If the odometer becomes inoperable during the term, You
              must immediately notify Us and, within fifteen (15) days, provide a
              Verifiable Document proving the odometer has been repaired.
            </p>
            <p>
              <strong>B. Duty to Maintain Vehicle and Records.</strong> You must
              have the Vehicle checked and serviced in accordance with the
              manufacturer&rsquo;s recommendations, as outlined in the
              Owner&rsquo;s Manual, following the maintenance schedule that
              applies to Your driving habits and climate conditions. Failure to
              do so may result in the denial of a claim. You must maintain copies
              of Verifiable Documents relating to any work performed on Your
              Vehicle. Only Verifiable Documents will be accepted; handwritten
              documents, invoices, and/or receipts will not be accepted. If You
              perform Your own maintenance services, receipts must be retained
              for the purchase of materials and supplies.
            </p>
            <p>
              <strong>C. Duty to Cooperate.</strong> You are required to cooperate
              with Administrator in connection with any claim or other action
              under this Contract, including providing copies of documents and
              information in a timely and accurate manner. Failure to do so may
              constitute a breach of this Contract by You.
            </p>
          </section>

          {/* V. FILING A CLAIM */}
          <section id="filing-a-claim" className={styles.section}>
            <h2>V. Filing a Breakdown Claim</h2>
            <p className={styles.lead}>
              <strong>
                No claims will be paid without prior authorization.
              </strong>{" "}
              If Your Vehicle incurs a Breakdown, You must take the following
              steps to file a claim:
            </p>
            <ol className={styles.steps}>
              <li>
                <strong>Prevent further damage.</strong> Take immediate action to
                prevent further damage to Your Vehicle. This Contract will not
                cover damage caused by continued operation or by not securing a
                timely repair of the failed component. The operator is
                responsible for observing Vehicle warning lights and gauges and
                taking appropriate action immediately.
              </li>
              <li>
                <strong>Take Your Vehicle to a Licensed Repair Facility.</strong>{" "}
                Arrange for transportation of Your Vehicle to any Licensed Repair
                Facility. You may utilize the 24-Hour Roadside Assistance Benefit
                to tow Your Vehicle, if necessary, to prevent further damage.
              </li>
              <li>
                Provide the Licensed Repair Facility with a copy of Your Contract
                and/or Your Contract number if possible.
              </li>
              <li>
                <strong>Obtain authorization from the Administrator.</strong>{" "}
                Prior to any repair being made, instruct the service manager to
                contact the Administrator to obtain an authorization for the claim
                at 877-414-0134. Any claim for repairs without prior
                authorization will not be covered except as provided under
                Emergency Repairs. The amount authorized is the maximum that will
                be paid; any additional amount must receive prior approval.
              </li>
              <li>
                <strong>Authorize tear-down and/or inspection.</strong> In some
                cases, You may need to authorize the Licensed Repair Facility to
                inspect and/or tear down Your Vehicle to determine the cause and
                cost of the repair. You will be responsible for these charges if
                the Breakdown is not covered. We reserve the right to require an
                independent third-party inspection prior to any repair.
              </li>
              <li>
                <strong>Review coverage.</strong> After the Administrator has been
                contacted, review with the service manager what will be covered.
              </li>
              <li>
                <strong>Pay any applicable Deductible.</strong> You must pay to
                the Licensed Repair Facility any required Deductible. We will
                reimburse the Licensed Repair Facility or You for the cost of the
                covered, previously authorized work, less the Deductible. All
                repair orders and Verifiable Documents must be submitted within
                thirty (30) days to be eligible for payment.
              </li>
              <li>
                <strong>Emergency Repairs.</strong> Should an emergency occur
                requiring repair of an Eligible Component when the
                Administrator&rsquo;s office is closed, follow the claim
                procedures above without authorization, and We will make
                reimbursement in accordance with the Contract provisions if the
                repair is a Covered Repair. You must call the Administrator&rsquo;s
                office within five (5) business days from the date of repair.
                Emergency Repairs are only those repairs which, if not performed,
                would render Your Vehicle inoperable or unsafe to drive.
              </li>
            </ol>
          </section>

          {/* VI. WHAT IS COVERED */}
          <section id="what-is-covered" className={styles.section}>
            <h2>VI. What Is Covered</h2>
            <p>
              <strong>A. Component Protection.</strong> Administrator agrees to
              provide payment or reimbursement for Covered Repairs, less any
              Deductible, in accordance with the terms of this Contract.
              Replacement of Eligible Components may be made with original
              equipment manufacturer parts, non-original equipment manufacturer
              parts, re-manufactured parts, or used parts at Administrator&rsquo;s
              discretion. Administrator will not pay for repairs to components
              that have ceased to operate or exhibited signs of failure prior to
              purchase or prior to the expiration of the Waiting Period, nor for
              repairs covered by a manufacturer&rsquo;s and/or repair
              facility&rsquo;s warranty or another vehicle service contract.
            </p>
            <p>
              <strong>B. Authorization and Inspection.</strong> Administrator will
              only pay for pre-authorized repairs. You or the Licensed Repair
              Facility must first seek prior authorization before performing any
              repairs. Administrator reserves the right to require an independent
              third-party inspection prior to any repair being made.
            </p>
            <p>
              <strong>C. Eligible Components.</strong> Your Contract provides
              Coverage based on the component protection You selected as shown on
              Your Identification Card and the Coverage box on the Application
              Page. The coverage levels are:
            </p>
            <ul className={styles.defList}>
              <li>
                <strong>Secure Coverage</strong> — covers listed components of
                the Engine (gas/diesel cylinder block, cylinder head(s), and
                internally lubricated parts), Turbo/Supercharger (factory
                installed), Transmission, Drive Axle Assembly, Transfer Unit, and
                Seals &amp; Gaskets (only in conjunction with a covered repair).
              </li>
              <li>
                <strong>Secure Plus Coverage</strong> — covers everything in
                Secure plus Brakes (including listed ABS parts), Steering,
                Electrical Components, and Air Conditioning.
              </li>
              <li>
                <strong>Superior Coverage</strong> — covers everything in Secure
                Plus with an expanded Electrical list, plus Front &amp; Rear
                Suspension, Fuel System, and Cooling System.
              </li>
              <li>
                <strong>Supreme Coverage</strong> — provides for repair or
                replacement of any Breakdown of all part(s) or component(s),
                including seals and gaskets, except those listed under Section
                VIII. Exclusions, less the Deductible.
              </li>
              <li>
                <strong>Supreme Wrap Coverage</strong> — &ldquo;wraps&rdquo;
                around Your current manufacturer&rsquo;s powertrain warranty and
                covers any Breakdown of all part(s) or component(s) except those
                covered by the manufacturer&rsquo;s powertrain warranty and those
                listed in Section VIII. Exclusions, less the Deductible.
              </li>
            </ul>
            <p>
              <strong>D. Optional Coverage.</strong> Where selected and the
              surcharge paid, additional coverage is available: the{" "}
              <strong>High Tech Option</strong> (back-up camera &amp; sensors,
              video/display screen, GPS/NAV, blind spot sensors, electronic
              driver information display, anti-theft systems);{" "}
              <strong>Commercial Use Option</strong>;{" "}
              <strong>Tire Modification / Body or Suspension Lift Option</strong>{" "}
              (combined lift not to exceed four inches; lift kit and its
              assemblies excluded); and the <strong>Hybrid Vehicle Option</strong>{" "}
              (hybrid electric drive motor, power controller, inverter assembly,
              generator(s), electronic A/C compressor, electronic power steering
              pump — batteries excluded).
            </p>
          </section>

          {/* VII. ADDITIONAL BENEFITS */}
          <section id="additional-benefits" className={styles.section}>
            <h2>VII. Additional Benefits</h2>
            <p>Your Vehicle Service Contract provides the following Benefits:</p>
            <p>
              <strong>A. Rental Car Benefit and Substitute Transportation.</strong>{" "}
              In the event of a Covered Repair, We will pay or reimburse You for
              receipted expenses to rent a replacement vehicle (from a licensed
              rental agency) or for alternate public transportation while Your
              Vehicle is at a Licensed Repair Facility, up to a maximum of thirty
              dollars ($30) per day and a maximum of one hundred fifty dollars
              ($150) per Covered Repair.
            </p>
            <p>
              <strong>B. 24-Hour Roadside Assistance.</strong> All roadside
              assistance services are administered through Quest Towing Services,
              LLC, 877-488-2418, and are available 24 hours a day when Your
              Vehicle is disabled. Covered services include emergency roadside
              service, mechanical first aid, tire service (using Your spare),
              battery service, fuel/fluid delivery (You pay for the fluids),
              towing up to twenty-five (25) miles, and lockout service. You are
              entitled to one (1) service of any type per seventy-two (72) hours.
            </p>
            <p>
              <strong>Trip Interruption.</strong> In the event of a Covered
              Repair, We will reimburse You up to a maximum of one hundred fifty
              dollars ($150) per day for a maximum of three (3) days (not to
              exceed $450 total) for meals and/or lodging, provided You cannot
              operate Your Vehicle due to a Covered Repair and the Breakdown
              occurs more than one hundred (100) miles from Your home.
            </p>
          </section>

          {/* VIII. EXCLUSIONS */}
          <section id="exclusions" className={styles.section}>
            <h2>VIII. Exclusions — What Is Not Covered</h2>
            <p>This Contract does NOT provide Coverage for any of the following:</p>
            <ul className={styles.defList}>
              <li>
                <strong>A.</strong> For any part not specifically listed in
                Section VI. What is Covered under the component protection and/or
                Optional Coverage You selected.
              </li>
              <li>
                <strong>B.</strong> For maintenance services and parts described
                in the owner&rsquo;s manual and other normal maintenance,
                including but not limited to alignments, adjustments, wheel
                balancing, tune-ups, spark plugs and wires, glow plugs, hoses
                (unless listed), drive belts, brake pads, brake linings/shoes,
                and wiper blades. Filters, lubricants, coolants, fluids and
                refrigerants are covered only if replacement is required in
                connection with a covered Breakdown. Also excluded: thermostat
                housing, shock absorbers, carburetor, battery and battery
                cable/harness, standard transmission clutch assembly, dual clutch
                transmission assemblies, friction clutch disc and pressure plate,
                distributor cap and rotor, safety restraint systems (including
                air bags), glass, lenses, sealed beams, light bulbs, LED/HID
                lights, fuses, circuit breakers, brake rotors and drums, all
                exhaust components, listed emission components, weather strips,
                trim, moldings, upholstery and carpet, paint, bumpers, body sheet
                metal and panels, frame and structural body parts, tires, tire
                pressure sensors, wheels/rims, and programming/reprogramming of a
                component that has not mechanically failed. (Radio, CD, and
                cassette player covered if manufacturer installed but limited to
                $1,000.)
              </li>
              <li>
                <strong>C.</strong> For any damage and/or Breakdown resulting from
                impact or external force, collision, bent or twisted parts, rust
                or corrosion, salt, environmental damage, contamination,
                oxidation, carbon, sludge, varnish, restricted oil passages, lack
                of proper quality or quantity of fluids or lubricants, or
                overheating. Engine block and cylinder heads are not covered if
                damaged by overheating, freezing or warping. Any Breakdown
                resulting from acts of nature, including lightning, earthquake,
                windstorm, volcanic eruption, and freezing.
              </li>
              <li>
                <strong>D.</strong> For any loss caused by faulty or negligent
                auto repair work, improper servicing, or installation of
                defective parts; or any repair that has been misdiagnosed.
              </li>
              <li>
                <strong>E.</strong> For any Breakdown caused by Your failure to
                follow Sections IV and V, or where requested maintenance records
                cannot be produced or verified, or due to lack of normal
                maintenance required by the manufacturer&rsquo;s schedule.
              </li>
              <li>
                <strong>F.</strong> For new Vehicles that do not have the full
                manufacturer warranty in place; for costs that should be covered
                by a manufacturer&rsquo;s warranty, recall, factory bulletin, or
                dealer assistance program; or by the warranty of parts or
                workmanship on a previously repaired component.
              </li>
              <li>
                <strong>G.</strong> For any Pre-Existing Condition, any Breakdown
                that occurs (or begins to occur) prior to the expiration of the
                Waiting Period or reported after the Expiration Date or Mileage,
                or where information cannot be verified as accurate.
              </li>
              <li>
                <strong>H.</strong> For any repair or replacement made without
                prior authorization from Administrator.
              </li>
              <li>
                <strong>I.</strong> For correcting engine compression, oil
                consumption, or gradual reduction of performance where no
                mechanical Breakdown has occurred; and for damage caused by
                pre-ignition detonation, pinging, improper/contaminated fuel,
                fuels containing more than ten percent (10%) ethanol (if not
                manufactured for it), improper lubricants, or lack of lubrication.
              </li>
              <li>
                <strong>J.</strong> For loss of time, expense, storage charges,
                loss of use, loss of profits or income, or other consequential
                damages.
              </li>
              <li>
                <strong>K.</strong> For accidental loss or damage, collision or
                upset, road hazard, falling objects, fire, theft, hail,
                explosion, lightning, earthquake, windstorm, water, flood,
                vandalism, riot, negligence, abuse or misuse, or lack of normal
                maintenance.
              </li>
              <li>
                <strong>L.</strong> For any Breakdown caused by rust, residue,
                electrolysis or corrosion, or by the failure of any nuts, bolts
                or fasteners unless internally lubricated.
              </li>
              <li>
                <strong>M.</strong> For any Vehicle that has ever been declared a
                total loss or issued a restricted title, or where the odometer
                has failed, been broken, disconnected or altered.
              </li>
              <li>
                <strong>N.</strong> For a Breakdown caused by Your failure to
                perform reasonable recommended repairs, or by failure to protect
                Your Vehicle from further damage (including failure to observe
                warning lights, gauges, or signs of overheating or component
                failure). Lack of mechanical knowledge is not an excuse for
                continued operation.
              </li>
              <li>
                <strong>O.</strong> For any part or repair a facility or
                manufacturer recommends to be repaired, replaced, adjusted or
                updated in conjunction with a Covered Repair when a Breakdown of
                that part has not occurred.
              </li>
              <li>
                <strong>P.</strong> For Commercial Use Vehicles unless the
                Commercial Use Option is selected and the surcharge paid.
              </li>
              <li>
                <strong>Q.</strong> If any alterations have been made to Your
                Vehicle or it is used in a manner not recommended by the
                manufacturer, including custom or add-on parts, trailer hitches,
                suspension lifts or reductions, oversized/undersized wheels or
                tires, and emissions, engine, transmission, or performance
                modifications (subject to the Tire Modification/Lift Option where
                selected).
              </li>
              <li>
                <strong>R.</strong> For any Breakdown occurring outside of the
                United States of America or Canada.
              </li>
              <li>
                <strong>S.</strong> For any loss arising out of unauthorized
                access or use of any system, software, hardware, or firmware, or
                any modification, reprogramming, destruction, or deletion of data
                or software.
              </li>
            </ul>
          </section>

          {/* IX. LEGAL CLAIMS AND DISPUTES */}
          <section id="legal-disputes" className={styles.section}>
            <h2>IX. Legal Claims and Disputes</h2>
            <p>
              <strong>A. Pre-Litigation Request for Reconsideration.</strong> If
              You believe We have improperly denied a claim for repairs, You
              should, before bringing any complaints, demands or other
              proceedings before any court, government agency, administrative body
              or third party, request a reconsideration of the denial via email
              to reconsideration@endurancedirect.com or via first-class mail to
              Endurance Dealer Services, LLC, ATTN: Reconsideration, 400 Skokie
              Blvd, Suite 105, Northbrook, IL 60062. Please include Your full name
              and Contract number, a brief description of why You believe the
              claim was improperly denied, and any relevant documentation. Please
              allow Us 48 business hours from the time of receipt to respond.
            </p>
            <p>
              <strong>B. Alternative Dispute Resolution.</strong> We reserve the
              right, in the interests of efficient and judicious resolution of
              disputes, to demand that any claim, complaint or demand initiated by
              You relating to the Coverage provided under this Contract be settled
              by an alternative dispute resolution procedure before a recognized
              and/or accredited third-party organization of Our choosing,
              including, but not limited to, arbitration, mediation, and/or
              conciliation, with the cost of such alternative dispute resolution
              to be paid entirely by Us.
            </p>
            <p className={styles.flNote}>
              Note: In Florida, this provision is amended by Section X — see the
              Florida State-Specific Requirements below, which make arbitration
              <strong> non-binding</strong>.
            </p>
          </section>

          {/* X. FLORIDA STATE-SPECIFIC REQUIREMENTS */}
          <section id="florida-requirements" className={styles.section}>
            <h2>X. Florida State-Specific Requirements</h2>
            <p>
              These special state requirements apply if Your Contract was
              delivered in Florida and supersede any other provisions herein to
              the contrary.
            </p>

            <div className={styles.flBlock}>
              <h3>Cancellations (replaces Section III.H)</h3>
              <p>
                Section III.H. Cancellations is deleted and replaced with the
                following: If this Contract is cancelled by You within sixty (60)
                days of purchase, one hundred percent (100%) of the gross premium
                paid will be refunded less the amount of any claims paid on the
                Contract and less an administrative fee not to exceed five percent
                (5%) of the gross premium paid or fifty dollars ($50), whichever
                is less. If You cancel this Contract after the first sixty (60)
                days, the unearned pro rata premium will be refunded less the
                amount of any claims paid and less an administrative fee not to
                exceed ten percent (10%) of the unearned pro-rata premium or fifty
                dollars ($50), whichever is less. Elapsed time and mileage shall
                be measured from the Purchase Date and Mileage.
              </p>
              <p>
                Within the first sixty (60) days of purchase, We may cancel this
                Contract for any reason. After the first sixty (60) days, We may
                only cancel this Contract if there has been a material
                misrepresentation or fraud at the time of sale of the Contract;
                if You have failed to maintain the vehicle as prescribed by the
                manufacturer; if the odometer has been tampered with or disabled
                and You have failed to repair the odometer; or for nonpayment of
                premium by You, in which case We shall provide You with notice of
                cancellation by certified mail. If We cancel this Contract, We
                will refund You one hundred percent (100%) of the paid unearned
                pro rata premium, less the amount of any claims paid on the
                Contract.
              </p>
            </div>

            <div className={styles.flBlock}>
              <h3>Transfer (amends Section III.I)</h3>
              <p>
                Section III.I. Contract Holder&rsquo;s Transfer Conditions is
                amended as follows: The transfer fee will be forty dollars ($40).
              </p>
            </div>

            <div className={styles.flBlockHighlight}>
              <h3>Arbitration / Dispute Resolution (amends Section IX.B)</h3>
              <p>
                Section IX.B. Alternative Dispute Resolution is amended as
                follows:
              </p>
              <blockquote className={styles.flQuote}>
                Arbitration is non-binding in the State of Florida. Arbitration
                proceedings shall be conducted in the county in which You reside.
              </blockquote>
              <p>
                The following is added to the contract: The rate charged to You
                for this Contract is not subject to regulation by the Florida
                Office of Insurance Regulation.
              </p>
            </div>
          </section>

          {/* CLOSING CTA */}
          <section className={styles.closing}>
            <h2 className={styles.closingTitle}>
              Had a Florida warranty or service-contract claim denied?
            </h2>
            <p>
              If a vehicle service contract, home warranty, or extended warranty
              claim was denied, delayed, or underpaid, you may have options.
              Louis Law Group reviews Florida warranty disputes at no cost to you.
            </p>
            <a className={styles.cta} href="/warranty-claims/qualify">
              See if you qualify — free
            </a>
            <p className={styles.finePrint}>
              This page reproduces a representative third-party vehicle service
              contract (Endurance form VSC-01D-EDS) for educational reference
              only. It is not legal advice and is not a Louis Law Group product.
              Always rely on the actual contract you were given.
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
