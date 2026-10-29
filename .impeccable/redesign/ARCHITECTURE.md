# Clean rebuild architecture — Phase 1 proposal

Status: architecture proposal only. Implementation begins after concept approval. The only project evidence used for this note is the supplied new brief; no previous source, layouts, assets, or portfolio data have been consulted.

## Stack and build boundary

Use Vite, React, TypeScript, Tailwind CSS, Lucide, and a small React routing layer. Verify supported package versions against official documentation when implementation starts; no version is prescribed here. Deploy generated static pages and a separate lead API handler on Vercel.

Create a fresh source tree after approval. Existing project files are excluded as implementation inputs. Do not scaffold packages or write UI code at this stage.

```text
api/
  leads.ts                     # Server-side request validation and delivery
src/
  app/
    App.tsx                    # Router composition
    AppShell.tsx               # Global navigation, footer, conversion controls
    route-manifest.ts          # Canonical paths, metadata, prerender inputs
  pages/
    HomePage.tsx               # Full Phase 1 homepage
    NotFoundPage.tsx
    services/                  # Future service template and route composition
    industries/                # Future industry template and route composition
  components/
    layout/                    # Navigation, mobile menu, footer, section container
    ui/                        # Buttons, field controls, modal, feedback states
    conversion/                # Quote form, WhatsApp, booking, mobile sticky bar
  features/
    home/                      # Hero, pillars, capabilities, industries, reach, CTA
    leads/                     # Form model, validation, submit state
    booking/                   # Booking adapter and launch behavior
  content/
    business.ts                # Approved brand, markets, contact configuration
    capabilities.ts            # Eight divisions and consultation-led flags
    industries.ts              # Six industry categories
    case-studies.ts            # Verified evidence only; empty until supplied
  lib/
    analytics.ts               # trackEvent wrapper with explicit safe metadata
    whatsapp.ts                # Context-to-message generation
    seo.ts                     # Metadata and structured data helpers
  shared/
    lead-schema.ts             # Shared Zod validation
    lead-contract.ts           # Browser/API request and response interfaces
  styles/
    tokens.css                 # Approved semantic design tokens
    globals.css
  entry-client.tsx
  entry-server.tsx              # Static render entry for build-time generation
scripts/
  prerender.ts                 # Generates crawlable route HTML from manifest
  generate-discovery.ts        # sitemap.xml and robots.txt from published routes
tests/
  leads/
  conversion/
  routing/
public/
  brand/                      # Approved K logo and derived favicon
  media/                      # New approved or replaceable original assets
```

The tree above is a future clean implementation structure, not an instruction to reuse similarly named existing files.

## Routes and release scope

The manifest owns each route's path, publication status, title, description, canonical path, image, render function, and structured-data type. A single source drives router registration, navigation, static generation, sitemap generation, and link validation.

Phase 1 delivers the global shell, navigation, footer, reusable lead components, and complete homepage. Publish `/` and the lead API when configured. Do not put future pages in the sitemap or link cards to unavailable routes. Until those pages ship, navigation can target matching homepage sections and capability cards can open the proposal form with the service preselected.

Reserve these future routes:

- `/about`
- `/services/:slug` — eight capability routes, with consultation-led language for AI, CRM/business technology, and analytics
- `/industries/:slug` — six industry solution routes
- `/work`
- `/global-partnerships`
- `/contact`

Service templates follow Business Problem → Proposed Solution → Deliverables → Four-Step Process → Contextual Enquiry. Industry templates combine the relevant capability offerings with the industry's stated search intent. A case-study record requires Client Challenge → Our Work → Delivered Solution → Verified Outcome, plus evidence provenance; records without approved evidence are not published.

## Homepage composition

1. Required hero headline, subheadline, and Get a Proposal / Explore Our Services actions.
2. Accessible Create / Market / Automate / Grow interaction with readable content available without motion.
3. Eight capability cards with delivery or consultation wording.
4. Six-industry grid.
5. Featured case studies only when real approved evidence exists. Until then, present a clearly named explanation of the engagement process in this position, with no fabricated client or outcome.
6. Markets We Serve: Indian locations and UAE, UK, USA, Canada, Australia, described as served markets; never implied offices.
7. Conversion section with the complete proposal form and contextual WhatsApp action.

## Design-token contract

The approved concept supplies the values. Components consume semantic roles rather than literal palette values.

- Color: canvas, surface, surface-raised, text, text-muted, border, accent, accent-hover, on-accent, focus, success, warning, error, overlay.
- Typography: display and body families; headline, section, card, body, small, and label roles; readable line lengths, responsive sizes, line heights, and weights.
- Layout: content-width, reading-width, page-gutter, section-space, grid-gap, and spacing scale.
- Shape and depth: control/card radii, border width, elevation, and media aspect ratios.
- Motion: short/standard/emphasis durations, easing, reveal-distance, and reduced-motion replacements.
- Interaction: minimum target size, focus-ring width/offset, control height, and sticky-bar safe-area space.

Choose exact colors and type treatments with the approved visual concept. Verify text and interactive contrast in their real combinations. Use icons as supporting cues with text labels; decorative icons are hidden from assistive technology.

## Reusable lead interfaces

The browser submits a typed `LeadSubmission`: fullName, companyName, locationCountry, email, phone, serviceId (one of eight known IDs), budgetTier, projectDescription, honeypot, and a small allowlisted context object (route/service ID). Exclude free-form tracking fields.

The server returns a discriminated result: accepted with requestId, validation_error with field errors, delivery_unavailable with retry guidance, or rate_limited. A confirmation state appears only after the configured receiver acknowledges acceptance. A successful response is not a claim that an email reached an inbox or that a sale entered a final CRM stage.

Use one shared Zod schema for length limits, email, phone input normalization, enumerated services/budget, and required fields; enforce it again on the server. Keep the form understandable: visible labels, accessible errors, error summary, retained inputs, pending state, and duplicate-submit protection.

A replaceable server-only `LeadSink.deliver(lead, requestId)` interface connects the chosen CRM/webhook. A separate notification adapter may notify the team after receipt. Keep credentials out of the browser. Use request IDs for correlation and avoid recording raw lead payloads in application logs. Honeypot, request-size limits, and a configurable server-side rate-limit adapter handle basic abuse; no unreliable in-memory limit is presented as durable protection.

If a receiver is missing, show the service as unavailable and do not simulate submission success. Notification failures must not cause a confirmed primary delivery to be retried as a fresh lead.

## WhatsApp and booking

One context resolver maps published routes and selected service IDs to short prewritten messages. Generate `https://wa.me/<NUMBER>?text=<encoded message>` from a configured international-format business number. Do not insert personal form data into WhatsApp URLs or analytics. Global floating, inline, and mobile sticky triggers share this implementation.

The booking component uses a replaceable configured calendar URL or approved integration. Load external scheduling content only when opened, provide a direct-link fallback, and manage dialog focus, Escape, and focus restoration. Use “Book a Solutions Architecture Call” for consultation-led capabilities. Missing contact/booking configuration is an explicit launch dependency; no invented phone number or scheduler is used.

## Analytics

Expose `trackEvent(eventName, metadata)` with typed names: `form_submit`, `consultation_request`, and `whatsapp_click`. Allow only non-personal fields such as routeId, serviceId, placement, and status. Strip everything else; never pass names, email, phone, project descriptions, free text, or entire URLs/query strings.

Emit form_submit after server-confirmed acceptance; consultation_request means a booking action was initiated, not a confirmed appointment. The wrapper safely does nothing when GA4 is not configured. Respect the approved consent configuration before sending events; no tracking identifier is invented.

## Crawlability, performance, and accessibility

Prerender published marketing routes during the Vite build through the shared server entry and route manifest. Each route receives real section content, one H1, a unique title/description, absolute canonical URL, OpenGraph data, and a consistent approved K mark. Hydrate the resulting page in the browser. Verify direct route requests and navigation on Vercel; do not serve homepage metadata at every URL through a blanket fallback.

Generate sitemap.xml only from published canonical routes. Generate robots.txt from the production deployment configuration; preview environments should not become indexed. Production domain and approved social image are required before final metadata is accepted.

Use Organization and ProfessionalService structured data with verified facts only, and Service data on the future service pages. Do not invent office addresses, testimonials, ratings, or geographic business premises.

Prefer a static hero composition and lightweight CSS motion. Reserve media dimensions, load below-fold media lazily, subset fonts, and keep external calendar code out of initial loading. Treat LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, and WCAG 2.2 AA as verification targets, not completed compliance claims. Honor prefers-reduced-motion. Provide keyboard navigation, visible focus, semantic landmarks, correct heading order, and a mobile sticky bar that does not cover content.

## Behavior-focused verification

- Lead schema rejects invalid/missing fields, unsupported service IDs, excessive payloads, and honeypot submissions.
- Lead API handles receiver acceptance, timeout/rejection, duplicate submission, rate limiting, missing configuration, and team-notification failure without a false success state.
- WhatsApp output uses the correct route/service context and encoding, and never includes entered personal information.
- Analytics emits only allowlisted metadata and does not imply a completed booking.
- Keyboard users can open/close mobile navigation and booking dialogs, reach form errors, and submit valid forms.
- Browser checks verify homepage anchors, service preselection, form loading/error/confirmed states with a controlled receiver, mobile sticky controls, reduced motion, and narrow-screen overflow.
- Inspect generated HTML for route metadata, content and structured data; confirm sitemap links, direct-route responses, and canonical origins.
- Measure actual loading and accessibility once on the completed build; expand checks only for new failures or changes.

## Inputs required before a production launch

Approved K logo; business WhatsApp number; calendar URL/integration; lead receiver and server-side credentials; production domain; GA4 identifier and consent preference; approved case-study evidence and client permissions. Replaceable new visual assets may be prepared, but none is represented as client work or the approved logo.
