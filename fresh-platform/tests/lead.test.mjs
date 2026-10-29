import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadHandler, leadSchema, SERVICE_IDS, webhookConfig } from '../api/lead.ts';

const valid = {
  fullName: 'Example Person', company: 'Example Company', location: 'Bengaluru, India',
  email: 'person@example.test', phone: '+91 98765 43210', service: 'creative-media',
  budget: 'exploring', description: 'We are preparing a new campaign and need a creative partner.',
  website: '', submissionId: 'f9159c94-9e52-4a45-8b5e-8e4a1a8bd80f',
};
const configured = { LEAD_WEBHOOK_URL: 'https://receiver.example.test/leads', LEAD_WEBHOOK_SECRET: 'test-secret', NODE_ENV: 'production' };
const baseHeaders = { host: 'site.example.test', origin: 'https://site.example.test', 'content-type': 'application/json' };
const accepted = () => new Response(JSON.stringify({ accepted: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });

async function invoke({ method = 'POST', body = valid, headers = baseHeaders, env = configured, fetch: fetchImpl = async () => accepted(), timeoutMs = 50 } = {}) {
  const record = { status: null, body: null, headers: {} };
  const response = {
    status(code) { record.status = code; return this; },
    json(value) { record.body = value; return value; },
    setHeader(name, value) { record.headers[name] = value; },
  };
  await createLeadHandler({ env, fetch: fetchImpl, timeoutMs, requestId: () => 'test-request-id' })({ method, body, headers }, response);
  return record;
}

test('all eight capability IDs validate and unknown capabilities fail', () => {
  assert.equal(SERVICE_IDS.length, 8);
  for (const service of SERVICE_IDS) assert.equal(leadSchema.safeParse({ ...valid, service }).success, true);
  assert.equal(leadSchema.safeParse({ ...valid, service: 'invented-service' }).success, false);
});

test('required fields, email, phone, description length, budget and unknown keys are enforced', () => {
  for (const field of ['fullName', 'company', 'location', 'email', 'phone', 'service', 'budget', 'description']) {
    assert.equal(leadSchema.safeParse({ ...valid, [field]: '' }).success, false, field);
  }
  for (const patch of [{ email: 'bad-email' }, { phone: '123456' }, { phone: 'letters1234567' }, { phone: '1234567890123456' }, { description: 'short' }, { description: 'x'.repeat(4001) }, { company: 'x'.repeat(161) }, { budget: 'random' }, { injected: 'value' }]) {
    assert.equal(leadSchema.safeParse({ ...valid, ...patch }).success, false);
  }
});

test('GET reports configuration readiness without calling the receiver', async () => {
  let calls = 0;
  const result = await invoke({ method: 'GET', fetch: async () => { calls++; return accepted(); } });
  assert.equal(result.status, 200); assert.equal(result.body.ready, true); assert.equal(calls, 0);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(JSON.stringify(result.body).includes('test-secret'), false);
});

test('missing receiver or secret is unavailable for GET and valid POST', async () => {
  for (const env of [{}, { LEAD_WEBHOOK_URL: configured.LEAD_WEBHOOK_URL }, { LEAD_WEBHOOK_SECRET: 'test' }]) {
    const readiness = await invoke({ method: 'GET', env });
    const submission = await invoke({ env });
    assert.equal(readiness.status, 503); assert.equal(readiness.body.ready, false);
    assert.equal(submission.status, 503); assert.notEqual(submission.body.status, 'accepted');
  }
});

test('production receiver URL rejects insecure URLs, credentials and fragments', () => {
  for (const url of ['http://remote.example.test', 'https://user:pass@remote.example.test', 'https://remote.example.test/#fragment', 'not-a-url']) {
    assert.equal(webhookConfig({ ...configured, LEAD_WEBHOOK_URL: url }), null);
  }
  assert.ok(webhookConfig({ ...configured, LEAD_WEBHOOK_URL: 'http://localhost:4011', NODE_ENV: 'development' }));
});

test('cross-origin, missing-origin, non-HTTPS remote and cross-site submissions are rejected before forwarding', async () => {
  let calls = 0;
  for (const headers of [
    { ...baseHeaders, origin: 'https://other.example.test' },
    { host: baseHeaders.host, 'content-type': 'application/json' },
    { ...baseHeaders, origin: 'http://site.example.test' },
    { ...baseHeaders, 'sec-fetch-site': 'cross-site' },
    { ...baseHeaders, origin: 'https://site.example.test/path' },
  ]) {
    const result = await invoke({ headers, fetch: async () => { calls++; return accepted(); } });
    assert.equal(result.status, 403);
  }
  assert.equal(calls, 0);
});

test('explicit configured origin pins submissions even if Host differs', async () => {
  const env = { ...configured, LEAD_ALLOWED_ORIGIN: 'https://approved.example.test' };
  assert.equal((await invoke({ env })).status, 403);
  assert.equal((await invoke({ env, headers: { ...baseHeaders, origin: 'https://approved.example.test' } })).status, 200);
});

test('unsupported methods and content types are rejected', async () => {
  const method = await invoke({ method: 'PUT' });
  assert.equal(method.status, 405); assert.equal(method.headers.Allow, 'GET, POST');
  assert.equal((await invoke({ headers: { ...baseHeaders, 'content-type': 'text/plain' } })).status, 415);
});

test('invalid JSON, oversized declared and actual bodies are rejected without forwarding', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; return accepted(); };
  assert.equal((await invoke({ body: '{broken json', fetch: fetchImpl })).status, 400);
  assert.equal((await invoke({ headers: { ...baseHeaders, 'content-length': '17000' }, fetch: fetchImpl })).status, 413);
  assert.equal((await invoke({ body: { ...valid, description: 'x'.repeat(17000) }, fetch: fetchImpl })).status, 413);
  assert.equal(calls, 0);
});

test('honeypot rejects spam and never forwards it or simulates acceptance', async () => {
  let calls = 0;
  const result = await invoke({ body: { ...valid, website: 'spam.example.test' }, fetch: async () => { calls++; return accepted(); } });
  assert.equal(result.status, 400); assert.equal(calls, 0); assert.notEqual(result.body.status, 'accepted');
});

test('only explicit receiver acceptance confirms; validated payload, secret and idempotency are forwarded', async () => {
  let captured;
  const result = await invoke({ body: { ...valid, fullName: '  Example Person  ' }, fetch: async (url, options) => { captured = { url, options }; return accepted(); } });
  assert.equal(result.status, 200); assert.equal(result.body.status, 'accepted'); assert.equal(result.body.requestId, 'test-request-id');
  assert.equal(captured.url, configured.LEAD_WEBHOOK_URL);
  assert.equal(captured.options.headers.Authorization, 'Bearer test-secret');
  assert.equal(captured.options.headers['Idempotency-Key'], valid.submissionId);
  assert.equal(captured.options.redirect, 'error');
  const payload = JSON.parse(captured.options.body);
  assert.equal(payload.lead.fullName, 'Example Person');
  assert.equal('website' in payload.lead, false); assert.equal(payload.source, 'katha-kantam-website');
  assert.equal(JSON.stringify(result.body).includes(valid.email), false);
});

test('retry keeps the same receiver idempotency key', async () => {
  const keys = [];
  const fetchImpl = async (_url, options) => { keys.push(options.headers['Idempotency-Key']); return accepted(); };
  await invoke({ fetch: fetchImpl }); await invoke({ fetch: fetchImpl });
  assert.deepEqual(keys, [valid.submissionId, valid.submissionId]);
});

test('HTTP errors, HTML 200, missing acceptance and malformed JSON never confirm', async () => {
  const responses = [
    () => new Response('private error with receiver details', { status: 500 }),
    () => new Response('<html>Login</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
    () => new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    () => new Response('{invalid', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    () => new Response('{"accepted":false}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  ];
  for (const makeResponse of responses) {
    const result = await invoke({ fetch: async () => makeResponse() });
    assert.equal(result.status, 502); assert.equal(result.body.status, 'delivery_failed');
    assert.equal(JSON.stringify(result.body).includes('private error'), false);
  }
});

test('network failures and redirect errors stay generic', async () => {
  for (const privateMessage of ['secret upstream address', 'redirect blocked']) {
    const result = await invoke({ fetch: async () => { throw new Error(privateMessage); } });
    assert.equal(result.status, 502); assert.equal(JSON.stringify(result.body).includes(privateMessage), false);
  }
});

test('receiver timeout aborts forwarding and produces a retryable failure', async () => {
  let aborted = false;
  const result = await invoke({ timeoutMs: 5, fetch: async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => { aborted = true; reject(new Error('abort')); }, { once: true });
  }) });
  assert.equal(aborted, true); assert.equal(result.status, 502); assert.equal(result.body.status, 'delivery_failed');
});
