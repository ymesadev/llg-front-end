import Link from "next/link";

export const metadata = {
  title: "Florida Contract Dispute & Breach of Contract Attorneys | Louis Law Group",
  description:
    "Breach of contract in Florida? Louis Law Group helps Florida residents and businesses enforce agreements, recover damages, and resolve contract disputes. Free case review — no fees unless we win.",
  alternates: { canonical: "https://www.louislawgroup.com/contract-disputes" },
  openGraph: {
    title: "Florida Contract Dispute & Breach of Contract Attorneys",
    description:
      "Enforce your agreement and recover what you're owed. Free Florida contract dispute case review — no fees unless we win.",
    url: "https://www.louislawgroup.com/contract-disputes",
    siteName: "Louis Law Group",
    type: "website",
  },
};

const NAVY = "#1a2b49";
const GOLD = "#ffb800";

const FAQ = [
  {
    q: "What counts as a breach of contract in Florida?",
    a: "A breach happens when one party fails to perform a duty the contract requires — not paying, not delivering, doing defective work, or refusing to perform (anticipatory breach). Florida recognizes both written and oral contracts, though written agreements are far easier to prove.",
  },
  {
    q: "How long do I have to sue for breach of contract in Florida?",
    a: "Florida's statute of limitations is five (5) years for a written contract and four (4) years for an oral contract (Fla. Stat. § 95.11). The clock generally starts on the date of the breach, so don't wait — deadlines are strict.",
  },
  {
    q: "What can I recover in a contract dispute?",
    a: "Depending on the facts, remedies can include compensatory damages (your actual losses), consequential damages, specific performance (forcing the other side to do what they promised), or rescission. We review your agreement to identify every remedy available to you.",
  },
  {
    q: "Do I need a lawyer or can I use small claims court?",
    a: "Florida small claims court handles disputes up to $8,000. Larger or more complex disputes belong in county or circuit court. Either way, a demand letter from an attorney often resolves the matter before a lawsuit is filed.",
  },
  {
    q: "How much does it cost?",
    a: "Your initial case review is free. We'll explain your options and fee structure up front — and in many matters we work so there are no fees unless we win.",
  },
];

export default function ContractDisputesLanding() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Louis Law Group — Florida Contract Dispute Attorneys",
    areaServed: "Florida",
    telephone: "+1-833-657-4812",
    url: "https://www.louislawgroup.com/contract-disputes",
  };

  return (
    <main style={{ background: "#fff", color: NAVY }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Hero */}
      <section style={{ background: NAVY, color: "#fff", padding: "120px 20px 64px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(255,184,0,0.15)", color: GOLD, fontWeight: 600, fontSize: 13, padding: "6px 14px", borderRadius: 999, marginBottom: 18 }}>
            Florida Contract Disputes · Breach of Contract
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,46px)", lineHeight: 1.12, margin: "0 0 16px", fontWeight: 800 }}>
            Someone Broke Their Contract. Let&rsquo;s Make It Right.
          </h1>
          <p style={{ fontSize: "clamp(16px,2.4vw,19px)", color: "#c7d0e0", maxWidth: 680, margin: "0 auto 28px", lineHeight: 1.55 }}>
            If a business, employer, contractor, tenant, or vendor failed to hold up their end of a Florida
            agreement, Louis Law Group helps you enforce the contract and recover what you&rsquo;re owed.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contract-disputes/qualify"
              style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16, padding: "15px 28px", borderRadius: 10, textDecoration: "none" }}>
              Check if you qualify →
            </Link>
            <a href="tel:+18336574812"
              style={{ background: "transparent", color: "#fff", fontWeight: 600, fontSize: 16, padding: "15px 28px", borderRadius: 10, textDecoration: "none", border: "1px solid rgba(255,255,255,0.35)" }}>
              Call (833) 657-4812
            </a>
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: "#9fb0c9" }}>
            Free case review · No fees unless we win · Florida Bar admitted
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: "clamp(22px,3.4vw,30px)", textAlign: "center", margin: "0 0 8px" }}>
          Contract disputes we handle
        </h2>
        <p style={{ textAlign: "center", color: "#475467", maxWidth: 620, margin: "0 auto 32px" }}>
          Written or verbal — if there was an agreement and the other side broke it, we want to hear about it.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {[
            ["Business & commercial contracts", "Vendor, supplier, partnership, and service agreements gone wrong."],
            ["Employment agreements", "Unpaid commissions, severance, non-competes, and broken offer terms."],
            ["Real estate & leases", "Purchase agreements, lease breaches, and landlord-tenant contract disputes."],
            ["Construction & services", "Unfinished, defective, or abandoned work under a signed contract."],
            ["Non-payment", "You delivered. They didn't pay. We pursue what you're owed."],
            ["Anticipatory breach", "The other side says they won't perform — act before the loss grows."],
          ].map(([t, d]) => (
            <div key={t} style={{ border: "1px solid #e4e7ec", borderRadius: 12, padding: "20px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t}</div>
              <div style={{ color: "#475467", fontSize: 14, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "48px 20px" }}>
        <h2 style={{ fontSize: "clamp(22px,3.4vw,30px)", textAlign: "center", margin: "0 0 32px" }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {[
            ["1", "Answer a few questions", "Tell us about the contract and what went wrong — takes about a minute."],
            ["2", "Upload your contract", "We review the actual agreement before your call so we can give you real answers."],
            ["3", "Book your free review", "Pick a time and speak with our team about your options and next steps."],
          ].map(([n, t, d]) => (
            <div key={n} style={{ textAlign: "center", padding: "0 8px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: NAVY, color: GOLD, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t}</div>
              <div style={{ color: "#475467", fontSize: 14, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/contract-disputes/qualify"
            style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16, padding: "15px 32px", borderRadius: 10, textDecoration: "none", display: "inline-block" }}>
            Start your free case review →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "16px 20px 64px" }}>
        <h2 style={{ fontSize: "clamp(22px,3.4vw,30px)", textAlign: "center", margin: "0 0 28px" }}>
          Frequently asked questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQ.map((f) => (
            <div key={f.q} style={{ border: "1px solid #e4e7ec", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.q}</div>
              <div style={{ color: "#475467", fontSize: 14.5, lineHeight: 1.6 }}>{f.a}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#98a2b3", textAlign: "center", marginTop: 28, lineHeight: 1.5 }}>
          This page is attorney advertising and general information, not legal advice. Past results do not
          guarantee future outcomes. Louis Law Group, Fort Lauderdale, FL.
        </p>
      </section>
    </main>
  );
}
