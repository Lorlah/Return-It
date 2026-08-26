# Return-It Core Product v1 — Design Spec

**Date:** 2026-08-26
**Status:** Draft — fulfilment section pending carrier API research
**Supersedes:** nothing. Complements `PROJECT.md` (product spec) and `CONTEXT.md` (state ledger).

---

## 1. What we're building

A working pilot for **20–100 real UK users** that takes a person from "I have returns piling up" to "they've been collected", without a trip to the Post Office.

The pilot is deliberately small: small enough to fulfil by hand, small enough to stay under Google's unverified-app ceiling, and large enough to prove the two things that actually carry risk — **can we reliably extract a return from a retailer's email**, and **will people pay for this**.

### Success criteria

| | Target |
|---|---|
| Parser accuracy | ≥85% target — **measured 100% (7/7 fixtures, 2026-08-26)**. ⚠️ Corpus is 7 fixtures across 5 senders and skews SHEIN/Temu; treat as indicative until it reaches ≥10 across ≥4 genuinely distinct retailers. Per-field: retailer, deadline, carrier, orderRef, returnId, labelType all 100%. |
| Time to first return detected | <60s from forwarding an email |
| Pilot users onboarded | 20–100 |
| Returns actually collected | ≥1 per active user |
| Compliance | Zero restricted OAuth scopes in v1 |

---

## 2. Non-goals

Explicitly out of scope for v1. Listed so they don't creep back in:

- Gmail OAuth (v2 — see §6.4)
- Driver app / routing / capacity management
- Multi-carrier automated allocation (see §8 — seam only, no integrations)
- Support ticketing (email is sufficient at this scale)
- Referral programme (designed in `BRAND-KIT.md`, built later)
- Return Cost Calculator (marketing-side, separate track)
- Native mobile app

---

## 3. Architecture

Three layers with hard boundaries, plus a fulfilment adapter layer.

```
  ForwardAdapter ─┐
   UploadAdapter ─┤
  OutlookAdapter ─┤──▶  RawReturnDocument  ──▶  Parser core  ──▶  DetectedReturn
    GmailAdapter ─┘         (choke point)         (pure)                │
     (Layer 1)                                   (Layer 2)              ▼
                                                              Dashboard + scheduling
                                                                    (Layer 3)
                                                                        │
                                                                        ▼
                                                          FulfilmentProvider adapter
                                                        (Manual │ Carrier API │ Concierge)
```

**The rule:** only Layer 1 changes when an ingestion source is added. Layers 2 and 3 never learn where the bytes came from. The same rule applies at the other end — the domain never learns which carrier collected the parcel.

Full visual: `design/architecture.html`, published at
https://claude.ai/code/artifact/a044c785-aee9-4eed-9a9f-618e0e1ed55e

### Why this shape

Ingestion is commodity; the parser is the asset. Anyone can call the Gmail API — the hard part is extracting a reliable deadline and carrier from dozens of inconsistent UK retailer templates. Building parser-first accumulates a labelled corpus from day one, which is both the defensible artifact and what makes an eventual Gmail restricted-scope application credible: we apply with measured accuracy across real retailers, not a promise.

---

## 4. Data model

Postgres via Supabase. See §4.6 for why we move off Airtable.

### 4.1 `User`

Existing fields plus:

| Field | Type | Notes |
|---|---|---|
| `ingest_address` | text unique | `lola-4f2@in.return-it.co.uk`, provisioned at signup |
| `ingest_consent_at` | timestamptz | Explicit opt-in — the PRD requires this be recorded, not implied |
| `ingest_consent_revoked_at` | timestamptz null | Revocation must be a first-class state, not a deletion |

### 4.2 `RawDocument`

The ingestion audit trail and the training corpus.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid fk | |
| `source` | enum | `forward │ upload │ outlook │ gmail` |
| `received_at` | timestamptz | |
| `sender_domain` | text | Primary retailer signal |
| `subject` | text | |
| `raw_storage_key` | text | Encrypted object storage. **Bytes never live in the DB.** |
| `parse_status` | enum | `pending │ parsed │ failed │ not_a_return` |
| `parser_version` | text | Enables measuring improvement across re-parses |
| `retention_expires_at` | timestamptz | Retention clock, enforced by scheduled job |

Kept separate from the parsed result for three reasons: we must be able to **re-parse** when the parser improves; we need originals to debug failures; and this is the most sensitive data in the system, so it carries its own retention and access rules.

### 4.3 `DetectedReturn`

The parser's output and what the dashboard renders.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid fk | |
| `raw_document_id` | uuid fk | |
| `retailer` | text | Normalised slug: `amazon-uk`, `asos`, `shein` |
| `retailer_display_name` | text | |
| `order_ref` | text null | |
| `return_id` | text null | |
| `deadline` | date null | |
| `deadline_confidence` | numeric | Separate from overall confidence — deadline is the highest-stakes field |
| `carrier` | text null | `royal-mail`, `evri`, `inpost`, … |
| `label_type` | enum | `pdf │ qr │ link │ none` |
| `label_storage_key` | text null | Signed-URL access only |
| `item_description` | text null | |
| `confidence` | numeric | Drives auto-accept vs. "is this a return?" |
| `status` | enum | `detected │ confirmed │ dismissed │ scheduled │ collected │ dropped_off │ completed │ expired` |
| `needs_review` | boolean | |
| `user_corrections` | jsonb null | See below |

**`DetectedReturn` is user-mutable.** The parser proposes; the user corrects. Corrections are stored as a JSON patch *alongside* the original extraction rather than overwriting it — so parser accuracy is measurable over time without re-reading raw documents, and every correction is training signal.

### 4.4 `PickupOrder`

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid fk | |
| `address_id` | uuid fk | |
| `detected_return_ids` | uuid[] | **Array, not a single FK** |
| `window_date` / `window_slot` | date / enum | |
| `mode` | enum | `carrier_direct │ concierge` |
| `fulfilment_provider` | text | Which adapter handled it — `manual` in v1 |
| `provider_booking_ref` | text null | Carrier's own reference, once integrated |
| `parcel_count` | int | |
| `needs_printing` | boolean | |
| `price_quoted` / `price_charged` | int | Pence |
| `status` | enum | `requested │ confirmed │ en_route │ collected │ dropped_off │ completed │ cancelled │ failed` |
| `proof_of_collection` | jsonb null | `{ photo_key, timestamp, collected_by }` |
| `stripe_payment_intent_id` | text null | |

`detected_return_ids` is an array because **bundling is the default shape, not a special case.** The unit economics in the PRD are unambiguous: density is the entire business. A schema that treats one-return-one-pickup as the norm would fight the business model.

### 4.5 `Event`

Append-only: `id, actor_type, actor_id, entity_type, entity_id, type, payload, at`.

The PRD mandates audit logs for admin actions. Making it the general event spine means the user-facing tracking timeline is a read over this table rather than a second system that can drift out of sync.

### 4.6 Storage: move off Airtable

Airtable was correct for capturing form submissions. It is wrong for holding people's inbox contents. The PRD requires row-level access control, encryption at rest with signed URLs, and audit logging — Airtable delivers none of the three credibly.

**Supabase** provides Postgres + RLS + storage with signed URLs + auth in one, and the MCP connector is already configured in this environment.

Migration is small now and painful later, so it happens as part of v1: `/api/submit` moves from Airtable to Supabase, and `/api/upload` moves from Cloudinary to Supabase Storage (keeping labels and marketing assets in separate buckets with different policies).

---

## 5. Ingestion — v1

### 5.1 `ForwardAdapter` (path B)

Each user gets a unique inbound address at signup: `{slug}-{nonce}@in.return-it.co.uk`. The nonce prevents address enumeration.

**Two modes on the same pipe:**

- **Manual forward** — user forwards a return email as it arrives. Zero setup, works on day one, works from any mail client on any device.
- **Auto-forward** — a one-time Gmail filter (`from:(amazon.co.uk OR asos.com OR …) OR subject:(return) → forward to <address>`). Gmail requires the destination be verified first and emails a confirmation code; our inbound handler catches that code and surfaces it in-app so the user can self-confirm without leaving the flow.

Inbound transport: Cloudflare Email Workers or Resend inbound. Resend is already a dependency.

**Security:** verify the inbound webhook signature; reject mail whose envelope sender doesn't correspond to a plausible retailer; rate-limit per address. An inbound address is a public-ish attack surface — treat unauthenticated mail as untrusted input throughout.

### 5.2 `UploadAdapter` (path C)

Upload a label PDF or photo, or paste an email body. Extends what `/request` already gestures at. Always available as the fallback — every comparable product has one, Shop included.

### 5.3 The magic moment

**When a forwarded email parses successfully, reply within seconds:**

> *"Got it. Your ASOS return is due 14 Sept. Schedule a pickup?"* — with a one-tap link.

This reproduces Shop's "it already knows" recognition at zero compliance cost, and it is the single highest-leverage interaction in the pilot. It also makes manual forwarding feel automatic enough that most users will never bother setting up the filter — which is exactly the "nearly automatic" bar we're aiming at.

### 5.4 Path to OAuth (A)

Sequenced, not deferred indefinitely:

| Phase | What | Why this order |
|---|---|---|
| v1.5 | `OutlookAdapter` via Microsoft Graph | No CASA equivalent, no user cap, no 7-day token expiry, lighter publisher verification. Gives a live, demoable "connected inbox" months before Gmail is possible. |
| v2 | `GmailAdapter` via Gmail History API | Requires CASA Tier 2 — third-party DAST scan by an authorised lab, roughly $500–$4,500/yr with annual recertification. Applied for *after* the parser has measured accuracy across real retailers. |

**The Gmail application is stronger for having waited.** Applying with "we process N retailers at X% accuracy for M pilot users, and here is our limited-use disclosure and retention policy" is a materially different submission from "we would like to read inboxes."

Constraints that force this order, verified:
- `gmail.readonly` is a **restricted** scope; Tier 2 CASA is mandatory, not optional
- Testing status caps at **100 manually-allowlisted** users
- **Refresh tokens expire after 7 days in Testing status** — weekly re-auth per user, which is fatal for a background-scanning product

---

## 6. Parser core

Pure functions, no I/O, fully testable. `RawReturnDocument → DetectedReturn`.

**Responsibilities:**
1. **Retailer identification** — sender domain first, template signature as fallback
2. **Deadline extraction** — highest-stakes field; carries its own confidence score
3. **Carrier + return ID**
4. **Label detection** — PDF attachment, QR, or link
5. **Confidence scoring** — decides auto-accept vs. user confirmation

**Fixtures:** the real artifacts currently in `~/Downloads/` — `Amazon return.pdf` (×3), `Shein return.png`, `return_label.png` — move into `fixtures/` as the seed corpus **before they get cleaned up**. Every pilot user's forwarded email that fails to parse becomes a new fixture.

**This is the first thing built, before any dashboard exists**, because extraction accuracy is the real risk in this product and everything downstream is worthless if it's poor. We want to discover that early and cheaply.

---

## 7. Dashboard

### 7.1 The mental model

Shop organises **orders counting forward to a delivery** — chronological feed, ETA per card.

Return-It's object counts the other way: **a return counting down to an expiry.** That inversion drives the layout. Shop sorts by recency because a delivery has no deadline. Return-It sorts by *urgency*, because the core pain in our own friction themes is missed windows and money quietly written off.

Take Shop's recognition moment. Do not take its chronological spine.

### 7.2 Structure

Three zones, sorted by deadline ascending:

1. **Needs action** — deadline chip dominant, colour-graded by urgency. Retailer, item, label status, one primary action.
2. **Scheduled** — pickup window plus live status, read from the `Event` log.
3. **Done** — collapsed, with refund-expected guidance. The referral prompt fires here: the moment of highest satisfaction, per the growth strategy.

**Multi-select is first-class** — "Schedule pickup for 3 returns" must be the obvious action, because bundling is what makes the margin work.

**Low-confidence detections get their own strip** — "Is this a return?" — cheap to confirm or dismiss, and every answer is training signal.

**The empty state carries the two-doors principle.** Side by side, neither dominant: *forward a return email to `lola-4f2@…`* (copy button plus an auto-forward walkthrough) **or** *upload a label*.

---

## 8. Fulfilment allocation

**Seam now, integrations later.**

`FulfilmentProvider` is an adapter interface mirroring the ingestion layer. The domain hands it a `PickupOrder` and receives a booking reference and a status stream; it never learns which carrier is involved.

| Adapter | Phase | What it does |
|---|---|---|
| `ManualFulfilment` | v1 | Writes to an ops queue; a human books the collection and updates status. Correct at 20–100 users. |
| Carrier API adapters | TBD | Pending research — see below |
| `ConciergeFulfilment` | Later | Own driver network. Heaviest ops; only justified where carriers won't collect. |

### 8.1 Research outcome

Full findings: `docs/carrier-integration-research.md`.

**No UK carrier exposes a self-serve API for booking collection of a third party's pre-paid return label.** Royal Mail will physically collect one but has no API (confirmed against the Click & Drop swagger, the developer portal, and the Shipping API endpoint list). Evri and DPD won't book pickups by API at all. Shippo and EasyPost exclude UK doorstep pickup outright.

**But the question was the wrong one.** Stuart and Gophr answer yes — because they're **point-to-point couriers that never look at the label.**

We don't need a carrier to collect a third party's label. We need *any courier* to move the parcel from the user's door to whatever drop-off point that label already implies — ParcelShop, Post Office, locker. That sidesteps the third-party-label problem entirely, works regardless of retailer, and needs no partner agreement.

**The constraint becomes economics, not access.** At ~£5.50/job, several users' parcels must batch into one neighbourhood route per day. That batching *is* the product — which is what the PRD's unit economics said all along.

### 8.2 Adapter roadmap

| Adapter | Phase | Notes |
|---|---|---|
| `ManualFulfilment` | v1 | Ops queue; a human books collection. Correct at 20–100 users. |
| `RoyalMailManual` | v1 | Parcel Collect at **30p**, up to 25 items, accepts third-party labels — but **RM Tracked Returns / Parcelforce return24-48 labels only**. No API; booked by hand or scripted browser flow. Cheapest rail by a wide margin. |
| `StuartAdapter` | v1.5 | Self-serve sandbox available today, London-native, ~£5.50/job. The first *automated* rail. |
| `SendcloudAdapter` | Later | Only aggregator with the right semantics (one-time pickup, dynamic address). Gated by carrier volume minimums. |

**Ruled out:** Packfleet (defunct — absorbed into DHL, Mar 2025) · Yodel (no API products published; acquired by InPost Apr 2025) · Shippo / EasyPost (exclude UK doorstep pickup).

### 8.3 Risks carried from this research

⚠️ **Amazon suspended this exact model on 13 August 2026** — Parcel Collect home pickup for Amazon prepaid return labels, withdrawn because it *"isn't completing buyer pickups as intended due to a technical issue."* Two weeks before this spec was written. Both the strongest validation of the thesis and a live warning that the rail is currently unreliable at scale. **Verify current status before depending on it.**

✅ **RESOLVED — the Royal Mail Parcel Collect T&Cs permit agent booking.** The PDF was downloaded manually (`royalmail.com` 403s all automated access) and read. Local copy: `docs/reference/rm-pfw-specific-terms-for-parcel-collect-non-account-customers.pdf`, last updated 11 August 2025.

**Clause 14.7, verbatim:**

> "You must not transfer any of your rights or duties under this Agreement; however, **you can use another person to carry out any of your duties (as your agent or otherwise) as long as you notify us first.** You will be responsible to us for any action that person takes. You must make sure your agents, representatives and subcontractors keep to the terms of this Agreement."

So a Return-It-booked collection on a user's behalf is **contractually permitted**, subject to three conditions:

1. **Royal Mail must be notified first.** A business action, not a technical blocker — but it must actually happen before the pilot books anything.
2. **The user remains liable to Royal Mail** for Return-It's actions as their agent. This needs reflecting in our own terms.
3. **Return-It must comply with the agreement** as the user's agent — including the Restricted and Prohibited Materials lists at `royalmail.com/prohibitedgoods`, which the pilot must surface to users at booking time.

No reseller or aggregator prohibition appears anywhere in the document.

⚠️ **One scope caveat.** Clause 2.2 states this Agreement covers outbound products *"where postage is purchased through Click & Drop with a trackable barcode."* A retailer's pre-paid return label is **not** purchased through Click & Drop, so these specific terms may not be the governing document for the pre-paid-returns case. The collection page separately confirms Parcel Collect accepts pre-paid Royal Mail Tracked Returns and Parcelforce return24/48 labels. **Confirm which terms govern the pre-paid case when notifying Royal Mail under 14.7** — one conversation closes both items at once.

### 8.4 Partner option

ZigZag Global runs an explicit white-label programme targeting *"tech companies and marketplaces"*, already has Parcel Collect integrated, and claims deployment *"in less than a month."* If speed to a working London pilot matters more than owning carrier relationships, that conversation may be worth more than three carrier integrations. They are also the most credible competitive threat on this rail.

---

## 9. Privacy & compliance

Non-negotiable, from the PRD:

- Email ingestion is **explicit opt-in**, recorded as a timestamp, not an implied checkbox
- **Transparent** — "we only process what you forward us"; the forwarding model makes this literally true, which is a stronger consent story than any OAuth scope
- **Revocable at any time** — revocation is a state, and it stops ingestion immediately
- Labels and pickup details **encrypted at rest**, served only via signed URLs
- **Row-level security** — a user can only ever reach their own rows
- **Audit logs** on all admin actions, via the `Event` table
- **Retention clock** on `RawDocument`, enforced by a scheduled job

---

## 10. Testing strategy

- **Parser: fixture-driven, measured.** A scored accuracy run over the corpus, reported as a number that must not regress. This is the only place in v1 where a metric gates merges.
- **Adapters: contract tests.** Each ingestion adapter must produce a valid `RawReturnDocument` from a recorded sample. This is what keeps the swap-in promise honest.
- **Domain: unit tests** on state transitions, especially `PickupOrder.status` and deadline/expiry logic.
- **Manual QA** for the dashboard at pilot scale — automated E2E is not worth its cost at 20–100 users.

---

## 11. Build sequence

1. **Parser core + fixtures.** Measured accuracy before anything else exists.
2. Supabase schema + migration off Airtable/Cloudinary.
3. `UploadAdapter` (path C) — shortest route to end-to-end.
4. `ForwardAdapter` (path B) + inbound webhook + address provisioning.
5. The reply-to-forward magic moment.
6. Pending Returns dashboard.
7. Pickup scheduling on top of the existing `/request` and quote flow.
8. `ManualFulfilment` + ops queue.
9. Stripe, if the pilot charges.
10. *Then* revisit the website against the validated mental model.

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Parser accuracy is poor across real retailer templates | **High** — invalidates the product | Built first, measured before anything depends on it |
| ~~No carrier will collect third-party labels via API~~ | Resolved | None do — but point-to-point couriers (Stuart, Gophr) make the label irrelevant. See §8.1 |
| ~~Royal Mail T&Cs may prohibit third-party/agent booking~~ | Resolved | Clause 14.7 permits it, subject to notifying RM first. See §8.3 |
| Royal Mail not notified under clause 14.7 before the pilot books collections | Medium | A business action that must precede the first booking; also the moment to confirm which terms govern pre-paid labels |
| The Parcel Collect rail is currently unreliable | Medium | Amazon suspended it 13 Aug 2026. Verify restoration; Stuart/Gophr are the fallback |
| Users won't forward emails; manual mode too much friction | Medium | Reply-to-forward magic moment; auto-forward filter as the upgrade |
| Retailers change email templates, breaking extraction | Medium | Failed parses become fixtures; `parser_version` makes regressions visible |
| Inbound address abused as spam target | Medium | Nonce in address, signature verification, per-address rate limiting |
| Pilot exceeds 100 users before Gmail verification | Low | v1 uses no OAuth at all — the cap doesn't bind |

---

## 13. Open questions

- [ ] Which carrier adapters, if any, ship in the pilot? (§8, research in flight)
- [ ] Does the pilot charge money, or is fulfilment free while validating demand?
- [ ] Which London postcodes?
- [ ] Merge `docs/website-brief-and-prd` into `main`?
- [ ] Which landing direction wins — a Variant design, a Stitch direction, or a synthesis?
