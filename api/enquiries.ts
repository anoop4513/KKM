declare const process: { env: Record<string, string | undefined> };

type Request = { method?: string; url?: string; headers: Record<string, string | string[] | undefined>; body?: unknown; socket?: { remoteAddress?: string } };
type Response = { status(code: number): Response; json(value: unknown): void; setHeader(name: string, value: string): void };
type Payload = { name: string; company: string; location: string; email: string; phone: string; service: string; budget: string; description: string; consultation: boolean; consent: boolean };
type Config = { url: string; key: string; salt: string; emailKey: string; emailTo: string; emailFrom: string };

export const serviceOptions = [
  ['creative-media-production', 'Creative & Media Production'],
  ['branding-creative-strategy', 'Branding & Creative Strategy'],
  ['digital-marketing-growth', 'Digital Marketing & Growth'],
  ['website-digital-experience', 'Website & Digital Experience'],
  ['ai-business-automation', 'AI & Business Automation'],
  ['crm-business-technology', 'CRM & Business Technology'],
  ['data-analytics-performance', 'Data Analytics & Performance'],
  ['global-creative-localization', 'Global Creative & Localization'],
  ['help-me-choose', 'Help me choose'],
] as const;
export const budgetOptions = ['Under ₹25,000', '₹25,000–₹75,000', '₹75,000–₹2,00,000', '₹2,00,000+', 'International project — discuss budget', 'Let’s discuss'] as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const limits: Record<string, [number, number]> = { name: [2, 100], company: [2, 160], location: [2, 160], email: [5, 254], phone: [7, 32], description: [20, 4000] };
const stringValue = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export function validateEnquiry(value: unknown, now = Date.now()): { payload?: Payload; requestId?: string; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: { form: 'Send a valid project enquiry.' } };
  const input = value as Record<string, unknown>;
  const payload = {
    name: stringValue(input.name), company: stringValue(input.company), location: stringValue(input.location),
    email: stringValue(input.email).toLowerCase(), phone: stringValue(input.phone), service: stringValue(input.service),
    budget: stringValue(input.budget), description: stringValue(input.description), consultation: input.consultation === true, consent: input.consent === true,
  };
  for (const [field, [min, max]] of Object.entries(limits)) {
    const content = payload[field as keyof Payload] as string;
    if (content.length < min || content.length > max) errors[field] = `Use ${min}–${max} characters.`;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(content)) errors[field] = 'Remove unsupported control characters.';
  }
  if (!EMAIL.test(payload.email) || /[\r\n]/.test(payload.email)) errors.email = 'Enter a valid email address.';
  const digits = payload.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(payload.phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a valid contact number, including your country code.';
  if (!serviceOptions.some(([id]) => id === payload.service)) errors.service = 'Choose a service.';
  if (!(budgetOptions as readonly string[]).includes(payload.budget)) errors.budget = 'Choose a budget range, or select “Let’s discuss”.';
  if (!payload.consent) errors.consent = 'Please agree to be contacted about this enquiry.';
  const requestId = stringValue(input.requestId);
  if (!UUID.test(requestId)) errors.form = 'Reload the form and try again.';
  const elapsed = now - Number(input.startedAt);
  if (input.website || !Number.isFinite(elapsed) || elapsed < 2500 || elapsed > 86_400_000) errors.form = 'Please take a moment to complete the form, then try again.';
  return Object.keys(errors).length ? { errors } : { payload, requestId, errors };
}

function config(): Config | null {
  const env = process.env;
  const url = env.SUPABASE_URL?.replace(/\/$/, '') || '';
  try { if (new URL(url).protocol !== 'https:') return null; } catch { return null; }
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.ENQUIRY_RATE_LIMIT_SALT || env.ENQUIRY_RATE_LIMIT_SALT.length < 32 || !env.RESEND_API_KEY || !EMAIL.test(env.ENQUIRY_NOTIFICATION_TO || '') || !env.ENQUIRY_NOTIFICATION_FROM) return null;
  return { url, key: env.SUPABASE_SERVICE_ROLE_KEY, salt: env.ENQUIRY_RATE_LIMIT_SALT, emailKey: env.RESEND_API_KEY, emailTo: env.ENQUIRY_NOTIFICATION_TO!, emailFrom: env.ENQUIRY_NOTIFICATION_FROM };
}

function header(request: Request, name: string) { const value = request.headers[name]; return Array.isArray(value) ? value[0] : value || ''; }
async function digest(value: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join(''); }
function database(settings: Config, path: string, init: RequestInit = {}) {
  return fetch(`${settings.url}/rest/v1/${path}`, { ...init, signal: AbortSignal.timeout(9000), headers: { apikey: settings.key, Authorization: `Bearer ${settings.key}`, 'Content-Type': 'application/json', ...init.headers } });
}
function sameOrigin(request: Request) {
  const origin = header(request, 'origin');
  const configured = (process.env.ENQUIRY_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  const vercelOrigins = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(Boolean).map(host => `https://${host}`);
  if ([...configured, ...vercelOrigins].includes(origin)) return true;
  if (process.env.NODE_ENV !== 'production') { try { const parsed = new URL(origin); return ['localhost', '127.0.0.1'].includes(parsed.hostname); } catch { return false; } }
  return false;
}

async function deliverNotification(settings: Config, enquiryId: string): Promise<'sent' | 'pending'> {
  const claim = await database(settings, 'rpc/claim_enquiry_notification', { method: 'POST', body: JSON.stringify({ p_enquiry_id: enquiryId }) });
  if (!claim.ok) return 'pending';
  const job = await claim.json();
  if (!job) return 'pending';
  if (job.sent) return 'sent';
  const lead = job.lead;
  const service = serviceOptions.find(([slug]) => slug === lead.service)?.[1] || lead.service;
  let sent = false;
  let providerId: string | null = null;
  try {
    const email = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(9000), headers: { Authorization: `Bearer ${settings.emailKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `kkm-enquiry-${enquiryId}` }, body: JSON.stringify({
      from: settings.emailFrom, to: [settings.emailTo], reply_to: lead.email,
      subject: `New Katha Kantam Media ${lead.consultation ? 'discovery-call request' : 'project enquiry'}`,
      text: `Reference: ${enquiryId}\nName: ${lead.name}\nCompany: ${lead.company}\nLocation: ${lead.location}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nService: ${service}\nBudget: ${lead.budget}\nDiscovery call requested: ${lead.consultation ? 'Yes' : 'No'}\n\nProject brief:\n${lead.description}\n\nThis enquiry is stored in the protected enquiries table.`,
    }) });
    if (email.ok) { const data = await email.json(); providerId = typeof data.id === 'string' ? data.id : null; sent = Boolean(providerId); }
  } catch { /* The durable outbox remains available for a protected retry. */ }
  const acknowledgement = await database(settings, `enquiry_notifications?enquiry_id=eq.${enquiryId}`, { method: 'PATCH', body: JSON.stringify({ status: sent ? 'sent' : 'pending', provider_id: providerId, sent_at: sent ? new Date().toISOString() : null, locked_until: null, next_attempt_at: new Date(Date.now() + 15 * 60_000).toISOString(), last_error: sent ? null : 'provider_send_failed' }) });
  return sent && acknowledgement.ok ? 'sent' : 'pending';
}

export default async function handler(request: Request, response: Response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  const settings = config();
  const retry = request.method === 'GET' && new URL(request.url || '/', 'https://request.invalid').searchParams.get('action') === 'retry';
  if (retry) {
    if (!process.env.ENQUIRY_CRON_SECRET || header(request, 'authorization') !== `Bearer ${process.env.ENQUIRY_CRON_SECRET}`) return response.status(401).json({ error: 'Unauthorized.' });
    if (!settings) return response.status(503).json({ error: 'Enquiry service is not configured.' });
    try {
      const due = await database(settings, `enquiry_notifications?select=enquiry_id&status=neq.sent&attempts=lt.8&next_attempt_at=lte.${encodeURIComponent(new Date().toISOString())}&order=created_at.asc&limit=5`);
      if (!due.ok) throw new Error('outbox_read_failed');
      const jobs = await due.json() as { enquiry_id: string }[];
      const states = await Promise.all(jobs.map(job => deliverNotification(settings, job.enquiry_id)));
      return response.status(200).json({ processed: states.length, sent: states.filter(state => state === 'sent').length });
    } catch { return response.status(503).json({ error: 'Notification retry is temporarily unavailable.' }); }
  }
  if (request.method === 'GET') {
    if (!settings) return response.status(200).json({ ready: false, message: 'Online enquiries are being connected. Please email your brief in the meantime.' });
    try {
      const health = await database(settings, 'enquiries?select=id&limit=0', { method: 'HEAD' });
      return response.status(200).json({ ready: health.ok, message: health.ok ? 'Ready to receive your brief.' : 'Online enquiries are temporarily unavailable. Please email your brief.' });
    } catch { return response.status(200).json({ ready: false, message: 'Online enquiries are temporarily unavailable. Please email your brief.' }); }
  }
  if (request.method !== 'POST') { response.setHeader('Allow', 'GET, POST'); return response.status(405).json({ error: 'Method not allowed.' }); }
  if (!settings) return response.status(503).json({ error: 'Online enquiries are not connected yet. Email kathakaantam@gmail.com instead.' });
  if (!sameOrigin(request)) return response.status(403).json({ error: 'Submit your enquiry from the Katha Kantam Media website.' });
  if (header(request, 'content-type').split(';')[0].trim().toLowerCase() !== 'application/json') return response.status(415).json({ error: 'Send the enquiry as JSON.' });
  if (Number(header(request, 'content-length')) > 14_000) return response.status(413).json({ error: 'Your project brief is too long.' });
  let body = request.body;
  if (typeof body === 'string') { if (body.length > 14_000) return response.status(413).json({ error: 'Your project brief is too long.' }); try { body = JSON.parse(body); } catch { return response.status(400).json({ error: 'The enquiry could not be read.' }); } }
  const validated = validateEnquiry(body);
  if (!validated.payload || !validated.requestId) return response.status(422).json({ error: 'Please check the highlighted fields.', errors: validated.errors });
  const { payload, requestId } = validated;
  try {
    const ip = header(request, 'x-vercel-forwarded-for').split(',')[0].trim() || header(request, 'x-real-ip') || request.socket?.remoteAddress || 'unavailable';
    const [requestHash, rateKey] = await Promise.all([digest(JSON.stringify(payload)), digest(`${settings.salt}:${ip}`)]);
    const saved = await database(settings, 'rpc/accept_enquiry', { method: 'POST', body: JSON.stringify({ p_request_id: requestId, p_request_hash: requestHash, p_rate_key: rateKey, p_payload: payload }) });
    if (!saved.ok) {
      const reason = await saved.json().catch(() => ({}));
      if (reason.message === 'enquiry_rate_limit') { response.setHeader('Retry-After', '900'); return response.status(429).json({ error: 'Too many enquiries in a short time. Please wait 15 minutes or email us.' }); }
      if (reason.message === 'enquiry_idempotency_conflict') return response.status(409).json({ error: 'This enquiry changed after a submission attempt. Reload the page before sending a new brief.' });
      return response.status(503).json({ error: 'Your enquiry has not been confirmed. Please try again or email us.' });
    }
    const result = await saved.json();
    if (!result?.enquiry_id || !UUID.test(result.enquiry_id)) throw new Error('missing_acceptance');
    let notification: 'sent' | 'pending' = result.notification === 'sent' ? 'sent' : 'pending';
    try { if (notification !== 'sent') notification = await deliverNotification(settings, result.enquiry_id); } catch { /* Acceptance is durable even when a provider is unavailable. */ }
    return response.status(notification === 'sent' ? 201 : 202).json({ success: true, reference: result.enquiry_id, notification, message: notification === 'sent' ? 'Your enquiry is saved and the team has been notified. We’ll review your brief and reply by email.' : 'Your enquiry is saved. The email notification is pending; you can also contact kathakaantam@gmail.com with your reference.' });
  } catch { return response.status(503).json({ error: 'We could not confirm the submission. Your details are still in the form. Please retry or email us.' }); }
}
