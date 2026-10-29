import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const outputDirectory = resolve(root, 'dist');
const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
const { agency, pages, render } = await import(pathToFileURL(resolve(root, '.prerender', 'entry-server.js')).href);

if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) {
  throw new Error('The built HTML is missing its prerender placeholders.');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function readOrigin(value, name, allowHost = false) {
  if (!value) return null;
  const candidate = allowHost && !/^https?:\/\//i.test(value) ? `https://${value}` : value;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(`${name} must contain a valid HTTP or HTTPS origin.`);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error(`${name} must contain an HTTP or HTTPS origin without credentials, paths, queries or fragments.`);
  }
  return url.origin;
}

const siteOrigin = readOrigin(process.env.SITE_URL, 'SITE_URL');
const deploymentOrigin = readOrigin(process.env.VERCEL_URL, 'VERCEL_URL', true);
const production = process.env.VERCEL_ENV === 'production';
const origin = production ? siteOrigin ?? deploymentOrigin : deploymentOrigin ?? siteOrigin;
const indexable = production && Boolean(siteOrigin);

function seoHead(page, isNotFound = false) {
  const url = origin ? `${origin}${page.path}` : null;
  const image = `${origin ?? ''}/assets/lens/lens-main.webp`;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: agency.name,
    email: agency.email,
    description: agency.positioning,
    ...(origin ? { url: origin } : {}),
    areaServed: ['India', ...agency.internationalMarkets].map((name) => ({ '@type': 'Country', name })),
    sameAs: [agency.instagram],
  };
  const jsonLd = JSON.stringify(organization).replace(/</g, '\\u003c');
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="${indexable && !isNotFound ? 'index, follow' : 'noindex, nofollow'}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeHtml(agency.name)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta property="og:image:alt" content="A gold sculptural aperture, a creative concept for Katha Kantam Media" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(url && !isNotFound ? [`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`] : []),
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
}

async function writePage(page, isNotFound = false) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(page.path)) {
    throw new Error(`Unsupported route path: ${page.path}`);
  }
  const rendered = render(page.path);
  const html = template
    .replace('<!--seo-head-->', () => seoHead(page, isNotFound))
    .replace('<!--app-html-->', () => rendered);
  const directory = isNotFound ? outputDirectory : resolve(outputDirectory, `.${page.path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, isNotFound ? '404.html' : 'index.html'), html, 'utf8');
}

const uniquePaths = new Set();
for (const page of pages) {
  if (uniquePaths.has(page.path)) throw new Error(`Duplicate page route: ${page.path}`);
  uniquePaths.add(page.path);
  await writePage(page);
}

await writePage({
  path: '/page-not-found/',
  title: 'Page Not Found | Katha Kantam Media',
  description: 'This page is unavailable. Explore Katha Kantam Media services or return to the homepage.',
}, true);

const robots = ['User-agent: *', indexable ? 'Allow: /' : 'Disallow: /'];
if (origin) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${escapeHtml(`${origin}${page.path}`)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
  robots.push(`Sitemap: ${origin}/sitemap.xml`);
}
await writeFile(resolve(outputDirectory, 'robots.txt'), `${robots.join('\n')}\n`, 'utf8');

console.log(`Prerendered ${pages.length} routes and 404.html. Indexing ${indexable ? 'enabled for the configured production origin' : 'disabled for this preview build'}.`);
console.log(origin ? `Canonical and sitemap origin: ${origin}` : 'No origin configured; canonical URLs and sitemap omitted.');
