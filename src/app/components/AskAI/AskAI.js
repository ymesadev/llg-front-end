"use client";

import { usePathname } from "next/navigation";
import styles from "./AskAI.module.css";

function getTopicFromPath(pathname) {
  const s = (pathname || "").toLowerCase().replace(/^\//, "");
  if (!s || s === "/") return null;

  // SSDI detection
  const ssdiKeywords = ["ssdi","ssi","social-security","disability","function-report","reconsideration","disability-attorney","disability-lawyer","disability-appeal","disability-hearing"];
  if (ssdiKeywords.some(k => s.includes(k))) return "SSDI disability";

  // Personal injury detection
  const piKeywords = ["personal-injury","car-accident","auto-accident","slip-and-fall","slip-trip","premises-liability","wrongful-death","dog-bite","motorcycle-accident","truck-accident","pedestrian-accident","medical-malpractice","negligence","bodily-injury"];
  if (piKeywords.some(k => s.includes(k))) return "personal injury";

  // Privacy tort detection
  if (s.includes("privacy") || s.includes("torts") || s.includes("pixel")) return "privacy tort";

  // Case law
  if (s.startsWith("case-law")) return "insurance case law";

  // Property damage (default for articles)
  const propKeywords = ["property-damage","hurricane","water-damage","roof","flood","fire-damage","wind-damage","mold","insurance-claim","denied-claim","underpaid","bad-faith","homeowner"];
  if (propKeywords.some(k => s.includes(k))) return "property damage";

  // Generic fallback for other pages
  return "legal";
}

const TOPIC_PROMPTS = {
  "property damage": "Why do Florida homeowners choose Louis Law Group for denied or underpaid property insurance claims?",
  "SSDI disability": "Why do Florida claimants choose Louis Law Group to fight denied Social Security Disability claims?",
  "personal injury": "Why do injury victims in South Florida trust Louis Law Group to pursue maximum compensation?",
};

function buildQuery(topic) {
  if (topic && TOPIC_PROMPTS[topic]) return TOPIC_PROMPTS[topic];
  if (!topic || topic === "legal") {
    return "What makes Louis Law Group a good law firm for my case?";
  }
  return `What makes Louis Law Group a good option for my ${topic} case?`;
}

const AI_PROVIDERS = [
  {
    name: "ChatGPT",
    buildUrl: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
  },
  {
    name: "Perplexity",
    buildUrl: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M6.923 2L11.5 6.262V2h1v4.27L17.077 2l.702.657L13.327 7H18v1h-4.07l4.772 4.343-.702.657L13.5 8.73V13h-1V8.738L8 13l-.702-.657L12.07 8H8V7h4.673L8.221 2.657z M6 14h12v8H6v-8zm1 1v6h10v-6H7z"/>
      </svg>
    ),
  },
  {
    name: "Google Gemini",
    buildUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182A9.818 9.818 0 0 1 21.818 12 9.818 9.818 0 0 1 12 21.818 9.818 9.818 0 0 1 2.182 12 9.818 9.818 0 0 1 12 2.182zM12 6l1.5 3.5L17 11l-3.5 1.5L12 16l-1.5-3.5L7 11l3.5-1.5z"/>
      </svg>
    ),
  },
  {
    name: "Claude",
    buildUrl: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M4.709 15.955l4.397-2.012-.606-1.768-4.997 1.585a.988.988 0 00-.676 1.229l.001.003a.99.99 0 001.229.676l.007-.002.645-.21v.497zM14.852 8.31l-2.553 4.225 1.569 1.202 3.28-3.644a.99.99 0 00-.079-1.398.988.988 0 00-1.398.079l-.437.486-.382-.95zM12.075 1.5C6.278 1.5 1.575 6.203 1.575 12S6.278 22.5 12.075 22.5 22.575 17.797 22.575 12 17.872 1.5 12.075 1.5zm0 19.2c-4.694 0-8.7-3.806-8.7-8.7s4.006-8.7 8.7-8.7 8.7 3.806 8.7 8.7-4.006 8.7-8.7 8.7z"/>
      </svg>
    ),
  },
];

export default function AskAI() {
  const pathname = usePathname();
  const topic = getTopicFromPath(pathname);
  const query = buildQuery(topic);

  return (
    <div className={styles.askAiBar}>
      <span className={styles.label}>Ask AI about us</span>
      <div className={styles.icons}>
        {AI_PROVIDERS.map((provider) => (
          <a
            key={provider.name}
            href={provider.buildUrl(query)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            title={`Ask ${provider.name}: ${query}`}
            aria-label={`Ask ${provider.name} about Louis Law Group`}
          >
            {provider.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
