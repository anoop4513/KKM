import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const output = resolve(root, 'dist');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
let html = await readFile(resolve(output, 'index.html'), 'utf8');
const production = process.env.VERCEL_ENV === 'production';
const candidate = production ? process.env.SITE_URL : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.SITE_URL);
let origin = '';
if (candidate) { const url = new URL(candidate); if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw Error('SITE_URL must be a clean origin'); origin = url.origin; }
const canIndex = production && Boolean(process.env.SITE_URL);
const metadata = { '@context':'https://schema.org', '@type':'ProfessionalService', name:'Katha Kantam Media', description:'Creative, digital marketing and business technology agency.', ...(origin ? {url:origin} : {}), areaServed:['Hindupur','Bengaluru','Hyderabad','United Arab Emirates','United Kingdom','United States','Canada','Australia'] };
const head = `${origin ? `<link rel="canonical" href="${origin}/"/><meta property="og:url" content="${origin}/"/>` : ''}<script type="application/ld+json">${JSON.stringify(metadata).replace(/</g,'\\u003c')}</script>`;
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`).replace('</head>',`${head}</head>`).replace('noindex,nofollow',canIndex ? 'index,follow' : 'noindex,nofollow');
await writeFile(resolve(output,'index.html'),html);
await writeFile(resolve(output,'robots.txt'),`User-agent: *\n${canIndex ? 'Allow: /' : 'Disallow: /'}\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
if(origin) await writeFile(resolve(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`);
console.log(`Prerendered homepage; ${canIndex ? 'indexing enabled' : 'preview indexing disabled'}.`);
