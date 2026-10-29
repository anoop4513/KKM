import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { validateEnquiry } from '../api/enquiries.ts';

const requestId = '311a807a-79bc-4ada-8029-705b2fc5ab31';
const enquiryId = '411a807a-79bc-4ada-8029-705b2fc5ab31';
const valid = () => ({ requestId, startedAt: Date.now() - 5000, name: 'Test Visitor', company: 'Test Company', location: 'Hindupur, India', email: 'visitor@example.test', phone: '+91 98765 43210', service: 'creative-media-production', budget: 'Let’s discuss', description: 'Clearly marked test brief for validation checks.', consultation: false, consent: true, website: '' });
const configKeys = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ENQUIRY_RATE_LIMIT_SALT', 'RESEND_API_KEY', 'ENQUIRY_NOTIFICATION_TO', 'ENQUIRY_NOTIFICATION_FROM', 'ENQUIRY_ALLOWED_ORIGINS', 'ENQUIRY_CRON_SECRET'];

function harness() {
  const output = { code: 200, body: null, headers: {} };
  const response = { status(code) { output.code = code; return this; }, json(body) { output.body = body; }, setHeader(name, value) { output.headers[name] = value; } };
  return { output, response };
}
async function configured(run) {
  const previous = Object.fromEntries(configKeys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-server-key', ENQUIRY_RATE_LIMIT_SALT: 'test-only-salt-of-at-least-32-characters', RESEND_API_KEY: 'test-email-key', ENQUIRY_NOTIFICATION_TO: 'team@example.test', ENQUIRY_NOTIFICATION_FROM: 'Agency <agency@example.test>', ENQUIRY_ALLOWED_ORIGINS: 'https://kkm.example.test' });
  try { await run(); } finally { globalThis.fetch = originalFetch; for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
}
const request = body => ({ method: 'POST', headers: { origin: 'https://kkm.example.test', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' }, body });
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });

test('valid enquiry is normalized and no private client fields escape the schema', () => {
  const value = validateEnquiry({ ...valid(), email: ' VISITOR@EXAMPLE.TEST ', extra: 'ignored' });
  assert.deepEqual(value.errors, {}); assert.equal(value.payload.email, 'visitor@example.test'); assert.equal('extra' in value.payload, false);
});
test('spam, missing consent, invalid service, header injection and oversize descriptions fail', () => {
  for (const change of [{ website: 'spam' }, { startedAt: Date.now() }, { consent: false }, { service: 'invented' }, { email: 'visitor@example.test\r\nBcc: other@example.test' }, { description: 'a'.repeat(4001) }, { phone: 'invalid phone' }]) assert.ok(Object.keys(validateEnquiry({ ...valid(), ...change }).errors).length);
});
test('readiness is safely unavailable without server credentials', async () => {
  const previous = process.env.SUPABASE_URL; delete process.env.SUPABASE_URL;
  try { const { response, output } = harness(); await handler({ method: 'GET', headers: {} }, response); assert.equal(output.body.ready, false); assert.equal(JSON.stringify(output.body).includes('SERVICE_ROLE'), false); }
  finally { if (previous !== undefined) process.env.SUPABASE_URL = previous; }
});
test('cross-origin submissions cannot call storage', async () => configured(async () => {
  globalThis.fetch = () => { throw new Error('unexpected fetch'); };
  const { response, output } = harness(); const req = request(valid()); req.headers.origin = 'https://untrusted.example.test';
  await handler(req, response); assert.equal(output.code, 403);
}));
test('storage failure never produces a success confirmation', async () => configured(async () => {
  globalThis.fetch = async () => json({ message: 'temporary failure' }, 503);
  const { response, output } = harness(); await handler(request(valid()), response); assert.equal(output.code, 503); assert.equal(output.body.success, undefined);
}));
test('durable rate-limit rejection sets a retry interval', async () => configured(async () => {
  globalThis.fetch = async () => json({ message: 'enquiry_rate_limit' }, 400);
  const { response, output } = harness(); await handler(request(valid()), response); assert.equal(output.code, 429); assert.equal(output.headers['Retry-After'], '900');
}));
test('confirmed durable duplicate returns reference without sending another notification', async () => configured(async () => {
  let calls = 0;
  globalThis.fetch = async (url, init) => { calls++; assert.match(url, /rpc\/accept_enquiry$/); const body = JSON.parse(init.body); assert.equal(body.p_request_id, requestId); assert.equal(body.p_rate_key.includes('192.0.2.1'), false); return json({ enquiry_id: enquiryId, duplicate: true, notification: 'sent' }); };
  const { response, output } = harness(); await handler(request(valid()), response); assert.equal(output.code, 201); assert.equal(output.body.reference, enquiryId); assert.equal(calls, 1);
}));
test('saved enquiry with provider failure truthfully confirms pending notification', async () => configured(async () => {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push(url);
    if (url.endsWith('/rpc/accept_enquiry')) return json({ enquiry_id: enquiryId, notification: 'pending' });
    if (url.endsWith('/rpc/claim_enquiry_notification')) return json({ sent: false, lead: valid() });
    if (url === 'https://api.resend.com/emails') { assert.equal(init.headers['Idempotency-Key'], `kkm-enquiry-${enquiryId}`); return json({ error: 'test provider failure' }, 503); }
    assert.match(url, /enquiry_notifications\?enquiry_id=/); assert.equal(JSON.parse(init.body).status, 'pending'); return new Response(null, { status: 204 });
  };
  const { response, output } = harness(); await handler(request(valid()), response); assert.equal(output.code, 202); assert.equal(output.body.success, true); assert.equal(output.body.notification, 'pending'); assert.equal(calls.length, 4);
}));
test('protected retry endpoint rejects unauthenticated requests', async () => configured(async () => {
  process.env.ENQUIRY_CRON_SECRET = 'test-only-cron-secret';
  const { response, output } = harness(); await handler({ method: 'GET', url: '/api/enquiries?action=retry', headers: {} }, response); assert.equal(output.code, 401);
}));
