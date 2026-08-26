# UK Carrier Collection APIs — Research Findings

**Date:** 2026-08-26
**Question:** Can a third party programmatically book a doorstep collection of a parcel already carrying someone else's pre-paid return label?
**Confidence key:** ✅ verified with source · ⚠️ partial or conflicting · ❓ unconfirmed · 💭 inference

---

## The headline answer

**No UK carrier exposes a self-serve, publicly documented API for booking a doorstep collection of a third party's pre-paid return label.**

That "no" has three distinct parts:

1. ✅ **Royal Mail will physically collect a third party's label, but has no API for booking it.** Confirmed by reading the specs, not by failing to find docs.
2. ✅ **Evri and DPD UK will not book pickups by API at all** — even for their own labels, even through aggregators. Their arrangements are recurring, contractual, volume-gated.
3. ✅ **The aggregators mostly don't solve it.** Shippo's Pickups API is USPS + DHL Express only. EasyPost excludes Evri and DPD UK by name.

✅ **The one genuine exception:** DHL Express MyDHL+ books pickups against waybills you didn't create ("I have DHL Waybill Number"), and MyDHL API has a standalone Pickup service. Right shape, wrong network — essentially no UK high-street retail return uses a DHL Express waybill. It matters only as proof the pattern isn't technically or legally unthinkable.

---

## 💭 The reframe that matters more than the answer

**We asked the wrong question.**

Stuart and Gophr answer "yes" — for a reason that generalises: **they're point-to-point couriers, so they never look at the label.**

We don't need a *carrier* to collect a third party's label. We need *any courier* to move the parcel from the user's door to whatever drop-off point that label already implies — ParcelShop, Post Office, locker, InPost.

This sidesteps the third-party-label problem entirely, works regardless of which retailer the user bought from, and needs no partner agreement.

**The constraint becomes economics, not access.** At ~£5.50+ per job, several users' parcels must batch into one courier route per neighbourhood per day. **That batching is the product** — which is exactly what the unit economics in the PRD already said.

---

## 1. Royal Mail — service yes, API no

✅ **Accepts third-party retailer labels.** Direct from https://www.royalmail.com/collection:

> "Yes we can collect returns. If you're using a pre-paid and printed label, when booking your collection for a **Tracked Return, Parcelforce return24 and 48** item, please use the reference number on the label containing the retailer's return address."

✅ Max **25 items** per collection · "Bring my label" service · Safeplace collection permitted.
⚠️ **Hard constraint: RM Tracked Returns or Parcelforce return24/48 labels only.** An Evri or DPD returns label cannot go this way — capping addressable returns to the RM-labelled share.

✅ **No collection API exists.** Three independent checks:
- **Click & Drop Public API v1** — swagger downloaded directly from `api.parcel.royalmail.com/doc/v1/click-and-drop-api-v1.yaml` (HTTP 200) and enumerated. No collection or pickup endpoint. The only "collect" matches are `isLocalCollect` — Post Office hold-for-collect, unrelated.
- **developer.royalmail.net/product** lists exactly three products: Delivery Office Finder, **Local Collect V3** (click-and-collect at Post Offices — *not* doorstep pickup; easy to misread), Tracking V2.
- **Shipping API V2/V3** — no collection booking. `local_collect` appears only as service-enhancement code 22.

✅ **Booking is web-form only:** Click & Drop (select 1–10 orders → Other actions → Book collection) or `send.royalmail.com/collect/youritems`.

💭 **A partner route probably exists but is undocumented.** ZigZag Global has offered Parcel Collect inside its retailer portals since Oct 2023; Amazon UK offered it too. Neither was filling in web forms. Treat as a conversation to have, not a fact to plan on.

⚠️ **Pricing conflict:** 30p corroborated by ChannelX quoting Royal Mail directly (May 2025) and Aug 2026 Amazon coverage. Priory Direct (reviewed Mar 2026) says **72p**. 30p treated as settled; flagging in case 72p is a tier hit at volume.

### ⚠️ Material risk — Amazon suspended this exact model two weeks ago

✅ Amazon UK ran precisely our model on this rail: Parcel Collect home pickup for Amazon prepaid return labels. **Suspended 13 August 2026** — *"Amazon have identified that UK Royal Mail Parcel Collect isn't completing buyer pickups as intended due to a technical issue."*
(https://channelx.world/2026/08/amazon-suspend-uk-royal-mail-parcel-collect-returns/)

💭 Simultaneously the strongest validation of the product thesis and a live warning that the rail is currently unreliable at scale. **Check whether it has been restored before committing.**

---

## 2. Other carriers

| Carrier | Verdict | Evidence |
|---|---|---|
| **Evri** | ✅ **No.** No public developer portal. EasyPost, verbatim: pickups "cannot be scheduled via the EasyPost API." Sendcloud: recurring only, **~150 parcels/week minimum**. Consumer courier collection (£4.04–£11.29) is a *send* service where Evri generates the label | docs.easypost.com/carriers/evri-guide |
| **DPD UK** | ✅ **No.** EasyPost: pickups "based on individual agreements... cannot be scheduled via the EasyPost API." ShipEngine: DPD must approve your test labels or the account may be suspended. **No rates API** | docs.easypost.com/carriers/dpduk-guide · shipengine.com/docs/carriers/dpd-uk-guide |
| **Yodel** | ✅ **Defunct as an option.** developer.yodel.co.uk renders "**No API Products found.**" ✅ **InPost acquired Yodel for £106m, April 2025** — treat as one counterparty | ciltuk.org.uk/news/202504/yodel-acquired-by-inpost |
| **InPost UK** | ✅ **Locker-first, volume-gated.** Pickups API exists (REST, OAuth 2.1) but collection needs **10 parcels minimum per pickup**. All four returns services are locker-based | developers.inpost-group.com |
| **DHL** | ✅ **The only real "yes", wrong network.** MyDHL API standalone Pickup service, sandbox 500 calls/day. DHL eCommerce UK has a Pickup API v1 with a pre-onboarding sandbox | developer.dhl.com |

💭 **The InPost/Yodel merger is strategically notable:** it creates the one UK player with both doorstep collection capability and a dense locker network — the exact combination this product needs.

---

## 3. Aggregators

| Provider | Third-party-label collection? | Status |
|---|---|---|
| **Shippo** | ✅ **No** — Pickups API is USPS + DHL Express only, and only for shipments already created in Shippo | Verified |
| **EasyPost** | ✅ **No** — Pickup API explicitly excludes Evri and DPD UK | Verified |
| **Sendcloud** | ⚠️ **Right API shape, carrier-gated.** v3 create-a-pickup, and critically *"the sender address is dynamic... you can request the pickup to take place at an address of your choice."* One-time pickups, ≥2 working days notice. **Whether it accepts a non-Sendcloud label is undocumented** — needs a direct question | sendcloud.dev/docs/shipments/pickups |
| **Parcel2Go** | ❓ **Unknown.** OAuth2, self-serve credentials via My Account → API, sandbox portal — **lowest signup friction found**. Third-party-label collection unverified; ask apihelp@parcel2go.com | parcel2go.com/api/docs |
| **Stuart** | ✅ **Yes — point-to-point, label-agnostic.** REST API, **self-serve sandbox** at admin-sandbox.stuart.com, London-native, from **£5.50/delivery** | api-docs.stuart.com |
| **Gophr** | ✅ **Yes — same reason.** Open API, key on request, no API surcharge, ~22 min central-London pickup | uk.gophr.com/service/e-commerce-integrations |
| **Packfleet** | ✅ **Dead — rule out.** docs.packfleet.com now serves only *"Packfleet deliveries are now DHL"* (March 2025) | Verified |
| **Zedify** | ⚠️ **Rule out for v1.** Reachable via Shiptheory; no public API docs found — though this search was shallower than the others | Partially verified |

---

## 4. Access requirements

**Self-serve, sandbox, no volume minimum:** Stuart · Parcel2Go · Gophr · DHL eCommerce UK sandbox

**Business account + account manager:** DHL Express · DHL eCommerce UK production

**Business account + approval + volume minimum:** DPD UK (5–10/collection, recurring) · InPost (10/pickup) · Evri (~150/week, recurring, paid plan)

**No path found:** Yodel (zero API products) · Royal Mail Parcel Collect (no API; partner route inferred)

### ⚠️ On reseller/aggregator prohibitions — read this carefully

**No explicit prohibition was found anywhere. This is a weak finding, not a reassuring one.**

The T&Cs that would contain such a clause — Royal Mail Parcel Collect, Evri, DPD — are all behind blocked or private documents. `royalmail.com` returns **HTTP 403 to all automated fetching**, including via reader proxies. Evri and DPD terms are not public.

**"No prohibition found" here means "not read", not "not present." Do not treat this as a green light.**

**Highest-value remaining action:** manually download the Royal Mail Parcel Collect T&Cs PDF from royalmail.com/collection (~2.4MB, last updated 11 Aug 2025) and read the clause on third-party/agent booking. It decides whether a manually-booked pilot is legitimate or quietly in breach.

---

## 5. Partner or competitor

| Company | Sells to | Read |
|---|---|---|
| **ZigZag Global** | **B2B + white-label** | ✅ **Most actionable.** Their white-label programme explicitly targets *"parcel carriers, postal operators, 3PLs, tech companies and marketplaces"*; partners can buy shipping country-by-country, deploy *"in less than a month"*, and **they already have Parcel Collect integrated.** The incumbent on exactly our rail — fastest partner route and the most credible threat |
| **Doddle** | B2B | Blue Yonder, Nov 2023. Enterprise. Not a partner at our scale |
| **Happy Returns** | US only | ✅ Owned by **UPS**, not PayPal (PayPal sold it). Irrelevant to UK |
| **ReturnBear** | B2B, Canada | Irrelevant |
| **Asendia** | B2B cross-border | Not a doorstep play |
| **Uber** | **B2C — the real future competitor** | Launched doorstep returns 17 Apr 2026, US, $20 minimum, priced on courier time + distance. ⚠️ **No UK availability stated** — absence of mention, not confirmed absence. They have the London fleet and the install base whenever they choose |
| **"Yeepa"** | — | ❓ **No returns-pickup company found by this name.** Nearest is **YEEP!**, a UK open locker network (Tesco rollout, May 2026) — lockers, not pickup. Possibly a garbled reference |

---

## 6. Ranked recommendation

**1. Stuart or Gophr — the actual pilot rail, integrable in weeks.**
Label-agnostic point-to-point, London-native, real REST APIs, Stuart has a self-serve sandbox available today. No partner agreement, no volume minimum, no dependency on which retailer the user shopped with. Economics are the only constraint.

**2. Royal Mail Parcel Collect — the cheap rail, booked manually.**
30p, explicit third-party-label support, 25 items per booking. Nothing comes close on cost. For 20–100 users, hand or scripted booking is entirely tractable and answers the demand question before a penny is spent on integration. ⚠️ Two caveats: RM/Parcelforce labels only, and the Amazon suspension two weeks ago.

**3. Sendcloud — the migration target once volume exists.**
The only aggregator with the right semantics (one-time pickup, dynamic address). Gated today by carrier minimums. Worth an early sales call.

**Partner-gated, therefore later:** Evri · DPD UK · InPost/Yodel · Amazon · DHL eCommerce UK.
**Wrong tools:** Shippo and EasyPost both exclude UK doorstep pickup outright.

💭 **One strategic call worth making early:** ZigZag runs an explicit white-label programme for tech companies and already has Parcel Collect wired up. If speed to a working London pilot matters more than owning carrier relationships, that conversation may be worth more than three carrier integrations.

---

## 7. Gaps not closed

- ❓ **Royal Mail Parcel Collect T&Cs on third-party/agent booking** — **the highest-value remaining item.** Needs manual download; royalmail.com 403s all automated access
- ❓ Whether Royal Mail has a partner Parcel Collect API — inferred from ZigZag/Amazon behaviour, no docs found
- ❓ Whether Sendcloud's or Parcel2Go's pickup APIs accept a non-native label — undocumented both ways
- ❓ Evri and DPD contract terms on aggregator use — not public, not read
- ⚠️ Zedify — searched, no public docs found, but shallower search than the others
- ❓ Uber's UK plans — no evidence found, which is not evidence of no plans
