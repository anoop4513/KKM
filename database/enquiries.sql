-- Apply once in the approved Supabase project's SQL editor. Contains no credentials.
-- These tables are a protected structured lead register, not a browser-facing CRM.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  request_hash text not null,
  name text not null check (length(name) between 2 and 100),
  company text not null check (length(company) between 2 and 160),
  location text not null check (length(location) between 2 and 160),
  email text not null check (length(email) between 5 and 254),
  phone text not null check (length(phone) between 7 and 32),
  service text not null,
  budget text not null,
  description text not null check (length(description) between 20 and 4000),
  consultation boolean not null default false,
  consent boolean not null check (consent),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);
create table if not exists public.enquiry_notifications (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null unique references public.enquiries(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent')),
  attempts integer not null default 0,
  provider_id text,
  last_error text,
  locked_until timestamptz,
  next_attempt_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.enquiry_rate_buckets (
  key_hash text not null,
  bucket_start timestamptz not null,
  attempts integer not null default 1,
  primary key (key_hash, bucket_start)
);
alter table public.enquiries enable row level security;
alter table public.enquiry_notifications enable row level security;
alter table public.enquiry_rate_buckets enable row level security;
revoke all on public.enquiries, public.enquiry_notifications, public.enquiry_rate_buckets from public, anon, authenticated;
grant select, insert, update, delete on public.enquiries, public.enquiry_notifications, public.enquiry_rate_buckets to service_role;

create or replace function public.accept_enquiry(p_request_id uuid, p_request_hash text, p_rate_key text, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  existing public.enquiries%rowtype;
  accepted_id uuid;
  count_in_window integer;
  window_start timestamptz := to_timestamp(floor(extract(epoch from now()) / 900) * 900);
  notification_state text;
begin
  select * into existing from public.enquiries where request_id = p_request_id;
  if found then
    if existing.request_hash <> p_request_hash then raise exception 'enquiry_idempotency_conflict'; end if;
    select status into notification_state from public.enquiry_notifications where enquiry_id = existing.id;
    return jsonb_build_object('enquiry_id', existing.id, 'duplicate', true, 'notification', notification_state);
  end if;
  delete from public.enquiry_rate_buckets where bucket_start < now() - interval '1 day';
  insert into public.enquiry_rate_buckets(key_hash, bucket_start) values (p_rate_key, window_start)
    on conflict (key_hash, bucket_start) do update set attempts = enquiry_rate_buckets.attempts + 1
    returning attempts into count_in_window;
  if count_in_window > 5 then raise exception 'enquiry_rate_limit'; end if;
  insert into public.enquiries(request_id, request_hash, name, company, location, email, phone, service, budget, description, consultation, consent)
    values (p_request_id, p_request_hash, p_payload->>'name', p_payload->>'company', p_payload->>'location', p_payload->>'email', p_payload->>'phone', p_payload->>'service', p_payload->>'budget', p_payload->>'description', (p_payload->>'consultation')::boolean, (p_payload->>'consent')::boolean)
    on conflict (request_id) do nothing returning id into accepted_id;
  if accepted_id is null then
    select * into existing from public.enquiries where request_id = p_request_id;
    if existing.request_hash <> p_request_hash then raise exception 'enquiry_idempotency_conflict'; end if;
    accepted_id := existing.id;
  end if;
  insert into public.enquiry_notifications(enquiry_id) values (accepted_id) on conflict (enquiry_id) do nothing;
  select status into notification_state from public.enquiry_notifications where enquiry_id = accepted_id;
  return jsonb_build_object('enquiry_id', accepted_id, 'notification', notification_state);
end;
$$;

create or replace function public.claim_enquiry_notification(p_enquiry_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  lead public.enquiries%rowtype;
  claimed uuid;
begin
  if exists (select 1 from public.enquiry_notifications where enquiry_id = p_enquiry_id and status = 'sent') then return jsonb_build_object('sent', true); end if;
  update public.enquiry_notifications set status = 'sending', attempts = attempts + 1, locked_until = now() + interval '2 minutes'
    where enquiry_id = p_enquiry_id and status <> 'sent' and attempts < 8 and (locked_until is null or locked_until < now())
    returning id into claimed;
  if claimed is null then return null; end if;
  select * into lead from public.enquiries where id = p_enquiry_id;
  return jsonb_build_object('sent', false, 'lead', to_jsonb(lead));
end;
$$;
revoke all on function public.accept_enquiry(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.claim_enquiry_notification(uuid) from public, anon, authenticated;
grant execute on function public.accept_enquiry(uuid, text, text, jsonb) to service_role;
grant execute on function public.claim_enquiry_notification(uuid) to service_role;
create index if not exists enquiry_notifications_due on public.enquiry_notifications (status, next_attempt_at);
create index if not exists enquiries_created_at on public.enquiries(created_at desc);
