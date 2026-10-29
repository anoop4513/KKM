import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Instagram, Menu, Minus, Plus, X } from 'lucide-react';
import { agency, capabilities, industries, normalizePath } from './content';
import { projects } from './data';
import DetailPage from './DetailPage';
import ProposalForm from './ProposalForm';
import StudioEyes from './StudioEyes';
import { useMotion } from './motion';
import { analyticsConfigured, bookingUrl, setAnalyticsConsent, useConversionTracking, whatsAppUrl } from './integrations';

const pillars = [
  { title: 'Create', copy: 'Give your ambition a voice. Stories, films and brand identities made to mean something.', line: 'A story worth paying attention to.', description: 'From a first idea to the final frame, we bring your brand into focus through strategy, design and thoughtful production.', links: ['Brand strategy', 'Films & reels', 'Visual identity'], art: 'main' },
  { title: 'Market', copy: 'Meet the right people. Turn good creative into conversations that move your business.', line: 'Good work deserves to be seen.', description: 'Connect your story to the right audience through purposeful content, social media, search and carefully scoped campaigns.', links: ['Social media', 'Campaign creative', 'Digital growth'], art: 'back' },
  { title: 'Automate', copy: 'Make room for better work. Explore practical technology around the way your business runs.', line: 'Less friction. More possibility.', description: 'Let’s map the handoffs, enquiries and everyday processes that could work better. We confirm feasibility and the right specialists before committing to a build.', links: ['Workflow discovery', 'Web experiences', 'CRM consultation'], art: 'ribbon' },
  { title: 'Grow', copy: 'Build what comes next. Learn from the work, refine the approach and move forward with clarity.', line: 'See the bigger picture.', description: 'Bring creative, marketing and business systems into one conversation. Define useful signals, review what happens and choose the next step with purpose.', links: ['Measurement planning', 'Ongoing collaboration', 'Business clarity'], art: 'main' },
];
const workGroups = ['Education', 'Education', 'Social & video', 'Social & video', 'Campaigns', 'Campaigns'];
const workFilters = ['All work', 'Education', 'Social & video', 'Campaigns'];
const industryNames = ['Hospitals & healthcare', 'Schools & education', 'Real estate & property', 'Founders & personal brands', 'Salons, retail & local business', 'Global brands & agencies'];

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`brand${footer ? ' brand-footer' : ''}`} href="/" aria-label="Katha Kantam Media home">
    <svg className="brand-k" viewBox="0 0 45 48" aria-hidden="true"><path d="M3 3h12v40H3zM16 23 33 3h10L25 24l20 21H30L16 30z" fill="currentColor" /></svg>
    <span>KATHA KANTAM<small>MEDIA</small></span>
  </a>;
}

function OptionalIntegrations() {
  const [consentMessage, setConsentMessage] = useState('Optional usage analytics stay off until you allow them.');
  if (!whatsAppUrl && !bookingUrl && !analyticsConfigured) return null;
  return <div className="optional-integrations wrap">
    {whatsAppUrl && <a className="inline-link" data-conversion="whatsapp_click" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a>}
    {bookingUrl && <a className="inline-link" data-conversion="booking_click" href={bookingUrl} target="_blank" rel="noopener noreferrer">Schedule a discovery call<ArrowUpRight size={17} aria-hidden="true" /></a>}
    {analyticsConfigured && <details><summary>Analytics preferences</summary><p role="status">{consentMessage}</p><button type="button" onClick={() => { setAnalyticsConsent(true); setConsentMessage('Anonymous usage analytics are allowed.'); }}>Allow analytics</button><button type="button" onClick={() => { setAnalyticsConsent(false); setConsentMessage('Usage analytics are off.'); }}>Keep analytics off</button></details>}
  </div>;
}

function Hero() {
  return <section className="hero-shell" aria-labelledby="hero-heading" data-motion-anchor>
    <div className="hero wrap">
      <div className="hero-copy">
        <h1 id="hero-heading"><span>Creative.</span><span>Marketing.</span><span>Technology.</span><em>One Growth Partner.</em></h1>
        <p>We help ambitious businesses build stronger brands, reach the right audiences and grow through creative storytelling, digital marketing, technology and smart automation.</p>
        <div className="hero-actions"><a className="button button-dark" href="/contact/">Get a Proposal<ArrowUpRight size={20} aria-hidden="true" /></a><a className="button button-light" href="#services">Explore Our Services<ArrowRight size={20} aria-hidden="true" /></a></div>
      </div>
      <div className="hero-art" aria-label="Concept artwork: layered metallic gold aperture and ribbon">
        <div className="lens-floor" aria-hidden="true" />
        <div className="lens-layer lens-back" data-parallax="-80"><img src="/assets/lens/lens-back.webp" width="1456" height="1088" alt="" /></div>
        <div className="lens-layer lens-main" data-parallax="-170"><div className="lens-turn" data-rotate="32"><img src="/assets/lens/lens-main.webp" width="1280" height="1280" alt="" {...{ fetchpriority: 'high' }} /></div></div>
        <div className="lens-layer lens-ribbon" data-parallax="-280"><img src="/assets/lens/lens-ribbon.webp" width="1536" height="1024" alt="" /></div>
        <span className="art-caption">Concept artwork</span>
      </div>
    </div>
    <div className="pillar-band wrap">{pillars.map(pillar => <a href={`#${pillar.title.toLowerCase()}`} key={pillar.title}><h2>{pillar.title}</h2><span className="gold-rule" /><p>{pillar.copy}</p><ArrowDown size={16} aria-hidden="true" /></a>)}</div>
  </section>;
}

function PillarStack() {
  return <div className="chapter-stack wrap">{pillars.map((pillar, index) => <article id={pillar.title.toLowerCase()} className={`chapter chapter-${index}`} key={pillar.title} style={{ '--chapter-index': index } as React.CSSProperties}>
    <div className="chapter-content"><h2>{pillar.title}<span>.</span></h2><h3>{pillar.line}</h3><p>{pillar.description}</p><div className="chapter-topics">{pillar.links.map(link => <span key={link}>{link}</span>)}</div><a className="inline-link" href={index === 2 ? '/services/ai-business-automation/' : index === 3 ? '/contact/' : capabilities[index === 1 ? 2 : 0].path}>{index === 2 ? 'Explore the possibilities' : index === 3 ? 'Plan your next chapter' : `Explore ${pillar.title.toLowerCase()}`}<ArrowUpRight size={20} aria-hidden="true" /></a></div>
    <div className={`chapter-art chapter-art-${pillar.art}`} aria-hidden="true" data-motion-anchor><div data-rotate={index % 2 ? '-45' : '45'}><img src={`/assets/lens/lens-${pillar.art}.webp`} alt="" width="1280" height="1280" loading="lazy" /></div></div>
  </article>)}</div>;
}

function Work({ filter, setFilter }: { filter: string; setFilter: (value: string) => void }) {
  const selected = projects.map((project, index) => ({ project, index })).filter(({ index }) => filter === 'All work' || filter === workGroups[index]);
  return <section id="work" className="work-section wrap section-space">
    <div className="section-heading"><h2>Different stories.<br /><em>The same care.</em></h2><div><p>A few of the brands, channels and campaigns in our existing portfolio. Explore the published work behind each story.</p><a className="inline-link" href="/work/">View all work<ArrowUpRight size={18} aria-hidden="true" /></a></div></div>
    <div className="work-filters" role="group" aria-label="Filter published work">{workFilters.map(item => <button key={item} aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <p className="sr-only" role="status">{selected.length} projects shown</p>
    <div className="selected-work">{selected.map(({ project, index }, position) => <article className={`portfolio-item${position < 2 ? ' portfolio-featured' : ''}`} key={project.title}>
      {position < 2 && <div className={`project-cover project-cover-${index}`}>
        {index === 1 ? <img src="/assets/images/WhatsApp_Image_2026-06-07_at_9.47.35_AM_(2).jpeg" alt="First Steps Play School logo from the existing portfolio" width="360" height="360" loading="lazy" /> : <><span className="project-cover-title">{project.title}</span><span className="project-cover-line" aria-hidden="true" /></>}
        <span className="cover-caption">{index === 1 ? 'Existing client artwork' : 'Project title treatment · preview artwork'}</span>
        <a href={project.links?.[0]?.url ?? '/work/'} target="_blank" rel="noopener noreferrer" className="project-open" aria-label={`View published work for ${project.title} (opens in new tab)`}><ArrowUpRight aria-hidden="true" /></a>
      </div>}
      <div className="project-text"><p className="project-category">{project.category}</p><h3>{project.title}</h3><p>{project.description}</p><a className="inline-link" href={project.links?.[0]?.url ?? '/work/'} target="_blank" rel="noopener noreferrer">View published work<ArrowUpRight size={17} aria-hidden="true" /></a></div>
    </article>)}</div>
  </section>;
}

function Home({ motion, filter, setFilter }: { motion: boolean; filter: string; setFilter: (value: string) => void }) {
  const statement = 'A compelling story. A clearer strategy. The right technology. More possibility for your business.';
  return <>
    <Hero />
    <section className="positioning wrap section-space"><h2 data-word-reveal>{statement.split(' ').map((word, index) => <span className="word" key={`${word}-${index}`}>{word}{' '}</span>)}</h2><div className="positioning-bottom"><span className="positioning-signature">Creative thinking.<br />Connected delivery.</span><p>We’re Katha Kantam Media. An India-based creative partner bringing storytelling, marketing and practical business technology into the same frame.</p><a className="inline-link" href="/about/">Get to know us<ArrowUpRight size={18} aria-hidden="true" /></a></div></section>
    <PillarStack />
    <Work filter={filter} setFilter={setFilter} />
    <section id="services" className="services-section wrap section-space"><div className="section-heading"><h2>A wider lens.<br /><em>One connected team.</em></h2><p>Start with what your business needs. We’ll shape the right combination of creative, marketing and technology around it.</p></div><div className="capability-list">{capabilities.map((service, index) => <details key={service.slug} open={index === 0 ? true : undefined}><summary><h3>{service.shortTitle}</h3><span className="capability-pillar">{service.pillar}</span><Plus className="detail-plus" size={22} aria-hidden="true" /><Minus className="detail-minus" size={22} aria-hidden="true" /></summary><div className="capability-body"><p>{service.summary}{service.consultationLed && <small>Consultation-led. Scope and feasibility confirmed before delivery.</small>}</p><a className="inline-link" href={service.path}>Explore this capability<ArrowUpRight size={18} aria-hidden="true" /></a></div></details>)}</div></section>
    <section className="industry-section section-space"><div className="wrap industry-layout"><div><h2>Your world.<br /><em>Our full attention.</em></h2><p>Different industries ask different questions. We start by understanding yours.</p><a className="inline-link" href="/industries/">Explore our approach<ArrowUpRight size={18} aria-hidden="true" /></a></div><div className="industry-links">{industries.map((industry, index) => <a key={industry.slug} href={industry.path}><span>{industryNames[index]}</span><ArrowUpRight size={22} aria-hidden="true" /></a>)}</div></div></section>
    <section className="global-section wrap section-space"><div className="global-title"><h2>Rooted in India.<br /><em>Open to the world.</em></h2><a className="button button-dark" href="/global-partnerships/">Explore Global Partnerships<ArrowUpRight size={19} aria-hidden="true" /></a></div><div className="global-body"><div className="global-orbit" aria-hidden="true" data-motion-anchor><img data-rotate="90" src="/assets/lens/lens-back.webp" width="1456" height="1088" loading="lazy" alt="" /></div><div><p>Creative production can cross borders without losing the details. Let’s discuss remote editing, white-label production and localized content for your next brief.</p><p>Project-based work or an ongoing partnership. A clear scope, shared references and agreed review points.</p><div className="market-labels"><span>India</span><span>UAE</span><span>UK</span><span>USA</span><span>Canada</span><span>Australia</span></div><small>Markets we’re looking to serve through remote collaboration.</small></div></div></section>
    <section className="studio-section wrap"><div><h2>Curious about<br /><em>what comes next?</em></h2><p>So are we. Tell us what you’re building, what’s getting in the way, and where you want to go.</p><a className="button button-dark" href="/contact/">Let’s talk about it<ArrowUpRight size={20} aria-hidden="true" /></a></div><div className="studio-character"><StudioEyes motion={motion} /><p>A fresh pair of eyes on your next idea.</p></div></section>
  </>;
}

export default function Website({ initialPath = '/' }: { initialPath?: string }) {
  const path = normalizePath(initialPath);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motion, setMotion] = useState(false);
  const [filter, setFilter] = useState('All work');
  const menuButton = useRef<HTMLButtonElement>(null);
  useMotion(motion, `${path}:${filter}`);
  useConversionTracking();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      let saved: string | null = null;
      try { saved = window.localStorage.getItem('kkm-motion'); } catch { /* Storage is optional. */ }
      setMotion(!preference.matches && saved !== 'off');
    };
    sync(); preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  const toggleMotion = () => { const next = !motion; setMotion(next); try { window.localStorage.setItem('kkm-motion', next ? 'on' : 'off'); } catch { /* Motion choice works without persistence. */ } };
  const nav = [['/work/', 'Work'], ['/services/', 'Services'], ['/about/', 'About'], ['/global-partnerships/', 'Global']];
  return <div className={`website ${motion ? 'motion-on' : 'motion-off'}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header wrap"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([href, label]) => <a href={href} key={href} aria-current={path.startsWith(href) ? 'page' : undefined}>{label}</a>)}</nav><a href="/contact/" className="button button-dark header-proposal">Get a Proposal<ArrowRight size={20} aria-hidden="true" /></a><button ref={menuButton} className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>{menuOpen && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">{[...nav, ['/industries/', 'Industries'], ['/contact/', 'Get a Proposal']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav>}</header>
    <main id="main" tabIndex={-1}>{path === '/' ? <Home motion={motion} filter={filter} setFilter={setFilter} /> : path === '/contact/' ? <div className="contact-page wrap"><div className="contact-intro"><h1>A good next chapter<br />starts with <em>a conversation.</em></h1><p>Tell us a little about your business and what you have in mind. We’ll use your brief to understand the right next step.</p><a className="inline-link" href={`mailto:${agency.email}`}>{agency.email}<ArrowUpRight size={18} aria-hidden="true" /></a><div className="contact-checks"><span><Check size={17} /> A brief, not a commitment</span><span><Check size={17} /> A scope shaped around your needs</span><span><Check size={17} /> Clear next steps before work begins</span></div></div><ProposalForm /></div> : <DetailPage path={path} />}</main>
    <footer className="site-footer"><div className="wrap"><div className="footer-main"><Brand footer /><div><h2>Let’s bring your<br />next idea <em>into focus.</em></h2><a className="inline-link" href="/contact/">Start a conversation<ArrowUpRight size={22} aria-hidden="true" /></a></div><div className="footer-contact"><a href={`mailto:${agency.email}`}>{agency.email}</a><a href={agency.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17} aria-hidden="true" /> Instagram<ArrowUpRight size={14} aria-hidden="true" /></a><span>India-based. Open to remote collaboration.</span></div></div><div className="footer-bottom"><span>© 2026 Katha Kantam Media</span><a href="/privacy/">Privacy</a><button onClick={toggleMotion} aria-pressed={motion}>Motion {motion ? 'on' : 'off'}<span className={`motion-switch ${motion ? 'is-on' : ''}`} aria-hidden="true" /></button><a href="#main" className="back-to-top">Back to top<ArrowUpRight size={14} aria-hidden="true" /></a></div></div></footer>
    <OptionalIntegrations />
    {path !== '/contact/' && <a className="mobile-proposal" href="/contact/">Get a Proposal<ArrowUpRight size={18} aria-hidden="true" /></a>}
  </div>;
}
