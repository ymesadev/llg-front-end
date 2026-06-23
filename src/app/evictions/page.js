import Link from "next/link";

export const metadata = {
  title: "Florida Eviction Attorneys for Landlords | Louis Law Group",
  description:
    "Florida landlords: Louis Law Group helps you evict non-paying, holdover, and lease-violating tenants quickly and lawfully. Free case review — we represent landlords, not tenants.",
  alternates: { canonical: "https://www.louislawgroup.com/evictions" },
  openGraph: {
    title: "Florida Eviction Attorneys for Landlords",
    description:
      "Evict non-paying or holdover tenants quickly and lawfully. Free Florida landlord case review — we represent landlords, not tenants.",
    url: "https://www.louislawgroup.com/evictions",
    siteName: "Louis Law Group",
    type: "website",
  },
};

const NAVY = "#1a2b49";
const GOLD = "#ffb800";

const FAQ = [
  {
    q: "Who does Louis Law Group represent in eviction cases?",
    a: "We represent landlords and property owners — not tenants. If you own or manage a Florida rental and need to remove a tenant lawfully, we can help.",
  },
  {
    q: "How long does a Florida eviction take?",
    a: "An uncontested Florida residential eviction often resolves in a few weeks once the proper notice has run and the case is filed, but timelines vary by county and whether the tenant contests. Serving the correct notice the right way is what keeps it fast.",
  },
  {
    q: "What notice do I have to give before evicting?",
    a: "It depends on the reason. Non-payment of rent generally requires a 3-day notice (excluding weekends and legal holidays); a lease violation may require a 7-day notice; and ending a month-to-month tenancy requires 30 days. Getting the notice and its timing right is critical — a defective notice can restart the whole process.",
  },
  {
    q: "Can I change the locks or shut off utilities to force a tenant out?",
    a: "No. Florida law prohibits 'self-help' evictions — changing locks, removing belongings, or shutting off utilities can expose you to significant liability. A tenant must be removed through the formal court eviction process.",
  },
  {
    q: "What does it cost?",
    a: "Your initial case review is free. We'll explain the process, the timeline, and the fees up front before you commit to anything.",
  },
];

export default function EvictionsLanding() {
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
    name: "Louis Law Group — Florida Eviction Attorneys for Landlords",
    areaServed: "Florida",
    telephone: "+1-833-657-4812",
    url: "https://www.louislawgroup.com/evictions",
  };

  return (
    <main style={{ background: "#fff", color: NAVY }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Hero */}
      <section style={{ background: NAVY, color: "#fff", padding: "120px 20px 64px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(255,184,0,0.15)", color: GOLD, fontWeight: 600, fontSize: 13, padding: "6px 14px", borderRadius: 999, marginBottom: 18 }}>
            Florida Evictions · For Landlords &amp; Property Owners
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,46px)", lineHeight: 1.12, margin: "0 0 16px", fontWeight: 800 }}>
            Remove a Problem Tenant — Quickly and Lawfully.
          </h1>
          <p style={{ fontSize: "clamp(16px,2.4vw,19px)", color: "#c7d0e0", maxWidth: 680, margin: "0 auto 28px", lineHeight: 1.55 }}>
            Non-payment, lease violations, or a tenant who won&rsquo;t leave? Louis Law Group handles Florida
            evictions for landlords and property owners — the right notice, the right filing, the fastest
            lawful path to possession.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/evictions/qualify"
              style={{ background: GOLD, color: NAVY, fontWeight: 700, fontSize: 16, padding: "15px 28px", borderRadius: 10, textDecoration: "none" }}>
              Check if we can help →
            </Link>
            <a href="tel:+18336574812"
              style={{ background: "transparent", color: "#fff", fontWeight: 600, fontSize: 16, padding: "15px 28px", borderRadius: 10, textDecoration: "none", border: "1px solid rgba(255,255,255,0.35)" }}>
              Call (833) 657-4812
            </a>
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: "#9fb0c9" }}>
            Free case review · We represent landlords, not tenants · Florida Bar admitted
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "56px 20px 8px" }}>
        <h2 style={{ fontSize: "clamp(22px,3.4vw,30px)", textAlign: "center", margin: "0 0 8px" }}>
          Evictions we handle for landlords
        </h2>
        <p style={{ textAlign: "center", color: "#475467", maxWidth: 620, margin: "0 auto 32px" }}>
          Residential and small commercial rentals across Florida.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {[
            ["Non-payment of rent", "The tenant is behind and the 3-day notice hasn't worked."],
            ["Lease violations", "Unauthorized occupants, pets, subletting, or other breaches."],
            ["Holdover tenants", "The lease ended but the tenant won't leave."],
            ["Month-to-month removal", "Ending a no-lease or month-to-month tenancy properly."],
            ["Nuisance & illegal activity", "Conduct that endangers the property or other tenants."],
            ["Defective-notice fixes", "A prior notice was wrong — let's restart it correctly."],
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
            ["1", "Answer a few questions", "Confirm you're the landlord and tell us the situation — about a minute."],
            ["2", "Book your free review", "Pick a time and speak with our team about notice, timing, and next steps."],
            ["3", "We handle the eviction", "We serve the correct notice, file, and pursue possession the lawful way."],
          ].map(([n, t, d]) => (
            <div key={n} style={{ textAlign: "center", padding: "0 8px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: NAVY, color: GOLD, fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t}</div>
              <div style={{ color: "#475467", fontSize: 14, lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/evictions/qualify"
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
          This page is attorney advertising and general information, not legal advice. Notice periods and
          procedures are summarized generally and can change; your situation may differ. Louis Law Group
          represents landlords and property owners, Fort Lauderdale, FL.
        </p>
      </section>
    </main>
  );
}
