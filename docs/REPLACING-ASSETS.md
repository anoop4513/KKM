# Replacing the concept assets

The current gold K and optical sculpture are provisional, as authorized by the user. They are not presented as the client's approved logo or original campaign footage.

| Item | Location | Replacement guidance |
| --- | --- | --- |
| Header and footer K | `src/Website.tsx`, `Brand` component | Replace the provisional SVG with the approved optimized mark; retain the accessible home link and brand name. |
| Favicon | `public/favicon.svg` | Export a small approved icon variant. |
| Rear gold loop | `public/assets/lens/lens-back.webp` | Preserve transparent openings and edge padding. This is the slow parallax layer. |
| Main gold aperture | `public/assets/lens/lens-main.webp` | Preserve transparency and the optical centre. It is the middle parallax layer and rotates with scroll. |
| Foreground ribbon | `public/assets/lens/lens-ribbon.webp` | Preserve alpha and a broad diagonal composition. This is the fastest parallax layer. |
| Original generated plates | `.impeccable/assets/originals/` | Full PNG originals are retained. Exact built-in image-generation prompts live in `.impeccable/build/lens-*.prompt.txt`. |
| Project title treatments | `src/Website.tsx`, `Work` component | Replace with approved campaign stills/thumbnails; preserve existing published-project links and accurate captions. |
| Project and service content | `src/data.ts`, `src/content.ts` | Update only with approved descriptions and substantiated results. |

Use modern compressed images with explicit dimensions. Retest desktop and mobile placement after replacement, because a different object's proportions can change overlap. Real work thumbnails should describe the work; concept visuals should keep their concept label until replaced.

The source prompts and alternative composition concepts remain in `.impeccable/`. Generated source imagery was produced with the built-in image-generation tool. No third-party client results, testimonials or metrics were invented.

For WhatsApp, booking, analytics and the enquiry backend, use `.env.example` and `docs/INTEGRATIONS.md`. Do not place secrets in `VITE_` variables or commit populated environment files.
