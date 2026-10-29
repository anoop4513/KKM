import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

const services = [
  ['creative-media-production', 'Creative & Media Production'], ['branding-creative-strategy', 'Branding & Creative Strategy'],
  ['digital-marketing-growth', 'Digital Marketing & Growth'], ['website-digital-experience', 'Website & Digital Experience'],
  ['ai-business-automation', 'AI & Business Automation'], ['crm-business-technology', 'CRM & Business Technology'],
  ['data-analytics-performance', 'Data Analytics & Performance'], ['global-creative-localization', 'Global Creative & Localization'], ['help-me-choose', 'Help me choose'],
] as const;
const budgets = ['Under ₹25,000', '₹25,000–₹75,000', '₹75,000–₹2,00,000', '₹2,00,000+', 'International project — discuss budget', 'Let’s discuss'];
type TextField = 'name' | 'company' | 'location' | 'email' | 'phone';
const textFields: { name: TextField; label: string; type: string; autoComplete: string; max: number; placeholder: string }[] = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', max: 100, placeholder: 'How should we address you?' },
  { name: 'company', label: 'Company / brand', type: 'text', autoComplete: 'organization', max: 160, placeholder: 'Your business or personal brand' },
  { name: 'location', label: 'City & country', type: 'text', autoComplete: 'address-level2', max: 160, placeholder: 'Where are you based?' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', max: 254, placeholder: 'you@company.com' },
  { name: 'phone', label: 'Contact number', type: 'tel', autoComplete: 'tel', max: 32, placeholder: 'Include your country code' },
];
const emptyValues = () => ({ name: '', company: '', location: '', email: '', phone: '', service: '', budget: '', description: '', consent: false, website: '' });

export default function ProposalForm({ consultation = false }: { consultation?: boolean }) {
  const [values, setValues] = useState(emptyValues);
  const [callRequested, setCallRequested] = useState(consultation);
  const [availability, setAvailability] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const [availabilityMessage, setAvailabilityMessage] = useState('Checking the enquiry connection…');
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const startedAt = useRef(0);
  const requestId = useRef('');
  const result = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    startedAt.current = Date.now();
    requestId.current = crypto.randomUUID();
    const params = new URLSearchParams(window.location.search);
    const selected = params.get('service');
    if (selected && services.some(([id]) => id === selected)) setValues(current => ({ ...current, service: selected }));
    if (params.get('type') === 'consultation') setCallRequested(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    fetch('/api/enquiries', { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async response => { if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('unavailable'); return response.json(); })
      .then(data => { if (!active) return; setAvailability(data.ready === true ? 'ready' : 'unavailable'); setAvailabilityMessage(typeof data.message === 'string' ? data.message : 'Online enquiries are being connected. Please email your brief.'); })
      .catch(() => { if (active) { setAvailability('unavailable'); setAvailabilityMessage('Online enquiries are being connected. Please email your brief in the meantime.'); } })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; startedAt.current = 0; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  useEffect(() => { if (message || reference) result.current?.focus(); }, [message, reference]);

  function update(field: string, value: string | boolean) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => { const next = { ...current }; delete next[field]; return next; });
    setMessage('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || availability !== 'ready') return;
    setErrors({}); setMessage(''); setPending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...values, consultation: callRequested, startedAt: startedAt.current, requestId: requestId.current }) });
      const data = await response.json();
      if (!response.ok || data.success !== true) {
        setErrors(data.errors && typeof data.errors === 'object' ? data.errors : {});
        setMessage(typeof data.error === 'string' ? data.error : 'Your enquiry has not been confirmed. Please retry or email us.');
      } else {
        setReference(data.reference);
        setMessage(data.message || 'Your enquiry has been saved.');
        setValues(emptyValues());
        // A meaningful conversion only follows durable server acceptance. No personal details enter analytics.
        window.dispatchEvent(new CustomEvent('kkm:conversion', { detail: { event: 'enquiry_submitted', service: values.service, consultation: callRequested } }));
      }
    } catch { setMessage('We could not confirm the submission. Your details are still here. Try again or email kathakaantam@gmail.com.'); }
    finally { window.clearTimeout(timeout); setPending(false); }
  }

  function sendAnother() {
    setReference(''); setMessage(''); setErrors({});
    startedAt.current = Date.now(); requestId.current = crypto.randomUUID();
  }

  if (reference) return <div className="proposal-form form-status" ref={result} tabIndex={-1} role="status">
    <h2>Thank you for the brief.</h2><p>{message}</p><p>Your reference: <code>{reference}</code></p>
    <button className="button button-dark" type="button" onClick={sendAnother}>Start another enquiry <ArrowUpRight size={18} /></button>
  </div>;

  return <form className="proposal-form" onSubmit={submit} aria-describedby="enquiry-availability enquiry-privacy" aria-busy={pending}>
    <div className="form-note" id="enquiry-availability" role="status">
      <p>{availabilityMessage}</p>
      {availability === 'unavailable' && <a className="inline-link" href="mailto:kathakaantam@gmail.com?subject=Project%20enquiry%20%E2%80%94%20Katha%20Kantam%20Media">Email your brief <ArrowUpRight size={16} /></a>}
    </div>
    <p className="form-note">All fields are required. A budget range helps us scope the conversation; you can choose “Let’s discuss”.</p>
    <div className="form-grid">
      {textFields.map(field => <div className="field" key={field.name}>
        <label htmlFor={`enquiry-${field.name}`}>{field.label}</label>
        <input id={`enquiry-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} value={values[field.name]} onChange={event => update(field.name, event.target.value)} placeholder={field.placeholder} required minLength={field.name === 'phone' ? 7 : 2} maxLength={field.max} disabled={pending} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />
        {errors[field.name] && <p className="form-error" id={`error-${field.name}`}>{errors[field.name]}</p>}
      </div>)}
      <div className="field"><label htmlFor="enquiry-service">What can we help with?</label>
        <select id="enquiry-service" name="service" value={values.service} onChange={event => update('service', event.target.value)} required disabled={pending} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'error-service' : undefined}>
          <option value="" disabled>Select a service</option>{services.map(([id, label]) => <option value={id} key={id}>{label}</option>)}
        </select>{errors.service && <p className="form-error" id="error-service">{errors.service}</p>}
      </div>
      <div className="field field-wide"><label htmlFor="enquiry-budget">Approximate project budget</label>
        <select id="enquiry-budget" name="budget" value={values.budget} onChange={event => update('budget', event.target.value)} required disabled={pending} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'error-budget' : undefined}>
          <option value="" disabled>Select a range</option>{budgets.map(budget => <option key={budget}>{budget}</option>)}
        </select>{errors.budget && <p className="form-error" id="error-budget">{errors.budget}</p>}
      </div>
      <div className="field field-wide"><label htmlFor="enquiry-description">Tell us about your project</label>
        <textarea id="enquiry-description" name="description" rows={5} placeholder="What are you building, who is it for, and what would you like to achieve?" value={values.description} onChange={event => update('description', event.target.value)} required minLength={20} maxLength={4000} disabled={pending} aria-invalid={Boolean(errors.description)} aria-describedby="enquiry-description-help error-description" />
        <span className="form-note" id="enquiry-description-help">20–4,000 characters. Please leave out passwords, payment details and other sensitive information.</span>
        {errors.description && <p className="form-error" id="error-description">{errors.description}</p>}
      </div>
    </div>
    <div hidden aria-hidden="true"><label htmlFor="enquiry-website">Leave this field empty</label><input id="enquiry-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => update('website', event.target.value)} /></div>
    <label className="form-check"><input type="checkbox" checked={callRequested} onChange={event => setCallRequested(event.target.checked)} disabled={pending} />I’d also like to request a discovery call.</label>
    <p className="form-note">A call request is not a confirmed booking. We’ll arrange a suitable time by email.</p>
    <label className="form-check" id="enquiry-privacy"><input name="consent" type="checkbox" checked={values.consent} onChange={event => update('consent', event.target.checked)} required disabled={pending} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'error-consent' : undefined} /><span>I agree to be contacted about this enquiry and have read the <a href="/privacy/">privacy notice</a>.</span></label>
    {errors.consent && <p className="form-error" id="error-consent">{errors.consent}</p>}
    {(message || errors.form) && <div className="form-status form-error" ref={result} tabIndex={-1} role="alert">{message || errors.form}{errors.form && message && <p>{errors.form}</p>}</div>}
    <button className="button button-dark" type="submit" disabled={availability !== 'ready' || pending}>{pending ? 'Sending your enquiry…' : 'Send project enquiry'}<ArrowUpRight size={18} /></button>
    {availability !== 'ready' && <p className="form-note">The send button activates when the secure enquiry connection is ready. You can email us now using the link above.</p>}
  </form>;
}
