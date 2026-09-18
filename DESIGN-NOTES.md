# Katha Kantam Media redesign

Run `npm ci`, then `npm run dev` for local development. `npm run build` creates the deployable `dist` directory.

Design: warm ivory #F3F1E9, ink #1B1D19, electric lime #D4F344. Manrope headings and DM Sans body text. Inspired by the bold typography and work-led presentation of https://koto.com/; implementation and project artwork are original.

Hero artwork created using Google Flow in project https://flow.google.com/project/b0042064-d6b1-4c03-93c5-f32dc0a26efc and downloaded locally as public/assets/images/hero-film.jpeg. Portfolio artwork is illustrative; original project links are preserved in src/data.ts.

Original page and styles are saved in .design-backup. The source data is separated from the layout. Features: project category filters, native service accordions, mobile menu with Escape dismissal, scroll reveals, scroll-driven emblem rotation, reduced-motion handling, and a motion toggle.

Validation: production build, TypeScript and ESLint; browser checks at desktop, 768px, 390px and 320px; project filters, image loading, service expansion, mobile menu, and motion toggle.

Deployment is not performed. Social share image uses a relative URL; set an absolute production image URL when a deployment domain is selected.

Hero update: isolated HeroArtwork component adds CSS perspective tilt, gentle 12-second depth animation and pointer-following light. Pauses outside the viewport; existing Motion toggle and prefers-reduced-motion disable the effect. No new dependencies or changes to other sections.

Scroll story update: same Google Flow ribbon artwork, now controlled by scroll progress in a sticky hero. Three chapters explain story, craft, and impact. Scroll backward to reverse; skip link goes to selected work. Motion off and system reduced motion display the chapter text statically. Original design saved in the sibling before-scroll-story ZIP; no new generated media or credits used. Timeline transitions and bounds validated, with production build, TypeScript, and ESLint passing.

Generated reel sequence: original closed loop plus three distinct Google Flow images (peeling ends, open curl, fully-unrolled wave), saved locally. Scroll controls image dissolves through reelLayers() in heroStory.ts. Physical pose changes now come from different generated images; minor depth transforms are secondary. Source Flow assets: ee097868-8752-4b06-9589-0361f01feb9f (peeling), original image edit history fb280683-16bb-4452-ab55-6ecbe0041a46 (open curl), b4bc5e84-9430-4187-94ad-cbea27a57e20 (wave). Browser confirmed all frames load and reverse scrolling changes visible pose.
