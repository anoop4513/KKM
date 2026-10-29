# Enquiries and launch integrations

## Current state

The website includes a real server endpoint and a proposal form. It does not simulate successful delivery. Without the server configuration below, the form shows an honest unavailable notice, disables submission, and offers the existing contact email. It does not save personal information in browser storage.

Vite's ordinary development server does not execute Vercel functions. A production-like form test requires `vercel dev`, a Vercel Preview deployment, or a purpose-built API test harness. A frontend build alone does not verify storage or email delivery.

## Activate secure enquiry capture

1. Select an approved Supabase project and apply `database/enquiries.sql` in its SQL editor. This creates a protected lead register, an email outbox and durable rate-limit buckets. It does not create a third-party CRM account or a staff dashboard.
2. Set server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel Preview first. Never put a service-role key in a `VITE_` variable. The migration revokes anonymous/authenticated access and enables RLS; only server-side service-role requests can read or write the lead tables or execute the acceptance functions.
3. Set `ENQUIRY_RATE_LIMIT_SALT` to a random secret of at least 32 characters. The server hashes the trusted platform IP with this secret. Raw IP addresses are not stored. The SQL transaction accepts at most five enquiries per hashed IP per fixed 15-minute bucket; an accepted idempotent retry does not create another lead.
4. Configure `RESEND_API_KEY`, a real approved `ENQUIRY_NOTIFICATION_TO` address, and `ENQUIRY_NOTIFICATION_FROM` with a Resend-verified sender. No destination is invented in code. Keep the existing public contact email unless the owner supplies a replacement.
5. Set `ENQUIRY_ALLOWED_ORIGINS` to the approved full production origin(s), comma separated without trailing slashes. The current Vercel deployment and branch preview origins are also allowed automatically. Add local origins only for local testing.
6. Redeploy the Preview. `GET /api/enquiries` returns only a safe readiness state and checks access to the lead table without reading a lead. This is not proof of inbox delivery.
7. Make an explicitly authorized test enquiry with clearly marked test data. Verify: a single record in `enquiries`, a matching outbox row, `status = sent`, the designated inbox received the email, and an identical retry did not duplicate the lead. Verify the anonymous role cannot select or insert records or execute either SQL function. Delete the test records after review.

## Delivery and retry behavior

The acceptance RPC inserts the enquiry and notification job in one transaction. The website confirms success only after durable database acceptance. Provider failure after acceptance returns a truthful pending-notification message; it never tells the visitor that an email was delivered. An idempotency UUID and payload hash reject reused IDs with changed data.

The handler claims an outbox job under a database lock and calls Resend with a stable idempotency key. Successful sends store the provider ID. Failed sends remain pending. Configure `ENQUIRY_CRON_SECRET` before calling the protected `GET /api/enquiries?action=retry` endpoint with `Authorization: Bearer <configured secret>` from an approved scheduled system. No schedule is created by this implementation. It retries a bounded five jobs per call, caps each job at eight attempts and leaves exhausted jobs for staff review. Monitor these records; a durable outbox without an enabled retry/alert process is not a complete operational notification system. Review Resend's current idempotency window when setting retry cadence.

No notification email is sent to an enquirer automatically; this route notifies only the configured team recipient. Do not infer delivered-to-inbox status from the provider's send acknowledgement.

## Privacy and operations decisions still needed

- Confirm who has access to Supabase, how staff follow up, a retention period, deletion/access request process and backup policy before launch. No arbitrary retention period has been invented.
- The draft privacy page must be approved against the actual configured services and owner's legal identity before production release.
- Confirm the real WhatsApp Business number before activating a prefilled link. No placeholder number is used.
- Supply a real calendar URL if immediate booking is required. The form currently supports an honest discovery-call request, not a confirmed appointment.
- GA4 needs an approved measurement ID and an agreed consent/privacy configuration. The form emits a browser event `kkm:conversion` only after durable acceptance, containing `event: enquiry_submitted`, the service category and a consultation boolean. It contains no name, email, phone, location, company or project text. This event is an integration hook, not proof that GA4 has been configured.
- Search Console needs the final approved domain and owner verification. Avoid including preview URLs in a production sitemap.
- There are no inherent new software charges to build the form. Supabase, email, hosting, CRM, calendar and monitoring costs depend on the selected accounts and usage. No paid plan is activated here.

## Validation and abuse controls

Server validation enforces field lengths, an allowed service/budget list, email/phone shape, privacy consent, JSON body limits and a UUID request ID. An invisible honeypot and minimum completion time add lightweight friction. Durable rate limiting applies before acceptance. Origin checking blocks cross-site browser submissions. These controls do not replace platform firewall rules or a challenge service if abuse appears. No security secrets or personal enquiry content are logged by this endpoint.

Official references: [Supabase database functions](https://supabase.com/docs/guides/database/functions), [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys).
