import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { chapters, storyFrame, reelLayers } from './heroStory';

// Asset base keeps image URLs working when deployed under a subpath.
const base = import.meta.env.BASE_URL;

export default function HeroArtwork({ motion }: { motion: boolean }) {
  const scene = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = track.current;
    const panel = scene.current;
    if (!element || !panel) return;
    let frame = 0;
    const render = () => {
      const box = element.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(panel).top) || 0;
      const distance = Math.max(1, element.offsetHeight - panel.offsetHeight);
      const values = storyFrame(motion ? (stickyTop - box.top) / distance : 0);
      reelLayers(values.progress).forEach((opacity, index) => {
        element.style.setProperty(`--reel-frame-${index}`, String(opacity));
      });
      element.style.setProperty('--story-progress', String(values.progress));
      element.style.setProperty('--story-scale', String(values.scale));
      element.style.setProperty('--story-rotate', `${values.rotate}deg`);
      element.style.setProperty('--story-depth', `${values.depth}deg`);
      element.style.setProperty('--story-shift', `${values.shift}%`);
      element.style.setProperty('--story-shade', String(values.shade));
      values.opacity.forEach((opacity, index) => {
        element.style.setProperty(`--chapter-${index}`, String(opacity));
        element.style.setProperty(`--chapter-y-${index}`, `${(1 - opacity) * 20}px`);
      });
    };
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(render); };
    const resize = new ResizeObserver(update);
    resize.observe(element); resize.observe(panel);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    render();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [motion]);
  useEffect(() => {
    const element = scene.current;
    if (!element || !motion) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty('--hero-x', '0deg');
      element.style.setProperty('--hero-y', '0deg');
      element.style.setProperty('--light-x', '50%');
      element.style.setProperty('--light-y', '50%');
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
      const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--hero-x', `${(0.5 - y) * 5}deg`);
        element.style.setProperty('--hero-y', `${(x - 0.5) * 7}deg`);
        element.style.setProperty('--light-x', `${x * 100}%`);
        element.style.setProperty('--light-y', `${y * 100}%`);
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle('hero-in-view', entry.isIntersecting);
    });
    observer.observe(element);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    return () => {
      reset(); observer.disconnect(); element.classList.remove('hero-in-view');
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
    };
  }, [motion]);
  return <section ref={track} className={`hero-story ${motion ? 'story-animated' : 'story-static'}`} aria-label="Our story, from idea to impact">
    <div ref={scene} className="hero-art hero-scene">
    <div className="hero-depth"><div className="hero-float"><div className="hero-scroll-image reel-sequence">
      <img src={`${base}assets/images/hero-film.jpeg`} alt="Black film reel and lime ribbon opening into an unfurled wave as you scroll" fetchPriority="high"/>
      {['reel-opening.webp', 'reel-unfurling.jpeg', 'reel-open.jpeg'].map((file, index) => <img
        key={file} src={`${base}assets/images/${file}?v=2`} alt="" aria-hidden="true"
        className={`reel-frame reel-frame-${index + 1}`} decoding="async"
        onLoad={event => { event.currentTarget.style.removeProperty('display'); }}
        onError={event => { event.currentTarget.style.display = 'none'; }}
      />)}
    </div></div></div>
    <div className="hero-sheen" aria-hidden="true"/>
    <div className="story-shade" aria-hidden="true"/>
    <div className="story-copy" aria-hidden="true">{chapters.map((chapter, index) => <div className={`story-chapter story-chapter-${index}`} key={chapter.label}>
      <p className="story-label">{chapter.label}</p><h2>{chapter.title}</h2><p className="story-body">{chapter.body}</p>
    </div>)}</div>
    <div className="art-topline"><span>THE ART OF MAKING YOU MATTER</span><span>KKM — CREATIVE STUDIO</span></div>
    <div className="art-bottomline"><span className="story-scroll-hint">Scroll to unfold the story <ArrowDown size={14}/></span><a className="round-link" aria-label="Skip story and explore our work" href="#work"><ArrowDown/></a></div>
    <div className="story-progress" aria-hidden="true"><span/></div>
    </div>
    <div className="story-transcript">{chapters.map(chapter => <div key={chapter.label}><p className="story-label">{chapter.label}</p><h3>{chapter.title}</h3><p>{chapter.body}</p></div>)}</div>
  </section>;
}

