-- Return-It core schema.
-- Money is stored in pence as integers. Timestamps are UTC.

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────

create type ingestion_source as enum ('forward', 'upload', 'outlook', 'gmail');
create type parse_status     as enum ('pending', 'parsed', 'failed', 'not_a_return');
create type label_type       as enum ('pdf', 'qr', 'link', 'none');

create type return_status as enum (
  'detected', 'confirmed', 'dismissed', 'scheduled',
  'collected', 'dropped_off', 'completed', 'expired'
);

create type pickup_mode   as enum ('carrier_direct', 'concierge');
create type pickup_status as enum (
  'requested', 'confirmed', 'en_route', 'collected',
  'dropped_off', 'completed', 'cancelled', 'failed'
);

-- ── Users ───────────────────────────────────────────────────────────────────

create table app_users (
  id                        uuid primary key default gen_random_uuid(),
  auth_user_id              uuid unique,
  email                     text not null,
  -- The unique inbound address, e.g. lola-4f2@in.return-it.co.uk.
  ingest_address            text unique,
  -- Consent is recorded, never implied. Revocation is a state, not a delete.
  ingest_consent_at         timestamptz,
  ingest_consent_revoked_at timestamptz,
  created_at                timestamptz not null default now()
);

create index app_users_ingest_address_idx on app_users (ingest_address);

-- ── Raw documents ───────────────────────────────────────────────────────────

-- The ingestion audit trail and the parser's training corpus. Raw bytes live
-- in object storage; only the key is stored here.
create table raw_documents (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references app_users(id) on delete cascade,
  source              ingestion_source not null,
  received_at         timestamptz not null,
  sender_domain       text,
  subject             text,
  raw_storage_key     text not null,
  parse_status        parse_status not null default 'pending',
  parser_version      text,
  retention_expires_at timestamptz not null,
  created_at          timestamptz not null default now()
);

create index raw_documents_user_idx      on raw_documents (user_id, received_at desc);
create index raw_documents_retention_idx on raw_documents (retention_expires_at);

-- ── Detected returns ────────────────────────────────────────────────────────

create table detected_returns (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references app_users(id) on delete cascade,
  raw_document_id      uuid references raw_documents(id) on delete set null,
  retailer             text,
  retailer_display_name text,
  order_ref            text,
  return_id            text,
  deadline             date,
  deadline_confidence  numeric(3,2) not null default 0,
  carrier              text,
  label_type           label_type not null default 'none',
  label_storage_key    text,
  item_description     text,
  confidence           numeric(3,2) not null default 0,
  status               return_status not null default 'detected',
  needs_review         boolean not null default true,
  -- The parser proposes and the user corrects. Corrections are stored as a
  -- patch ALONGSIDE the original extraction, never over it, so parser
  -- accuracy stays measurable without re-reading raw documents.
  user_corrections     jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- The dashboard's primary read: soonest-expiring first.
create index detected_returns_triage_idx
  on detected_returns (user_id, deadline asc nulls last)
  where status in ('detected', 'confirmed');

-- ── Pickup orders ───────────────────────────────────────────────────────────

create table pickup_orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references app_users(id) on delete cascade,
  -- An array because bundling is the DEFAULT shape, not a special case:
  -- density is the entire business model.
  detected_return_ids   uuid[] not null default '{}',
  address_line          text not null,
  postcode              text not null,
  window_date           date not null,
  window_slot           text not null,
  mode                  pickup_mode not null,
  fulfilment_provider   text not null default 'manual',
  provider_booking_ref  text,
  parcel_count          int not null default 1,
  needs_printing        boolean not null default false,
  price_quoted_pence    int not null,
  price_charged_pence   int,
  status                pickup_status not null default 'requested',
  proof_of_collection   jsonb,
  stripe_payment_intent_id text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index pickup_orders_user_idx on pickup_orders (user_id, window_date desc);

-- ── Events ──────────────────────────────────────────────────────────────────

-- Append-only. Satisfies the PRD's audit-log requirement AND backs the
-- user-facing tracking timeline, so the two cannot drift apart.
create table events (
  id          uuid primary key default gen_random_uuid(),
  actor_type  text not null,
  actor_id    text,
  entity_type text not null,
  entity_id   uuid not null,
  type        text not null,
  payload     jsonb,
  at          timestamptz not null default now()
);

create index events_entity_idx on events (entity_type, entity_id, at desc);
