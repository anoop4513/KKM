import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import Home from './Home';
import LeadForm, { LEAD_SERVICES } from './LeadForm';
import { activateAnalyticsIfConsented, analyticsConfigured, setAnalyticsConsent, trackEvent } from './tracking';

const navigation = [['#work','Work'],['#services','Services'],['#industries','Industries'],['#global','Global']] as const;
const number = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').trim();
const configuredNumber = /^\d{8,15}$/.test(number) ? number : '';
function bookingLink(value: string) { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; } }
const booking = bookingLink(String(import.meta.env.VITE_BOOKING_URL || ''));
function Brand() { return <a className="site-brand" href="#top" aria-label="Katha Kantam Media home"><svg viewBox="0 0 42 42" aria-hidden="true"><path fill="currentColor" d="M3 2h10v38H3zm12 19L31 2h10L24 22l18 18H29L15 27z"/></svg><span>KATHA KANTAM <b>MEDIA</b></span></a>; }
export default function App() {
  const [menu, setMenu] = useState(false);
  const [service, setService] = useState('');
  const [analytics, setAnalytics] = useState('Optional analytics are off until you allow them.');
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activateAnalyticsIfConsented();
    const selected = (event: Event) => { const value = (event as CustomEvent<unknown>).detail; if (typeof value === 'string' && LEAD_SERVICES.some(item=>item.id===value)) setService(value); };
    window.addEventListener('kkm:choose-service', selected);
    return () => window.removeEventListener('kkm:choose-service', selected);
  }, []);
  useEffect(() => { const handle = (event: KeyboardEvent) => { if(event.key === 'Escape' && menu){setMenu(false);trigger.current?.focus();} }; window.addEventListener('keydown',handle); return () => window.removeEventListener('keydown',handle); },[menu]);
  const chosen = LEAD_SERVICES.find(item=>item.id===service)?.label;
  const whatsapp = configuredNumber ? `https://wa.me/${configuredNumber}?text=${encodeURIComponent(`Hello Katha Kantam Media, I’d like to discuss ${chosen || 'a project'}.`)}` : '';
  const proposal = <><div className="site-contact-options">{booking && <a href={booking} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent('consultation_request',{placement:'contact'})}>Schedule a discovery call<ArrowUpRight size={18}/></a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent('whatsapp_click',{placement:'contact',serviceId:service})}>Enquire on WhatsApp<ArrowUpRight size={18}/></a>}</div><LeadForm onTrackEvent={(event,metadata)=>trackEvent(event,metadata)}/></>;
  return <div className="site" id="top"><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><Brand/><nav className="site-nav" aria-label="Main navigation">{navigation.map(([href,label])=><a href={href} key={href}>{label}</a>)}</nav><a className="site-action" href="#contact">Get a Proposal<ArrowUpRight size={18}/></a><button className="site-menu" ref={trigger} aria-label={menu?'Close navigation':'Open navigation'} aria-controls="mobile-nav" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>{menu && <nav className="site-mobile-nav" id="mobile-nav" aria-label="Mobile navigation">{[...navigation,['#contact','Get a Proposal'] as const].map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}<ArrowUpRight size={19}/></a>)}</nav>}</header><main id="main"><Home proposal={proposal}/></main><footer className="site-footer"><div className="site-footer-top"><div><Brand/><p>CREATE • MARKET • AUTOMATE • GROW</p></div><div><h2>Let’s make what<br/>comes next matter.</h2><a href="#contact">Start a conversation<ArrowUpRight size={20}/></a></div><div><h3>Explore</h3>{navigation.map(([href,label])=><a key={href} href={href}>{label}</a>)}<a href="#contact">Contact</a></div></div><div className="site-footer-bottom"><span>© 2026 Katha Kantam Media</span><span>India-rooted. Working across borders.</span>{analyticsConfigured && <details><summary>Analytics preferences</summary><p role="status">{analytics}</p><button type="button" onClick={()=>{setAnalyticsConsent(true);setAnalytics('Optional analytics are on.');}}>Allow</button><button type="button" onClick={()=>{setAnalyticsConsent(false);setAnalytics('Optional analytics are off.');}}>Keep off</button></details>}<a href="#top">Back to top<ArrowDown size={15}/></a></div></footer><div className="site-mobile-actions"><a href="#contact">Get a Proposal<ArrowUpRight size={18}/></a>{whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent('whatsapp_click',{placement:'floating',serviceId:service})}>WhatsApp<MessageCircle size={18}/></a>}</div></div>;
}
