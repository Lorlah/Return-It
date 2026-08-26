# Competitive Teardown — UK Returns & Package Tracking

**Date:** 2026-08-26
**Method:** Desk research, primary sources where available.
**Confidence key:** ✅ verified with source · ⚠️ partial or conflicting · ❓ unconfirmed · 💭 inference

> **Read §5 and §7 first.** They contain findings that challenge the pricing model in
> `docs/superpowers/specs/2026-08-26-core-product-v1-design.md`.

---

## 1. UK consumer booking flows — what we're actually competing with

### Royal Mail Parcel Collect

✅ **30p per parcel**, flat, Mon–Sat. ✅ Max 5 items/day · 610×460×460mm · 20kg · **tracked services only**.
✅ **"Bring my label"** — the postie brings a pre-printed self-adhesive label. **Royal Mail has already neutralised the printer objection.**

✅ Flow: you must **already hold a barcoded label** → enter its tracking number at Click & Drop → choose a date (up to 5 days ahead, until midnight the day before) → optionally nominate a Safeplace → collection on the postie's normal round, **typically 6am–4pm**.

⚠️ Price history: 72p (2020) → free (Mar 2021) → **30p reintroduced 1 May 2025 with no announcement**, producing a "sneaky charge" news cycle.

**Where it's weak:**
- **The chicken-and-egg.** You can't book until you hold a label. RM solves the last five metres, not the 45 minutes before it.
- **Click & Drop is seller software.** A shopper returning a jumper is using merchant tooling.
- **"6am–4pm" is a day, not a window.**
- **Untracked postage is silently ineligible** — the cheapest option a consumer knows.

### Evri

✅ Retailer-first flow: search retailer → enter **order reference, email, reason for return** → drop off or collection.
✅ Collection **8am–8pm Mon–Fri**, with a **1-hour ETA on the day**. 18,000+ couriers.
✅ On returns pricing, Evri's own answer is a non-answer: costs "vary for different sellers and retailers" — **it tells you to ask the retailer.**
⚠️ "From £3.38 ex VAT" is general send-a-parcel pricing, not returns-specific.

💭 The 1-hour ETA is genuinely better than RM's all-day window. **That's the service bar to beat.**

### Parcel2Go

✅ Demands **weight in kg and dimensions in cm before quoting anything.** A shopper returning a dress knows neither. Hard stop at step two for our exact use case.

### InPost — the real UK benchmark

✅ **28M returns via UK lockers = 12% of ALL UK online returns.** ✅ **2 in 5 UK adults (~21M)** used a locker last year. ✅ 24M parcels Q1 2025, **+39% YoY**. ✅ Label-free QR returns in **"as little as 10 seconds."**

💭 For a large and fast-growing share of UK shoppers, returns are already free, label-free, and ten seconds at a locker they walk past. We are not competing with pain — we are competing with *that*, for the subset who find "walk past a locker" hard.

---

## 2. Orderly — the closest analogue

✅ Connects email, auto-imports orders, tracks 100+ carriers, shows **return deadline and return cost**, countdown timers ("2 days left to return"), one-click return initiation, **and home pickup scheduling.**
✅ **Free to the shopper.** Previously-paid features are now free.
✅ Mental model: **Orders view + Items view**, with returns layered on as deadline countdowns — not a separate pipeline.
⚠️ Traction: **4.6★ from 61 App Store ratings; "5,000+ users"** across iOS/Android/Web. Product Hunt 2023, 130 upvotes.

💭 **Orderly has already built Return-It's entire front end — email ingestion, deadline countdowns, return initiation, even home pickup — given it away free, and reached ~5,000 users in about 2.5 years.**

❓ Pickup carrier, cost and geography unconfirmed. 💭 Likely a thin wrapper over US carrier pickup APIs.
⚠️ **Search hazard:** at least three unrelated products are called "Orderly."

---

## 3. Other consumer-side

**Route (US)** — ✅ tracking + shipping protection, **shopper pays 2–2.5% of cart**, opted into **at the retailer's checkout**. Ingestion is retailer integration, not email.
💭 Proves shoppers will pay for post-purchase peace of mind — but the fee is collected inside checkout, not by an app they must find, download, and grant inbox access to. **That distribution difference is everything.**

**Deadline-organised tracking apps** — ⚠️ **none found.** Deliveries (Junecloud, since 2008) is delivery-date oriented. 💭 Its most stealable mechanic: **push the deadline into the user's calendar** — the app admits its own list isn't where you'll look.

**Email-scanning aggregators — a graveyard:**
- ✅ **Slice** — scanned inboxes for orders and receipts explicitly "to facilitate returns, exchanges and warranty claims." **2.2M downloads. Removed from Google Play 26 June 2023.**
- ✅ **Paribus** — inbox receipt scanning for price-drop refunds. Acquired by Capital One 2016, **decommissioned March 2021**; successor killed **January 2023**.
- ✅ **Earny** — same model, same fate trajectory.

💭 Every consumer app built on inbox-scanning has died or been absorbed. ❓ No public post-mortem states why. 💭 Common thread: **inbox permission is a high-friction, high-anxiety ask for a low-frequency benefit.**

---

## 4. Retailer-side

| Product | Status | Price / payer | Notes |
|---|---|---|---|
| **Narvar** | ✅ Active | ~$30k/yr+; one customer reported **£49,000/yr** | 1,500+ brands. Launched a consumer app in 2024. ❓ cross-retailer or per-brand wrapper unconfirmed |
| **Loop Returns** | ✅ Active | **$155–$340/mo** | **5,000+ Shopify merchants, ~16% of Shopify GMV, 70.5M returns.** Absorbed Returnly's merchants |
| **ZigZag Global** (UK) | ✅ Active | Retailer-paid | ⚠️ Acquired by **Global Blue**, Mar 2021, ~$79.8M — *not* Global-e |
| **Doddle** (UK) | ⚠️ Software alive, consumer business dead | Retailer-paid | See §5 |
| **Happy Returns** | ✅ Active (UPS) | Retailer-paid | PayPal $265M (2021) → **UPS $465M (2023)** |
| **ReBound** | ✅ Active | Retailer-paid | Acquired by Reconomy, 2021. ⚠️ Asendia relationship contradictory in sources |

💭 **Every one is retailer-paid**, and the sector has consolidated hard (Returnly→Loop, Doddle→Blue Yonder, Happy Returns→PayPal→UPS, ZigZag→Global Blue, ReBound→Reconomy). There is no "partner with the incumbent and they pay us" path — **they are the buyer of returns tech, and they have all just been bought by someone bigger.**

---

## 5. The graveyard — consumer-paid returns pickup

### ✅ Returnmates → Sway — the closest precedent

Consumer-paid returns pickup at **$6/pickup + $2 per additional package**. Raised **$25.6M total** ($19.5M Series A, Jan 2024). Rebranded to **Sway**, repositioned as **B2B** last-mile and returns for retailers. Its own FAQ states **"The Returnmates Home Pickup Service has been discontinued."**

⚠️ Reason unconfirmed — page title verified via search index, body text unretrievable.
💭 **Note what survived: the pickup operation. What died: the consumer paying for it.** That is a pricing-side failure, not an operational one.

### ✅ Shyp (2013–2018) — $62M raised, $250M valuation, dead

Flat **$5 pickup fee**, 20-minute pickup. Shut March 2018. Stated reasons:
- **Frequency.** Shipping is "rare and sporadic." Assumed weekly behaviour for an occasional need.
- **Flat pricing across wildly variable cost** — shipping cost routinely exceeded the fee.
- Never scaled past San Francisco.
- CEO: *"what we didn't do is focus on having a sustainable business from day one."*

### ✅ Doorman (2014–2017) — closest structural analogue

Scheduled doorstep package delivery. Admitted **a year before shutting** that the model was so popular it was **losing money**. Raised the subscription to **$89/month plus per-package fees** — still insufficient. Stated reason: **stayed B2C too long, never achieved delivery density.**

### ⚠️ Doddle (UK) — the canonical UK version of the lesson

✅ Closed **17 of 24 standalone stores, laid off 100 staff**, then closed the rest and pivoted to licensing software to retailers and carriers. Acquired by **Blue Yonder, Oct 2023**, still expanding.
**The consumer-facing returns business was the part that didn't work.**

### ✅ Returnly — $300M acquisition, dead in two years

Affirm bought it for **$300M (June 2021)**, **sunset 1 Oct 2023**, merchants migrated to Loop.

### 💭 One counter-signal

Boomerang Returns (Atlanta, ~$1.18M raised) argues ✅ **"consumers prefer pickup 3–4× more than dropping a return off"** and diagnoses Shyp precisely: ✅ *"Shyp's business model was on-demand, despite little consumer need for same-day pickup of returns... on-demand is a great customer experience but very expensive to execute."* Their model bills the **retailer**.
⚠️ Quotes are search-index extracts, not first-hand retrieval. ⚠️ Boomerang's own traction is minimal.
💭 The useful part: **demand for pickup is real; on-demand is what killed Shyp.** Scheduled, batched, next-day pickup is a different cost structure — and it is exactly what Royal Mail already does at 30p by riding an existing delivery round.

---

## 6. Two live competitors

### ⚠️ ReturnQueen (US) — closest live analogue to our concierge tier

Driver **packs, prints the label, ships it back**. Poshmark integration for one-tap resale.
✅ **$9.99/pickup for up to 12 items** (+$1/extra) · **$19.99/mo** (4 pickups) · **$199.99/yr**. Relaunched Sept 2025.
❓ Coverage, ingestion method, traction all unconfirmed.

💭 **$9.99 for up to 12 items validates our £8.99 concierge tier almost exactly** — and note the shape: priced **per pickup, not per item**, which is how batching is made to pay. We should copy that shape.

### ✅ Uber entered this market four months ago

Launched **17 April 2026**: doorstep returns pickup via Uber Eats. Order history → "Return an item" → "Return with a courier." Retailers include Target, Best Buy, Petco, Michael's. Fee based on **courier time and distance**, not flat. Limits: **only items bought through Uber Eats**, min **$20** value. US-only at launch.

💭 **The constraint is the tell.** Even Uber, with the densest courier network on earth, launched only where it **already owned the order data**. It solved ingestion by not having one. That is a direct comment on how hard the ingestion problem is — the one we propose to solve with email parsing.

---

## 7. Synthesis

### UX patterns worth stealing

| Pattern | Source | What it solves |
|---|---|---|
| **Deadline countdown as the primary object** | Orderly | Turns a passive list into a decaying asset. Unit of value is *time remaining* |
| **Push the deadline into the calendar** | Deliveries | Admits the app isn't a daily surface. For a ~4×/year behaviour this is essential |
| **Price per pickup, not per item** | ReturnQueen | Makes batching the user's incentive. Directly counters Shyp's flat-fee error |
| **1-hour ETA on the day** | Evri | RM's 6am–4pm "window" is the most beatable thing in UK returns |
| **Fee collected in checkout, at purchase** | Route | Sidesteps the download-app-then-connect-inbox funnel entirely |
| **QR replaces label, no printer** | InPost | The printer is the true villain |
| **"Bring my label"** | Royal Mail | The incumbent already neutralised the printer objection, at 30p |
| **Resale as the alternative to returning** | ReturnQueen | Monetises items that *can't* be returned — the past-deadline ones only we know about |

### The mental model

Four exist in the wild:
1. **Chronological feed** (Deliveries, most trackers) — ❌ wrong. A return's urgency has no relationship to when it arrived.
2. **Status pipeline** (Loop, Narvar) — models *the retailer's* workflow. Shoppers don't have a workflow, they have a chore.
3. **Retailer-first directory** (Evri, RM) — ❌ demands retailer + order ref + reason before it helps.
4. **Deadline queue** (Orderly, partially) — ⚠️ the only fit, and **nobody has committed to it fully.**

💭 **Recommendation: a decaying triage queue.** Sort strictly by days-to-deadline. Soonest-expiring items largest and loudest; 25-days-left items collapse to one line. Add a **past-deadline bucket that routes to resale** — revenue from the failure state. The model is not a feed or a pipeline: **it's an inbox that expires.** Every design decision should ask *does this make the next expiring item more obvious?*

### Where the white space actually is

1. ✅ **The pre-label gap.** Royal Mail can't help until you hold a barcoded label. Everything upstream — finding the order, opening the portal, generating the return, choosing a reason, getting a label — is **unowned by anyone in the UK.** That's ~45 minutes of friction sitting in front of a 30p service. **This is the white space, and it is not the pickup.**
2. ✅ **Multi-retailer batching.** Every existing flow is single-retailer. Nobody lets a shopper say "these four things, three retailers, one collection."
3. ✅ **The expired-return market.** We'd be the only product that *knows* an item just became un-returnable — a qualified resale lead nobody else can generate.
4. ⚠️ **Non-locker, non-car households.** Real, but defined by exclusion from InPost's 21M reach. Size it honestly.

### Market context (all ✅)

UK non-food online returns forecast **£25.1bn in 2025**; clothing return rate **23.6%**. **42% of UK retailers now charge for returns** (young fashion 80%); average fee **£11.50**; ASOS charges **£3.95** to high-rate returners. **72% of UK shoppers** name free returns a priority. On fairness: **47.6%** think a fee is fair for frequent returners, but **21.5% say charging is never fair.**

💭 Acceptance of a returns fee is **situational, not general**. "£1.99 to return anything" is the framing they reject; "£8.99 because we packed, labelled and queued for you" is the framing they accept.

---

## 8. The uncomfortable conclusion

💭 Three of the four things we plan to charge for are already free or near-free in the UK: tracking (free), deadline reminders (Orderly, free), doorstep collection (**Royal Mail, 30p, brings the label**).

**Our £1.99 carrier-direct tier competes directly with a 30p incumbent that has already solved the printer problem.** It needs killing or repricing, and we need a clear answer to *"why not just use Royal Mail at 30p?"* before building it.

The tier that survives scrutiny is **£8.99 concierge** — ReturnQueen prices the same shape at $9.99/12 items. But **Returnmates charged $6 for it, raised $25M, and withdrew it.**

💭 The pattern across Shyp, Doorman, Doddle and Returnmates is identical, and it is **not an ops failure: the pickup works; the consumer paying for it doesn't, at consumer frequency.** Returns happen ~4×/year — Shyp's "rare and sporadic" problem exactly. No amount of UX fixes a frequency problem.

**Every survivor found someone else to pay:** Doddle sold software to retailers · Boomerang and Sway bill the retailer · Route collects inside checkout · Uber only did it where it already owned the order.

💭 That doesn't mean don't build it. It means **the consumer app is plausibly the acquisition surface, not the business model** — and the question worth answering before writing more code is: *which UK retailer would pay for the collection that the shopper books?*

---

## 9. Gaps not closed

- ❓ **Collect+ standalone consumer flow** — no clean source
- ❓ **Returnmates' stated reason** for discontinuing home pickup — the most decision-relevant unknown in this report. Try the Wayback Machine on `returnmates.com/faq`
- ❓ Orderly's home-pickup mechanics — carrier, cost, geography; live vs. marketing copy
- ❓ ReturnQueen coverage, ingestion method, funding, traction
- ⚠️ ReBound/Asendia ownership — sources contradict
- ⚠️ Evri's returns-specific consumer collection price
- ❓ Narvar's 2024 consumer app — cross-retailer or per-brand?

## 10. Note on CASA cost

⚠️ **Public sources conflict on the cost of Google restricted-scope verification.** Google's own tier documentation indicates **Tier 2 (third-party DAST scan)** is what restricted scopes require, with reported costs of **$500–$4,500/yr**. Other sources report **$15,000–$75,000/yr**, which appears to describe Tier 3 or complex multi-app assessments.

**This needs resolving with a direct quote from an authorised assessor before it informs any decision.** A documented workaround exists either way: route through an **already-CASA-verified provider** (Nylas, Unipile, Composio and similar) so their assessment covers the scope.
