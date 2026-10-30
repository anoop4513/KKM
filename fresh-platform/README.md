# Katha Kantam Media — fresh Phase 1

A standalone Vite, React, TypeScript, Tailwind and Lucide build based on the new project brief. Its source, design and example content were authored for this project without importing prior layouts, components, styles, images or portfolio records.

Run `npm install`, then `npm run dev`. `npm run build` type-checks, builds and prerenders the homepage. `npm test` runs the lead-handler tests. The Vite development server alone does not execute Vercel Functions; a Vercel preview runs `api/lead.ts`.

This is Phase 1: the homepage, navigation, footer and proposal flow. Service, industry, work, global and contact links currently take visitors to substantial sections on the homepage. Dedicated detail routes are a later phase; no placeholder links imply that those pages already exist.

The mark and favicon are provisional. Replace them with the approved K asset when available. The four-panel hero artwork is a generated concept visual, replaceable at `public/art/dispatch-panels.webp`; its prompt is retained in `docs/dispatch-panels.prompt.txt`. The three case-study examples are explicitly illustrative and do not assert actual clients or results.

Online proposals require an approved receiver, credentials and verified end-to-end delivery. WhatsApp, calendar booking and GA4 also require approved settings. See `.env.example` and `docs/LEADS.md`. Analytics is off unless a measurement ID is configured and the visitor opts in. Preview indexing is disabled. Configure a verified production `SITE_URL` before an approved launch.

The previous production site remains separate. Deploy this directory as a Vercel Preview; do not promote it without the required approval.
