# Lead capture integration

This is a new implementation. No earlier backend, contact information, portfolio, or credentials were used.

## Rendering

Import the default `LeadForm` from `src/LeadForm.tsx`. Optional props are `initialService`, `compact`, `onAccepted(requestId)`, and `onTrackEvent(eventName, metadata)`. A changed `initialService` preselects the corresponding capability. The form also listens for `window.dispatchEvent(new CustomEvent('kkm:choose-service', { detail: serviceId }))` after mounting. Only exact IDs in `LEAD_SERVICES` are accepted; the listener is removed on cleanup. Selection changes are ignored while submitting. Selecting a new service after acceptance starts a fresh enquiry with a new idempotency key.

The optional `onTrackEvent` callback fires `form_submit` only after receiver acknowledgement, with the allowlisted `serviceId`, `placement: 'proposal_form'`, and `consultationLed` boolean. The last value identifies AI, CRM/business technology, or analytics selections; it does not claim a booking happened. No consultation event fires without an actual scheduling action. Use either this callback or `onAccepted` for form-submit analytics to avoid duplicates. Callback errors cannot change an accepted enquiry to a failure. Never send names, emails, phone numbers, descriptions, request IDs, or the complete form payload to analytics.

Service IDs are `creative-media`, `branding-strategy`, `digital-growth`, `websites-experiences`, `ai-automation`, `crm-business-tech`, `analytics-performance`, and `global-localization`. Labels identify all eight divisions. AI, CRM, and analytics CTAs elsewhere should use the consultation wording specified in the brief.

Every visible field is required. Client Zod validation produces accessible per-field errors and focuses the first invalid field. The server separately validates the same contract. Inputs remain on a delivery failure. Submission is disabled while pending. The honeypot is excluded from focus and assistive technology. Budget options are indicative planning ranges, not claims about agency prices.

## API

Vercel deploys `api/lead.ts` at `/api/lead`. `GET` returns `{ ready: true, status: "configured" }` only when a valid receiver URL and secret exist. This checks configuration, not remote connectivity or inbox delivery. Without configuration the response is 503 and the homepage clearly identifies that sending is not connected.

`POST` requires JSON, a same-origin browser `Origin`, and the validated fields. The body is bounded to 16 KB, phone numbers to 7–15 digits, descriptions to 4,000 characters, and other fields to their documented input limits. Unknown fields are rejected. Cross-site requests, missing origins, invalid payloads, nonempty honeypots, and unsupported methods/types are rejected before forwarding. Optional `LEAD_ALLOWED_ORIGIN` pins an exact production origin; otherwise the incoming `Host` must match. Add managed rate limiting before a high-volume public launch; this handler does not claim durable rate-limit storage or CAPTCHA protection.

Set server-only `LEAD_WEBHOOK_URL` and `LEAD_WEBHOOK_SECRET`. Production receivers require HTTPS and cannot contain URL credentials or fragments. HTTP localhost is allowed only outside production for controlled testing. Outbound redirects are rejected. The request has:

```
Authorization: Bearer <LEAD_WEBHOOK_SECRET>
Content-Type: application/json
Idempotency-Key: <browser-generated submission UUID>
X-Lead-Request-Id: <server-generated request UUID>
```

The JSON envelope contains `lead`, `requestId`, `source`, and `submittedAt`. The honeypot is never forwarded. The receiver is responsible for durable lead storage/CRM routing, idempotency enforcement, team notifications, and its own access control. A retry retains the submission UUID; the receiver must honor it to avoid duplicate entries after network timeouts. No PII is written to application logs by this handler.

The receiver must return a **2xx response with `Content-Type: application/json` and `{ "accepted": true }`**. Only that explicit acknowledgement produces the form confirmation. A bare 200, HTML login page, rejected request, invalid JSON, redirect, timeout, or missing receiver cannot produce success. The server aborts forwarding after eight seconds, including response parsing; the browser allows twelve seconds. Public failures are generic and never expose receiver URLs, response bodies, or credentials.

An accepted response means that the configured receiver acknowledged the enquiry. It does not prove email inbox delivery, a CRM stage change, or a booked appointment. There is no fabricated fallback inbox or simulated delivery.

## Optional contact settings

The user-supplied business number is maintained in `src/contact.ts` and enables WhatsApp links with contextual messages that exclude form PII. `.env.example` leaves `VITE_BOOKING_URL` and `VITE_GA4_MEASUREMENT_ID` blank. Booking requires a valid approved HTTPS URL with no URL credentials. Missing settings leave a truthful unavailable state; they never point to an invented contact. The lead form has no dependency on either setting.

Vite's development server does not execute Vercel API handlers by itself. Use a controlled local handler server or the configured Vercel development/deployed environment to exercise delivery. A static preview with no receiver intentionally shows unavailable.

## Verification

Run `npm test` for endpoint validation, same-origin handling, missing configuration, explicit receiver acceptance, retries/idempotency, redirects, and failure handling. Browser-check invalid fields, focus, narrow layouts, and actual receiver receipt before claiming production delivery. No live receiver credentials or approved WhatsApp/booking details were provided during implementation.
