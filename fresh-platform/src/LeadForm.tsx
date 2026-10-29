import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, LoaderCircle } from 'lucide-react';
import { z } from 'zod';
import './LeadForm.css';

export const LEAD_SERVICES = [
  { id: 'creative-media', label: 'Creative & Media Production' },
  { id: 'branding-strategy', label: 'Branding & Creative Strategy' },
  { id: 'digital-growth', label: 'Digital Marketing & Growth' },
  { id: 'websites-experiences', label: 'Websites & Digital Experiences' },
  { id: 'ai-automation', label: 'AI & Business Automation' },
  { id: 'crm-business-tech', label: 'CRM & Business Technology' },
  { id: 'analytics-performance', label: 'Data Analytics & Performance' },
  { id: 'global-localization', label: 'Global Creative & Localization' },
] as const;

const text = (name: string, min: number, max: number) => z.string().trim().min(min, `${name} needs at least ${min} characters.`).max(max, `${name} is too long.`);
export const clientLeadSchema = z.object({
  fullName: text('Full name', 2, 100), company: text('Company name', 2, 160), location: text('Location / country', 2, 160),
  email: z.string().trim().max(254).email('Enter a valid email address.'),
  phone: z.string().trim().min(7).max(32).regex(/^\+?[\d\s().-]+$/, 'Enter a phone number with your country code.')
    .refine(value => { const digits = value.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; }, 'Enter 7–15 digits, including your country code.'),
  service: z.enum(['creative-media', 'branding-strategy', 'digital-growth', 'websites-experiences', 'ai-automation', 'crm-business-tech', 'analytics-performance', 'global-localization'], { errorMap: () => ({ message: 'Choose a service.' }) }),
  budget: z.enum(['exploring', 'under-1000-usd', '1000-5000-usd', '5000-15000-usd', '15000-plus-usd'], { errorMap: () => ({ message: 'Choose an approximate budget.' }) }),
  description: text('Project description', 20, 4000), website: z.string().max(0), submissionId: z.string().uuid(),
}).strict();

type Values = { fullName: string; company: string; location: string; email: string; phone: string; service: string; budget: string; description: string; website: string };
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type LeadServiceId = typeof LEAD_SERVICES[number]['id'];
type LeadAnalyticsMetadata = { serviceId: LeadServiceId; placement: 'proposal_form'; consultationLed: boolean };
type LeadFormProps = {
  initialService?: string;
  compact?: boolean;
  onAccepted?: (requestId: string) => void;
  onTrackEvent?: (eventName: 'form_submit', metadata: LeadAnalyticsMetadata) => void;
};
const initialValues = (service = ''): Values => ({ fullName: '', company: '', location: '', email: '', phone: '', service, budget: '', description: '', website: '' });

export default function LeadForm({ initialService = '', compact = false, onAccepted, onTrackEvent }: LeadFormProps) {
  const formId = useId().replace(/:/g, '');
  const [values, setValues] = useState<Values>(() => initialValues(initialService));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'accepted'>('idle');
  const [message, setMessage] = useState('');
  const [readiness, setReadiness] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const submissionId = useRef('');
  const feedbackRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (LEAD_SERVICES.some(item => item.id === initialService)) setValues(previous => ({ ...previous, service: initialService }));
  }, [initialService]);

  useEffect(() => {
    const chooseService = (event: Event) => {
      const detail: unknown = (event as CustomEvent<unknown>).detail;
      if (status === 'submitting' || typeof detail !== 'string' || !LEAD_SERVICES.some(item => item.id === detail)) return;
      if (status === 'accepted') {
        submissionId.current = '';
        setValues(initialValues(detail));
      } else {
        setValues(previous => ({ ...previous, service: detail }));
      }
      setErrors(previous => ({ ...previous, service: undefined }));
      setStatus('idle');
      setMessage('');
    };
    window.addEventListener('kkm:choose-service', chooseService);
    return () => window.removeEventListener('kkm:choose-service', chooseService);
  }, [status]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch('/api/lead', { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async response => { const data = await response.json(); if (active) setReadiness(response.ok && data.ready === true ? 'ready' : 'unavailable'); })
      .catch(() => { if (active) setReadiness('unavailable'); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => { if (status === 'accepted' || status === 'error') feedbackRef.current?.focus(); }, [status, message]);

  const change = (field: FieldName, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    if (status === 'error') { setStatus('idle'); setMessage(''); }
  };
  const fieldProps = (field: FieldName) => ({
    id: `${formId}-${field}`, name: field, value: values[field], required: true,
    'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${formId}-${field}-error` : undefined,
    disabled: status === 'submitting', onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => change(field, event.target.value),
  });
  const error = (field: FieldName) => errors[field] ? <span className="lead-field-error" id={`${formId}-${field}-error`}>{errors[field]}</span> : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const result = clientLeadSchema.safeParse({ ...values, submissionId: submissionId.current });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const nextErrors: Errors = {};
      for (const key of Object.keys(fieldErrors) as FieldName[]) {
        const messages = fieldErrors[key];
        if (messages?.[0]) nextErrors[key] = messages[0];
      }
      setErrors(nextErrors); setStatus('error'); setMessage('Please check the highlighted fields.');
      const firstField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus());
      return;
    }
    if (readiness !== 'ready') { setStatus('error'); setMessage('Online enquiry submission is currently unavailable. Your details are still in the form.'); return; }
    setStatus('submitting'); setMessage(''); setErrors({});
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let failureMessage = 'We could not confirm receipt. Your details are still in the form; please retry.';
    try {
      const response = await fetch('/api/lead', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(result.data) });
      const data = await response.json();
      if (!response.ok || data.status !== 'accepted' || typeof data.requestId !== 'string') {
        if (data.errors && typeof data.errors === 'object') {
          const nextErrors: Errors = {};
          for (const field of Object.keys(values) as FieldName[]) if (Array.isArray(data.errors[field]) && typeof data.errors[field][0] === 'string') nextErrors[field] = data.errors[field][0];
          setErrors(nextErrors);
        }
        if (response.status === 503) failureMessage = 'Online enquiries are temporarily unavailable. Your details are still in the form.';
        throw new Error('Submission was not acknowledged.');
      }
      setStatus('accepted'); setMessage('Your project enquiry has been received.');
      // Analytics or consumer callbacks must not turn a confirmed submission into an error.
      try { onAccepted?.(data.requestId); } catch { /* The enquiry was already accepted. */ }
      try {
        onTrackEvent?.('form_submit', {
          serviceId: result.data.service,
          placement: 'proposal_form',
          consultationLed: ['ai-automation', 'crm-business-tech', 'analytics-performance'].includes(result.data.service),
        });
      } catch { /* Tracking is optional and never changes the confirmed enquiry. */ }
    } catch {
      setStatus('error'); setMessage(failureMessage);
    } finally { clearTimeout(timeout); }
  }

  if (status === 'accepted') return <div className="lead-success" ref={feedbackRef} tabIndex={-1} role="status">
    <span className="lead-success-icon"><Check size={27} aria-hidden="true" /></span>
    <h3>Brief received.</h3><p>{message}</p><p className="lead-success-note">A discovery call can be scheduled separately.</p>
    <button type="button" className="lead-reset" onClick={() => { submissionId.current = ''; setValues(initialValues()); setStatus('idle'); setMessage(''); }}>Start another enquiry <ArrowUpRight size={16} aria-hidden="true" /></button>
  </div>;

  return <form className={`lead-form${compact ? ' lead-form-compact' : ''}`} ref={formRef} onSubmit={submit} noValidate aria-busy={status === 'submitting'}>
    <div className="lead-form-topline"><span>PROJECT ENQUIRY</span><span>01 — A LITTLE ABOUT YOU</span></div>
    <div className="lead-fields">
      <div className="lead-field"><label htmlFor={`${formId}-fullName`}>Full name <span aria-hidden="true">*</span></label><input {...fieldProps('fullName')} autoComplete="name" maxLength={100} placeholder="Your name" />{error('fullName')}</div>
      <div className="lead-field"><label htmlFor={`${formId}-company`}>Company name <span aria-hidden="true">*</span></label><input {...fieldProps('company')} autoComplete="organization" maxLength={160} placeholder="Your business or brand" />{error('company')}</div>
      <div className="lead-field"><label htmlFor={`${formId}-location`}>Location / country <span aria-hidden="true">*</span></label><input {...fieldProps('location')} autoComplete="country-name" maxLength={160} placeholder="City, country" />{error('location')}</div>
      <div className="lead-field"><label htmlFor={`${formId}-email`}>Email address <span aria-hidden="true">*</span></label><input {...fieldProps('email')} type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" />{error('email')}</div>
      <div className="lead-field"><label htmlFor={`${formId}-phone`}>Phone / WhatsApp <span aria-hidden="true">*</span></label><input {...fieldProps('phone')} type="tel" autoComplete="tel" maxLength={32} placeholder="Include your country code" />{error('phone')}</div>
      <div className="lead-field"><label htmlFor={`${formId}-service`}>Required service <span aria-hidden="true">*</span></label><select {...fieldProps('service')}><option value="">Select a capability</option>{LEAD_SERVICES.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select>{error('service')}</div>
      <div className="lead-field lead-field-wide"><label htmlFor={`${formId}-budget`}>Approximate budget <span aria-hidden="true">*</span></label><select {...fieldProps('budget')}><option value="">Choose your planning range</option><option value="exploring">Let’s define the scope and budget together</option><option value="under-1000-usd">Under US$1,000</option><option value="1000-5000-usd">US$1,000–5,000</option><option value="5000-15000-usd">US$5,000–15,000</option><option value="15000-plus-usd">US$15,000+</option></select>{error('budget')}<span className="lead-field-hint">A planning guide. We can discuss your preferred currency.</span></div>
      <div className="lead-field lead-field-wide"><label htmlFor={`${formId}-description`}>Tell us what you’re building <span aria-hidden="true">*</span></label><textarea {...fieldProps('description')} rows={3} minLength={20} maxLength={4000} placeholder="Your goal, what you need, and any timeline you have in mind…" />{error('description')}</div>
    </div>
    <div className="lead-honeypot" aria-hidden="true"><label htmlFor={`${formId}-website`}>Leave this field empty</label><input id={`${formId}-website`} name="website" value={values.website} onChange={event => change('website', event.target.value)} tabIndex={-1} autoComplete="off" /></div>
    {status === 'error' && <div className="lead-feedback" ref={feedbackRef} tabIndex={-1} role="alert">{message}</div>}
    {readiness === 'unavailable' && status !== 'error' && <p className="lead-availability" role="status">Online enquiry submission is currently unavailable. You can review the form and prepare your project brief.</p>}
    <div className="lead-submit-row"><p className="lead-form-note">All fields are required. Your details are used to respond to this enquiry.</p><button className="lead-submit" type="submit" disabled={status === 'submitting' || readiness === 'checking'}>{status === 'submitting' ? <><LoaderCircle className="lead-spinner" size={18} aria-hidden="true" /> Sending brief…</> : <>{readiness === 'checking' ? 'Checking availability…' : 'Send project brief'}<ArrowUpRight size={20} aria-hidden="true" /></>}</button></div>
  </form>;
}
