# Fire Insurance Claims Hub — Design Spec

**Project:** Louis Law Group - Fire Claims Content Hub
**Target:** louislawgroup.com/fire-insurance-claims/
**Stack:** Next.js 15 (App Router) + Strapi CMS (existing articles table) + Cal.com (event type 4)
**Codebase:** /opt/openclaw-data/workspace/llg-front-end/
**Date:** 2026-04-23

---

## 1. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Strapi content types | Use existing `articles` table | No schema changes needed, compatible with SEO pipelines |
| Cluster/FAQ data | Static JS data files in repo | Simple, version-controlled, no Strapi schema changes |
| Author data | Reuse `team-pages` content type | Already exists, default author: Pierre Louis |
| Cal.com | Event type 4 + URL prefill params | Single booking flow, fire context passed via params |
| Styling | CSS Modules (no Tailwind) | Matches existing site patterns |
| Qualifier backend | POST to `/api/qualify-intake` | Existing n8n webhook integration |
| Analytics | Existing `trackEvent()`/`trackConversion()` | GA4 + GTM dataLayer, no new infra |
| Article CTAs | Reuse existing site CTA components | Same CTAs as main resources page and article pages |
| Article generation | Two separate pipelines | GKP pipeline + autocomplete pipeline, both 50/day |

---

## 2. Site Integration

### Footer Addition

Add "Fire Insurance Claims" link to the Footer component (`src/app/components/Footer/Footer.js`) in the **Resources** column (Column 3), linking to `/fire-insurance-claims/`.

Current Resources column:
- Blog
- Careers
- Water Damage Claims
- SSDI Disability Lawyers
- Public Adjuster Resources
- Case Law Updates
- FL Insurance Market Report
- FL Pre-Suit Notice Report
- Fee Reform Case Outcomes
- **Fire Insurance Claims** ← NEW

### Subdirectory Confirmation

All fire claims content lives under `/fire-insurance-claims/` as a subdirectory of the main louislawgroup.com domain. This is NOT a subdomain — it inherits all root domain SEO equity.

---

## 3. URL Routes & File Structure

```
app/fire-insurance-claims/
  layout.js                           # shared layout: breadcrumbs, disclaimer
  page.js                             # pillar hub: hero, cluster grid, trust signals, FAQ sample
  resources/
    page.js                           # resource library index (same CTAs as main /resources/ page)
    [slug]/page.js                    # individual article (same CTAs as main article pages)
  types-of-damage/page.js             # cluster pillar (static)
  denied-claims/page.js               # cluster pillar
  claim-process/page.js               # cluster pillar
  coverage-disputes/page.js           # cluster pillar
  legal-remedies/page.js              # cluster pillar
  fire-scenarios/page.js              # cluster pillar
  florida-specific/page.js            # cluster pillar
  faqs/page.js                        # FAQ hub

components/fire-hub/
  FirePillarHero.js + .module.css      # hero + primary Cal.com CTA (hub page only)
  FireClaimQualifier.js + .module.css  # 4-question gating widget (hub page only)
  CalBookingEmbed.js + .module.css     # Cal.com inline embed wrapper
  ClusterGrid.js + .module.css         # 7 cluster cards on hub
  ResourceCard.js + .module.css        # article card for resource library
  ArticleTOC.js + .module.css          # sticky sidebar TOC (desktop) / collapsible (mobile)
  FireFAQ.js + .module.css             # accordion FAQ + FAQPage JSON-LD
  TrustSignals.js + .module.css        # bar admissions, years, focus
  BreadcrumbNav.js + .module.css       # visual + BreadcrumbList JSON-LD
  FireDisclaimer.js + .module.css      # Florida Bar compliant disclaimer

data/
  fire-clusters.js                     # cluster definitions, intro copy, topic terms
  fire-faqs.js                         # FAQ entries with cluster associations
```

### Reused CTA Components (no new fire-specific versions)

These existing components are reused directly on fire resources/article pages:

**On resources index page (`/fire-insurance-claims/resources/`):**
- `Results` — "$200,000,000 recovered for clients" case statistics
- `Steps` — "How it Works" / "No Win, No Fee" 3-step carousel + "Free Case Evaluation" button
- `Contact` — Contact form with phone number (833-657-4812) + HeroForm

**On individual article pages (`/fire-insurance-claims/resources/[slug]/`):**
- `UrgencyBanner` — "Statute of limitations may apply. See if you qualify..." top banner
- `DocumentUploadCTA` — Mid-article "See If You Qualify — Free Eligibility Check" card
- `ChecklistCTA` — Mid-article checklist download (property damage variant: "Get Your Free Property Damage Checklist")
- `RelatedArticles` — Related fire articles at bottom
- End-of-article CTA: "Find Out If You Qualify — Free Case Review" + OpenChatButton ("Ask Us a Question Live") + "See If You Qualify" link to `/fire-insurance-claims/qualify` or `/property-damage-claims/qualify`
- Sticky mobile CTA: OpenChatButton + "See If You Qualify"
- Sticky desktop CTA: "Insurance claim issues? Find out if you have a case — free, no obligation." + buttons
- `MobileExitIntent` — Exit-intent modal with property damage messaging

---

## 4. Component Specifications (Fire-Hub Specific Only)

### 4.1 FirePillarHero

- H1: "Florida Fire Insurance Claim Lawyers"
- Value proposition paragraph
- Primary CTA button: "Book a Free Fire Claim Consultation"
- Button opens Cal.com modal with prefill `?claimType=fire`
- Above the fold on pillar hub page only
- Uses Anton font for H1, Work Sans for body (existing pattern)

### 4.2 FireClaimQualifier

Client component with 4 steps. Used on hub page and optionally at end of articles.

**Step 1 — Claim status:**
- Not yet filed / Pending / Denied / Underpaid or partially paid / Closed and unresolved

**Step 2 — Insurance carrier:**
- Dropdown: Citizens, Universal, Homeowners Choice, Heritage, Federated National, People's Trust, Castle Key, Security First, Florida Peninsula, Other (free text)

**Step 3 — Loss date:**
- Less than 30 days / 1-6 months / 6 months to 1 year / 1-3 years / More than 3 years

**Step 4 — Approximate damage value:**
- Under $25,000 / $25,000-$100,000 / $100,000-$500,000 / Over $500,000 / Not sure

**Routing logic:**
- Qualified (denied/underpaid/pending AND loss < 3 years): Show CalBookingEmbed inline with prefilled params
- Out-of-scope (loss > 3 years OR no dispute): Lead capture form (name, email, phone), POST to `/api/qualify-intake` with `caseType: "fire"`

### 4.3 CalBookingEmbed

- Wraps Cal.com inline embed via `<iframe>` to `https://bookings.louislawgroup.com/team/event-type-4`
- Props: `prefillParams` object (claimType, claimStatus, carrier, lossDate, claimValue)
- Params appended as URL query string
- Responsive: 100% width, min-height 600px

### 4.4 ClusterGrid

- 7 cards in CSS Grid (3 columns desktop, 2 tablet, 1 mobile)
- Each card: lucide-react icon, cluster title, short description, link to cluster pillar
- Data sourced from `data/fire-clusters.js`

### 4.5 ResourceCard

- Title (link), excerpt (2 lines), cluster tag pill, read time estimate
- Used on: resource index page, cluster pillar pages
- Read time: `Math.ceil(wordCount / 200)` minutes

### 4.6 ArticleTOC

- Desktop: sticky sidebar, generated from H2 elements in article body
- Mobile: collapsible accordion at top of article
- Smooth scroll to section on click
- Highlights active section on scroll (IntersectionObserver)

### 4.7 FireFAQ

- Accordion (details/summary or custom with CSS transitions)
- Emits `FAQPage` JSON-LD when rendered
- Props: `faqs` array, each with `question` and `answer` (HTML string)

### 4.8 TrustSignals

- Horizontal bar: "Florida Bar | DC Bar | Texas Bar | Colorado Bar | 10+ Years | Fire Claim Focus"
- Rendered on hub page and cluster pillars

### 4.9 BreadcrumbNav

- Visual breadcrumbs: Home > Fire Insurance Claims > {Cluster or Resources} > {Article}
- Emits `BreadcrumbList` JSON-LD
- Rendered in layout.js for all fire hub pages

### 4.10 FireDisclaimer

- Text: "The information on this page is for general informational purposes only and does not constitute legal advice. Past results do not guarantee future outcomes. This is attorney advertising. Louis Law Group, PLLC is a Florida law firm."
- Rendered in layout.js footer area

---

## 5. Data Layer

### 5.1 Strapi Article Fetching

**Resource index page:**

Both pipelines insert articles into the Strapi `articles` table. To reliably fetch fire articles, maintain a `fire-article-slugs.json` manifest that each pipeline appends to on every run. The resource index reads this manifest and fetches by exact slug list.

Fallback: OR filter with multiple fire-related keywords:
```
GET {STRAPI_URL}/api/articles?filters[$or][0][slug][$containsi]=fire&filters[$or][1][slug][$containsi]=smoke-damage&filters[$or][2][slug][$containsi]=arson&filters[$or][3][slug][$containsi]=soot&filters[$or][4][slug][$containsi]=lightning-strike&pagination[pageSize]=200&sort=publishedAt:desc
```

**Individual article page:**
```
GET {STRAPI_URL}/api/articles?filters[slug][$eq]={slug}&populate=*
```

**ISR:** `revalidate: 3600` (1 hour, matches existing pattern)

### 5.2 Static Data: fire-clusters.js

```js
export const FIRE_CLUSTERS = [
  {
    slug: "types-of-damage",
    title: "Types of Fire Damage",
    description: "Structural damage, smoke, soot, water from firefighting, electrical, HVAC contamination",
    icon: "Flame",
    topicTerms: ["structural", "smoke", "soot", "water", "electrical", "hvac", "contamination"],
    intro: "<p>Fire damage extends far beyond...</p>"
  },
  {
    slug: "denied-claims",
    title: "Why Fire Claims Get Denied",
    description: "Arson allegations, misrepresentation, excluded causes, lapsed coverage, late notice",
    icon: "ShieldX",
    topicTerms: ["denied", "denial", "arson", "misrepresentation", "excluded", "lapsed", "late notice"],
    intro: "<p>Insurance companies deny fire claims for...</p>"
  },
  {
    slug: "claim-process",
    title: "The Fire Claim Process",
    description: "Steps after a fire, documentation, proof of loss, EUO, adjusters",
    icon: "ClipboardList",
    topicTerms: ["process", "steps", "document", "proof of loss", "euo", "adjuster", "after a fire"],
    intro: "<p>The hours and days after a house fire...</p>"
  },
  {
    slug: "coverage-disputes",
    title: "Coverage Disputes",
    description: "ACV vs RCV, ALE, personal property, code upgrades, depreciation",
    icon: "Scale",
    topicTerms: ["coverage", "acv", "rcv", "ale", "living expenses", "depreciation", "personal property", "code upgrade"],
    intro: "<p>Even when your fire claim is accepted...</p>"
  },
  {
    slug: "legal-remedies",
    title: "Legal Remedies",
    description: "Bad faith, Civil Remedy Notice, appraisal, mediation, litigation",
    icon: "Gavel",
    topicTerms: ["bad faith", "civil remedy", "appraisal", "mediation", "litigation", "attorney fees", "lawsuit"],
    intro: "<p>When an insurance company acts in bad faith...</p>"
  },
  {
    slug: "fire-scenarios",
    title: "Specific Fire Scenarios",
    description: "Kitchen fires, electrical fires, lightning, wildfire, smoke-only, vehicle fires",
    icon: "Zap",
    topicTerms: ["kitchen", "electrical", "lightning", "wildfire", "smoke only", "vehicle", "grease"],
    intro: "<p>Different fire scenarios present unique...</p>"
  },
  {
    slug: "florida-specific",
    title: "Florida-Specific Issues",
    description: "Tort reform impact, Citizens Insurance, wind + fire, Florida statutes, statute of limitations",
    icon: "MapPin",
    topicTerms: ["florida", "tort reform", "citizens", "wind", "statute of limitations", "f.s."],
    intro: "<p>Florida's insurance landscape presents unique...</p>"
  }
]
```

### 5.3 Static Data: fire-faqs.js

20-30 FAQ entries structured as:
```js
{ question: "...", answer: "...(HTML)...", cluster: "claim-process", showOnHub: true }
```

FAQ hub page renders all. Hub page renders those with `showOnHub: true` (top 5-7). Cluster pillars render FAQs matching their cluster slug.

---

## 6. Structured Data (JSON-LD)

| Page | Schema |
|------|--------|
| Pillar hub | `LegalService` (areaServed: Florida, serviceType: Fire Insurance Claims) + `BreadcrumbList` |
| Cluster pillar | `CollectionPage` + `BreadcrumbList` |
| Article | `Article` (author, datePublished, dateModified) + `BreadcrumbList` |
| Any page with FAQs | `FAQPage` (only when FAQs are rendered) |

Schemas emitted via `<script type="application/ld+json">` in page components. Reuse pattern from existing `[...slug]/page.js`.

---

## 7. Conversion Flow

### Hub page (pillar):
1. **FirePillarHero CTA** — "Book a Free Fire Claim Consultation" → Cal.com modal
2. **FireClaimQualifier** — 4-question widget at bottom of hub

### Resources index page:
Same CTAs as main `/resources/` page:
- `Results` component — case statistics
- `Steps` component — "How it Works" + "Free Case Evaluation" button
- `Contact` component — contact form + phone

### Individual article pages:
Same CTAs as main article pages via `[...slug]/page.js`:
- `UrgencyBanner` — statute of limitations warning, top of article
- `DocumentUploadCTA` — mid-article qualifier CTA
- `ChecklistCTA` — mid-article checklist download (property damage variant)
- End-of-article CTA block: "Find Out If You Qualify" + `OpenChatButton` + qualify link
- Sticky mobile CTA bar: chat + qualify buttons
- Sticky desktop CTA bar: "Insurance claim issues?" + buttons
- `MobileExitIntent` — exit-intent modal
- `RelatedArticles` — related fire articles

### Cal.com prefill URL params:
```
?claimType=fire&claimStatus={status}&carrier={carrier}&lossDate={range}&claimValue={range}
```

---

## 8. Two Article Generation Pipelines

### Pipeline 1: Google Keyword Planner (GKP) Pipeline

**File:** `fire_claims_gkp_pipeline.py`
**Schedule:** Daily, 50 articles/day
**Keyword source:** Google Ads Keyword Planner API (direct pull)
**Keyword file:** `fire_claims_gkp_keywords.json`

Seeds for GKP pull:
- "fire damage insurance claim Florida", "house fire insurance claim denied"
- "smoke damage insurance claim", "fire insurance lawyer Florida"
- "fire claim underpaid", "arson investigation insurance"
- "electrical fire insurance claim", "kitchen fire claim"
- "fire damage bad faith insurance", "additional living expenses fire"
- "fire damage proof of loss", "fire claim public adjuster vs attorney"
- "commercial fire insurance claim", "fire damage restoration dispute"
- "lightning strike fire damage claim", "wildfire insurance claim Florida"
- And 60+ more fire insurance-specific seeds

**Article CTA:** Same as main article pages (UrgencyBanner, DocumentUploadCTA, ChecklistCTA, end-of-article qualify + chat, sticky CTAs, exit intent)

**Slug manifest:** Appends published slugs to `fire-article-slugs.json` for resource index fetching.

### Pipeline 2: Autocomplete + Sources Pipeline

**File:** `fire_claims_autocomplete_pipeline.py`
**Schedule:** Daily, 50 articles/day (offset by 1 hour from Pipeline 1)
**Keyword sources:**
- Google Autocomplete suggestions (primary)
- Google Trends scoring
- Competitor seed expansion (Nolo, FindLaw, Martindale fire claim pages)
- "People Also Ask" style long-tail queries

Seeds for autocomplete expansion:
- "what to do after house fire", "fire insurance claim tips"
- "how long does fire claim take", "fire damage claim checklist"
- "can insurance deny fire claim", "fire claim adjuster won't pay"
- "fire damage claim timeline Florida", "fire claim lawyer near me"
- "smoke damage claim without fire", "fire insurance claim process step by step"
- "fire department report for insurance", "fire claim depreciation"
- And competitor-derived topics

**Article CTA:** Same as main article pages (identical to Pipeline 1)

**Slug manifest:** Same shared `fire-article-slugs.json`.

### Shared Pipeline Infrastructure

Both pipelines:
- Insert into existing Strapi `articles` table
- Use shared anti-cannibalization engine (`anti_cannibalize.py`)
- Triple dedup: slug + title fingerprint + intent cluster
- GSC guard against page 1 cannibalization
- Telegram notifications on completion
- Append to shared `fire-article-slugs.json` manifest
- Submit sitemap after publishing
- Separate state files per pipeline (slugs, titles, intents) to avoid conflicts

### Dedup Across Pipelines

Both pipelines read from a shared intent log (`fire_claims_shared_intents.json`) to prevent the autocomplete pipeline from generating articles on the same topics as the GKP pipeline. Each pipeline:
1. Reads shared intents before selecting keywords
2. Writes new intents back after publishing

---

## 9. Internal Linking Rules

1. Every article links up to its matched cluster pillar via BreadcrumbNav
2. Every cluster pillar links up to the main fire hub via BreadcrumbNav
3. Main hub links to all 7 cluster pillars via ClusterGrid
4. Main hub links to 5-7 cornerstone articles (highest-traffic fire articles)
5. RelatedArticles: related fire articles at bottom of every article
6. Footer link: "Fire Insurance Claims" in Resources column

---

## 10. E-E-A-T & Florida Bar Compliance

- Author attribution via existing `team-pages` (Pierre Louis) on articles
- Bar admissions visible on hub (FL, DC, TX, CO)
- FireDisclaimer in layout footer on all fire hub pages
- No guaranteed outcome language
- No superlatives without qualification
- "Attorney advertising" notice in disclaimer

---

## 11. Phased Build Order

### Phase 1: Foundation
- Create `app/fire-insurance-claims/layout.js` with BreadcrumbNav, FireDisclaimer
- Create data files (`fire-clusters.js`, `fire-faqs.js`)
- Build CalBookingEmbed, FirePillarHero
- Build pillar hub `page.js`
- Schema emission utilities

### Phase 2: Hub + Footer
- Build ClusterGrid, TrustSignals, FireFAQ
- Populate hub with final copy
- Build 7 cluster pillar pages
- Add "Fire Insurance Claims" link to Footer component

### Phase 3: Resource System
- Build resource index page with cluster filter + Results/Steps/Contact CTAs
- Build article template `[slug]/page.js` with all existing article CTAs (UrgencyBanner, DocumentUploadCTA, ChecklistCTA, sticky CTAs, exit intent, end-of-article CTA)
- Build ResourceCard, ArticleTOC
- Verify pipeline articles render correctly

### Phase 4: Pipelines
- Build GKP keyword pull + pipeline (50/day)
- Build autocomplete keyword pull + pipeline (50/day)
- Shared `fire-article-slugs.json` manifest
- Cross-pipeline dedup via shared intents
- Cron entries for both pipelines
- Verify articles appear in resource library

### Phase 5: Conversion + Launch
- Build FireClaimQualifier on hub page
- Cal.com prefill integration
- Analytics event instrumentation
- Internal linking audit
- Schema validation
- Deploy to Vercel production
- Submit sitemap to GSC
