import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, ChartNoAxesCombined, Check, Code2, Globe2, Layers3, MoveUpRight, Plus, Sparkles, Workflow } from 'lucide-react';
import './Home.css';

const pillars = [
  { name: 'Create', line: 'Make people feel something.', copy: 'Give your business a story people can understand and remember.', scope: ['Brand identity', 'Films & reels', 'Campaign creative'] },
  { name: 'Market', line: 'Give good work an audience.', copy: 'Put the right message in front of the people who matter, with a clear next step.', scope: ['Social & search', 'Paid campaigns', 'Lead-generation journeys'] },
  { name: 'Automate', line: 'Make space for better work.', copy: 'Explore a better way to handle the tasks that repeat. We assess the workflow before proposing the technology.', scope: ['Workflow discovery', 'Lead routing', 'CRM consultation'], consultation: true },
  { name: 'Grow', line: 'Connect the next opportunity.', copy: 'Bring creative work, digital experience and useful measurement into the same conversation.', scope: ['Web experiences', 'Measurement planning', 'Ongoing collaboration'] },
];

const capabilities = [
  { title: 'Creative & Media Production', copy: 'Films, reels, ads and multilingual media. A clear idea, carried from the first script to the final frame.', icon: AudioLines, cta: 'Discuss a production brief' },
  { title: 'Branding & Creative Strategy', copy: 'Positioning, identity and content direction that give your business a consistent voice.', icon: Sparkles, cta: 'Discuss your brand' },
  { title: 'Digital Marketing & Growth', copy: 'Social, search and purposeful campaigns. Connect your message with a clear customer journey.', icon: MoveUpRight, cta: 'Discuss your growth brief' },
  { title: 'Websites & Digital Experiences', copy: 'Business websites and landing pages that make your offer, and the next action, clear.', icon: Code2, cta: 'Discuss a digital experience', note: 'Custom portals and web apps begin with technical discovery.' },
  { title: 'AI & Business Automation', copy: 'Assess chatbots, customer-response flows, lead routing and the everyday tasks worth simplifying.', icon: Workflow, cta: 'Book a Solutions Architecture Call', consultation: true },
  { title: 'CRM & Business Technology', copy: 'Define a useful sales pipeline, booking process or business system before choosing the software.', icon: Layers3, cta: 'Book a Solutions Architecture Call', consultation: true },
  { title: 'Data Analytics & Performance', copy: 'Plan measurement, lead tracking and reporting around the questions your business needs to answer.', icon: ChartNoAxesCombined, cta: 'Book a Solutions Architecture Call', consultation: true },
  { title: 'Global Creative & Localization', copy: 'White-label editing, remote production and localized versions for brand and agency teams.', icon: Globe2, cta: 'Discuss a global brief' },
];

const serviceSlugs = ['creative-media', 'branding-strategy', 'digital-growth', 'websites-experiences', 'ai-automation', 'crm-business-tech', 'analytics-performance', 'global-localization'];

const industries = [
  { title: 'Hospitals & Healthcare', copy: 'Clear service communication. Considered awareness campaigns. A simpler path to an enquiry.', detail: 'Content approvals · Local visibility · Appointment enquiries' },
  { title: 'Schools & Education', copy: 'Help families understand the school before the admissions conversation begins.', detail: 'School storytelling · Admissions content · Parent enquiries' },
  { title: 'Real Estate & Property', copy: 'Give buyers a consistent story and the information they need to take the next step.', detail: 'Project campaigns · Landing pages · Enquiry journeys' },
  { title: 'Founders & Personal Brands', copy: 'Bring your expertise, point of view and public presence into focus.', detail: 'Positioning · Content direction · Thought leadership' },
  { title: 'Salons, Retail & Local Business', copy: 'Be easier to discover, understand and contact in the neighbourhoods you serve.', detail: 'Local SEO · Hyperlocal campaigns · Booking journeys' },
  { title: 'Global Brands & Agencies', copy: 'Extend your creative production with a shared brief and a clearly defined working rhythm.', detail: 'White-label editing · Remote production · Localization' },
];

const scenarios = [
  { type: 'Education', title: 'A clearer admissions journey.', challenge: 'Families find isolated posts, but no clear explanation of the school or admissions process.', approach: 'Connect the school story, parent questions and admissions information in one journey.', deliverables: 'Messaging direction, a short-form content set, an admissions landing page and an enquiry form.', measure: 'Enquiry sources, completed forms and the admissions team’s assessment of relevance.', graphic: ['A school.', 'A story.', 'A next step.'], className: 'education' },
  { type: 'Property', title: 'One message. Every touchpoint.', challenge: 'A property launch tells a different story across advertisements, project information and enquiries.', approach: 'Build one communication direction and carry it through the campaign and landing page.', deliverables: 'Project messaging, campaign creative, a project landing page and a defined lead-capture flow.', measure: 'Landing-page actions, enquiry sources and the sales team’s feedback on enquiry quality.', graphic: ['THE', 'NEXT', 'ADDRESS.'], className: 'property' },
  { type: 'Agency', title: 'A production rhythm that fits.', challenge: 'An agency needs recurring short-form content, but scattered assets and feedback slow the edit.', approach: 'Define the source-file handoff, editing brief, version requirements and consolidated review.', deliverables: 'An agreed content batch, format versions, a review workflow and checked final exports.', measure: 'Brief completeness, review rounds and delivery against the agreed milestones.', graphic: ['BRIEF', 'MAKE', 'REVIEW'], className: 'agency' },
];

function WordReveal({ children }: { children: string }) {
  return <span className="home-word-reveal" data-home-reveal>{children.split(' ').map((word, index) => <span className="home-reveal-word" key={`${word}-${index}`}>{word}{' '}</span>)}</span>;
}

function useHomeMotion(root: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    const layers = Array.from(element.querySelectorAll<HTMLElement>('[data-home-parallax]'));
    const turns = Array.from(element.querySelectorAll<HTMLElement>('[data-home-turn]'));
    const reveals = Array.from(element.querySelectorAll<HTMLElement>('[data-home-reveal]'));
    const clamp = (number: number, min: number, max: number) => Math.min(max, Math.max(min, number));
    const paint = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const animated = !reduced.matches;
      element.classList.toggle('home-motion-ready', animated);
      for (const layer of layers) {
        const rect = layer.getBoundingClientRect();
        const depth = Number(layer.dataset.homeParallax ?? 0);
        const progress = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        layer.style.setProperty('--home-parallax-y', `${animated && finePointer.matches ? progress * depth : 0}px`);
      }
      for (const turn of turns) {
        const rect = turn.getBoundingClientRect();
        const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
        turn.style.setProperty('--home-turn', `${animated ? progress * Number(turn.dataset.homeTurn ?? 180) : 0}deg`);
      }
      for (const reveal of reveals) {
        const rect = reveal.getBoundingClientRect();
        const progress = clamp((viewport * .88 - rect.top) / (viewport * .42 + rect.height * .3), 0, 1);
        const words = reveal.querySelectorAll<HTMLElement>('.home-reveal-word');
        words.forEach((word, index) => {
          const local = clamp(progress * (words.length + 3) - index, 0, 1);
          word.style.setProperty('--home-word-opacity', String(animated ? .6 + local * .4 : 1));
        });
      }
    };
    const requestPaint = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
    window.addEventListener('scroll', requestPaint, { passive: true });
    window.addEventListener('resize', requestPaint);
    reduced.addEventListener('change', requestPaint);
    finePointer.addEventListener('change', requestPaint);
    requestPaint();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestPaint);
      window.removeEventListener('resize', requestPaint);
      reduced.removeEventListener('change', requestPaint);
      finePointer.removeEventListener('change', requestPaint);
    };
  }, [root]);
}

export default function Home({ proposal }: { proposal: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [workFilter, setWorkFilter] = useState('All approaches');
  useHomeMotion(root);
  const shownScenarios = scenarios.filter((scenario) => workFilter === 'All approaches' || scenario.type === workFilter);

  return <div className="home-page" ref={root}>
    <section className="home-hero home-wrap" aria-labelledby="home-headline">
      <h1 className="home-headline" id="home-headline" data-home-parallax="12"><span>Creative. Marketing.</span>{' '}<span>Technology.</span>{' '}<span>One Growth Partner.</span></h1>
      <div className="home-hero-bottom">
        <div className="home-hero-intro"><p>We help ambitious businesses build stronger brands, reach the right audiences and grow through creative storytelling, digital marketing, technology and smart automation.</p><div className="home-actions"><a className="home-button home-button-ink" href="#contact">Get a Proposal<ArrowUpRight size={19} aria-hidden="true" /></a><a className="home-text-link" href="#services">Explore Our Services<ArrowUpRight size={19} aria-hidden="true" /></a></div></div>
      </div>
      <div className="home-hero-art" data-home-parallax="-55" aria-hidden="true"><img src="/art/dispatch-panels.webp" alt="" width="1024" height="1024" {...{ fetchpriority: 'high' }} /><div className="home-art-labels"><span>CREATE</span><span>MARKET</span><span>AUTOMATE</span><span>GROW</span></div></div>
    </section>

    <section className="home-pillars home-wrap home-section" aria-labelledby="home-pillars-heading">
      <div className="home-pillar-intro"><h2 id="home-pillars-heading"><WordReveal>One partner. More possibilities.</WordReveal></h2><div className="home-pillar-aside"><p>A creative, digital growth and business technology agency helping ambitious businesses turn ideas into lasting impact, anywhere in the world.</p></div></div>
      <div className="home-pillar-stack">
        {pillars.map((pillar, index) => <details className={`home-pillar home-pillar-${pillar.name.toLowerCase()}`} open key={pillar.name} style={{ '--home-stack-index': index } as CSSProperties}>
          <summary><span className="home-pillar-title">{pillar.name}<span>.</span></span><span className="home-pillar-line">{pillar.line}</span><Plus className="home-pillar-plus" size={36} strokeWidth={1.4} aria-hidden="true" /></summary>
          <div className="home-pillar-content"><div className="home-pillar-copy"><p>{pillar.copy}</p>{pillar.consultation && <span className="home-consultation">Consultation-led</span>}<ul>{pillar.scope.map((scope) => <li key={scope}>{scope}</li>)}</ul><a className="home-text-link" href={pillar.name === 'Automate' ? '#contact' : '#services'}>{pillar.consultation ? 'Discuss the possibilities' : `Explore ${pillar.name.toLowerCase()}`}<ArrowUpRight size={19} aria-hidden="true" /></a></div></div>
        </details>)}
      </div>
    </section>

    <section id="services" className="home-services home-wrap home-section" aria-labelledby="home-services-heading">
      <div className="home-section-heading"><h2 id="home-services-heading">A full set.<br />Built around <em>you.</em></h2><p>Eight connected capabilities. One place to start. Tell us the challenge; we’ll shape the right combination of work.</p></div>
      <div className="home-capabilities">{capabilities.map((service, index) => <article className="home-capability" key={service.title}><service.icon className="home-capability-icon" size={30} strokeWidth={1.35} aria-hidden="true" /><h3>{service.title}</h3>{service.consultation && <span className="home-consultation">Consultation-led</span>}<p>{service.copy}</p>{service.note && <small>{service.note}</small>}<a className="home-capability-link" href="#contact" onClick={() => { window.dispatchEvent(new CustomEvent('kkm:choose-service', { detail: serviceSlugs[index] })); }}>{service.cta}<ArrowUpRight size={18} aria-hidden="true" /></a></article>)}</div>
      <p className="home-services-note">Advanced technology, CRM and analytics work begins with discovery. Feasibility, specialist support and delivery scope are confirmed before implementation.</p>
    </section>

    <section id="industries" className="home-industries home-section" aria-labelledby="home-industries-heading"><div className="home-wrap">
      <div className="home-section-heading"><h2 id="home-industries-heading">Your world.<br />Our full attention.</h2><p>Different audiences. Different decisions. We start by understanding the business behind the brief.</p></div>
      <div className="home-industry-grid">{industries.map((industry) => <article className="home-industry" key={industry.title}><h3>{industry.title}</h3><p>{industry.copy}</p><span>{industry.detail}</span><a href="#contact" className="home-industry-link" aria-label={`Discuss ${industry.title.toLowerCase()}`}><ArrowUpRight size={26} strokeWidth={1.4} aria-hidden="true" /></a></article>)}</div>
    </div></section>

    <section id="work" className="home-work home-wrap home-section" aria-labelledby="home-work-heading">
      <div className="home-section-heading"><h2 id="home-work-heading">See how it<br />could come together.</h2><div><p>Three example briefs. A look at how creative, marketing and technology can support the same goal.</p><p className="home-work-disclosure">Illustrative approaches only. These are not client projects, delivered work or verified outcomes.</p></div></div>
      <div className="home-work-filters" role="group" aria-label="Filter illustrative approaches">{['All approaches', 'Education', 'Property', 'Agency'].map((filter) => <button type="button" key={filter} aria-pressed={workFilter === filter} onClick={() => setWorkFilter(filter)}>{filter}<span>{filter === 'All approaches' ? '3' : '1'}</span></button>)}</div>
      <p className="home-sr-only" role="status">{shownScenarios.length} illustrative {shownScenarios.length === 1 ? 'approach' : 'approaches'} shown.</p>
      <div className="home-scenarios">{shownScenarios.map((scenario) => <article className={`home-scenario home-scenario-${scenario.className}`} key={scenario.type}>
        <div className="home-scenario-art" aria-hidden="true"><span className="home-scenario-art-label">AN ILLUSTRATIVE APPROACH</span><div>{scenario.graphic.map((line) => <span key={line}>{line}</span>)}</div><ArrowDownRight size={80} strokeWidth={1.1} /></div>
        <div className="home-scenario-copy"><span className="home-scenario-category">{scenario.type} / Example brief</span><h3>{scenario.title}</h3><p className="home-scenario-label">Not a real client project. No outcome is claimed.</p><dl><div><dt>Example challenge</dt><dd>{scenario.challenge}</dd></div><div><dt>Proposed approach</dt><dd>{scenario.approach}</dd></div></dl><details className="home-scenario-details"><summary>Explore the proposed scope<Plus size={18} aria-hidden="true" /></summary><dl><div><dt>Example deliverables</dt><dd>{scenario.deliverables}</dd></div><div><dt>What we would measure</dt><dd>{scenario.measure}</dd></div></dl></details></div>
      </article>)}</div>
    </section>

    <section id="global" className="home-global home-section" aria-labelledby="home-global-heading"><div className="home-wrap">
      <div className="home-global-heading"><h2 id="home-global-heading"><span data-home-parallax="24">Local roots.</span><span data-home-parallax="8">Global <em>outlook.</em></span></h2><div className="home-global-orbit" aria-hidden="true" data-home-turn="-130"><svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="87" /><ellipse cx="100" cy="100" rx="43" ry="87" /><path d="M13 100h174M26 56h148M26 144h148M100 13v174" /></svg><ArrowUpRight size={54} strokeWidth={1.2} /></div></div>
      <div className="home-global-body"><p>India-rooted. Built for collaboration. For regional businesses and international teams, we connect the brief, the creative and the way the work gets done.</p><div><h3>Markets We Serve</h3><dl className="home-markets"><div><dt>India</dt><dd>Hindupur, Bengaluru, Hyderabad<br />and surrounding regions.</dd></div><div><dt>International</dt><dd>UAE, UK, USA, Canada<br />and Australia.</dd></div></dl><small>Service markets, not physical office locations.</small></div></div>
      <div className="home-partnership"><div><h3>Your creative team.<br />A wider production circle.</h3><p>White-label video editing, short-form content, motion graphics and localization coordination. A project or an ongoing production scope, shaped around your team.</p><a href="#contact" className="home-button home-button-paper">Discuss a Global Partnership<ArrowUpRight size={19} aria-hidden="true" /></a></div><ul><li><Check size={18} aria-hidden="true" /><span>One shared brief and clear asset handoffs</span></li><li><Check size={18} aria-hidden="true" /><span>Agreed review rounds and feedback owners</span></li><li><Check size={18} aria-hidden="true" /><span>Format, brand and localization quality checks</span></li><li><Check size={18} aria-hidden="true" /><span>Turnaround, revisions and capacity agreed per brief</span></li></ul></div>
    </div></section>

    <section id="contact" className="home-contact home-wrap home-section" aria-labelledby="home-contact-heading"><div className="home-contact-intro"><h2 id="home-contact-heading">A good next step<br />starts with<br /><span>“let’s talk.”</span></h2><p>Tell us about the business, the challenge and the work you have in mind. We’ll use your brief to shape the next conversation.</p><div className="home-contact-checks"><span><Check size={17} aria-hidden="true" />A brief, not a commitment</span><span><Check size={17} aria-hidden="true" />A scope shaped around your needs</span><span><Check size={17} aria-hidden="true" />Clear next steps before work begins</span></div><ArrowDownRight className="home-contact-arrow" size={100} strokeWidth={1.15} aria-hidden="true" /></div><div className="home-proposal">{proposal}</div></section>
    <div className="home-closing home-wrap" aria-hidden="true"><span>CREATE.</span><span>MARKET.</span><span>AUTOMATE.</span><span>GROW.</span><ArrowRight strokeWidth={1.4} /></div>
  </div>;
}
