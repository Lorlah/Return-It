# Compliance Register

> Maintained by the `compliance-advisor` agent. This is the standing record of
> Return-It's security, privacy and compliance posture — so conclusions aren't
> re-derived every session, and so there's something to hand an investor, a grant
> assessor, or a DPA counterparty.

**Jurisdiction:** UK GDPR + Data Protection Act 2018. Regulator: ICO.
**Last reviewed:** 2026-08-29 (F-1, F-3 closed)
**Confidence key:** ✅ verified · ⚠️ partial · ❓ unconfirmed · 💭 inference

---

## 1. Why this project's surface is sharper than most

Return-It stores **the contents of people's email inboxes** and **return labels
bearing their home addresses**. That is not ordinary account data. Two consequences
run through everything below:

- A label PDF is a **home address in a file**. Anywhere one is stored, served or
  linked is an address disclosure surface.
- Inbox contents are **volunteered under a specific, narrow purpose** ("we only
  process what you forward us"). Any use beyond return detection needs its own basis.

---

## 2. Sub-processors

Every third party below processes personal data on our behalf. Under UK GDPR each
must be disclosed to users, covered by a DPA, and listed in the privacy policy.
**Adding one after users have consented is a re-consent event, not a config change.**

| Processor | Purpose | Personal data | Region | DPA | Status |
|---|---|---|---|---|---|
| **Supabase** | Primary database | Email, addresses, inbox-derived returns | ✅ **eu-west-2 (London)** | ❓ not signed | Live, empty |
| **Resend** | Transactional email (+ inbound, planned) | Email addresses, message content | ❓ | ❓ not signed | Configured, no keys |
| ~~Cloudinary~~ | ~~Label file storage~~ | — | — | — | ✅ **Removed 2026-08-28** (F-1) |
| **Supabase Storage** | Label files, private bucket | Home addresses (in label PDFs) | ✅ eu-west-2 (London) | ❓ not signed | Live, signed URLs only |
| **Airtable** | MVP form submissions | Name, email, phone, address, label URL | ❓ likely US | ❓ not signed | Live in code — to be retired |
| **PostHog** | Product analytics | Events; spec says no PII | ❓ | ❓ not signed | Configured, no keys |
| **Vercel** | Hosting | Request logs, IPs | ❓ | ❓ not signed | Planned |
| **Stripe** | Payments | Payment data | — | ❓ | Not built |
| **GitHub Pages** | Current static host | Request logs | US | n/a | Live |

⚠️ **No DPA is in place with any processor.** For a pre-launch project with no real
users this is not yet a breach — but it must be closed before the first pilot user's
data lands. **Supabase and Resend are the two that matter first.**

---

## 3. Lawful basis

| Processing activity | Basis | State |
|---|---|---|
| Email ingestion (forwarding) | **Consent** — explicit, specific, revocable | ✅ Schema records `ingest_consent_at` / `ingest_consent_revoked_at`; repository treats a revoked user as absent, so ingestion stops immediately |
| Return detection / parsing | Consent (same act) | ✅ Same |
| Pickup fulfilment | **Contract** | Not built |
| Analytics | **Consent** (UK PECR — cookies need consent) | ⚠️ PostHog configured; no consent banner exists |
| Marketing email | **Consent** | Not built |

💭 The forwarding model gives a genuinely stronger consent story than OAuth: *"we only
ever see what you forward us"* is literally true, narrowly scoped, and easy to explain.
That is a compliance asset, not just a technical choice.

---

## 4. Retention

| Data class | Policy | Enforced? |
|---|---|---|
| `raw_documents` | **90 days** | ✅ Job built (`/api/cron/retention`). ⚠️ **Not yet scheduled** — wire at deploy. |
| `detected_returns` | Undefined | ❌ Not set |
| `pickup_orders` | Undefined — likely 6yr (UK tax) | ❌ Not set |
| `events` (audit log) | Undefined | ❌ Not set |
| Label files | Follows `raw_documents` | ✅ Deleted by the same sweep |

💭 `detected_returns`, `pickup_orders` and `events` still have no defined policy.
Lower risk — they hold structured fields, not correspondence — but they should be set
before launch, since an absent policy defaults to "forever" in practice.

---

## 5. Findings

### F-1 · Return labels are served from unauthenticated permanent URLs — ✅ **CLOSED 2026-08-28**

**Reversibility: irreversible once URLs are issued.** ⛔

`lib/cloudinary.ts` uploads with an **unsigned preset** (`upload_preset`, no
`access_mode: authenticated`, no signed delivery) and returns `secure_url`.
`lib/airtable.ts` then stores that URL as "Label URL".

**A return label carries the user's full home address.** So each upload creates a
permanent, unauthenticated URL to a document containing someone's home address, with
no revocation, readable by anyone holding the link or with Airtable access.

⚠️ Nuance: the URLs contain a random public ID, so they are not trivially enumerable.
But that is obscurity, not access control — and it does not survive a link being
forwarded, logged, or leaked.

**This contradicts the project's own spec** (§9: *"Labels and pickup details encrypted
at rest, served only via signed URLs"*). Intent was right; the code does the opposite.

**Why irreversible:** every URL already issued stays live and cannot be recalled.
Rotating later protects future uploads only.

**Fix:** move label storage to **Supabase Storage in a private bucket**, serve via
short-lived signed URLs, and store the object key — never the URL — in the database.
Consolidates onto a processor already in the correct region and removes Cloudinary as
a sub-processor entirely.

**Cheap version if the full move is deferred:** set the Cloudinary preset to
authenticated delivery and generate time-limited signed URLs. Removes the permanence
without a migration.

💭 **Practical note:** no real user labels existed, so the blast radius was zero.

**✅ Resolution (2026-08-28):** label storage moved to the private Supabase Storage
bucket `return-labels` (10MB cap, PDF/PNG/JPEG/HEIC only). `lib/storage.ts` now
uploads under `${userId}/${uuid}.${ext}`, returns the **object key only**, and serves
via signed URLs with a **300-second default TTL**. `lib/cloudinary.ts` is deleted and
the `CLOUDINARY_*` variables are removed from `.env.example` — **Cloudinary is no
longer a sub-processor.** `labelUrl` is renamed to `labelStorageKey` throughout, so no
URL is persisted anywhere. `deleteLabel()` added to support the erasure right.
20 tests; 139 passing overall.

### F-2 · No consent mechanism for analytics — **OPEN**

**Reversibility: reversible.** Logged, not escalated.

PostHog is wired but no consent banner exists. UK PECR requires consent for
non-essential cookies/tracking. Not urgent while unlaunched; must exist before public
traffic.

### F-3 · Retention is declared but unenforced — ✅ **CLOSED 2026-08-29**

**Reversibility: partially irreversible.** Data retained past its stated policy cannot
be un-retained, and the stated policy is what we would be held to.

**✅ Resolution (2026-08-29):** `lib/ingest/retention.ts` sweeps expired
`raw_documents` and deletes both the rows and the storage objects they reference.
Exposed at `POST /api/cron/retention`, bearer-token protected with a timing-safe
comparison that **fails closed when `CRON_SECRET` is unset** — an unprotected
deletion endpoint being considerably worse than an unprotected read one. The
Postgres implementation uses delete-with-returning, so there is no window in which a
row could change between reading its storage key and deleting it. Individual storage
failures are collected and reported rather than aborting the sweep, and every sweep
appends one audit event. **Retention period: 90 days** (founder decision).
12 tests; 157 passing overall.

⚠️ **Still needs a scheduler.** The endpoint exists but nothing calls it yet — wire
Vercel Cron (or equivalent) at deploy time, or retention remains theoretical.

---

## 6. Open obligations

| Obligation | Why | Status |
|---|---|---|
| **ICO registration + data protection fee** | ✅ UK controllers must register and pay. **Tier 1 (≤10 staff or ≤£632k turnover) is £52/yr**; tiers run £52–£3,763. Some exemptions exist — the [ICO self-assessment](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee-self-assessment/) confirms which applies. ([Guide to the fee](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/)) | ❌ **Not registered.** Cheap, has lead time, trivially forgotten. Do before first user. |
| **DPAs with Supabase and Resend** | Both will process personal data | ❌ Not signed |
| **Privacy policy** | Required; must list sub-processors and lawful bases | ❌ Does not exist |
| **Subject access / erasure process** | UK GDPR rights. FK cascades cover the DB; `deleteLabel()` now covers label objects. Still needs an orchestrating flow. | ⚠️ Partial |
| **Retention job** | See F-3 | ✅ Built · ⚠️ not scheduled |
| **Royal Mail clause 14.7 notification** | Contractual, not data protection. Founder decision: defer until ~20 collections/week. ⚠️ Note the 20/week figure is RM *recommending a business account*, not a 14.7 threshold — 14.7 has no volume condition | ⏸️ Deferred by decision |
| **Google CASA** | Only if Gmail OAuth is pursued (v2). Restricted scope ⇒ Tier 2 mandatory; ⚠️ public cost reports conflict ($500–4,500 vs $15k–75k) — get a quote from an authorised assessor before planning on it | ⏸️ Out of scope for v1 |

---

## 7. Decisions taken

| Date | Decision | Rationale |
|---|---|---|
| 2026-08-26 | **Forwarding-based ingestion, not Gmail OAuth, for v1** | Avoids restricted scopes entirely: no CASA, no 100-user cap, no 7-day token expiry. Also a narrower, more honest consent story. |
| 2026-08-26 | **Supabase over Airtable** | Airtable cannot do row-level security, encrypted blobs with signed URLs, or a credible append-only audit log — all three of which the PRD requires. |
| 2026-08-28 | **Supabase project in eu-west-2 (London)**, not the existing eu-west-1 | UK data residency for inbox contents. Chosen over reusing an existing Ireland-region project. |
| 2026-08-28 | **Default-deny RLS on all five tables** | Enabling RLS without a matching policy blocks access entirely — the correct direction to fail. ✅ Zero security-advisor lints. |
| 2026-08-28 | **Webhook signature verification fails closed on a missing secret** | The inbound address is publicly reachable; an unset env var must never read as "accept everything". |
| 2026-08-28 | **Label storage on private Supabase Storage with 300s signed URLs** | Closes F-1. Short TTL means a leaked link expires in five minutes rather than never. Also consolidates onto a processor already in the correct region and removes a sub-processor. |
| 2026-08-29 | **90-day retention on raw documents, enforced by a sweep** | Founder decision on the period. Raw email bodies are the most sensitive thing held; the sweep removes both rows and label objects. |
| 2026-08-28 | **Consent revocation is a state, not a delete** | Enables immediate ingestion stop while preserving the audit trail of what was consented to and when. |

---

## 8. Controls in place

✅ Row-level security, default-deny, all five tables · ✅ Timing-safe HMAC webhook
verification, fails closed · ✅ Consent recorded as timestamps, revocation halts
ingestion at the repository layer · ✅ Append-only `events` audit log, not
client-writable · ✅ Service-role key isolated server-side with an explicit
never-import-client-side warning · ✅ Raw bytes stored by key, never inline in the
database · ✅ All webhook input treated as attacker-controlled; malformed payloads
return null rather than throwing · ✅ UK data residency for the primary datastore · ✅ Label files in a private bucket,
served only via short-lived signed URLs, referenced by key never by URL.

---

## 9. Next review

Trigger a review when: a new third party is introduced · the data model changes ·
before the first real pilot user · before any public launch · if Gmail OAuth is
revisited.
