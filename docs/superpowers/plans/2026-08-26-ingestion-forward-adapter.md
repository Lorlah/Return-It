# Schema + Forward Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist the data model as versioned SQL, and build the ingestion path that turns a forwarded email into a stored `RawReturnDocument` — without blocking on live database credentials.

**Architecture:** Layer 1 of the three-layer design. The schema ships as plain SQL migrations that can be applied to Supabase whenever it's connected. The adapter itself is split into pure transformation (fully testable, no I/O) and a thin repository interface with an in-memory implementation, so the whole ingestion path is exercisable today and swaps to Postgres by changing one binding.

**Tech Stack:** TypeScript (strict), Vitest, PostgreSQL (Supabase), Next.js route handlers. No new runtime dependencies for the testable core.

**Spec:** `docs/superpowers/specs/2026-08-26-core-product-v1-design.md` (§4 data model, §5.1 ForwardAdapter, §9 privacy)

**Prior plan:** `docs/superpowers/plans/2026-08-26-parser-core.md` — complete, 65 tests, 100% fixture accuracy.

## Global Constraints

- **TypeScript strict mode.** No `any`, no non-null assertions (`!`).
- **Path alias:** `@/*` maps to the repo root.
- **Code style:** match `lib/pricing.ts` and `lib/parser/*` — named exports, `interface` for object shapes, `type` for unions, `// ── Section ───────` comments.
- **No live-credential dependency in tests.** Every test in this plan must pass with no environment variables set. Anything needing a real database goes behind the repository interface and is tested against the in-memory implementation.
- **Pure transformation stays pure.** Parsing an inbound webhook payload into a `RawReturnDocument` performs no I/O.
- **Untrusted input.** An inbound address is publicly reachable. Every field of a webhook payload is attacker-controlled until verified.
- **Money in pence, timestamps in UTC.**
- **SQL migrations are append-only.** Never edit an applied migration; add a new one.

---

## File structure

| File | Responsibility |
|---|---|
| `supabase/migrations/0001_initial_schema.sql` | Tables, enums, indexes |
| `supabase/migrations/0002_rls_policies.sql` | Row-level security |
| `lib/ingest/address.ts` | Ingest-address generation and parsing |
| `lib/ingest/inbound.ts` | Webhook payload → `RawReturnDocument` (pure) |
| `lib/ingest/signature.ts` | Webhook signature verification |
| `lib/ingest/repository.ts` | Storage interface + in-memory implementation |
| `tests/ingest/*.test.ts` | One test file per module |

---

### Task 1: Database schema

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`

**Interfaces:**
- Consumes: nothing
- Produces: the tables every later task and plan reads

> **Not applied automatically.** Supabase is not yet connected. This migration is written to be applied with `supabase db push` (or pasted into the SQL editor) once it is. Nothing in this plan's tests depends on it having run.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0001_initial_schema.sql`:

```sql
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
```

- [ ] **Step 2: Verify the SQL parses**

Run: `grep -c "create table" supabase/migrations/0001_initial_schema.sql`
Expected: `5`

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0001_initial_schema.sql
git commit -m "feat(db): initial schema for users, documents, returns, pickups, events"
```

---

### Task 2: Row-level security

**Files:**
- Create: `supabase/migrations/0002_rls_policies.sql`

**Interfaces:**
- Consumes: Task 1's tables
- Produces: RLS enforcement

> The spec's §9 requires a user can only ever reach their own rows. Enabling RLS without policies denies everything by default, which is the safe direction to fail.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0002_rls_policies.sql`:

```sql
-- Row-level security. Default-deny: enabling RLS with no matching policy
-- blocks access entirely, which is the correct direction to fail.

alter table app_users        enable row level security;
alter table raw_documents    enable row level security;
alter table detected_returns enable row level security;
alter table pickup_orders    enable row level security;
alter table events           enable row level security;

-- Users see only themselves.
create policy app_users_self on app_users
  for all using (auth_user_id = auth.uid());

-- Everything else is reachable only through ownership of the parent user row.
create policy raw_documents_own on raw_documents
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

create policy detected_returns_own on detected_returns
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

create policy pickup_orders_own on pickup_orders
  for all using (
    user_id in (select id from app_users where auth_user_id = auth.uid())
  );

-- Events are readable by the owner of the entity but never writable from the
-- client: the audit log must only be appended server-side.
create policy events_read_own on events
  for select using (
    entity_id in (
      select id from detected_returns
      where user_id in (select id from app_users where auth_user_id = auth.uid())
      union
      select id from pickup_orders
      where user_id in (select id from app_users where auth_user_id = auth.uid())
    )
  );
```

- [ ] **Step 2: Verify every table is covered**

Run: `grep -c "enable row level security" supabase/migrations/0002_rls_policies.sql`
Expected: `5`

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0002_rls_policies.sql
git commit -m "feat(db): row-level security policies, default-deny"
```

---

### Task 3: Ingest address generation and parsing

**Files:**
- Create: `lib/ingest/address.ts`
- Test: `tests/ingest/address.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `generateIngestAddress(displayName: string, nonce: string): string`, `parseIngestAddress(address: string): { slug: string; nonce: string } | null`, `INGEST_DOMAIN`

- [ ] **Step 1: Write the failing test**

Create `tests/ingest/address.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  generateIngestAddress,
  parseIngestAddress,
  INGEST_DOMAIN,
} from "@/lib/ingest/address";

describe("generateIngestAddress", () => {
  it("builds a slug-nonce address at the ingest domain", () => {
    expect(generateIngestAddress("Lola", "4f2a")).toBe(`lola-4f2a@${INGEST_DOMAIN}`);
  });

  it("lowercases and strips unsafe characters from the name", () => {
    expect(generateIngestAddress("Lola O'Salehu!", "abcd")).toBe(
      `lolaosalehu-abcd@${INGEST_DOMAIN}`,
    );
  });

  it("collapses whitespace to a single hyphen", () => {
    expect(generateIngestAddress("Mary  Jane", "abcd")).toBe(
      `mary-jane-abcd@${INGEST_DOMAIN}`,
    );
  });

  it("falls back to a generic slug when the name has no usable characters", () => {
    expect(generateIngestAddress("!!!", "abcd")).toBe(`user-abcd@${INGEST_DOMAIN}`);
  });

  it("truncates a very long name", () => {
    const addr = generateIngestAddress("a".repeat(100), "abcd");
    expect(addr.split("@")[0].length).toBeLessThanOrEqual(37);
  });
});

describe("parseIngestAddress", () => {
  it("round-trips a generated address", () => {
    const addr = generateIngestAddress("Lola", "4f2a");
    expect(parseIngestAddress(addr)).toEqual({ slug: "lola", nonce: "4f2a" });
  });

  it("is case insensitive", () => {
    expect(parseIngestAddress(`LOLA-4F2A@${INGEST_DOMAIN}`)).toEqual({
      slug: "lola",
      nonce: "4f2a",
    });
  });

  it("handles a hyphenated slug", () => {
    expect(parseIngestAddress(`mary-jane-abcd@${INGEST_DOMAIN}`)).toEqual({
      slug: "mary-jane",
      nonce: "abcd",
    });
  });

  it("rejects an address at the wrong domain", () => {
    expect(parseIngestAddress("lola-4f2a@example.com")).toBeNull();
  });

  it("rejects an address with no nonce", () => {
    expect(parseIngestAddress(`lola@${INGEST_DOMAIN}`)).toBeNull();
  });

  it("rejects malformed input without throwing", () => {
    expect(parseIngestAddress("not-an-address")).toBeNull();
    expect(parseIngestAddress("")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/ingest/address.test.ts`
Expected: FAIL — cannot resolve `@/lib/ingest/address`.

- [ ] **Step 3: Write the implementation**

Create `lib/ingest/address.ts`:

```ts
export const INGEST_DOMAIN = "in.return-it.co.uk";

// A 4+ character hex nonce. Without it, addresses would be guessable from a
// user's name alone, and anyone could post mail into another user's inbox.
const NONCE_PATTERN = "[a-f0-9]{4,}";

const ADDRESS_PATTERN = new RegExp(
  `^([a-z0-9]+(?:-[a-z0-9]+)*)-(${NONCE_PATTERN})@${INGEST_DOMAIN.replace(/\./g, "\\.")}$`,
  "i",
);

const MAX_SLUG_LENGTH = 32;

// ── Generation ──────────────────────────────────────────────────────────────

function slugify(displayName: string): string {
  const slug = displayName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-$/, "");

  return slug.length > 0 ? slug : "user";
}

/**
 * Build a user's unique inbound address.
 *
 * The nonce is what makes the address unguessable — the slug alone is
 * derivable from a display name.
 */
export function generateIngestAddress(displayName: string, nonce: string): string {
  return `${slugify(displayName)}-${nonce.toLowerCase()}@${INGEST_DOMAIN}`;
}

// ── Parsing ─────────────────────────────────────────────────────────────────

/**
 * Split an inbound address back into slug and nonce.
 *
 * Returns null for anything not matching our own address format — including
 * addresses at other domains. Never throws: this runs on untrusted input.
 */
export function parseIngestAddress(
  address: string,
): { slug: string; nonce: string } | null {
  const m = ADDRESS_PATTERN.exec(address.trim());
  if (!m) return null;
  return { slug: m[1].toLowerCase(), nonce: m[2].toLowerCase() };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/ingest/address.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/ingest/address.ts tests/ingest/address.test.ts
git commit -m "feat(ingest): unique per-user inbound address generation and parsing"
```

---

### Task 4: Inbound payload → RawReturnDocument

**Files:**
- Create: `lib/ingest/inbound.ts`
- Test: `tests/ingest/inbound.test.ts`

**Interfaces:**
- Consumes: `RawReturnDocument`, `Attachment` from `@/lib/parser/types`; `parseIngestAddress` from Task 3
- Produces: `parseInboundPayload(payload: unknown, userId: string): RawReturnDocument | null`, `extractRecipientAddress(payload: unknown): string | null`, `type InboundEmailPayload`

> Every field here is attacker-controlled. The function validates shape before trusting anything and returns null rather than throwing on malformed input.

- [ ] **Step 1: Write the failing test**

Create `tests/ingest/inbound.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseInboundPayload, extractRecipientAddress } from "@/lib/ingest/inbound";

const valid = {
  to: "lola-4f2a@in.return-it.co.uk",
  from: "SHEIN <noreply@sheinnotice.com>",
  subject: "You have received a EVRI return label from SHEIN",
  text: "Order number: GSO187019000B2Y",
  receivedAt: "2026-08-14T09:31:00Z",
  attachments: [
    { filename: "label.pdf", contentType: "application/pdf", size: 48211 },
  ],
};

describe("parseInboundPayload", () => {
  it("builds a RawReturnDocument from a valid payload", () => {
    const doc = parseInboundPayload(valid, "user-1");
    expect(doc?.userId).toBe("user-1");
    expect(doc?.source).toBe("forward");
    expect(doc?.senderDomain).toBe("sheinnotice.com");
    expect(doc?.subject).toBe(valid.subject);
    expect(doc?.body).toBe(valid.text);
  });

  it("extracts the sender domain from a bare address", () => {
    const doc = parseInboundPayload({ ...valid, from: "noreply@asos.com" }, "u");
    expect(doc?.senderDomain).toBe("asos.com");
  });

  it("lowercases the sender domain", () => {
    const doc = parseInboundPayload({ ...valid, from: "X <a@ASOS.COM>" }, "u");
    expect(doc?.senderDomain).toBe("asos.com");
  });

  it("maps attachments to the parser's shape", () => {
    const doc = parseInboundPayload(valid, "u");
    expect(doc?.attachments).toEqual([
      { filename: "label.pdf", mimeType: "application/pdf", sizeBytes: 48211 },
    ]);
  });

  it("tolerates a missing attachments array", () => {
    const { attachments, ...withoutAttachments } = valid;
    expect(parseInboundPayload(withoutAttachments, "u")?.attachments).toEqual([]);
  });

  it("falls back to the html field when text is absent", () => {
    const { text, ...rest } = valid;
    const doc = parseInboundPayload({ ...rest, html: "<p>Hello</p>" }, "u");
    expect(doc?.body).toContain("Hello");
  });

  it("strips HTML tags from an html-only body", () => {
    const { text, ...rest } = valid;
    const doc = parseInboundPayload({ ...rest, html: "<p>Order <b>123</b></p>" }, "u");
    expect(doc?.body).not.toContain("<");
  });

  it("returns null when the payload is not an object", () => {
    expect(parseInboundPayload(null, "u")).toBeNull();
    expect(parseInboundPayload("string", "u")).toBeNull();
    expect(parseInboundPayload(42, "u")).toBeNull();
  });

  it("returns null when there is no sender", () => {
    const { from, ...rest } = valid;
    expect(parseInboundPayload(rest, "u")).toBeNull();
  });

  it("returns null when there is no body of any kind", () => {
    const { text, ...rest } = valid;
    expect(parseInboundPayload(rest, "u")).toBeNull();
  });

  it("defaults receivedAt to now when absent or unparseable", () => {
    const { receivedAt, ...rest } = valid;
    const doc = parseInboundPayload(rest, "u");
    expect(doc?.receivedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(doc?.receivedAt.getTime())).toBe(false);
  });

  it("ignores attachment entries that are not objects", () => {
    const doc = parseInboundPayload({ ...valid, attachments: [null, "x", 1] }, "u");
    expect(doc?.attachments).toEqual([]);
  });

  it("does not throw on a deeply malformed payload", () => {
    expect(() =>
      parseInboundPayload({ from: 1, subject: [], text: {}, attachments: "no" }, "u"),
    ).not.toThrow();
  });
});

describe("extractRecipientAddress", () => {
  it("reads the to field", () => {
    expect(extractRecipientAddress(valid)).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("unwraps a display-name form", () => {
    expect(
      extractRecipientAddress({ to: "Lola <lola-4f2a@in.return-it.co.uk>" }),
    ).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("takes the first of several recipients", () => {
    expect(
      extractRecipientAddress({ to: "lola-4f2a@in.return-it.co.uk, x@y.com" }),
    ).toBe("lola-4f2a@in.return-it.co.uk");
  });

  it("returns null when absent or malformed", () => {
    expect(extractRecipientAddress({})).toBeNull();
    expect(extractRecipientAddress(null)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/ingest/inbound.test.ts`
Expected: FAIL — cannot resolve `@/lib/ingest/inbound`.

- [ ] **Step 3: Write the implementation**

Create `lib/ingest/inbound.ts`:

```ts
import type { Attachment, RawReturnDocument } from "@/lib/parser/types";

export interface InboundEmailPayload {
  to?: unknown;
  from?: unknown;
  subject?: unknown;
  text?: unknown;
  html?: unknown;
  receivedAt?: unknown;
  attachments?: unknown;
}

// ── Guards ──────────────────────────────────────────────────────────────────

// Everything arriving here is attacker-controlled: the inbound address is
// publicly reachable, so shape is validated before any field is trusted.

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

// ── Address handling ────────────────────────────────────────────────────────

const ANGLE_ADDRESS = /<([^<>@\s]+@[^<>\s]+)>/;
const BARE_ADDRESS = /([^<>@\s,]+@[^<>\s,]+)/;

/** Pull a plain email address out of a header value. */
function firstAddress(header: string): string | null {
  const angled = ANGLE_ADDRESS.exec(header);
  if (angled) return angled[1].trim();

  const bare = BARE_ADDRESS.exec(header);
  return bare ? bare[1].trim() : null;
}

/** The address the mail was sent TO — identifies which user owns it. */
export function extractRecipientAddress(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const to = asString(payload.to);
  return to ? firstAddress(to) : null;
}

function senderDomain(from: string): string | null {
  const address = firstAddress(from);
  if (!address) return null;
  const at = address.lastIndexOf("@");
  return at === -1 ? null : address.slice(at + 1).toLowerCase();
}

// ── Body handling ───────────────────────────────────────────────────────────

/**
 * Reduce an HTML body to readable text.
 *
 * Deliberately crude — the parser works on prose, not markup, and pulling in
 * a full HTML parser for this would be a runtime dependency we don't need.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

// ── Attachments ─────────────────────────────────────────────────────────────

function toAttachments(raw: unknown): Attachment[] {
  if (!Array.isArray(raw)) return [];

  const out: Attachment[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const filename = asString(item.filename) ?? asString(item.name);
    const mimeType = asString(item.contentType) ?? asString(item.mimeType);
    if (!filename || !mimeType) continue;
    out.push({
      filename,
      mimeType: mimeType.toLowerCase(),
      sizeBytes: typeof item.size === "number" ? item.size : 0,
    });
  }
  return out;
}

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Turn an inbound-email webhook payload into a `RawReturnDocument`.
 *
 * Returns null rather than throwing when the payload is unusable — a
 * malformed inbound email is an expected event, not an exceptional one.
 */
export function parseInboundPayload(
  payload: unknown,
  userId: string,
): RawReturnDocument | null {
  if (!isRecord(payload)) return null;

  const from = asString(payload.from);
  if (!from) return null;

  const domain = senderDomain(from);
  if (!domain) return null;

  const text = asString(payload.text);
  const html = asString(payload.html);
  const body = text ?? (html ? htmlToText(html) : null);
  if (!body) return null;

  const receivedRaw = asString(payload.receivedAt);
  const received = receivedRaw ? new Date(receivedRaw) : new Date();

  return {
    userId,
    source: "forward",
    receivedAt: Number.isNaN(received.getTime()) ? new Date() : received,
    senderDomain: domain,
    subject: asString(payload.subject) ?? "",
    body,
    attachments: toAttachments(payload.attachments),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/ingest/inbound.test.ts`
Expected: PASS, 17 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/ingest/inbound.ts tests/ingest/inbound.test.ts
git commit -m "feat(ingest): parse inbound email webhook payloads defensively"
```

---

### Task 5: Webhook signature verification

**Files:**
- Create: `lib/ingest/signature.ts`
- Test: `tests/ingest/signature.test.ts`

**Interfaces:**
- Consumes: Node's `crypto`
- Produces: `verifyWebhookSignature(rawBody: string, signature: string | null, secret: string | null): boolean`

- [ ] **Step 1: Write the failing test**

Create `tests/ingest/signature.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "@/lib/ingest/signature";

const SECRET = "test-secret";
const BODY = '{"from":"a@b.com"}';

function sign(body: string, secret = SECRET): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyWebhookSignature", () => {
  it("accepts a correct signature", () => {
    expect(verifyWebhookSignature(BODY, sign(BODY), SECRET)).toBe(true);
  });

  it("accepts a signature with a sha256= prefix", () => {
    expect(verifyWebhookSignature(BODY, `sha256=${sign(BODY)}`, SECRET)).toBe(true);
  });

  it("rejects a signature over different content", () => {
    expect(verifyWebhookSignature(BODY, sign("other"), SECRET)).toBe(false);
  });

  it("rejects a signature made with a different secret", () => {
    expect(verifyWebhookSignature(BODY, sign(BODY, "wrong"), SECRET)).toBe(false);
  });

  it("rejects a missing signature", () => {
    expect(verifyWebhookSignature(BODY, null, SECRET)).toBe(false);
  });

  it("rejects a malformed signature without throwing", () => {
    expect(verifyWebhookSignature(BODY, "not-hex", SECRET)).toBe(false);
    expect(verifyWebhookSignature(BODY, "", SECRET)).toBe(false);
  });

  it("fails closed when no secret is configured", () => {
    // An unset secret must never mean "accept everything" — the inbound
    // address is publicly reachable.
    expect(verifyWebhookSignature(BODY, sign(BODY), null)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/ingest/signature.test.ts`
Expected: FAIL — cannot resolve `@/lib/ingest/signature`.

- [ ] **Step 3: Write the implementation**

Create `lib/ingest/signature.ts`:

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify an inbound webhook's HMAC-SHA256 signature.
 *
 * Fails closed in every ambiguous case, including a missing secret: the
 * inbound address is publicly reachable, so an unconfigured secret must
 * never be read as "accept everything".
 *
 * Comparison is timing-safe.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string | null,
): boolean {
  if (!secret || !signature) return false;

  const provided = signature.startsWith("sha256=")
    ? signature.slice("sha256=".length)
    : signature;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  // timingSafeEqual throws on length mismatch, so check first.
  if (provided.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  } catch {
    // Non-hex input reaches here.
    return false;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/ingest/signature.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/ingest/signature.ts tests/ingest/signature.test.ts
git commit -m "feat(ingest): timing-safe webhook signature verification, fails closed"
```

---

### Task 6: Repository interface and in-memory implementation

**Files:**
- Create: `lib/ingest/repository.ts`
- Test: `tests/ingest/repository.test.ts`

**Interfaces:**
- Consumes: `RawReturnDocument`, `DetectedReturn` from `@/lib/parser/types`
- Produces: `IngestRepository` interface, `InMemoryIngestRepository`, `StoredUser`

> This is the seam that lets everything above be tested with no database. The Postgres implementation lands when Supabase is connected and satisfies the same interface.

- [ ] **Step 1: Write the failing test**

Create `tests/ingest/repository.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryIngestRepository } from "@/lib/ingest/repository";
import type { RawReturnDocument } from "@/lib/parser/types";

const doc: RawReturnDocument = {
  userId: "u1",
  source: "forward",
  receivedAt: new Date("2026-08-14T09:31:00Z"),
  senderDomain: "sheinnotice.com",
  subject: "Return label",
  body: "Order number: ABC123",
  attachments: [],
};

describe("InMemoryIngestRepository", () => {
  let repo: InMemoryIngestRepository;

  beforeEach(() => {
    repo = new InMemoryIngestRepository();
  });

  it("finds a user by their ingest address", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date(),
      ingestConsentRevokedAt: null,
    });

    const found = await repo.findUserByIngestAddress("lola-4f2a@in.return-it.co.uk");
    expect(found?.id).toBe("u1");
  });

  it("matches an ingest address case-insensitively", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date(),
      ingestConsentRevokedAt: null,
    });

    expect(
      (await repo.findUserByIngestAddress("LOLA-4F2A@IN.RETURN-IT.CO.UK"))?.id,
    ).toBe("u1");
  });

  it("returns null for an unknown address", async () => {
    expect(await repo.findUserByIngestAddress("nobody@in.return-it.co.uk")).toBeNull();
  });

  it("does not return a user who has revoked consent", async () => {
    repo.addUser({
      id: "u1",
      email: "lola@example.com",
      ingestAddress: "lola-4f2a@in.return-it.co.uk",
      ingestConsentAt: new Date("2026-01-01"),
      ingestConsentRevokedAt: new Date("2026-06-01"),
    });

    expect(await repo.findUserByIngestAddress("lola-4f2a@in.return-it.co.uk")).toBeNull();
  });

  it("stores a raw document and returns an id", async () => {
    const id = await repo.saveRawDocument(doc, "storage/key/1");
    expect(id).toBeTruthy();
    expect(repo.rawDocuments).toHaveLength(1);
    expect(repo.rawDocuments[0].rawStorageKey).toBe("storage/key/1");
  });

  it("sets a retention expiry on every stored document", async () => {
    await repo.saveRawDocument(doc, "k");
    const stored = repo.rawDocuments[0];
    expect(stored.retentionExpiresAt.getTime()).toBeGreaterThan(
      stored.receivedAt.getTime(),
    );
  });

  it("appends an event", async () => {
    await repo.appendEvent({
      actorType: "system",
      actorId: null,
      entityType: "raw_document",
      entityId: "r1",
      type: "ingested",
      payload: { source: "forward" },
    });
    expect(repo.events).toHaveLength(1);
    expect(repo.events[0].type).toBe("ingested");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run tests/ingest/repository.test.ts`
Expected: FAIL — cannot resolve `@/lib/ingest/repository`.

- [ ] **Step 3: Write the implementation**

Create `lib/ingest/repository.ts`:

```ts
import type { RawReturnDocument } from "@/lib/parser/types";

export interface StoredUser {
  id: string;
  email: string;
  ingestAddress: string;
  ingestConsentAt: Date | null;
  ingestConsentRevokedAt: Date | null;
}

export interface StoredRawDocument {
  id: string;
  userId: string;
  source: RawReturnDocument["source"];
  receivedAt: Date;
  senderDomain: string;
  subject: string;
  rawStorageKey: string;
  retentionExpiresAt: Date;
}

export interface EventInput {
  actorType: string;
  actorId: string | null;
  entityType: string;
  entityId: string;
  type: string;
  payload?: Record<string, unknown>;
}

export interface StoredEvent extends EventInput {
  id: string;
  at: Date;
}

/**
 * Storage seam for the ingestion path.
 *
 * Everything upstream depends on this interface rather than on Postgres, so
 * the whole path is testable with no database. The Supabase implementation
 * satisfies the same contract.
 */
export interface IngestRepository {
  findUserByIngestAddress(address: string): Promise<StoredUser | null>;
  saveRawDocument(doc: RawReturnDocument, storageKey: string): Promise<string>;
  appendEvent(event: EventInput): Promise<void>;
}

// ── In-memory implementation ────────────────────────────────────────────────

const RETENTION_DAYS = 90;
const MS_PER_DAY = 86_400_000;

export class InMemoryIngestRepository implements IngestRepository {
  readonly users: StoredUser[] = [];
  readonly rawDocuments: StoredRawDocument[] = [];
  readonly events: StoredEvent[] = [];

  private counter = 0;

  private nextId(prefix: string): string {
    this.counter += 1;
    return `${prefix}-${this.counter}`;
  }

  addUser(user: StoredUser): void {
    this.users.push(user);
  }

  async findUserByIngestAddress(address: string): Promise<StoredUser | null> {
    const wanted = address.trim().toLowerCase();
    const found = this.users.find(
      (u) => u.ingestAddress.toLowerCase() === wanted,
    );

    // A user who has revoked consent is treated as absent: revocation must
    // stop ingestion immediately, per the PRD.
    if (!found || found.ingestConsentRevokedAt !== null) return null;
    return found;
  }

  async saveRawDocument(
    doc: RawReturnDocument,
    storageKey: string,
  ): Promise<string> {
    const id = this.nextId("raw");
    this.rawDocuments.push({
      id,
      userId: doc.userId,
      source: doc.source,
      receivedAt: doc.receivedAt,
      senderDomain: doc.senderDomain,
      subject: doc.subject,
      rawStorageKey: storageKey,
      retentionExpiresAt: new Date(
        doc.receivedAt.getTime() + RETENTION_DAYS * MS_PER_DAY,
      ),
    });
    return id;
  }

  async appendEvent(event: EventInput): Promise<void> {
    this.events.push({ ...event, id: this.nextId("evt"), at: new Date() });
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run tests/ingest/repository.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Run the full suite and typecheck**

Run: `pnpm vitest run && npx tsc --noEmit`
Expected: all tests pass; tsc exits 0.

- [ ] **Step 6: Commit**

```bash
git add lib/ingest/repository.ts tests/ingest/repository.test.ts
git commit -m "feat(ingest): repository seam with in-memory implementation"
```

---

## Definition of done

- [ ] `pnpm vitest run` passes with every test green
- [ ] `npx tsc --noEmit` exits 0
- [ ] Both SQL migrations exist and are syntactically complete
- [ ] No test requires an environment variable or network access

## Explicitly out of scope

- Applying the migrations (Supabase is not yet connected)
- The Supabase implementation of `IngestRepository`
- Object storage for raw bytes and labels
- The Next.js route handler wiring these together
- Auto-forward filter setup and Gmail's forwarding-verification code capture
- The reply-to-forward "magic moment"
- The dashboard

## Next plan

Route handler + Supabase repository implementation, once Supabase is connected.
