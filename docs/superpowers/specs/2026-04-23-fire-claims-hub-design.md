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
| Strapi content types | Use existing `articles` table | No schema changes needed, compatible with SEO pipeline |
| Cluster/FAQ data | Static JS data files in repo | Simple, version-controlled, no Strapi schema changes |
| Author data | Reuse `team-pages` content type | Already exists, default author: Pierre Louis |
| Cal.com | Event type 4 + URL prefill params | Single booking flow, fire context passed via params |
| Styling | CSS Modules (no Tailwind) | Matches existing site patterns |
| Qualifier backend | POST to `/api/qualify-intake` | Existing n8n webhook integration |
| Analytics | Existing `trackEvent()`/`trackConversion()` | GA4 + GTM dataLayer, no new infra |

---

## 2. URL Routes & File Structure

```
app/fire-insurance-claims/
  layout.js                           # shared layout: breadcrumbs, disclaimer, sticky CTA
  page.js                             # pillar hub: hero, cluster grid, trust signals, FAQ sample
  resources/
    page.js                           # resource library index with cluster filter
    [slug]/page.js                    # individual article (fetched from Strapi articles table)
  types-of-damage/page.js             # cluster pillar (static)
  denied-claims/page.js               # cluster pillar
  claim-process/page.js               # cluster pillar
  coverage-disputes/page.js           # cluster pillar
  legal-remedies/page.js              # cluster pillar
  fire-scenarios/page.js              # cluster pillar
  florida-specific/page.js            # cluster pillar
  faqs/page.js                        # FAQ hub

components/fire-hub/
  FirePillarHero.js + .module.css      # hero + primary Cal.com CTA
  FireClaimQualifier.js + .module.css  # 4-question gating widget
  CalBookingEmbed.js + .module.css     # Cal.com inline embed wrapper
  StickyBookingCTA.js + .module.css    # scroll-triggered sticky bar
  ClusterGrid.js + .module.css         # 7 cluster cards on hub
  ResourceCard.js + .module.css        # article card for resource library
  RelatedArticles.js + .module.css     # bottom-of-article internal links
  ArticleTOC.js + .module.css          # sticky sidebar TOC (desktop) / collapsible (mobile)
  FireFAQ.js + .module.css             # accordion FAQ + FAQPage JSON-LD
  TrustSignals.js + .module.css        # bar admissions, years, focus
  AuthorBio.js + .module.css           # from team-pages Strapi data
  BreadcrumbNav.js + .module.css       # visual + BreadcrumbList JSON-LD
  FireDisclaimer.js + .module.css      # Florida Bar compliant disclaimer

data/
  fire-clusters.js                     # cluster definitions, intro copy, topic terms
  fire-faqs.js                         # FAQ entries with cluster associations
```

---

## 3. Component Specifications

### 3.1 FirePillarHero

- H1: "Florida Fire Insurance Claim Lawyers"
- Value proposition paragraph
- Primary CTA button: "Book a Free Fire Claim Consultation"
- Button opens Cal.com modal with prefill `?claimType=fire`
- Above the fold on pillar hub page only
- Uses Anton font for H1, Work Sans for body (existing pattern)

### 3.2 FireClaimQualifier

Client component with 4 steps:

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

**Analytics:** `fire_qualifier_start`, `fire_qualifier_step_{n}`, `fire_qualifier_qualified`, `fire_qualifier_offramp`

### 3.3 CalBookingEmbed

- Wraps Cal.com inline embed via `<iframe>` to `https://bookings.louislawgroup.com/team/event-type-4`
- Props: `prefillParams` object (claimType, claimStatus, carrier, lossDate, claimValue)
- Params appended as URL query string
- Responsive: 100% width, min-height 600px

### 3.4 StickyBookingCTA

- Fixed bottom bar, appears after 40% scroll depth
- Copy: "Denied fire claim? Talk to an attorney — free."
- CTA button: "Book Free Consultation" → Cal.com modal
- X dismiss button, stores `fireStickyCTADismissed` in sessionStorage
- Does not reappear in same session after dismiss
- Analytics: `fire_sticky_cta_impression`, `fire_sticky_cta_click`, `fire_sticky_cta_dismiss`

### 3.5 ClusterGrid

- 7 cards in CSS Grid (3 columns desktop, 2 tablet, 1 mobile)
- Each card: lucide-react icon, cluster title, short description, link to cluster pillar
- Data sourced from `data/fire-clusters.js`

### 3.6 ResourceCard

- Title (link), excerpt (2 lines), cluster tag pill, read time estimate
- Used on: resource index page, cluster pillar pages, related articles
- Read time: `Math.ceil(wordCount / 200)` minutes

### 3.7 RelatedArticles

- 3 same-cluster articles + 1 cross-cluster article
- Matching: keyword overlap between article slug/title and cluster topic terms
- Falls back to most recent if insufficient matches
- Rendered at bottom of article pages

### 3.8 ArticleTOC

- Desktop: sticky sidebar, generated from H2 elements in article body
- Mobile: collapsible accordion at top of article
- Smooth scroll to section on click
- Highlights active section on scroll (IntersectionObserver)

### 3.9 FireFAQ

- Accordion (details/summary or custom with CSS transitions)
- Emits `FAQPage` JSON-LD when rendered
- Props: `faqs` array, each with `question` and `answer` (HTML string)
- Analytics: `fire_faq_expand` on each open

### 3.10 TrustSignals

- Horizontal bar: "Florida Bar | DC Bar | Texas Bar | Colorado Bar | 10+ Years | Fire Claim Focus"
- Rendered on hub page and cluster pillars

### 3.11 AuthorBio

- Fetches from Strapi `team-pages` by slug (default: "pierre-louis")
- Displays: headshot, name, title, short bio, link to `/team/{slug}`
- Rendered at bottom of article pages above RelatedArticles

### 3.12 BreadcrumbNav

- Visual breadcrumbs: Home > Fire Insurance Claims > {Cluster or Resources} > {Article}
- Emits `BreadcrumbList` JSON-LD
- Rendered in layout.js for all fire hub pages

### 3.13 FireDisclaimer

- Text: "The information on this page is for general informational purposes only and does not constitute legal advice. Past results do not guarantee future outcomes. This is attorney advertising. Louis Law Group, PLLC is a Florida law firm."
- Rendered in layout.js footer area

---

## 4. Data Layer

### 4.1 Strapi Article Fetching

**Resource index page:**

The fire claims pipeline generates slugs with various fire-related terms (e.g., `house-fire-insurance-claim-denied-2026`, `smoke-damage-claim-florida-2026`). To reliably fetch fire articles, use an OR filter with multiple keywords:

```
GET {STRAPI_URL}/api/articles?filters[$or][0][slug][$containsi]=fire&filters[$or][1][slug][$containsi]=smoke-damage&filters[$or][2][slug][$containsi]=arson&filters[$or][3][slug][$containsi]=soot&filters[$or][4][slug][$containsi]=lightning-strike&pagination[pageSize]=200&sort=publishedAt:desc
```

Alternatively, maintain a `fire-article-slugs.json` manifest that the pipeline appends to on each run. The resource index reads this manifest and fetches by exact slug list. This is the more reliable approach and avoids false positives.

**Individual article page:**
```
GET {STRAPI_URL}/api/articles?filters[slug][$eq]={slug}&populate=*
```

**ISR:** `revalidate: 3600` (1 hour, matches existing pattern)

**generateStaticParams:** Not used for fire articles (too many, use ISR on-demand)

### 4.2 Static Data: fire-clusters.js

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

### 4.3 Static Data: fire-faqs.js

20-30 FAQ entries structured as:
```js
{ question: "...", answer: "...(HTML)...", cluster: "claim-process", showOnHub: true }
```

FAQ hub page renders all. Hub page renders those with `showOnHub: true` (top 5-7). Cluster pillars render FAQs matching their cluster slug.

---

## 5. Structured Data (JSON-LD)

| Page | Schema |
|------|--------|
| Pillar hub | `LegalService` (areaServed: Florida, serviceType: Fire Insurance Claims) + `BreadcrumbList` |
| Cluster pillar | `CollectionPage` + `BreadcrumbList` |
| Article | `Article` (author, datePublished, dateModified) + `BreadcrumbList` |
| Any page with FAQs | `FAQPage` (only when FAQs are rendered) |

Schemas emitted via `<script type="application/ld+json">` in page components. Reuse pattern from existing `[...slug]/page.js`.

---

## 6. Conversion Flow

### Four touchpoints:
1. **Hero CTA** (hub only) — "Book a Free Fire Claim Consultation" → Cal.com modal
2. **Sticky bar** (articles + cluster pillars) — 40% scroll, sessionStorage dismiss
3. **Mid-content CTA** (articles) — styled card between 2nd and 3rd H2
4. **End-of-article qualifier** (articles) — FireClaimQualifier below body

### Cal.com prefill URL params:
```
?claimType=fire&claimStatus={status}&carrier={carrier}&lossDate={range}&claimValue={range}
```

### Qualifier → n8n integration:
Qualified leads that don't book immediately also POST to `/api/qualify-intake`:
```json
{
  "caseType": "fire",
  "claimStatus": "denied",
  "carrier": "Citizens",
  "lossDate": "1-6 months",
  "claimValue": "$100,000-$500,000",
  "name": "...",
  "email": "...",
  "phone": "...",
  "source": "fire-hub-qualifier"
}
```

---

## 7. Analytics Events

All via existing `trackEvent()` and `trackConversion()` from `/src/app/utils/analytics.js`.

| Event | Trigger |
|-------|---------|
| `fire_qualifier_start` | User begins qualifier |
| `fire_qualifier_step_{n}` | Step n completed |
| `fire_qualifier_qualified` | Qualified outcome |
| `fire_qualifier_offramp` | Out-of-scope outcome |
| `fire_sticky_cta_impression` | Sticky bar appears |
| `fire_sticky_cta_click` | Sticky bar click |
| `fire_sticky_cta_dismiss` | Sticky bar dismissed |
| `fire_booking_complete` | Cal.com booking confirmed |
| `fire_article_scroll_{25/50/75/100}` | Scroll depth |
| `fire_faq_expand` | FAQ opened |
| `fire_internal_link_click` | Article → hub/cluster |

---

## 8. SEO Pipeline Integration

The existing `fire_claims_pipeline.py` (deployed at `/opt/openclaw-data/workspace/scripts/llg-seo-pipeline/`) generates 50 articles/day at 3 PM UTC. Articles are inserted into Strapi `articles` table with fire-related slugs.

**For articles to appear in the fire hub resource library:**
- Resource index fetches articles where slug contains "fire"
- Cluster matching uses `topicTerms` keyword overlap with article title/slug
- No manual tagging required — fully automatic

**Keyword pull:** `fire_claims_keyword_pull.py` pulls from Google Keyword Planner (90+ keywords).

---

## 9. Internal Linking Rules

1. Every article links up to its matched cluster pillar via BreadcrumbNav
2. Every cluster pillar links up to the main fire hub via BreadcrumbNav
3. Main hub links to all 7 cluster pillars via ClusterGrid
4. Main hub links to 5-7 cornerstone articles (highest-traffic fire articles)
5. RelatedArticles: 3 same-cluster + 1 cross-cluster at bottom of every article
6. Mid-content CTA links to `/fire-insurance-claims/` hub

---

## 10. E-E-A-T & Florida Bar Compliance

- AuthorBio on every article (Pierre Louis from `team-pages`)
- Bar admissions visible on hub + author bio (FL, DC, TX, CO)
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
- Build pillar hub `page.js` with placeholder content
- Schema emission utilities

### Phase 2: Hub Completion
- Build ClusterGrid, TrustSignals, FireFAQ, StickyBookingCTA
- Populate hub with final copy
- Build 7 cluster pillar pages

### Phase 3: Resource System
- Build resource index page with cluster filter
- Build article template `[slug]/page.js`
- Build ResourceCard, RelatedArticles, ArticleTOC, AuthorBio
- Verify pipeline articles render correctly

### Phase 4: Conversion
- Build FireClaimQualifier with routing logic
- Mid-content CTA insertion in article template
- Cal.com prefill integration
- Analytics event instrumentation
- Verify n8n webhook receives qualifier data

### Phase 5: Polish & Launch
- Internal linking audit
- Schema validation (Google Rich Results Test)
- Lighthouse audit (performance, accessibility)
- Submit sitemap update to GSC
- Deploy to Vercel production
