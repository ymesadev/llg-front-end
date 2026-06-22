import Link from "next/link";

/*
 * /privacy — site Privacy Policy.
 *
 * ⚠️ PLACEHOLDER POLICY TEXT — Workstream C (visitor-intelligence) created this page
 * because none existed (only the unrelated /privacy-torts marketing page did). The
 * copy below describes the first-party analytics + internal-use posture that the
 * visitor-intelligence build introduces. It is NOT legal-reviewed final text —
 * Pierre / counsel must approve the production wording before the cutover that turns
 * tracking on (NEXT_PUBLIC_VI_ENABLED=true).
 */

export const metadata = {
  title: "Privacy Policy | Louis Law Group",
  description:
    "How Louis Law Group uses first-party analytics and handles information collected on this website. Internal use only — not shared with advertisers.",
  alternates: { canonical: "https://www.louislawgroup.com/privacy" },
  robots: { index: false, follow: true },
};

const LAST_UPDATED = "2026-06-22";

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "48px 20px 80px",
        font: "16px/1.7 var(--font-work-sans, system-ui, sans-serif)",
        color: "#1a2330",
      }}
    >
      {/* PLACEHOLDER NOTICE — remove before production cutover (Pierre/counsel). */}
      <div
        style={{
          background: "#fff7e6",
          border: "1px solid #f0c36d",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 28,
          fontSize: 14,
          color: "#7a5b00",
        }}
      >
        <strong>Draft / placeholder.</strong> This privacy policy is a working draft
        introduced with first-party analytics. Wording is pending Louis Law Group /
        counsel approval and is not yet the firm&apos;s official policy.
      </div>

      <h1 style={{ font: "700 32px/1.2 var(--font-anton, system-ui)", marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#5a6573", marginBottom: 32 }}>Last updated: {LAST_UPDATED}</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>Overview</h2>
        <p>
          Louis Law Group (&quot;we,&quot; &quot;us,&quot; or &quot;the firm&quot;)
          operates this website. This policy explains what information we collect when
          you use the site, how we use it, and the choices you have. We collect only
          what we need to operate the site, respond to inquiries, and improve our
          intake experience.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>First-Party Analytics</h2>
        <p>
          With your consent, we use our own first-party analytics to understand how
          visitors use this site. This includes pages viewed, which steps of an intake
          questionnaire are reached and completed, how long is spent on each step, the
          general source of the visit (for example, a search engine or advertising
          campaign), and basic device type.
        </p>
        <p style={{ marginTop: 12 }}>
          We record <strong>behavior and timing only</strong>. We do{" "}
          <strong>not</strong> record the actual answers you type into questionnaire
          fields through these analytics — only whether a field was completed. This
          analytics data is generated and stored using systems we control and is used
          <strong> internally by Louis Law Group</strong> to improve the website and
          intake process. It is <strong>not shared with or sold to advertisers</strong>{" "}
          or other third parties for their own marketing.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>Information You Provide</h2>
        <p>
          If you submit a contact or case-evaluation form, you may provide information
          such as your name, phone number, email address, and details about your
          situation. We use this information to evaluate and respond to your inquiry and
          to provide the legal services you request. Submitting a form does not create
          an attorney-client relationship.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>Your Consent &amp; Choices</h2>
        <p>
          When you first visit, we ask for your consent before enabling first-party
          analytics. You may decline, and you may change your choice at any time by
          clearing this site&apos;s data in your browser. Declining analytics does not
          affect your ability to use the site or contact us. Advertising and
          marketing-cookie choices are handled separately through the cookie controls
          presented on the site.
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>Data Retention &amp; Security</h2>
        <p>
          We retain information only as long as needed for the purposes described above
          or as required by law, and we use reasonable measures to protect it. [Specific
          retention periods and security details to be confirmed by the firm.]
        </p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={sectionH2}>Contact Us</h2>
        <p>
          Questions about this policy can be directed to Louis Law Group. [Insert
          official contact address / email approved by the firm.] You can also return
          to our <Link href="/" style={{ color: "#1565c0" }}>home page</Link>.
        </p>
      </section>
    </main>
  );
}

const sectionH2 = {
  font: "700 20px/1.3 var(--font-montserrat, system-ui)",
  marginBottom: 8,
  color: "#0f2540",
};
