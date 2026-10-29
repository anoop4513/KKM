import { z } from 'zod';

export const SERVICE_IDS = [
  'creative-media', 'branding-strategy', 'digital-growth', 'websites-experiences',
  'ai-automation', 'crm-business-tech', 'analytics-performance', 'global-localization',
] as const;
export const BUDGET_IDS = ['exploring', 'under-1000-usd', '1000-5000-usd', '5000-15000-usd', '15000-plus-usd'] as const;

const requiredText = (label: string, min: number, max: number) => z.string().trim().min(min, `${label} is required.`).max(max, `${label} is too long.`);
export const leadSchema = z.object({
  fullName: requiredText('Full name', 2, 100),
  company: requiredText('Company name', 2, 160),
  location: requiredText('Location / country', 2, 160),
  email: z.string().trim().max(254).email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a valid phone or WhatsApp number.').max(32)
    .regex(/^\+?[\d\s().-]+$/, 'Use a phone number including your country code.')
    .refine(value => { const digits = value.replace(/\D/g, ''); return digits.length >= 7 && digits.length <= 15; }, 'Enter 7–15 digits, including your country code.'),
  service: z.enum(SERVICE_IDS, { errorMap: () => ({ message: 'Choose a required service.' }) }),
  budget: z.enum(BUDGET_IDS, { errorMap: () => ({ message: 'Choose an approximate budget.' }) }),
  description: requiredText('Project description', 20, 4000),
  website: z.string().max(0),
  submissionId: z.string().uuid(),
}).strict();

export type LeadInput = z.infer<typeof leadSchema>;
type Headers = Record<string, string | string[] | undefined>;
export type LeadRequest = { method?: string; headers: Headers; body?: unknown };
export type LeadResponse = { status: (code: number) => LeadResponse; json: (body: unknown) => unknown; setHeader: (name: string, value: string) => unknown };
export type LeadEnvironment = { LEAD_WEBHOOK_URL?: string; LEAD_WEBHOOK_SECRET?: string; LEAD_ALLOWED_ORIGIN?: string; NODE_ENV?: string };
type Dependencies = { env?: LeadEnvironment; fetch?: typeof fetch; timeoutMs?: number; requestId?: () => string };

const header = (headers: Headers, name: string) => {
  const value = headers[name] ?? headers[name.toLowerCase()];
  return typeof value === 'string' ? value : undefined;
};
const isLocal = (host: string) => host === 'localhost' || host === '127.0.0.1' || host === '[::1]';

export function webhookConfig(env: LeadEnvironment) {
  if (!env.LEAD_WEBHOOK_URL || !env.LEAD_WEBHOOK_SECRET?.trim()) return null;
  try {
    const url = new URL(env.LEAD_WEBHOOK_URL);
    if (url.username || url.password || url.hash) return null;
    if (url.protocol !== 'https:' && !(env.NODE_ENV !== 'production' && url.protocol === 'http:' && isLocal(url.hostname))) return null;
    return { url: url.toString(), secret: env.LEAD_WEBHOOK_SECRET };
  } catch { return null; }
}

export function isSameOrigin(headers: Headers, allowedOrigin?: string) {
  const originValue = header(headers, 'origin');
  if (!originValue || header(headers, 'sec-fetch-site') === 'cross-site') return false;
  try {
    const origin = new URL(originValue);
    if (origin.origin !== originValue || origin.username || origin.password) return false;
    if (origin.protocol !== 'https:' && !(origin.protocol === 'http:' && isLocal(origin.hostname))) return false;
    if (allowedOrigin) return origin.origin === new URL(allowedOrigin).origin;
    return origin.host === header(headers, 'host');
  } catch { return false; }
}

export function createLeadHandler(dependencies: Dependencies = {}) {
  return async (req: LeadRequest, res: LeadResponse) => {
    // Environment access stays inside the server handler; no secrets are exported to the client.
    const env: LeadEnvironment = dependencies.env ?? {
      LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
      LEAD_WEBHOOK_SECRET: process.env.LEAD_WEBHOOK_SECRET,
      LEAD_ALLOWED_ORIGIN: process.env.LEAD_ALLOWED_ORIGIN,
      NODE_ENV: process.env.NODE_ENV,
    };
    const config = webhookConfig(env);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'GET') {
      return res.status(config ? 200 : 503).json({
        ready: Boolean(config), status: config ? 'configured' : 'unavailable',
        message: config ? 'Proposal receiver is configured.' : 'Online proposals are not available yet.',
      });
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ status: 'method_not_allowed', message: 'Use POST to send a proposal request.' });
    }
    if (!isSameOrigin(req.headers, env.LEAD_ALLOWED_ORIGIN)) {
      return res.status(403).json({ status: 'forbidden', message: 'Please submit through this website.' });
    }
    if (!header(req.headers, 'content-type')?.toLowerCase().startsWith('application/json')) {
      return res.status(415).json({ status: 'unsupported_type', message: 'Submit the form as JSON.' });
    }
    const contentLength = Number(header(req.headers, 'content-length') ?? '0');
    if (!Number.isFinite(contentLength) || contentLength > 16000 || contentLength < 0) {
      return res.status(413).json({ status: 'too_large', message: 'Your request is too long. Please shorten it.' });
    }
    let body: unknown;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? null);
      if (new TextEncoder().encode(raw).length > 16000) return res.status(413).json({ status: 'too_large', message: 'Your request is too long. Please shorten it.' });
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch { return res.status(400).json({ status: 'validation_error', message: 'The request could not be read.' }); }
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      // Never reveal spam filtering detail or echo submitted values.
      if (body && typeof body === 'object' && 'website' in body && body.website) {
        return res.status(400).json({ status: 'validation_error', message: 'The request could not be accepted.' });
      }
      return res.status(400).json({ status: 'validation_error', message: 'Please check the required fields.', errors: parsed.error.flatten().fieldErrors });
    }
    if (!config) return res.status(503).json({ status: 'unavailable', message: 'Online proposals are not available yet. Please try again later.' });

    const requestId = dependencies.requestId?.() ?? crypto.randomUUID();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), dependencies.timeoutMs ?? 8000);
    try {
      const { website: _honeypot, ...lead } = parsed.data;
      const response = await (dependencies.fetch ?? fetch)(config.url, {
        method: 'POST', redirect: 'error', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.secret}`, 'Idempotency-Key': lead.submissionId, 'X-Lead-Request-Id': requestId },
        body: JSON.stringify({ lead, requestId, source: 'katha-kantam-website', submittedAt: new Date().toISOString() }),
      });
      // Require an explicit machine acknowledgement; an HTML login page with 200 is not acceptance.
      const receipt = response.ok && response.headers.get('content-type')?.includes('application/json')
        ? await response.json().catch(() => null) : null;
      if (!response.ok || !receipt || typeof receipt !== 'object' || receipt.accepted !== true) {
        return res.status(502).json({ status: 'delivery_failed', message: 'We could not confirm receipt. Your details have been kept in the form so you can retry.' });
      }
      return res.status(200).json({ status: 'accepted', requestId, message: 'Your proposal request was accepted by our enquiry receiver.' });
    } catch {
      // A timeout may happen after receiver acceptance. Retrying uses the same idempotency key.
      return res.status(502).json({ status: 'delivery_failed', message: 'We could not confirm receipt. Please retry using this form.' });
    } finally { clearTimeout(timeout); }
  };
}

export default createLeadHandler();
