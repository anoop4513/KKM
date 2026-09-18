import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, X, Plus, Instagram } from 'lucide-react';
import { projects, services, clientLogos } from './data';
import HeroArtwork from './HeroArtwork';
// Asset base keeps image URLs working when deployed under a subpath.
const base = import.meta.env.BASE_URL;
const filters = ['All work', 'Education', 'Social & video', 'Campaigns'];
const groups = ['Education', 'Education', 'Social & video', 'Social & video', 'Campaigns', 'Campaigns'];
const artwork = ['A brighter\ntomorrow.', 'Small steps.\nBig stories.', 'Break the\nalgorithm.', 'A different\nperspective.', 'A place\nto belong.', 'Stories for\nthe greater good.'];
// Banner-theme descriptions: a sentence on each card's visual theme, not the client.
const descriptions = ['A rising arc sweeps across deep green — momentum you can feel, growth you can see. Bold and open, it carries the optimism of new beginnings and steady progress.', 'Soft shapes in warm pink hold small, honest moments — gently told, easily remembered. Playful curves keep the feeling light, warm, and full of care.', 'Electric lines cut through the dark — a grid for ideas that refuse to sit still. Sharp, modern geometry for work that breaks the pattern.', 'Layered rings ripple outward in cool blue — one perspective opening into many. Calm, concentric circles suggest focus, depth, and a wider view.', 'A sun-warmed arch opens like a doorway — an invitation to step inside the story. Earthy tones and a classic arch feel welcoming, grounded, and built to last.', 'A tilted square leans toward what’s next — familiar stories, seen from a new angle. A fresh slant on soft green keeps things purposeful yet approachable.'];
const themes = ['A story of growth — every step\nforward, one arc at a time.', 'Small moments,\ntold with care.', 'Bright lines after dark —\nwhere bold ideas surface.', 'Rings on rings —\nseeing the wider picture.', 'An open arch —\nwalk right in.', 'A fresh angle —\nstories that do good.'];
const nav = [['work', 'Our work'], ['about', 'The studio'], ['services', 'What we do']];
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All work');
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setMotion(!query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    root.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filter]);
  useEffect(() => {
    if (!motion) { root.current?.style.setProperty('--turn', '0deg'); return; }
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => root.current?.style.setProperty('--turn', `${window.scrollY * .035}deg`)); };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, [motion]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);
  const close = () => setMenuOpen(false);
  const shown = projects.filter((_, index) => filter === 'All work' || filter === groups[index]).length;
  return <div ref={root} className={motion ? 'site motion-on' : 'site motion-off'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="wordmark" href="#home" aria-label="Katha Kantam Media home" onClick={close}><span className="brand-symbol" aria-hidden="true">k<span>↗</span></span><span>Katha Kantam<small>MEDIA & STORIES</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([id,label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={17}/></a>
      <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{[...nav,['contact','Let’s talk']].map(([id,label]) => <a key={id} onClick={close} href={`#${id}`}>{label}<ArrowUpRight/></a>)}</nav>}
    </header>
    <main id="main">
      <section id="home" className="hero wrap">
        <div className="eyebrow hero-eyebrow"><span className="status-dot"/> INDEPENDENT CREATIVE CONTENT STUDIO <span className="hero-location">HINDUPUR, INDIA ↗</span></div>
        <h1>Good stories.<br/><span>Lasting impact.</span><span className="hero-star" aria-hidden="true">✳</span></h1>
        <div className="hero-bottom"><p>We turn what makes you different into<br/> stories people feel. And remember.</p><a className="pill dark" href="#work">Explore our work <ArrowDown size={18}/></a><span className="hero-note">STRATEGY. FILM. SOCIAL.<br/>A LITTLE DIFFERENT. BY DESIGN.</span></div>
        <HeroArtwork motion={motion}/>
      </section>
      <section className="clients wrap" aria-label="Clients"><p className="eyebrow">GOOD COMPANY.<br/>GREAT COLLABORATIONS.</p><div className="client-list"><div className="client-track">{[0, 1].map(copy => <div className="client-group" key={copy} aria-hidden={copy === 1}>{clientLogos.map(client => <div className="client-logo" key={copy === 0 ? client.name : `${client.name}-copy`}><img loading="lazy" src={`${base}assets/images/${client.file}`} alt={client.name}/></div>)}</div>)}</div></div></section>
      <section id="work" className="work wrap section-space">
        <div className="section-heading reveal"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Different brands.<br/>Same obsession.</h2></div><p>From the first spark to the final frame.<br/>A few stories we’ve helped bring to life.</p></div>
        <div className="filters" aria-label="Filter projects">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === 'All work' && <sup>{String(projects.length).padStart(2, '0')}</sup>}</button>)}</div>
        <p className="sr-only" role="status">{shown} projects shown</p>
        <div className="projects">{projects.map((project, index) => {
          if (filter !== 'All work' && filter !== groups[index]) return null;
          const artInner = <><div className="project-shape" aria-hidden="true"/><span className="art-title">{artwork[index]}</span><span className="art-signature">KATHA KANTAM MEDIA</span><span className="project-arrow"><ArrowUpRight/></span></>;
          return <article className="project reveal" key={project.title}>
          <div className={`project-art project-art-${index}`}>{artInner}</div>
          <p className="project-theme">{themes[index]}</p><p className="project-theme-sub">{descriptions[index]}</p>
        </article>;})}</div>
      </section>
      <section id="about" className="about section-space"><div className="wrap about-grid"><div><p className="eyebrow">02 / THE STUDIO</p><div className="about-emblem" aria-hidden="true">✳</div><span className="eyebrow">LOCAL ROOTS. LIMITLESS PERSPECTIVE.</span></div><div className="reveal"><h2>Every brand has a story.<br/><span>Let’s make yours<br/>impossible to ignore.</span></h2><p>We’re Katha Kantam Media, a creative content studio in Hindupur. We bring cinematic craft and clear strategy together to help ambitious brands connect with the people who matter.</p><p>Schools. Creators. Real estate. Community campaigns. Different worlds, one belief: the best content makes you feel something.</p><a className="text-link" href="#contact">Meet your next creative partner <ArrowUpRight size={20}/></a></div></div></section>
      <section id="services" className="services wrap section-space"><div className="section-heading reveal"><div><p className="eyebrow">03 / WHAT WE DO</p><h2>Big picture thinking.<br/>Frame-by-frame craft.</h2></div><p>One creative partner.<br/>From idea to audience.</p></div><div className="service-list">{services.map((service,index) => <details className="service" key={service.title} open={index === 0 ? true : undefined}><summary><span className="service-number">0{index + 1}</span><h3>{service.title}</h3><Plus className="service-plus"/></summary><div className="service-body"><service.icon size={28}/><p>{service.description}</p><a href="#contact" aria-label={`Discuss ${service.title}`}>Let’s make it happen <ArrowUpRight size={17}/></a></div></details>)}</div></section>
      <section className="process wrap section-space"><p className="eyebrow">THE WAY WE WORK</p><div className="process-grid">{[['01','Find the story','We listen, ask questions, and find what makes your brand worth paying attention to.'],['02','Make it real','We shape the idea, build the narrative, and bring it to life with thoughtful production.'],['03','Put it out there','We help your content reach the right people, then learn what resonates.']].map(([n,title,copy]) => <div className="reveal" key={n}><span>{n} —</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
      <section id="contact" className="contact"><div className="wrap"><div className="contact-top"><p className="eyebrow"><span className="status-dot"/> YOUR NEXT CHAPTER STARTS HERE</p><span>HINDUPUR · WORKING ACROSS INDIA</span></div><a className="contact-title" href="mailto:kathakaantam@gmail.com">Let’s make<br/>a little noise.<ArrowUpRight aria-hidden="true"/></a><div className="contact-bottom"><a className="pill dark" href="mailto:kathakaantam@gmail.com">Tell us your story <ArrowUpRight size={18}/></a><a className="email" href="mailto:kathakaantam@gmail.com">kathakaantam@gmail.com</a><a className="instagram" href="https://www.instagram.com/kathakanthammedia?igsh=MXNmMmVmaXF5NDA4NQ==" target="_blank" rel="noopener noreferrer"><Instagram size={18}/> Instagram <ArrowUpRight size={16}/></a></div></div></section>
    </main>
    <footer className="wrap footer"><a className="footer-brand" href="#home">Katha Kantam Media<span>Stories that create impact.</span></a><span>© {new Date().getFullYear()} Katha Kantam Media</span><button className="motion-toggle" aria-pressed={motion} onClick={() => setMotion(!motion)}>Motion {motion ? 'on' : 'off'}</button><span>Made in Hindupur</span></footer>
  </div>;
}



