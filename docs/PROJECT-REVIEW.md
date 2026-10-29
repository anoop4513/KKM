# Katha Kantam Media — website review and delivery handoff

Prepared for the transformation brief dated October 29, 2026. This document separates the review build from the remaining launch requirements. It does not certify an untested integration or promise a delivery date.

## What the existing project needs

The existing React, TypeScript and Vite project provides useful source material: eight capability areas, six project records, original project links, client image assets and an established contact email. That work is being retained rather than starting from an unrelated template.

Observed issues in the supplied local source:

- Its ivory, ink and electric-lime identity differs from the requested premium white, black and metallic-gold direction. The existing textual K mark and older logo do not establish the newly approved Golden K asset.
- Contact links open an email draft. There was no active enquiry form, secure lead storage, notification workflow or consultation-request flow in the current application. An installed Supabase package alone is not an integration.
- The portfolio data contains project names, services and original links, but the visible project cards substituted illustrative banner themes and visual descriptions. Visitors could not easily connect the presentation to the actual source project details.
- The site was a single page. The supplied configuration rewrote routes to the same application shell; it did not provide dedicated service or industry content with individually rendered SEO metadata.
- Existing motion does not cover the complete requested interaction set. The new build needs layered depth, word reveals, scroll-linked rotation, differential eye/head tracking and stacking sections, with touch and reduced-motion alternatives.
- The source does not establish a verified WhatsApp number, booking URL, GA4 property, notification destination, final production-domain configuration or publishable numerical case-study outcomes.

These observations come from the local project, not a fresh audit of the live domain. No live performance score or independently verified campaign result is implied.

## Approved design and visitor journey

The user selected **Open Lens** from three image concepts. It combines clear black typography on white with a sculptural gold optical object. The headline and proposal action remain immediately readable; depth and rotation belong to the visual object, while forms and navigation stay stable.

The journey is: understand the agency → find the relevant service or industry → inspect source-backed work → enquire. The four pillars remain Create, Market, Automate and Grow. Expansion services use consultation-based language until delivery readiness is confirmed. Hindupur, Bengaluru, Hyderabad and international targets are presented as markets, not invented offices.

The concept logo and generated artwork are deliberately replaceable. They are not represented as the client's final approved logo or original client campaign assets.

## Intended 22-route structure

| Group | Routes | Purpose |
| --- | --- | --- |
| Core pages — 8 | `/`, `/about/`, `/services/`, `/industries/`, `/work/`, `/global-partnerships/`, `/contact/`, `/privacy/` | Agency positioning, discovery, proof, global collaboration and conversion. |
| Service pages — 8 | `/services/creative-media-production/`, `/services/branding-creative-strategy/`, `/services/digital-marketing-growth/`, `/services/website-digital-experience/`, `/services/ai-business-automation/`, `/services/crm-business-technology/`, `/services/data-analytics-performance/`, `/services/global-creative-localization/` | Distinct business problem, proposed approach, scope, process and enquiry path for each capability. |
| Industry pages — 6 | `/industries/healthcare/`, `/industries/education/`, `/industries/real-estate/`, `/industries/founders-personal-brands/`, `/industries/salons-retail-local-businesses/`, `/industries/international-agencies/` | Useful industry-specific content without repetitive location pages or invented proof. |

The work page preserves the existing six project records and source links. Dedicated numerical case studies should be added only when the client supplies approved evidence. No fabricated testimonials, awards, conversion rates or international client claims are needed to fill the page.

## Development and integration requirements

The review keeps React, TypeScript, Vite, the existing icon system and Vercel as the deployment target. The motion can run through native browser APIs without an additional animation subscription. Individual pages need rendered content, unique titles/descriptions, descriptive internal links and suitable social metadata.

The enquiry implementation includes a real server endpoint, validation, lightweight spam controls, durable rate limiting, idempotent acceptance, a protected lead register and a notification outbox. Activation requires an approved Supabase project and Resend configuration. See [INTEGRATIONS.md](./INTEGRATIONS.md) and `database/enquiries.sql` for the exact setup and verification steps. This lead register is not presented as a fully configured third-party CRM or an authenticated staff dashboard.

Without those credentials and schema, the form must stay visibly unavailable and offer the verified contact email. A success screen is permitted only after server-confirmed durable acceptance. Database acceptance, provider acknowledgement and inbox delivery must be checked separately. An outbox retry/alert process and an accountable staff owner are required for reliable operations.

Additional launch integrations depend on real client details:

- WhatsApp: approved Business number and prefilled enquiry wording.
- Consultation booking: approved calendar URL, or use the implemented discovery-call request and arrange a time by email.
- Analytics: approved GA4 measurement ID and consent/privacy decisions. Track useful conversion categories without form text or contact details.
- Search Console: final domain and owner verification.
- CRM: selected platform, account access and field mapping if a dedicated CRM is required beyond the protected lead register.
- Monitoring: owner-approved error/availability reporting and who responds when notifications or form acceptance fail.

No new paid software is mandatory merely to review the frontend preview. Before commercial launch, verify the selected hosting account's permitted use, service limits, sender-domain requirements, data controls and applicable email/CRM/monitoring plans. No paid plan has been selected or activated, and no unresearched price or plan recommendation is made here.

## Planning estimates by phase

These are planning ranges for a complete project cycle with content review and revisions, not actual hours spent, a promised ETA or a claim that every phase remains unfinished. Re-estimate the remaining work after preview review. Waiting for assets, account access and client approvals is additional.

| Phase | Indicative effort | Acceptance point |
| --- | --- | --- |
| 1. Brand and website foundation | 3–5 working days | Approved logo integrated; Open Lens layout, navigation, positioning and responsive motion reviewed. |
| 2. Service, industry and SEO content | 4–7 working days | Eight service and six industry pages approved; source work shown accurately; route rendering and metadata verified. |
| 3. Enquiry and analytics setup | 2–4 working days | Real storage, rate limits, consent, designated notifications, retries and non-personal conversion events tested. |
| 4. International partnership content | 1–3 working days | Collaboration offer, supported languages, review process and delivery expectations confirmed. |
| 5. Final QA and controlled launch | 2–4 working days | Desktop/mobile, keyboard, reduced motion, links, forms, metadata and operational checks complete; release approved. |

## Assets and decisions needed from the client

- Final Golden K logo: preferably SVG plus a transparent PNG, usage rules and any approved variants. Replace the provisional header/footer mark, favicon and social image consistently.
- Real project images/video thumbnails and permission to publish client names, logos and samples. Preserve original aspect ratios and record source/usage rights.
- Verified project descriptions, service scope and any outcomes approved for publication. Numerical results need evidence and context.
- Leadership names, biographies and photographs if these should appear. Do not invent team members.
- Confirmed services ready for delivery; specialist support and scoping terms for expansion capabilities.
- Approved public contact email, WhatsApp/telephone number and consultation booking details.
- Designated internal notification recipient, verified sender domain, Supabase access and the owner responsible for lead follow-up.
- GA4 measurement ID, Search Console access, privacy/legal identity, data retention and deletion process.
- Final approved `SITE_URL` / production origin and social-sharing assets. Preview addresses must not become the production canonical URL or sitemap origin.
- International delivery languages, realistic turnaround expectations, revision terms and project/retainer arrangements.

## Preview and verification record

**Verified review preview:** https://kkmedia-5n9j19e33-anoop4513s-projects.vercel.app/

Source branch: `codex/kkm-global-motion` in `anoop4513/KKM`. Application commit: `55c06ea`. This deployment is a Vercel Preview, with the project's existing Vercel Authentication protection preserved; reviewers may need to sign in to the authorized account.

Verified on October 29, 2026: all 22 deployed routes returned 200 with distinct rendered titles, headings and preview noindex metadata. The sitemap contains all 22 routes and uses the actual preview origin. Browser checks found no application errors. Local interaction checks passed for parallax speeds, reversible rotation, fixed-position stillness, word reveal, differential eye/head tracking, sticky stacking, portfolio filters, keyboard menu escape and reduced motion. Layouts were checked at 320, 390, 768, 1024 and 1440 pixels. Nine mocked backend tests passed; no live database write or notification delivery is claimed.

The deployed enquiry readiness endpoint reports `ready: false`, as expected without the approved credentials. Online submission is disabled and the verified email alternative remains available. The finish reviewer returned `disposition: ship` for the two scored visual fixes: broader hero serif and single-column, 16px mobile form fields. The automated single-composite plate gate remains a documented process limitation because the requested motion uses three separately generated layers.

The existing production deployment remained `dpl_Ao4XMKvXpiYjrovsPDtZbvqYCeac` at the final check. The original source checkout still has its original four uncommitted files and was not edited by this build.

The preview is a review deliverable. Record build/type checks, browser checks, motion reversibility, small-screen layouts and reduced-motion behavior alongside it. Do not describe a Vercel `READY` state as proof that a protected preview is accessible to the intended reviewer. Do not describe passing mocked backend tests as proof of live Supabase writes or email delivery.

## Preservation, release and rollback

The original source checkout remains at `C:\Users\anoop\Downloads\dpl_7D6jEfP4eZqmc2vrf5M3gNfzxHHc\src`. The review work is in `C:\Users\anoop\Downloads\JONA` on `codex/kkm-global-motion`. Existing local edits and portfolio source content were carried into the review copy; the original checkout and live domain are preserved.

Before release, retain the reviewed commit, the last approved production deployment, current environment-variable names/configuration and a database backup appropriate to the selected service. Keep secrets out of source and backups shared for review. Confirm the exact Vercel project and environment before deploying or promoting.

The client's brief explicitly requires **approval before publishing to the live domain**. A preview review does not itself grant that release approval. If an approved release needs to be undone, restore the last approved deployment/commit using the recorded target, then verify the live pages and lead flow. Database changes and captured enquiries require their own backup and recovery handling; a frontend rollback does not reverse stored data.
